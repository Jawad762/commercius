import { FastifyInstance } from "fastify"
import { createRoom, getUserRooms } from "../controllers/rooms.ts"
import { verifyAuth } from "../helpers/verifyAuth.ts"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // get user rooms
    fastify.get('/', getUserRooms)

    // create room
    fastify.post('/', createRoom)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes