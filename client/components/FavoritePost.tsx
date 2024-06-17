import React from 'react'
import { Image, Pressable, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText'
import { blue } from '../assets/colors'
import { Post } from './BrowsePosts'
import { Ionicons } from '@expo/vector-icons'
import { useRemoveFromFavoritesMutation } from '../redux/API/favoritesAPI'

interface Props {
    post: Post
    navigation: any
    styles: any
}

const FavoritePost = ({ post, navigation, styles }: Props) => {
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()

  const handleRemoveFromFavorites = () => {
    try {
      removeFromFavorites({ post })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{ width: '48%', backgroundColor: 'white', borderRadius: 10, ...styles.shadowProp }}>
        <Pressable onPress={handleRemoveFromFavorites} style={{ position: 'absolute', zIndex: 10, top: 0, right: 0, backgroundColor: blue, borderRadius: 50 }}>
          <Ionicons name="close" size={30} color="orange" />
        </Pressable>
        <TouchableOpacity onPress={() => navigation.navigate(`PostDetails`, { post })}>
          <Image style={{ aspectRatio: 3/4, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: post.pictures?.[0] }}/>
          <View style={{ padding: 10 }}>
              <CustomText style={{ color: blue }} numberOfLines={1} ellipsizeMode='tail'>{post.title}</CustomText>
              <CustomText style={{ color: blue, fontSize: 22, fontWeight: 700 }}>USD {post.price}</CustomText>
          </View>
        </TouchableOpacity>
    </View>
  )
}

export default FavoritePost