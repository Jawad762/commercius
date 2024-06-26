import { FastifyInstance } from "fastify"
import { createRoom, getUserRooms } from "../controllers/rooms.js"
import { verifyAuth } from "../helpers/verifyAuth.js"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // get user rooms
    fastify.get('/', getUserRooms)

    // create room
    fastify.post('/', createRoom)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes