import { FastifyReply, FastifyRequest } from "fastify"
import { fastify } from "../index.ts"
import jwt, { JwtPayload } from 'jsonwebtoken'

export const getFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        const { rows } = await fastify.pg.query(`
            SELECT
                posts.post_id,
                posts.category,
                posts.title,
                posts.price,
                posts.description,
                posts.pictures,
                posts.country,
                posts.city,
                posts.date,
                users.user_id,
                TRUE as is_item_in_favorites
            FROM favorites
            INNER JOIN posts ON posts.post_id = favorites.post_id
            INNER JOIN users ON users.user_id = favorites.user_id
            WHERE users.user_id = $1
        `, [user_id])
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send('something went wrong')
    }
}

export const addToFavorites = async (request: FastifyRequest<{ Body: { post_id: number } }>, reply: FastifyReply) => {
    try {
        const { post_id } = request.body
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        // first check if the item is in the user's favorites already, if it is --> remove it, else --> add it
        const { rows: existingFavorite } = await fastify.pg.query('SELECT * FROM favorites WHERE user_id = $1 AND post_id = $2', [user_id, post_id])
        if (existingFavorite.length > 0) {
            await fastify.pg.transact(async client => {
                await client.query(`DELETE FROM favorites WHERE post_id = $1 AND user_id = $2`, [post_id, user_id])
            })
            return reply.code(200).send('removed from favorites.')
        }
        await fastify.pg.transact(async client => {
            await client.query(`INSERT INTO favorites (post_id, user_id) VALUES ($1, $2)`, [post_id, user_id])
        })
        reply.code(200).send('added to favorites.')
    } catch (error) {
        console.error(error)
        reply.code(500).send('something went wrong')
    }
}

export const removeFromFavorites = async (request: FastifyRequest<{ Params: { post_id: number } }>, reply: FastifyReply) => {
    try {
        const { post_id } = request.params
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        await fastify.pg.transact(async client => {
            await client.query('DELETE FROM favorites WHERE user_id = $1 AND post_id = $2', [user_id, post_id])
        })
        reply.code(200).send('removed from favorites')
    } catch (error) {
        console.error(error)
        reply.code(500).send('something went wrong')
    }
}