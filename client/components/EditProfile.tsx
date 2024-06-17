import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';
import { blue, lightGray } from '../assets/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import DropDownPicker from 'react-native-dropdown-picker';
import { allCountries } from '../assets/countries';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToFirebase } from '../uploadImageToFirebase';
import { useEditProfileMutation } from '../redux/API/userAPI';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { setUser } from '../redux/userSlice';
import { useFocusEffect } from '@react-navigation/native';

interface FormInput {
    username: string
    phone_number: string
}

const EditProfile = ({ navigation }: any) => {
    const { control, handleSubmit } = useForm<FormInput>()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const [countryInputOpen, setCountryInputOpen] = useState(false);
    const [countryValue, setCountryValue] = useState(user?.country?.toLowerCase());
    const phoneCode = allCountries.find(country => country.value === countryValue)?.phoneCode
    const [image, setImage] = useState<string>(user?.profile_picture as string);
    const [editProfile, { isLoading }] = useEditProfileMutation()
    const [isSaved, setIsSaved] = useState(false)
    const [hasPictureChanged, setHasPictureChanged] = useState(false)

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
        setHasPictureChanged(true)
      }
    };

    const saveChanges: SubmitHandler<FormInput> = async (data) => {
        try {
            dispatch(setUser({...user, phone_number: data.phone_number || user?.phone_number, country: countryValue, username: data.username || user?.username, profile_picture: image } as any))
            setIsSaved(true)
            setTimeout(() => {
                setIsSaved(false)
            }, 1000)
            const imageURL = hasPictureChanged ? await uploadImageToFirebase(image) : image
            await editProfile({ phone_number: data.phone_number || user?.phone_number, country: countryValue, username: data.username || user?.username, profile_picture: imageURL } as any)
        } catch (error) {
            console.error(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
          return () => {
            setHasPictureChanged(false)
          };
        }, [])
    )

    return (
        <View style={{ backgroundColor: blue, flex: 1 }}>

            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="arrow-back-sharp" size={24} color={'white'} onPress={() => navigation.goBack()} />
                <CustomText style={{ color: 'white', fontSize: 24 }}>Edit Profile</CustomText>
            </View>

            <View style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, gap: 20, backgroundColor: lightGray }}>
                <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <View>
                        <Image style={{ borderRadius: 50, height: 90, width: 90, objectFit: 'cover' }} source={{ uri: image }}/>
                        <View style={{ backgroundColor: 'orange', borderRadius: 50, position: 'absolute', right: 0, bottom: 0, height: 35, width: 35, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome6 name="camera-retro" size={18} color="white" onPress={pickImage} />
                        </View>
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                        <CustomText style={{ color: blue }}>Display name</CustomText>
                        <Controller
                        control={control}
                        name='username'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput    
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value} style={{ borderWidth: 1, borderRadius: 5, borderColor: blue, paddingHorizontal: 10, paddingVertical: 5 }} defaultValue={user?.username}/>
                        )}
                        />
                    </View>
                </View>

                <View>
                    <CustomText style={{ color: blue, marginBottom: 10 }}>Country</CustomText>
                    <DropDownPicker
                        style={{  backgroundColor: 'transparent', borderColor: blue }}
                        dropDownContainerStyle={{ backgroundColor: lightGray, borderColor: blue }}
                        textStyle={{ color: blue }}
                        labelStyle={{ color: blue }}
                        arrowIconStyle={{ tintColor: blue } as any}
                        placeholder={countryValue} open={countryInputOpen} value={countryValue as string} items={allCountries} setOpen={setCountryInputOpen} setValue={setCountryValue}
                        onChangeValue={(value) => setCountryValue(value?.toLowerCase() as string)}
                    />
                </View>

                <View style={{ gap: 4 }}>
                    <CustomText style={{ color: blue }}>Phone Number</CustomText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: blue, paddingHorizontal: 10 }}>
                        <View style={{ paddingRight: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>{phoneCode}</Text>
                        </View>
                        <Controller
                        control={control}
                        name='phone_number'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput    
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value} inputMode='numeric' style={{ borderLeftWidth: 1, paddingHorizontal: 10, paddingVertical: 5, flex: 1 }} defaultValue={user?.phone_number || ''}/>
                        )}
                        />
                    </View>
                </View>

                <TouchableOpacity disabled={isLoading} onPress={handleSubmit(saveChanges)} style={{ backgroundColor: 'orange', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, width: '100%', borderRadius: 15, marginTop: 20 }}>
                    <CustomText style={{ color: blue, fontSize: 20 }}>{isSaved ? 'Saving Changes...' : 'Save Changes'}</CustomText>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default EditProfile;
