import { socket } from '../../socket'
import { REST_API } from './centralAPI'

export type Room = {
  room_id: number
  seller_id: number
  profile_picture: string
  username: string
  user_id: number
  text: string
  date: string
}

export type Message = {
  message_id: number
  sender_id?: number
  text: string
  date?: string
  username: string
  profile_picture: string
}

export const roomsAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => `rooms`,
      providesTags: ['Rooms'],
    }),
    createRoom: builder.mutation<{ room_id: number }, { seller_id: number }>({
      query: (body) => ({ url: 'rooms', method: 'POST', body }),
      invalidatesTags: ['Rooms'],
    }),
    getRoomMessages: builder.query<Message[], number>({
      query: (room_id) => `messages/${room_id}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded

          socket.on('receivedMessage' ,(message: Message) => {
            console.log('received: ', message)
            updateCachedData((draft) => {
              draft.push(message)
            })
          })

        } catch (error) {
          console.error('Something went wrong in onCacheEntryAdded:', error)
        }
      },
    }),
    sendMessage: builder.mutation<string, { message: Message, room_id: number }>({
      query: ({ room_id, message: { text, sender_id } }) => ({ url: 'messages', method: 'POST', body: { room_id, text } }),
      async onQueryStarted(body, { dispatch }) {
        dispatch(
          roomsAPI.util.updateQueryData('getRoomMessages', body.room_id, (draft: Message[]) => {
            return [...draft, body.message]
          })
        )
        dispatch(
          roomsAPI.util.updateQueryData('getRooms', undefined, (draft: Room[]) => {
            const newRooms = draft.map(room => {
              if (room.room_id === body.room_id) {
                return {
                  ...room,
                  text: body.message.text,
                  date: new Date().toISOString()
                }
              }
              return room
            })
            return newRooms
          })
        )
      }
    })
  }),
  overrideExisting: true,
})

export const { useGetRoomsQuery, useCreateRoomMutation, useGetRoomMessagesQuery, useSendMessageMutation } = roomsAPI
