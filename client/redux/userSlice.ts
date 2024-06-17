import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface User {
  user_id: number
  username: string
  profile_picture: string | null
  country: string | null
  phone_number: string | null
  email: string
  is_confirmed: boolean
  provider: string
}

interface SliceTypes {
  user: User | null
  auth: boolean
  token: string | null
}

const initialState: SliceTypes = {
  user: null,
  auth: false,
  token: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.auth = action.payload
    },
    logIn: (state, action: PayloadAction<{ user: User, jwt: string }>) => {
      state.token = action.payload.jwt
      state.auth = true
      if (state.user?.profile_picture) state.user = action.payload.user
      else state.user = {...action.payload.user, profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'}
    },
    confirmUser: (state) => {
      if (state.user) {
        state.user = { ...state.user, is_confirmed: true };
      }
    },
    logOut: (state) => {
      state.user = null
      state.token = null
      state.auth = false
    },
  },
})

export const { setUser, setAuth, logIn, confirmUser , logOut} = userSlice.actions

export default userSlice.reducer