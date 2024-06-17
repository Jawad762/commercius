import { User } from '../userSlice'
import { REST_API } from './centralAPI'

export const userAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
    editProfile: builder.mutation<string, User>({
        query: (user) => ({ url: 'users', method: 'PUT', body: user }),
    }),
  }),
  overrideExisting: true,
})

export const { useEditProfileMutation } = userAPI