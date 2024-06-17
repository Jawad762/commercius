import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../index";
import jwt, { JwtPayload } from 'jsonwebtoken'

export const sendMessage = async (
    request: FastifyRequest<{ Body: { room_id: number, text: string }}>,
    reply: FastifyReply
) => {
    try {
        const { room_id, text } = request.body
        const token = request.headers.authorization?.split(' ')[1]
        const { id: sender_id } = jwt.decode(token as string) as JwtPayload
        await fastify.pg.transact(async client => {
            await client.query('INSERT INTO messages (room_id, sender_id, text) VALUES ($1, $2, $3)', [room_id, sender_id, text])
        })
        reply.code(200).send('sent')
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const getMessages = async (request: FastifyRequest<{ Params: { room_id: number }}>, reply: FastifyReply) => {
    try {
        const { room_id } = request.params
        const { rows } = await fastify.pg.query(`
        SELECT
            messages.message_id,
            messages.sender_id,
            messages.text,
            messages.date,
            users.username,
            users.profile_picture
        FROM messages
        JOIN users ON users.user_id = messages.sender_id
        WHERE messages.room_id = $1
        `, [room_id])
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}