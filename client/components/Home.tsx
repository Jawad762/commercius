import React from 'react'
import { Image, SafeAreaView, FlatList, StyleSheet, View, ScrollView, TextInput, Pressable } from 'react-native';
import CustomText from './CustomText';
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { blue, lightGray } from '../assets/colors';
import { useGetPopularPostsQuery } from '../redux/API/postsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Home = ({ navigation }: any) => {

  const user = useSelector((state: RootState) => state.user.user)
  
  const categories = [
    {
      logo: <MaterialCommunityIcons name="home-city" size={24} color="#09203F" />,
      name: 'Houses'
    },
    {
      logo: <FontAwesome5 name="couch" size={24} color="#09203F" />,
      name: 'Furniture'
    },
    {
      logo: <FontAwesome5 name="car" size={24} color="#09203F" />,
      name: 'Cars'
    },
    {
      logo: <FontAwesome name="headphones" size={24} color="#09203F" />,
      name: 'Electronics'
    },
    {
      logo: <Entypo name="game-controller" size={24} color="#09203F" />,
      name: 'Games'
    },
    {
      logo: <MaterialCommunityIcons name='shoe-sneaker' size={40} color="#09203F"/>,
      name: 'Fashion'
    },
  ]

  const { data: popularPosts } = useGetPopularPostsQuery()

  return (
    <View style={styles.container}>

      <ScrollView>
        <SafeAreaView style={{ backgroundColor: blue, padding: 20, paddingBottom: 0 }}>
          <CustomText style={{ color: 'white', fontSize: 24 }}>Home</CustomText>
        </SafeAreaView>
        <View style={{ paddingTop: 20, paddingBottom: 100, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, backgroundColor: blue}}>
          <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: 'white', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                <AntDesign name="search1" size={20} color="white" />
                <TextInput style={{ color: 'white', flex: 1 }} placeholderTextColor={'white'} placeholder='Search'></TextInput>
              </View>
          </View>

          <Image height={150} style={{ marginTop: 30, marginHorizontal: 20, borderRadius: 10 }} source={{ uri: 'https://i.pinimg.com/originals/fd/cb/98/fdcb9817f051f83db9a6cf32dccb268b.jpg' }}></Image>

          <View style={{ ...styles.shadowProp, marginHorizontal: 20, borderRadius: 10, padding: 10, backgroundColor: lightGray, position: 'absolute', bottom: 0, transform: 'translate(0, 60px)' }}>
            <CustomText style={styles.subTitle}>Categories</CustomText>
            <FlatList
              style={{ marginTop: 10 }}
              data={categories}
              renderItem={({ item }) =>
                <Pressable onPress={() => navigation.navigate('BrowsePosts', { category: item.name.toLowerCase() })} style={{ alignItems: 'center', marginRight: 20, gap: 5 }}>
                  <View style={{ borderWidth: 2, borderColor: blue, borderRadius: 50, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                    {item.logo}
                  </View>
                  <CustomText style={{ color: blue, fontSize: 10 }}>{item.name}</CustomText>
                </Pressable> 
              }
              showsHorizontalScrollIndicator={false}
              horizontal
              >
            </FlatList>
          </View>
        </View>

        <View style={{ marginTop: 80, paddingLeft: 20, backgroundColor: lightGray }}>
          <CustomText style={styles.subTitle}>Popular Products</CustomText>
          <ScrollView style={{ marginTop: 10 }} horizontal>
            {popularPosts?.map(post => (
              <Pressable onPress={() => navigation.navigate('PostDetails', { post })}>
                <Image height={300} style={{ borderRadius: 10, width: 200, marginRight: 10 }} source={{ uri: post.pictures?.[0] }} />
              </Pressable>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGray,
    gap: 20
  },
  subTitle: {
    color: blue,
    fontSize: 20,
  },
  shadowProp: {  
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
    elevation: 1,  
  },  
});

export default Home