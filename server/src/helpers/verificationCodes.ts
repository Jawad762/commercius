import { sendEmail } from "./emails.js"
import crypto from 'crypto'
import { fastify } from '../index.js'

export const sendVerificationCode = async (user_id: number, email: string) => {
    const code = crypto.randomInt(10000, 99999).toString()

    await fastify.pg.transact(async client => {
        await client.query('DELETE FROM verification_codes WHERE user_id = $1', [user_id])
        await client.query('INSERT INTO verification_codes (user_id, code, timestamp) VALUES ($1, $2, $3)', [user_id, code, Date.now()])
    })

    await sendEmail(email, code)
}

export const verifyExpiration = (codeDate: number) => {
    try {
        const currentDate = Date.now()
        const differenceInMinutes = (currentDate - codeDate) / 1000 / 60
        if (differenceInMinutes > 5) return true
        return false
    } catch (error) {
        console.error(error)
    }
}