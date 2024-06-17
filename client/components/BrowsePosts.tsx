import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { AntDesign, MaterialCommunityIcons, FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import CustomText from './CustomText';
import { blue, lightGray } from '../assets/colors';
import FilterModal from './FilterModal';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PostComponent from './Post';
import { useGetPostsQuery } from '../redux/API/postsAPI';

export interface Post {
  post_id?: number
  user_id?: number
  title: string
  country: string
  city: string
  price: number
  category: string
  pictures?: string[]
  is_item_in_favorites?: boolean
  email: string
  username: string
  profile_picture: string
}

const BrowsePosts = ({ route, navigation }: any) => {

  const user = useSelector((state: RootState) => state.user.user)
  const [showModal, setShowModal] = useState(false)
  const category = route.params.category
  const [fromPrice, setFromPrice] = useState<number | null>(null);
  const [toPrice, setToPrice] = useState<number | null>(null);
  const [sortValue, setSortValue] = useState('default');

  const { data: posts } = useGetPostsQuery({ category, country: user?.country as string })
  
  const filteredPosts = posts?.filter((post: Post) => {
    if (fromPrice && toPrice) return post.price >= fromPrice && post?.price <= toPrice
    else if (fromPrice) return post.price >= fromPrice
    else if (toPrice) return post.price <= toPrice
    return true
  })
  .sort((a: Post, b: Post) => {
    if (sortValue === 'lth') return a.price - b.price
    else if (sortValue === 'htl') return b.price - a.price
    else return 0
  })
  
  return (
    <View style={{ backgroundColor: blue, flex: 1 }}>
      <View style={{ paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: blue }}>
        <FontAwesome6 name="location-dot" size={24} color="orange" />
        <CustomText style={{ color: 'white', fontSize: 20 }}>Beirut, Lebanon</CustomText>
      </View>

      <View style={{ padding: 20, paddingBottom: 10, backgroundColor: lightGray, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: blue, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
          <AntDesign name="search1" size={20} color={blue} />
          <TextInput style={{ color: blue, flex: 1 }} placeholderTextColor={blue} placeholder='Search'></TextInput>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 10, gap: 10 }}>
          <Pressable onPress={() => setShowModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="filter-variant" size={24} color={blue} />
            <CustomText style={{ color: blue }}>Filters</CustomText>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: blue, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 }}>
            <MaterialIcons name="category" size={20} color="orange" />
            <CustomText style={{ color: 'orange', fontSize: 10, textTransform: 'capitalize' }}>{category}</CustomText>
          </View>
          {sortValue !== 'default' &&
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: blue, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 }}>
            <MaterialCommunityIcons name="sort" size={20} color="orange" />
            <CustomText style={{ color: 'orange', fontSize: 10, textTransform: 'uppercase' }}>{sortValue}</CustomText>
          </View>
          }
        </View>
      </View>

      <View style={{ backgroundColor: lightGray, flex: 1 }}>
        {posts ? (
          <FlatList
          data={filteredPosts} 
          renderItem={({ item: post }) => <PostComponent post={post} navigation={navigation} styles={styles}/>} 
          ListEmptyComponent={<CustomText style={{ color: blue, flex: 1, textAlign: 'center'}}>No posts matched your search.</CustomText>}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          />
        ) :
        <View style={{ alignItems: 'center', marginVertical: 30 }}>
          <ActivityIndicator color={blue} size={'large'}/>
        </View>
        }
      </View>

      <FilterModal showModal={showModal} setShowModal={setShowModal} category={category} navigation={navigation} fromPrice={fromPrice} setFromPrice={setFromPrice} toPrice={toPrice} setToPrice={setToPrice} sortValue={sortValue} setSortValue={setSortValue} />
    </View>
  )
}

export default BrowsePosts

const styles = StyleSheet.create({
  shadowProp: {  
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
    elevation: 3,  
  },  
})