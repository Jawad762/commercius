import React, { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { blue, lightGray } from '../assets/colors'
import { AntDesign, Entypo } from '@expo/vector-icons'
import CustomText from './CustomText'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUpMutation } from '../redux/API/authAPI'
import { User, logIn } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker'
import { allCountries } from '../assets/countries'

interface FormInput {
    username: string
    email: string
    password: string
    phone_number: string
}

const schema = z.object({
    username: z.string().min(4, { message: 'Name must be longer than 3 characters' }).max(25, { message: 'exceeded character limit. (25)' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be longer than 5 characters' }).max(60, { message: 'exceeded character limit. (50)' }),
    phone_number: z.string().min(0, { message: 'Phone number is required' })
})

const Signup = ({ navigation }: any) => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormInput>({ resolver: zodResolver(schema) })
    const [signUp, { isLoading }] = useSignUpMutation()
    const dispatch = useDispatch()
    const [responseError, setResponseError] = useState('')
    const [hidePassword, setHidePassword] = useState(true)
    const [countryInputOpen, setCountryInputOpen] = useState(false);
    const [countryValue, setCountryValue] = useState('lebanon')
    const phoneCode = allCountries.find(country => country.value === countryValue)?.phoneCode

    const onSubmit: SubmitHandler<FormInput> = async (formData) => {
        try {
            const data = {
                ...formData,
                phone_number: phoneCode + formData.phone_number,
                country: countryValue
            }
            const res = await signUp(data).unwrap() as { user: User, jwt?: string, error?: string }
            if (res.user && res.jwt && !res.user.is_confirmed) {
                dispatch(logIn({ user: res.user, jwt: res.jwt as string }))
                navigation.navigate('VerifyRegistration', { email: res.user.email })
            }
        } catch (error: any) {
            console.error(error)
            setResponseError(error.data.error)
        }
    }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: blue, paddingHorizontal: 20 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 30 }}>
            <AntDesign name="left" size={16} color={'white'} style={{ opacity: 0.9 }} />
            <CustomText style={{ color: 'white', opacity: 0.9 }}>Back</CustomText>
        </Pressable>
        <CustomText style={{ color: 'white', fontSize: 30, marginTop: 30 }}>Sign Up</CustomText>
        <View style={{ marginTop: 30 }}>
            <CustomText style={{ color: 'white' }}>Display name</CustomText>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={{ color: 'white', borderRadius: 5, borderWidth: 2, borderColor: errors.username ? 'crimson' : 'lightgray', paddingVertical: 10, paddingLeft: 15, marginTop: 10, fontSize: 16 }}
                        onBlur={onBlur} onChangeText={onChange} value={value} inputMode='text' maxLength={25}
                    />
                )}
                name="username"
            />
            {errors.username && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{errors.username.message}</Text>}
        </View>
        <View style={{ marginTop: 20 }}>
            <CustomText style={{ color: 'white' }}>Email</CustomText>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={{ color: 'white', borderRadius: 5, borderWidth: 2, borderColor: errors.email || responseError.length > 0 ? 'crimson' : 'lightgray', paddingVertical: 10, paddingLeft: 15, marginTop: 10, fontSize: 16 }}
                        onBlur={onBlur} onChangeText={onChange} value={value} inputMode='text'
                    />
                )}
                name="email"
            />
            {errors.email && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{errors.email.message}</Text>}
            {responseError.length > 0 && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{responseError}</Text>}
        </View>
        <View style={{ marginTop: 20 }}>
            <CustomText style={{ color: 'white' }}>Password</CustomText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5, borderWidth: 2, borderColor: errors.password ? 'crimson' : 'lightgray', paddingVertical: 10, paddingHorizontal: 15, marginTop: 10 }}>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        maxLength={50}
                        style={{ color: 'white', fontSize: 16, flex: 1, marginRight: 12 }}
                        onBlur={onBlur} onChangeText={onChange} value={value} inputMode='text'
                        secureTextEntry={hidePassword}
                    />
                )}
                name="password"
            />
                <Entypo name={hidePassword ? 'eye-with-line' : 'eye'} size={24} color="white" onPress={() => setHidePassword(!hidePassword)} />
            </View>
            {errors.password && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{errors.password.message}</Text>}
        </View>
        <View style={{ marginTop: 20 }}>
            <CustomText style={{ color: 'white' }}>Country</CustomText>
            <DropDownPicker
                style={{ borderRadius: 5, borderWidth: 2, borderColor: 'lightgray', paddingVertical: 10, paddingLeft: 15, marginTop: 10, backgroundColor: blue }}
                dropDownContainerStyle={{ backgroundColor: blue, borderColor: lightGray }}
                textStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
                arrowIconStyle={{ tintColor: 'white' } as any}
                placeholder={countryValue} open={countryInputOpen} value={countryValue as string} items={allCountries} setOpen={setCountryInputOpen} setValue={setCountryValue}
                onChangeValue={(value) => setCountryValue(value?.toLowerCase() as string)}
            />
        </View>
        <View style={{ marginTop: 20 }}>
            <CustomText style={{ color: 'white' }}>Phone Number</CustomText>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 5, borderColor: errors.phone_number ? 'crimson' : 'lightgray', paddingHorizontal: 10, paddingVertical: 10, marginTop: 10 }}>
                <View style={{ paddingRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>{phoneCode}</Text>
                </View>
                <Controller
                control={control}
                name='phone_number'
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput    
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value} inputMode='numeric' style={{ borderLeftWidth: 1, borderColor: lightGray, paddingHorizontal: 10, flex: 1, color: 'white' }}/>
                )}
                />
            </View>
            {errors.phone_number && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{errors.phone_number.message}</Text>}
        </View>
        <Pressable onPress={() => navigation.navigate('Signin')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 4 }}>
            <CustomText style={{ color: 'white', opacity: 0.8 }}>Already have an account?</CustomText>
            <CustomText style={{ color: 'orange' }}>Sign in</CustomText>
        </Pressable>
        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: 'orange', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, width: '100%', borderRadius: 15, marginTop: 20 }}>
            {!isLoading && <CustomText style={{ color: blue, fontSize: 20 }}>Sign up</CustomText>}
            {isLoading && <ActivityIndicator color={blue} size='large'/>}
        </TouchableOpacity>
    </ScrollView>
  )
}

export default Signup