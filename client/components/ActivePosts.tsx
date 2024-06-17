import React from 'react'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText'
import { blue, lightGray } from '../assets/colors'
import { useGetUserPostsQuery } from '../redux/API/postsAPI'

const ActivePosts = ({ navigation }: any) => {
  const { data: posts, isLoading } = useGetUserPostsQuery()

  return (
    <View style={{ flex: 1, backgroundColor: blue }}>
        <View style={{ padding: 20 }}>
            <CustomText style={{ color: 'white', fontSize: 24 }}>Active Posts</CustomText>
            <CustomText style={{ color: 'white', opacity: 0.8 }}>You have {posts?.length || 0} active post{posts?.length !== 1 && 's'}</CustomText>
        </View>  
        <View style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20, backgroundColor: lightGray }}>
          {isLoading ?
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <ActivityIndicator color={blue} size={'large'}/>
            </View> 
            :
            <FlatList
            data={posts}
            renderItem={({ item: post }) => (
              <View style={{ width: '48%', backgroundColor: 'white', borderRadius: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate(`PostDetails`, { post })}>
                  <Image style={{ aspectRatio: 3/4, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: post.pictures?.[0] }}/>
                  <View style={{ padding: 10 }}>
                      <CustomText style={{ color: blue }} numberOfLines={1} ellipsizeMode='tail'>{post.title}</CustomText>
                      <CustomText style={{ color: blue, fontSize: 22, fontWeight: 700 }}>USD {post.price}</CustomText>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<CustomText style={{ textAlign: 'center' }}>Active Posts will appear here!</CustomText>}
            contentContainerStyle={{ gap: 10 }}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            />
          }
        </View>
    </View>
  )
}

export default ActivePosts