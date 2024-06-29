import { FastifyReply, FastifyRequest } from 'fastify'
import { User, fastify } from '../index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { sendEmail } from '../helpers/emails.js'
import { sendVerificationCode, verifyExpiration } from '../helpers/verificationCodes.js'

export const googleSignin = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
    try {
        const { username, email, profile_picture, google_id } = request.body
        
        const { rows: existingUser } = await fastify.pg.query('SELECT user_id, username, email, profile_picture, phone_number, country, is_confirmed, provider FROM users WHERE google_id = $1', [google_id])

        if (existingUser.length > 0) {
            const JWT_TOKEN = jwt.sign({ id: existingUser[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: 300 })
            return reply.code(200).send({ jwt: JWT_TOKEN, user: existingUser[0] })
        }

        const { rows: insertedUserId } = await fastify.pg.transact(async client => {
            const id = await client.query(`INSERT INTO users (username, email, profile_picture, google_id, is_confirmed, provider, country) VALUES ($1, $2, $3, $4, true, 'google', 'lebanon') RETURNING user_id`, [username, email, profile_picture, google_id])
            return id
        })
        const { rows: newUser } = await fastify.pg.query('SELECT user_id, username, email, profile_picture, phone_number, country, is_confirmed, provider FROM users WHERE user_id = $1', [insertedUserId[0].user_id])

        const JWT_TOKEN = jwt.sign({ id: newUser[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '24h' })
        return reply.code(200).send({ jwt: JWT_TOKEN, user: newUser[0] })
    } catch (error) {
        console.error(error)
        return reply.code(500).send('Something went wrong.')
    }
}

export const signin = async (request: FastifyRequest<{ Body: { email: string, password: string } }>, reply: FastifyReply) => {
    try {
        const { email, password } = request.body

        const { rows: user } = await fastify.pg.query('SELECT user_id, username, password, email, profile_picture, phone_number, country, is_confirmed, provider FROM users WHERE email = $1', [email])
        if (user.length === 0 || user[0].provider === 'google') return reply.code(401).send({ user: null, error: 'Incorrect Email or Password' })

        const isPasswordCorrect = await bcrypt.compare(password, user[0].password)
        if (!isPasswordCorrect) return reply.code(401).send({ user: null, error: 'Incorrect Email or Password' })

        const JWT_TOKEN = jwt.sign({ id: user[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '24h' })
        return reply.code(200).send({ jwt: JWT_TOKEN, user: user[0] })
    } catch (error) {
        console.error(error)
        return reply.code(500).send('Something went wrong.')
    }
}

export const signup = async (request: FastifyRequest<{ Body: { username: string, email: string, password: string, country: string, phone_number: string } }>, reply: FastifyReply) => {
    try {
        const { username, email, password, country, phone_number } = request.body

        const { rows: doesUserExist } = await fastify.pg.query('SELECT email FROM users WHERE email = $1', [email])
        if (doesUserExist.length > 0) return reply.code(400).send({ user: null, error: 'An account with this email already exists' })

        // const isEmailValid = await fetch(`https://api.ValidEmail.net/?email=${email}&token=${process.env.EMAIL_VAL_KEY}`)
        // const data = await isEmailValid.json()
        // if (!data.IsValid) return reply.code(401).send({ user: null, error: 'Invalid email' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const { rows: insertedUserId } = await fastify.pg.transact(async client => {
            const id = await client.query(`INSERT INTO users (username, email, password, is_confirmed, provider, country, phone_number) VALUES ($1, $2, $3, false, 'local', $4, $5) RETURNING user_id`, [username, email, hashedPassword, country, phone_number])
            return id                                    
        })
        const { rows: user } = await fastify.pg.query('SELECT user_id, username, email, profile_picture, phone_number, country, is_confirmed, provider FROM users WHERE user_id = $1', [insertedUserId[0].user_id])
        const JWT_TOKEN = jwt.sign({ id: user[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '24h' })
        
        await sendVerificationCode(user[0].user_id, user[0].email)
        return reply.code(200).send({ jwt: JWT_TOKEN, user: user[0] })
    } catch (error) {
        console.error(error)
        return reply.code(500).send('Something went wrong.')
    }
}

export const resendVerificationCode = async (request: FastifyRequest<{ Body: { user_id: number, email: string } }>, reply: FastifyReply) => {
    try {
        const { user_id, email } = request.body
        const code = crypto.randomInt(10000, 99999).toString()

        await fastify.pg.transact(async client => {
            await client.query('DELETE FROM verification_codes WHERE user_id = $1', [user_id])
            await client.query('INSERT INTO verification_codes (user_id, code, timestamp) VALUES ($1, $2, $3)', [user_id, code, Date.now()])
        })

        await sendEmail(email, code)

        return reply.code(200).send('sent')
    } catch (error) {
        console.error(error)
        return reply.code(500).send('Something went wrong.')
    }
}

export const verifyCode = async (request: FastifyRequest<{ Body: { input: string, user_id: number } }>, reply: FastifyReply) => {
    try {
        const { input, user_id } = request.body

        const { rows } = await fastify.pg.query('SELECT code, timestamp FROM verification_codes WHERE user_id = $1', [user_id])
        const code = rows[0]

        if (code.code !== input) return reply.code(400).send({ verified: false, message: 'Invalid code' })
 
        const isExpired = verifyExpiration(code.timestamp)
        if (isExpired) return reply.code(400).send({ verified: false, message: 'Code has expired' })
        
        await fastify.pg.transact(async client => {
            await client.query('UPDATE users SET is_confirmed = true WHERE user_id = $1', [user_id])
        })
        return reply.code(200).send({ verified: true })
    } catch (error) {
        console.error(error)
        return reply.code(500).send({ verified: false, message: 'Something went wrong.' })
    }
}

export const checkAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        if (!token) return reply.code(401).send({ authorized: false })
        jwt.verify(token, process.env.JWT_SECRET as string, (err, _) => {
            if (err) return reply.code(401).send({ authorized: false })
        })
        return reply.code(200).send({ authorized: true })
    } catch (error) {
        console.error(error)
        return reply.code(500).send('Something went wrong.')
    }
}