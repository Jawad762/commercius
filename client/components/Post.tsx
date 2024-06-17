import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText'
import { blue, lightGray } from '../assets/colors'
import { Post as PostType } from './BrowsePosts'

interface Props {
    post: PostType
    navigation: any
    styles: any
}

const Post = ({ post, navigation, styles }: Props) => {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 20, backgroundColor: 'white', paddingRight: 20, borderRadius: 10, ...styles.shadowProp }} onPress={() => navigation.navigate(`PostDetails`, { post })}>
        <Image width={100} style={{ aspectRatio: 3/4, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} source={{ uri: post.pictures?.[0] }}/>
        <View style={{ paddingVertical: 10 }}>
            <CustomText style={{ color: blue }} numberOfLines={1} ellipsizeMode='tail'>{post.title}</CustomText>
            <CustomText style={{ color: blue, fontSize: 22, fontWeight: 700 }}>{post.price}$</CustomText>
            <CustomText style={{ fontSize: 10, color: blue, marginTop: 'auto', paddingTop: 8, borderTopWidth: 2, borderColor: lightGray }}>{post.city}</CustomText>
            <CustomText style={{ fontSize: 10, color: blue }}>2 days ago</CustomText>
        </View>
    </TouchableOpacity>
  )
}

export default Post