import { User } from '../userSlice'
import { REST_API } from './centralAPI'

export const userAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
    editProfile: builder.mutation<string, User>({
        query: (user) => ({ url: 'users', method: 'PUT', body: user }),
    }),
    deleteAccount: builder.mutation<string, void>({
      query: () => ({ url: 'users', method: 'DELETE' })
    })
  }),
  overrideExisting: true,
})

export const { useEditProfileMutation, useDeleteAccountMutation } = userAPI