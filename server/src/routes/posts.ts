import { FastifyInstance } from "fastify"
import { getPosts, createPost, getActivePosts, deletePost, getPopularPosts } from "../controllers/posts.ts"
import { verifyAuth } from "../helpers/verifyAuth.ts"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // get posts
    fastify.get('/:category/:country', getPosts)

    // add post
    fastify.post('/', createPost)

    // get user's active posts
    fastify.get('/active', getActivePosts)

    // delete user post
    fastify.delete('/delete/:post_id', deletePost)

    // get popular posts
    fastify.get('/popular', getPopularPosts)

    // add authorization middleware to all the routes above
    fastify.addHook('preHandler', verifyAuth)
}

export default routes