import React, { useState } from 'react'
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { blue } from '../assets/colors'
import CustomText from './CustomText'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { User, logIn, setAuth } from '../redux/userSlice';
import LoadingScreen from './LoadingScreen';
import { useSignInWithGoogleMutation } from '../redux/API/authAPI';

const WelcomePage = ({ navigation }: any) => {

  const dispatch = useDispatch()
  const [signInWithGoogle] = useSignInWithGoogleMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const data = await GoogleSignin.signIn()
      const user = {
        email: data.user.email,
        username: data.user.givenName,
        google_id: data.user.id,
        profile_picture: data.user.photo
      }
      setIsLoading(true)
      const { data: userData } = await signInWithGoogle(user as any) as { data: { user: User, jwt: string } }
      dispatch(logIn(userData))
      setTimeout(() => {
        dispatch(setAuth(true))
        setIsLoading(false)
      }, 3000)
    } catch (error) {
      console.log('error:', JSON.stringify(error))
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingScreen/>

  return (
    <View style={{ backgroundColor: blue, flex: 1, padding: 20, justifyContent: 'space-around' }}>

        <SafeAreaView style={{ alignItems: 'center', height: 150 }}>
          <Image style={{ maxWidth: 150, maxHeight: 150 }} source={require('../assets/logo.png')} />
        </SafeAreaView>

        <View>
          <CustomText style={{ color: 'white', textAlign: 'center', fontSize: 40 }}>Hello</CustomText>
          <CustomText style={{ color: 'white', textAlign: 'center', fontSize: 14, opacity: 0.9 }}>Welcome to Commercius, your go-to app to find all your wants and needs.</CustomText>
          <TouchableOpacity style={{ marginTop: 40, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 2, borderColor: 'white', borderRadius: 50 }} onPress={() => navigation.navigate('Signin')}>
            <CustomText style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Login</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'orange', borderRadius: 50 }} onPress={() => navigation.navigate('Signup')}>
            <CustomText style={{ color: blue, textAlign: 'center', fontSize: 20 }}>Sign Up</CustomText>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 20, borderTopWidth: 1, borderColor: 'white', alignItems: 'center' }}>
          <CustomText style={{ color: 'white', textAlign: 'center', fontSize: 14, backgroundColor: blue, zIndex: 100, paddingHorizontal: 10, position: 'relative', top: -12 }}>Continue with</CustomText>
          <TouchableOpacity onPress={handleSignInWithGoogle} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 50, gap: 10, width: '100%' }}>
            <Image style={{ maxWidth: 25, maxHeight: 25}} source={require('../assets/google.png')} />
            <CustomText style={{ color: blue, textAlign: 'center', fontSize: 20 }}>Google</CustomText>
          </TouchableOpacity>
        </View>

    </View>
  )
}

export default WelcomePage