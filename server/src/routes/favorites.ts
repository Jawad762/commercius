import { FastifyInstance } from "fastify"
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorites.js"
import { verifyAuth } from "../helpers/verifyAuth.js"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // get user favorites
    fastify.get('/', getFavorites)

    // add to favorites
    fastify.post('/', addToFavorites)

    // remove from favorites
    fastify.delete('/:post_id', removeFromFavorites)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes