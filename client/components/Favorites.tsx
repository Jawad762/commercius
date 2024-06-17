import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { blue, lightGray } from '../assets/colors'
import CustomText from './CustomText'
import Post from './FavoritePost'
import { useGetFavoritesQuery } from '../redux/API/favoritesAPI'

const Favorites = ({ navigation }: any) => {
  const { data: favorites, isLoading } = useGetFavoritesQuery()

  return (
    <View style={{ flex: 1, backgroundColor: blue }}>
        <View style={{ padding: 20 }}>
            <CustomText style={{ color: 'white', fontSize: 24 }}>Favorites</CustomText>
            <CustomText style={{ color: 'white', opacity: 0.8 }}>You have {favorites?.length || 0} item(s) in your favorites</CustomText>
        </View>  
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: lightGray }}>
          {isLoading ?
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <ActivityIndicator color={blue} size={'large'}/>
            </View> 
            :
            <FlatList
            data={favorites}
            renderItem={({ item: post }) => <Post post={post} navigation={navigation} styles={styles.shadowProp}/>}
            ListEmptyComponent={<CustomText style={{ textAlign: 'center' }}>Favorited items will appear here!</CustomText>}
            contentContainerStyle={{ gap: 10 }}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          }
        </View>
    </View>
  )
}

export default Favorites

const styles = StyleSheet.create({
  shadowProp: {  
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
    elevation: 3,  
  },  
})