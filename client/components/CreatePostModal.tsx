import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { blue, lightGray, lighterBlue } from '../assets/colors'
import CustomText from './CustomText'
import { Ionicons } from '@expo/vector-icons'
import { categories } from './FilterModal'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useCreatePostMutation } from '../redux/API/postsAPI'
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImageToFirebase } from '../uploadImageToFirebase'

interface Props {
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
}

interface FormInput {
    title: string
    price: number
    description: string
}

const schema = z.object({
    title: z.string().min(1, { message: 'You must provide a title' }).max(50, { message: 'exceeded 50 characters.' }),
    // price is a string cause textinput only uses string values
    price: z.string().refine(value => parseInt(value) >= 0.5, { message: 'You must provide a price greater than 0.5 USD'})
                     .refine(value => parseInt(value) <= 100_000_000, { message: 'You must provide a price smaller than 100M USD'}),
    description: z.string().min(1).max(400, { message: 'exceeded 400 characters.'}),
})

const CreatePostModal = ({ showModal, setShowModal }: Props) => {

    const user = useSelector((state: RootState) => state.user.user)
    const [categoryValue, setCategoryValue] = useState<null | string>(null)
    const [cities, setCities] = useState([])
    const [images, setImages] = useState<string[]>([])
    const [city, setCity] = useState<null | string>(null)
    const [categoryError, setCategoryError] = useState(false)
    const [cityError, setCityError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [createPost] = useCreatePostMutation()

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormInput>({ resolver: zodResolver(schema) })

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        try {
            if (!categoryValue || !city) {
                !categoryValue && setCategoryError(true)
                !city && setCityError(true)
                return
            } 

            if (images.length < 1) return

            setIsLoading(true)

            const urlPromises = images.map((image: string) => uploadImageToFirebase(image))
            const arrayOfUrls = await Promise.all(urlPromises)

            const formData = {
                ...data,
                category: categoryValue.toLowerCase(),
                country: user?.country as string,
                city: city as string,
                pictures: arrayOfUrls as string[],
                username: user?.username as string,
                email: user?.email as string,
                phone_number: user?.phone_number as string,
                profile_picture: user?.profile_picture as string,
                user_id: user?.user_id,
                date: new Date().toString()
            };
            await createPost(formData)
            Alert.alert('Success', 'Your post is now active!', [
                {text: 'OK'}
            ])
            setShowModal(false)
            reset()
            setImages([])
            setCategoryValue(null)
        } catch (error) {
            Alert.alert('Error', 'Failed to create post. Please try again later.', [{ text: 'OK' }]);
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const addImage = async () => {
        if (images.length >= 8) {
            Alert.alert('Oops!', 'You cannot upload more than 8 Images.', [
                {text: 'OK'}
            ])
            return
        }

        const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
        })

        if (!result.canceled) setImages(images => [...images, result.assets?.[0].uri as string])
    }

    const getCities = async () => {
        try {
            const { data } = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { "country": user?.country?.toLowerCase() || 'lebanon' })
            setCities(data.data.states)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getCities()
    },[user])

    useEffect(() => {
        city && setCityError(false)
        categoryValue && setCategoryError(false)
    },[city, categoryValue])

  return (
    <Modal animationType="slide" visible={showModal} onRequestClose={() => setShowModal(!showModal)}>
        <View style={{ flex: 1, backgroundColor: blue, padding: 20 }}>

            <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <CustomText style={{ color: 'white', fontSize: 24 }}>Create Ad</CustomText>
                    <Ionicons name="close" size={40} color="orange" onPress={() => setShowModal(false)} />
                </View>

                <View>
                    <CustomText style={{ color: 'white', marginBottom: 10 }}>Category</CustomText>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 10}}>
                        {categories.map((category: any) => (
                        <TouchableOpacity key={category.value} onPress={() => setCategoryValue(category.label)} style={{ backgroundColor: categoryValue === category.label ? 'orange' : lighterBlue, padding: 8, paddingHorizontal: 18, borderRadius: 5,}}>
                            <CustomText style={{ color: categoryValue === category.label ? blue : 'white' }}>{category.label}</CustomText>
                        </TouchableOpacity>
                        ))}
                    </View>
                    {categoryError && <Text style={{ color: 'red', fontSize: 10, marginTop: 4 }}>Please select a category</Text>}
                </View>

                <View>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Title</CustomText>
                    <View style={{ borderWidth: 2, borderColor: lighterBlue, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput 
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value} inputMode='text' maxLength={50} style={{ color: lightGray, flex: 1 }} selectionColor={'orange'}/>
                            )}
                            name='title'
                        />
                    </View>
                    {errors.title && <Text style={{ color: 'red', fontSize: 10, marginTop: 4 }}>{errors.title.message}</Text>}
                </View>

                <View>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Price</CustomText>
                    <View style={{ borderWidth: 2, borderColor: lighterBlue, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput    
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={typeof value === 'number' ? value.toString() : value} inputMode='numeric' style={{ color: lightGray, flex: 1 }} selectionColor={'orange'}/>
                            )}
                            name="price"
                        />
                        <Text style={{ color: lightGray, opacity: 0.7 }}>USD</Text>
                    </View>
                    {errors.price && <Text style={{ color: 'red', fontSize: 10, marginTop: 4 }}>{errors.price.message}</Text>}
                </View>

                <View>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Description</CustomText>
                    <View style={{ borderWidth: 2, borderColor: lighterBlue, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput onBlur={onBlur}
                                onChangeText={onChange}
                                value={value} textAlignVertical='top' numberOfLines={6} multiline={true} inputMode='text' style={{ color: lightGray, flex: 1 }} selectionColor={'orange'}/>
                            )}
                            name="description"
                        />
                    </View>
                    {errors.description && <Text style={{ color: 'red', fontSize: 10, marginTop: 4 }}>{errors.description.message}</Text>}
                </View>

                <View>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Images</CustomText>
                    <ScrollView horizontal contentContainerStyle={{ alignItems: 'center', gap: 8 }} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity onPress={addImage} style={{ backgroundColor: 'orange', height: 100, width: 100, justifyContent: 'center', borderRadius: 10 }}>
                            <Text style={{ color: blue, textAlign: 'center', fontSize: 30 }}>+</Text>
                        </TouchableOpacity>
                        <ScrollView contentContainerStyle={{ gap: 10 }} horizontal>
                            {images.map(image => (
                                <Image key={image} height={100} width={100} style={{ borderRadius: 10, objectFit: 'cover' }} source={{ uri: image }}/>
                            ))}
                        </ScrollView>
                    </ScrollView>
                </View>

                <View>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Country</CustomText>
                    <View style={{ borderWidth: 2, borderColor: lighterBlue, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                        <TextInput value={user?.country || ''} inputMode='text' readOnly={true} style={{ color: lightGray, flex: 1, opacity: 0.8, textTransform: 'capitalize' }} selectionColor={'orange'}/>
                    </View>
                </View>

                <View>
                    <CustomText style={{ color: 'white', marginBottom: 10 }}>State / City</CustomText>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 10}}>
                        {cities.map((thisCity: any) => (
                        <TouchableOpacity onPress={() => setCity(thisCity.name)} style={{ backgroundColor: thisCity.name === city ? 'orange' : lighterBlue, padding: 8, paddingHorizontal: 18, borderRadius: 5,}}>
                            <CustomText style={{ color: city === thisCity.name ? blue : 'white' }}>{thisCity.name.replaceAll('Governorate', '')}</CustomText>
                        </TouchableOpacity>
                        ))}
                    </View>
                    {cityError && <Text style={{ color: 'red', fontSize: 10, marginTop: 4 }}>Please select a city</Text>}
                </View>
            </ScrollView>

            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: 'orange', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, width: '100%', borderRadius: 15, marginTop: 20 }}>
                {!isLoading && <CustomText style={{ color: blue, fontSize: 20 }}>Post</CustomText>}
                {isLoading && <ActivityIndicator color={blue} size='large'/>}
            </TouchableOpacity>

        </View>
    </Modal>
  )
}

export default CreatePostModal