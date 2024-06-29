import { FastifyReply, FastifyRequest } from 'fastify'
import { Post, fastify } from '../index.js'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const getPosts = async (request: FastifyRequest<{ Params: { category: string, country: string }}>, reply: FastifyReply) => {
    try {
        const { category, country } = request.params
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        const { rows } = await fastify.pg.query(`
        SELECT
            posts.post_id,
            posts.user_id,
            posts.category,
            posts.title,
            posts.price,
            posts.description,
            posts.pictures,
            posts.country,
            posts.city,
            posts.date,
            users.username,
            users.profile_picture,
            users.email,
            users.phone_number,
            CASE
                WHEN (SELECT post_id FROM favorites WHERE post_id = posts.post_id AND user_id = $1) IS NOT NULL THEN TRUE
            ELSE
                false
            END as is_item_in_favorites
            FROM posts 
            JOIN users ON users.user_id = posts.user_id
            WHERE category = $2 AND posts.user_id != $3 AND posts.country = $4
        `, [user_id, category, user_id, country])
        
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const createPost = async (request: FastifyRequest<{ Body: Post }>, reply: FastifyReply) => {
    try {
        const { category, title, description, price, pictures, country, city } = request.body
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload

        await fastify.pg.transact(async client => {
            await client.query('INSERT INTO posts (user_id, category, title, description, price, pictures, country, city, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [user_id, category, title, description, price, pictures, country, city, new Date()])
        })
        reply.code(200).send('success')
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const getActivePosts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        const { rows } = await fastify.pg.query(`
        SELECT
            posts.post_id,
            posts.user_id,
            posts.category,
            posts.title,
            posts.price,
            posts.description,
            posts.pictures,
            posts.country,
            posts.city,
            posts.date,
            users.username,
            users.profile_picture,
            users.email,
            users.phone_number
            FROM posts 
            JOIN users ON users.user_id = posts.user_id
            WHERE posts.user_id = $1
        `, [user_id])
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const deletePost = async (request: FastifyRequest<{ Params: { post_id: string } }>, reply: FastifyReply) => {
    try {
        const { post_id } = request.params
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        await fastify.pg.query('DELETE FROM posts WHERE post_id = $1 AND user_id = $2', [post_id, user_id])
        reply.code(200).send('post deleted successfully')
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}

export const getPopularPosts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]
        const { id: user_id } = jwt.decode(token as string) as JwtPayload
        const { rows } = await fastify.pg.query(`
        SELECT
            posts.post_id,
            posts.user_id,
            posts.category,
            posts.title,
            posts.price,
            posts.description,
            posts.pictures,
            posts.country,
            posts.city,
            posts.date,
            users.username,
            users.profile_picture,
            users.email,
            users.phone_number,
            CASE
                WHEN (SELECT post_id FROM favorites WHERE post_id = posts.post_id AND user_id = $1) IS NOT NULL THEN TRUE
            ELSE
                false
            END as is_item_in_favorites
        FROM posts 
        JOIN users ON users.user_id = posts.user_id
        WHERE posts.user_id != $1
        LIMIT 5`, [user_id])
        reply.code(200).send(rows)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error)
    }
}