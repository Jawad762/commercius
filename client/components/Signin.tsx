import React, { useState } from 'react'
import { ActivityIndicator, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { blue } from '../assets/colors'
import { AntDesign, Entypo } from '@expo/vector-icons'
import CustomText from './CustomText'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignInMutation } from '../redux/API/authAPI'
import { User, logIn } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

interface FormInput {
    email: string
    password: string
}

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address '}),
    password: z.string().min(6, { message: 'Password must be longer than 5 characters' }).max(60, { message: 'exceeded character limit. (50)' }),
})

const Signin = ({ navigation }: any) => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormInput>({ resolver: zodResolver(schema) })
    const [signIn, { isLoading }] = useSignInMutation()
    const dispatch = useDispatch()
    const [responseError, setResponseError] = useState('')
    const [hidePassword, setHidePassword] = useState(true)

    const onSubmit: SubmitHandler<FormInput> = async (formData) => {
        try {
            setResponseError('')
            const res = await signIn(formData).unwrap() as { user: User, jwt?: string, error?: string }
            dispatch(logIn({ user: res.user, jwt: res.jwt as string }))
            if (res.user && res.jwt && !res.user.is_confirmed) {
                navigation.navigate('VerifyRegistration', { email: res.user.email })
            }
        } catch (error: any) {
            console.error(JSON.stringify(error))
            setResponseError(error.data.error)
        }
    }

  return (
    <View style={{ flex: 1, backgroundColor: blue, padding: 20, paddingTop: 30 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <AntDesign name="left" size={16} color={'white'} style={{ opacity: 0.9 }} />
            <CustomText style={{ color: 'white', opacity: 0.9 }}>Back</CustomText>
        </Pressable>
        <CustomText style={{ color: 'white', fontSize: 30, marginTop: 30 }}>Sign In</CustomText>
        <View style={{ marginTop: 20 }}>
            {responseError.length > 0 && <Text style={{ color: 'red', marginBottom: 14, fontSize: 18 }}>{responseError}</Text>}
            <CustomText style={{ color: 'white' }}>Email</CustomText>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={{ color: 'white', borderRadius: 5, borderWidth: 2, borderColor: errors.email ? 'crimson' : 'lightgray', paddingVertical: 10, paddingLeft: 15, marginTop: 10, fontSize: 16 }}
                        onBlur={onBlur} onChangeText={onChange} value={value} inputMode='text'
                    />
                )}
                name="email"
            />
            {errors.email && <Text style={{ color: 'crimson', fontSize: 10, marginTop: 4 }}>{errors.email.message}</Text>}
        </View>
        <View style={{ marginTop: 20 }}>
            <CustomText style={{ color: 'white' }}>Password</CustomText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5, borderWidth: 2, borderColor: errors.password ? 'crimson' : 'lightgray', paddingVertical: 10, paddingHorizontal: 15, marginTop: 10, }}>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
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
        <Pressable onPress={() => navigation.navigate('Signup')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 4 }}>
            <CustomText style={{ color: 'white', opacity: 0.8 }}>Don't have an account?</CustomText>
            <CustomText style={{ color: 'orange' }}>Sign up</CustomText>
        </Pressable>
        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: 'orange', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, width: '100%', borderRadius: 15, marginTop: 20 }}>
            {!isLoading && <CustomText style={{ color: blue, fontSize: 20 }}>Sign In</CustomText>}
            {isLoading && <ActivityIndicator color={blue} size='large'/>}
        </TouchableOpacity>
    </View>
  )
}

export default Signin