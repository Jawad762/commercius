import React from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, View } from 'react-native'
import { blue } from '../assets/colors'
import CustomText from './CustomText'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Room, useGetRoomsQuery } from '../redux/API/roomsAPI'

const Chats = ({ navigation, route }: any) => {
  const user = useSelector((state: RootState) => state.user.user)
  let { data: rooms, isLoading } = useGetRoomsQuery()
  const { tab } = route.params

  let copiedRooms = rooms ? [...rooms] : [];

  if (tab === 'selling') {
    copiedRooms = copiedRooms.filter(room => room.seller_id === user?.user_id);
  } else if (tab === 'buying') {
    copiedRooms = copiedRooms.filter(room => room.seller_id !== user?.user_id);
  }

  copiedRooms.sort((a: Room, b: Room) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <View style={{ flex: 1, backgroundColor: blue }}>
        <View style={{ paddingBottom: 10 }}>
            <CustomText style={{ color: 'white', fontSize: 24, padding: 20, }}>Chats</CustomText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4, borderBottomWidth: 0.5, borderColor: 'white' }}>
                <Pressable onPress={() => navigation.setParams({ tab: 'all' })} style={{ borderBottomWidth: 1, borderColor: `${tab === 'all' ? 'orange' : 'black'}`, flex: 1, paddingBottom: 8 }}>
                    <CustomText style={{ color: `${tab === 'all' ? 'orange' : 'white'}`, textAlign: 'center' }}>All</CustomText>
                </Pressable>
                <Pressable style={{ flex: 1, borderBottomWidth: 1, borderColor: `${tab === 'buying' ? 'orange' : 'black'}`, }} onPress={() => navigation.setParams({ tab: 'buying' })}>
                    <CustomText style={{ color: `${tab === 'buying' ? 'orange' : 'white'}`, textAlign: 'center' }}>Buying</CustomText>
                </Pressable>
                <Pressable style={{ flex: 1, borderBottomWidth: 1, borderColor: `${tab === 'selling' ? 'orange' : 'black'}`, }} onPress={() => navigation.setParams({ tab: 'selling' })}>
                    <CustomText style={{ color: `${tab === 'selling' ? 'orange' : 'white'}`, textAlign: 'center' }}>Selling</CustomText>
                </Pressable>
            </View>
        </View>  
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          {isLoading ?
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <ActivityIndicator color={'white'} size={'large'}/>
            </View> 
            :
            <FlatList
            data={copiedRooms}
            renderItem={({ item: room }) => (
                <Pressable style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} onPress={() => navigation.navigate('Chat', { room_id: room.room_id, profile_picture: room.profile_picture, username: room.username })}>
                    <Image height={50} width={50} source={room.profile_picture ? { uri: room.profile_picture } : require('../assets/default-pfp.jpg')} style={{ borderRadius: 50, objectFit: 'cover', maxHeight: 50, maxWidth: 50 }}/>
                    <View>
                        <CustomText style={{ color: 'white' }}>{room.username}</CustomText>
                        <CustomText style={{ color: 'white', fontSize: 12, opacity: 0.8 }} numberOfLines={1} ellipsizeMode='tail'>{room.text}</CustomText>
                    </View>
                </Pressable>
            )}
            ListEmptyComponent={<CustomText style={{ textAlign: 'center', color: 'white', marginTop: 60 }}>Active chats will appear here!</CustomText>}
            contentContainerStyle={{ gap: 20 }}
            />
          }
        </View>
    </View>
  )
}

export default Chats