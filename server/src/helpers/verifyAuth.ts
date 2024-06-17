import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'

export const verifyAuth = (request: FastifyRequest, reply: FastifyReply, done: any) => {
    try {
        const token = request.headers.authorization
        if (!token) return reply.code(401).send('unauthorized')
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string, (err, _) => {
            if (err) return reply.code(401).send('unauthorized')
        })
        done()
    } catch (error) {
        console.error(error)
        return reply.code(500).send('something went wrong')
    }
}