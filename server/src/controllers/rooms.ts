import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../index.ts";
import jwt, { JwtPayload } from 'jsonwebtoken'

export const getUserRooms = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        let { rows } = await fastify.pg.query(`
        SELECT
            rooms.room_id,
            rooms.seller_id,
            users.profile_picture,
            users.username,
            users.user_id,
            lastMessage.text,
            lastMessage.date
        FROM rooms
        JOIN users ON (users.user_id = rooms.seller_id AND rooms.seller_id != $1) OR (users.user_id = rooms.buyer_id AND rooms.buyer_id != $1)
        LEFT JOIN (
            SELECT
                messages.room_id,
                messages.text,
                messages.date
            FROM messages
            WHERE (messages.room_id, messages.date) IN (
                SELECT room_id,
                    MAX(date) AS maxDate
                FROM messages
                GROUP BY room_id
            )
        ) as lastMessage ON lastMessage.room_id = rooms.room_id
        WHERE rooms.seller_id = $1 OR rooms.buyer_id = $1
        ORDER BY lastMessage.date DESC
        `, [user_id])
        
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const createRoom = async (request: FastifyRequest<{ Body: { seller_id: number }}>, reply: FastifyReply) => {
    try {
        const { seller_id } = request.body
        const token = request.headers.authorization?.split(' ')[1]
        const { id: buyer_id } = jwt.decode(token as string) as JwtPayload

        const { rows: existingRoom } = await fastify.pg.query(`
            SELECT room_id FROM rooms WHERE (seller_id = $1 AND buyer_id = $2) OR (seller_id = $2 AND buyer_id = $1)
        `, [seller_id, buyer_id])

        if (existingRoom.length > 0) return reply.code(200).send({ room_status: 'already exists', room_id: existingRoom[0].room_id })

        await fastify.pg.transact(async client => {
            const { rows } = await client.query('INSERT INTO rooms (seller_id, buyer_id) VALUES ($1, $2) RETURNING room_id', [seller_id, buyer_id])
            const room_id = rows[0].room_id
            return reply.code(200).send({ room_status: 'created', room_id })
        })
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}
