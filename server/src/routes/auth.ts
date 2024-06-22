import { FastifyInstance } from "fastify"
import { checkAuth, googleSignin, resendVerificationCode, signin, signup, verifyCode } from "../controllers/auth.ts"

const routes = async (fastify: FastifyInstance, _options: Object) => {
    // continue with google
    fastify.post('/google-signin', googleSignin)
    // sign in
    fastify.post('/signin', signin)
    // sign up
    fastify.post('/signup', signup)
    // check if user is authorized
    fastify.get('/check-auth', checkAuth)
    // verify code
    fastify.post('/verify-code', verifyCode)
    // resend code
    fastify.post('/resend-code', resendVerificationCode)
}

export default routes