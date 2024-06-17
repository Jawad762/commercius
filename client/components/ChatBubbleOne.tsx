import React from 'react'
import { Message } from '../redux/API/roomsAPI'
import { Image, View } from 'react-native'
import CustomText from './CustomText'
import { blue } from '../assets/colors'

const ChatBubbleOne = ({ message, previousMessageSenderId }: { message: Message, previousMessageSenderId: number | null }) => {
  
  return (
    <View style={{ flexDirection: 'row-reverse', gap: 8, alignItems: 'center', maxWidth: 260, marginLeft: 'auto' }}>
        {message.sender_id !== previousMessageSenderId && <Image height={35} width={35} source={message.profile_picture ? { uri: message.profile_picture } : require('../assets/default-pfp.jpg')} style={{ borderRadius: 50, objectFit: 'cover', maxHeight: 40, maxWidth: 40 }}/>}
        <View style={{ backgroundColor: 'orange', padding: 10, borderRadius: 10, marginRight: message.sender_id !== previousMessageSenderId ? 0 : 48, minWidth: 60 }}>
            <CustomText style={{ color: blue, opacity: 0.8 }}>{message.text}</CustomText>
        </View>
    </View>
  )
}

export default ChatBubbleOne