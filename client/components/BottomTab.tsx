import React, { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { blue, lightGray } from '../assets/colors';
import CreatePostModal from './CreatePostModal';

const BottomTab = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.user.user)
  const [showModal, setShowModal] = useState(false)

  const isPageActive = (page: string) => {
    return navigation.getState().index === navigation.getState().routeNames.indexOf(page)
  }

  return (
    <>
    <View style={{ backgroundColor: lightGray }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 14, backgroundColor: 'white' }}>
          <Ionicons name={isPageActive('Home') === true ? 'home' : 'home-outline'} size={24} color="#09203F" onPress={() => navigation.navigate('Home')} /> 
          <Ionicons onPress={() => navigation.navigate('Chats', { tab: 'all' })} name={isPageActive('Chats') === true ? 'chatbox' : 'chatbox-outline'} size={24} color={blue} style={{ marginBottom: -2 }} />
          <Pressable style={{ backgroundColor: 'white', borderRadius: 50, zIndex: 10, marginTop: -30, padding: 10, shadowOffset: {width: -2, height: 4}, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1 }} onPress={() => setShowModal(true)}>
            <Ionicons name="add-outline" size={32} color={blue} />
          </Pressable>
          <Ionicons onPress={() => navigation.navigate('Favorites')} name={isPageActive('Favorites') === true ? 'heart' : 'heart-outline'} size={28} color={blue} />
          <Pressable onPress={() => navigation.navigate('Account')}>
            <Image height={25} width={25} source={{ uri: user?.profile_picture as string }} style={{ borderRadius: 50, borderWidth: isPageActive('Account') === true ? 2 : 0, borderColor: blue }}/>
          </Pressable>
      </View>
    </View>

    <CreatePostModal showModal={showModal} setShowModal={setShowModal}/>
    </>
  )
}

export default BottomTab