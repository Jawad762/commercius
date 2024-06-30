import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTab from './BottomTab';
import { useFonts } from 'expo-font';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat'
import BrowsePosts from './BrowsePosts';
import { StatusBar, View } from 'react-native';
import { blue } from '../assets/colors';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import PostDetails from './PostDetails';
import WelcomePage from './WelcomePage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from './Signin';
import Signup from './Signup';
import { RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setAuth } from '../redux/userSlice';
import MyAccount from './MyAccount';
import Favorites from './Favorites';
import EditProfile from './EditProfile';
import ActivePosts from './ActivePosts';
import Chats from './Chats';
import Chat from './Chat';
import { usePrefetchImmediately } from '../redux/Prefetch';
import VerifyRegistration from './VerifyRegistration';
import { useCheckAuthQuery } from '../redux/API/authAPI';
import { socket } from '../socket';

export default function Main() {
  const auth = useSelector((state: RootState) => state.user.auth)
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useDispatch()
  const Tab = createBottomTabNavigator()
  const Stack = createNativeStackNavigator()
  useFonts({ 'Montserrat': Montserrat_500Medium })
  const { data } = useCheckAuthQuery()

  useEffect(() => {
    if (!data) return
    if (data.authorized) dispatch(setAuth(true))
    else {
      dispatch(setAuth(false))
    }
  }, [auth, data])

  useEffect(() => {
    const styleScreen = async () => {
      if (auth && user?.is_confirmed) {
        await NavigationBar.setBackgroundColorAsync('white')
        await NavigationBar.setButtonStyleAsync('dark');
      }
      else {
        await NavigationBar.setBackgroundColorAsync(blue)
        await NavigationBar.setButtonStyleAsync('light');
      }
    }
    styleScreen()
  },[auth, user])

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '483664023467-7dod2v0n6t6td0mo85ujftf6n8old6j8.apps.googleusercontent.com'
    })

    socket.on('message', (message: any) => {
      console.log(message)
    })
  }, [])

  const MainNavigation = () => {
    usePrefetchImmediately('getFavorites' as never, undefined as never)
    usePrefetchImmediately('getRooms' as never, undefined as never)
    usePrefetchImmediately('getPopularPosts' as never, undefined as never)
    usePrefetchImmediately('getUserPosts' as never, undefined as never)
    return (
      <Tab.Navigator backBehavior='history' screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTab {...props}/>}>
        <Tab.Screen name='Home' component={Home}/>
        <Tab.Screen name='BrowsePosts' component={BrowsePosts}/>
        {/* @ts-ignore */}
        <Tab.Screen name='PostDetails' component={PostDetails}/>
        <Tab.Screen name='Account' component={MyAccount}/>
        <Tab.Screen name='EditProfile' component={EditProfile}/>
        <Tab.Screen name='Favorites' component={Favorites}/>
        <Tab.Screen name='ActivePosts' component={ActivePosts}/>
        <Tab.Screen name='Chats' component={Chats}/>
      </Tab.Navigator>
    )
  }

  return (
        <View style={{ backgroundColor: blue, flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {auth && user?.is_confirmed ?
                  <Stack.Group>
                    <Stack.Screen name="MainNavigation" component={MainNavigation} />
                    <Stack.Screen name="Chat" component={Chat} />
                  </Stack.Group>
                :
                  <Stack.Group>
                    <Stack.Screen name='Welcome' component={WelcomePage}/>
                    <Stack.Screen name='Signin' component={Signin}/>
                    <Stack.Screen name='Signup' component={Signup}/>
                    <Stack.Screen name='VerifyRegistration' component={VerifyRegistration}/>
                  </Stack.Group>
              }
              </Stack.Navigator>
            <StatusBar backgroundColor={blue} barStyle='light-content'/>
          </NavigationContainer>
        </View>
  );
}