import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyIO from 'fastify-socket.io'
import Postgres from '@fastify/postgres'
import fs from 'fs'
import postRoutes from './routes/posts'
import favoritesRoutes from './routes/favorites'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import messageRoutes from './routes/messages'
import roomRoutes from './routes/rooms'
import ngrok from '@ngrok/ngrok'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
dotenv.config()

export const fastify = Fastify({ logger: true })

fastify.register(fastifyCors, {
    origin: '*'
})

fastify.register(fastifyIO)

fastify.ready(() => {
    fastify.io.on('connection', async (socket) => {
        socket.on('joinRoom', (room: string): void => {
            socket.join(room);
        })
        socket.on('leaveRoom', (room: string): void => {
            socket.leave(room)
        })
        socket.on('sendMessage', (message: any): void => {
            console.log('server received')
            socket.broadcast.emit('receivedMessage', message)
        })
        socket.on('deleteMessage', (message: Message): void => {
            socket.broadcast.emit('deletedMessage', message)
        })
    })
})

fastify.register(Postgres, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./src/ca.pem').toString()
    }
})

fastify.register(userRoutes, { prefix: '/api/users' })
fastify.register(postRoutes, { prefix: '/api/posts' })
fastify.register(favoritesRoutes, { prefix: '/api/favorites' })
fastify.register(roomRoutes, { prefix: '/api/rooms' })
fastify.register(messageRoutes, { prefix: '/api/messages' })
fastify.register(authRoutes, { prefix: '/api/auth' })

fastify.listen({ port: 8000 }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    else console.log('Server listening on port 8000')
})

ngrok.connect({ addr: 8000, authtoken_from_env: true })
	.then(listener => console.log(`Ingress established at: ${listener.url()}`));

declare module "fastify" {
    interface FastifyInstance {
        io: Server<any>
    }
}    

export type User = {
    user_id?: number
    username?: string
    email?: string
    password?: string
    profile_picture?: string
    phone_number: string
    country: string
    google_id?: string
}

export interface Post {
    user_id: number
    category: string
    title: string
    description: string
    price: string
    pictures: string[]
    country: string
    city: string
}

export interface Message {
    message_id: number
    sender_id: number
    room_id: number
    text: string
    date: string
    username: string
    profile_picture: string
}