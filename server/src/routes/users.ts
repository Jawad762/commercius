import { FastifyInstance } from "fastify"
import { getUser, updateUser, deleteUser } from "../controllers/users.js"
import { verifyAuth } from "../helpers/verifyAuth.js"

const routes = async (fastify: FastifyInstance, _options: any) => {
    // find specific user
    fastify.get('/:user_id', getUser)

    // edit user profile
    fastify.put('/', updateUser)

    // delete user
    fastify.delete('/', deleteUser)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes