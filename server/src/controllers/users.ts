import { FastifyReply, FastifyRequest } from "fastify";
import { User, fastify } from '../index.ts'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const getUser = async (request: FastifyRequest<{ Params: { user_id: number }}>, reply: FastifyReply) => {
    try {
        const { user_id } = request.params
        const { rows } = await fastify.pg.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        reply.code(200).send(rows[0])
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const updateUser = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
    try {
        const { username, profile_picture, country, phone_number } = request.body
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        await fastify.pg.transact(async client => {
            await client.query(`
                UPDATE users 
                SET username = $1,
                profile_picture = $2,
                country = $3,
                phone_number = $4
                WHERE user_id = $5
            `, [username, profile_picture, country, phone_number, user_id])
        })
        reply.code(200).send('updated profile')
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const deleteUser = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        await fastify.pg.transact(async client => {
            await client.query(`DELETE FROM users WHERE user_id = $1`, [user_id])
        })
        reply.code(200).send('deleted')
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}