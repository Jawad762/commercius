import { FastifyInstance } from "fastify"
import { getMessages, sendMessage } from "../controllers/messages.js"
import { verifyAuth } from "../helpers/verifyAuth.js"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // get room messages
    fastify.get('/:room_id', getMessages)
    
    // send message
    fastify.post('/', sendMessage)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes