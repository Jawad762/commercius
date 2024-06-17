import React from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';
import { FontAwesome6, AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { blue } from '../assets/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useAddToFavoritesMutation } from '../redux/API/favoritesAPI';
import { useDeletePostMutation } from '../redux/API/postsAPI';
import { useCreateRoomMutation } from '../redux/API/roomsAPI';

const PostDetails = ({ route, navigation }: any) => {
    const { post } = route.params;
    const user = useSelector((state: RootState) => state.user.user)
    const [addToFavorites] = useAddToFavoritesMutation()
    const [deletePost] = useDeletePostMutation()
    const [startChat, { isLoading }] = useCreateRoomMutation()

    const handleAddToFavorites = async () => {
        try {
            navigation.setParams({ post: {...post, is_item_in_favorites: !post.is_item_in_favorites} })
            await addToFavorites({ post })
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeletePost = async () => {
        try {
            await deletePost(post)
            Alert.alert('Success', 'Your post has been deleted successfully.', [
                {text: 'OK'}
            ])
            navigation.navigate('ActivePosts')
        } catch (error) {
            console.error(error)
        }
    }

    const handleStartChat = async () => {
        try {
            const { data } = await startChat({ seller_id: post.user_id }) as { data: { room_id: number } }
            navigation.navigate('Chat', { room_id: data.room_id, username: post.username, profile_picture: post.profile_picture })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: blue, paddingVertical: 10 }}>
                <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 15 }}>
                    <AntDesign name="left" size={16} color={'white'} style={{ opacity: 0.9 }} />
                    <CustomText style={{ color: 'white', opacity: 0.9, fontSize: 18 }}>Back</CustomText>
                </Pressable>
                {post.user_id === user?.user_id ? (
                    <Pressable style={{ marginRight: 15 }}>
                        <Ionicons onPress={() => handleDeletePost()} name='trash-bin' size={30} color={'red'}/>
                    </Pressable>
                ) : (
                    <Ionicons onPress={() => handleAddToFavorites()} name={post.is_item_in_favorites === true ? "heart" : "heart-outline"} size={40} color={'white'} style={{ marginRight: 15 }}/>
                )}
            </View>

            <ScrollView style={{  }}>

                <View style={{ height: 400, justifyContent: 'center' }}>
                    <Image style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} source={{ uri: post.pictures?.[0] }}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <MaterialIcons name="navigate-before" size={50} color="white" />
                        <MaterialIcons name="navigate-next" size={50} color="white" />
                    </View>
                </View>

                <View style={{ padding: 30, backgroundColor: 'white'  }}>
                    <CustomText style={{ fontSize: 28, color: blue }}>{post.title}</CustomText>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <FontAwesome6 name="location-dot" size={20} color="orange" />
                            <CustomText style={{ color: blue }}>{post.city}</CustomText>
                        </View>
                        <CustomText style={{ color: blue }}>3 days ago</CustomText>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <CustomText style={{ fontWeight: '700', color: blue }}>Description</CustomText>
                        <CustomText style={{ color: blue, borderWidth: 1, borderColor: blue, borderRadius: 10, padding: 10, marginTop: 5 }}>{post.description}</CustomText>
                    </View>

                    <CustomText style={{ fontWeight: '700', marginTop: 20, color: blue }}>Contact info</CustomText>
                
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: blue, borderRadius: 10, padding: 10, marginTop: 5  }}>
                        <MaterialCommunityIcons name="email" size={24} color="orange" />
                        <Text style={{ color: blue }}>{post.email}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: blue, borderRadius: 10, padding: 10, marginTop: 5 }}>
                        <MaterialCommunityIcons name="phone" size={24} color="orange" />
                        <Text style={{ color: blue }}>{post.phone_number}</Text>
                    </View>

                    <View style={{ flexWrap: 'wrap', gap: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 20 }}>
                        <CustomText style={{ fontSize: 28, color: blue }}>USD {post.price}</CustomText>
                        {post.user_id !== user?.user_id && (
                            <TouchableOpacity onPress={handleStartChat} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'orange', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 50 }}>
                                <CustomText style={{ color: blue, fontSize: 20 }}>{!isLoading ? 'Chat' : 'Redirecting...'}</CustomText>
                                <AntDesign name="arrowright" size={24} color={blue} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>

        </View>
    );
};

export default PostDetails;