import React from 'react'
import { ActivityIndicator, Alert, FlatList, Image, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useGetRoomMessagesQuery, useSendMessageMutation } from '../redux/API/roomsAPI'
import { RootState } from '../redux/store'
import CustomText from './CustomText'
import { blue } from '../assets/colors'
import ChatBubbleOne from './ChatBubbleOne'
import ChatBubbleTwo from './ChatBubbleTwo'
import { Ionicons } from '@expo/vector-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { socket } from '../socket'

interface FormInput {
  text: string
}

const Chat = ({ route, navigation }: any) => {
    const user = useSelector((state: RootState) => state.user.user)
    const { room_id, profile_picture, username } = route.params
    let { data: messages, isLoading } = useGetRoomMessagesQuery(room_id as number)
    const [sendMessage] = useSendMessageMutation()
    const { control, handleSubmit, reset } = useForm<FormInput>()

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
      try {
        reset()
        const message = {
          sender_id: user?.user_id,
          message_id: messages?.[messages.length - 1]?.message_id as number + 1 || 1000 + Math.floor(Math.random() * 1000),
          text: data.text,
          username: user?.username as string,
          profile_picture: user?.profile_picture as string,
          date: new Date().toISOString()
        }
        socket.emit('sendMessage', message)
        await sendMessage({ message, room_id })
      } catch (error) {
        Alert.alert('Error', 'Failed to send message. Please try again later.', [{ text: 'OK' }]);
        console.error(error)
      }
    }

  return (
    <View style={{ flex: 1, backgroundColor: blue }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderColor: 'white' }}>
            <Ionicons name="arrow-back-circle" size={40} color="white" onPress={() => navigation.goBack()} />
            <Image height={40} width={40} source={profile_picture ? { uri: profile_picture } : require('../assets/default-pfp.jpg')} style={{ borderRadius: 50, objectFit: 'cover', maxHeight: 40, maxWidth: 40 }}/>
            <CustomText style={{ color: 'white' }}>{username}</CustomText>  
        </View>  
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20 }}>
          {isLoading ?
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <ActivityIndicator color={'white'} size={'large'}/>
            </View> 
            :
            <FlatList
            data={messages}
            renderItem={({ item: message, index }) => (
                <>
                {message.sender_id === user?.user_id ? <ChatBubbleOne message={message} previousMessageSenderId={messages?.[index - 1]?.sender_id || null}/> : <ChatBubbleTwo message={message} previousMessageSenderId={messages?.[index - 1]?.sender_id || null}/>}
                </>
            )}
            contentContainerStyle={{ gap: 2 }}
            />
          }
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderTopWidth: 1, borderColor: 'white' }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput onBlur={onBlur}
              onChangeText={onChange}
              value={value} inputMode='text' placeholderTextColor={'lightgray'} placeholder='Type message here...' style={{ fontSize: 18, flex: 1, color: 'white' }}/>
            )}
            name="text"
          />
          <Ionicons onPress={handleSubmit(onSubmit)} name="send-sharp" size={24} color="orange" />
        </View>
    </View>
  )
}

export default Chat