import { User } from '../userSlice'
import { REST_API } from './centralAPI'

export const authAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
    checkAuth: builder.query<{ authorized: boolean }, void>({
      query: () => 'auth/check-auth',
      keepUnusedDataFor: 15
    }),
    signInWithGoogle: builder.mutation<{user: User, jwt: string}, User>({
        query: (user) => ({ url: 'auth/google-signin', method: 'POST', body: user }),
    }),
    signIn: builder.mutation<{user: User, jwt?: string, error?: string}, { email: string, password: string }>({
      query: (user) => ({ url: 'auth/signin', method: 'POST', body: user }),
    }),
    signUp: builder.mutation<{user: User, jwt?: string, error?: string}, { username: string, email: string, password: string, country: string, phone_number: string }>({
      query: (user) => ({ url: 'auth/signup', method: 'POST', body: user }),
    }),
    verifyCode: builder.mutation<{ verified: boolean, message: string }, { input: string, user_id: number }>({
      query: (body) => ({ url: 'auth/verify-code', method: 'POST', body }),
    }),
    resendCode: builder.mutation<string, { email: string, user_id: number }>({
      query: (body) => ({ url: 'auth/resend-code', method: 'POST', body }),
    })
  }),
  overrideExisting: true,
})

export const { useSignInWithGoogleMutation, useResendCodeMutation, useSignInMutation, useSignUpMutation, useVerifyCodeMutation, useCheckAuthQuery } = authAPI