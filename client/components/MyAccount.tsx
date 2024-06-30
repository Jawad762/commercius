import React, { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { blue, lightGray } from '../assets/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import CustomText from './CustomText'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { logOut } from '../redux/userSlice'
import LoadingScreen from './LoadingScreen'
import { useDeleteAccountMutation } from '../redux/API/userAPI'

const Profile = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteUser] = useDeleteAccountMutation()

    const handleSignout = async () => {
        try {
            setIsLoading(true)
            setTimeout(() => {
                dispatch(logOut())
            }, 2000)
        } catch (error) {
            console.error(JSON.stringify(error))
        }
    }

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            await deleteUser()
            setTimeout(() => {
                dispatch(logOut())
            }, 2000)
        } catch (error) {
            console.error(JSON.stringify(error))
        }
    }
 
    if (isLoading) return <LoadingScreen/>

  return (
    <View style={{ flex: 1, backgroundColor: blue }}>

        <CustomText style={{ color: 'white', fontSize: 24, marginTop: 20, marginHorizontal: 20 }}>My account</CustomText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20 }}>
            <Image style={{ borderRadius: 50, height: 70, width: 70, objectFit: 'cover' }} source={{ uri: user?.profile_picture || '' }}/>
            <View style={{ width: '70%' }}>
                <CustomText style={{ color: 'white', fontSize: 20 }}>{user?.username}</CustomText>
                <CustomText style={{ color: 'white', opacity: 0.8 }}>{user?.email}</CustomText>
            </View>
        </View>

        <View style={{ flex: 1, gap: 30, padding: 20, backgroundColor: lightGray }}>
            <View style={{ flex: 1 }}>
                <Pressable onPress={() => navigation.navigate('EditProfile')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, borderBottomWidth: 1, padding: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                    <Ionicons name="person-circle" size={32} color={blue} />
                    <CustomText style={{ color: blue }}>Edit Profile</CustomText>
                    <Ionicons name="chevron-forward" size={28} color={blue} style={{ marginLeft: 'auto' }} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('ActivePosts')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, padding: 10 }}>
                    <Ionicons name="list" size={32} color={blue}/>
                    <CustomText style={{ color: blue }}>Active posts</CustomText>
                    <Ionicons name="chevron-forward" size={28} color={blue} style={{ marginLeft: 'auto' }} />
                </Pressable>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }} onPress={handleDelete}>
                    <AntDesign name="deleteuser" size={28} color={blue} />
                    <CustomText style={{ color: blue }}>Delete Account</CustomText>
                    <Ionicons name="chevron-forward" size={28} color={blue} style={{ marginLeft: 'auto' }} />
                </Pressable>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, marginTop: 'auto' }} onPress={handleSignout}>
                    <Ionicons name="log-out" size={32} color={blue} />
                    <CustomText style={{ color: blue }}>Sign-out</CustomText>
                    <Ionicons name="chevron-forward" size={28} color={blue} style={{ marginLeft: 'auto' }} />
                </Pressable>
            </View>
        </View>
    </View>
  )
}

export default Profile