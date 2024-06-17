import { ActivityIndicator, Alert, Animated, Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import { AntDesign } from '@expo/vector-icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CustomText from './CustomText';
import { blue } from '../assets/colors';
import { useResendCodeMutation, useVerifyCodeMutation } from '../redux/API/authAPI';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { confirmUser } from '../redux/userSlice';

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 5;
const CELL_SIZE = 55;
const CELL_BORDER_RADIUS = 4;
const DEFAULT_CELL_BG_COLOR = '#fff';
const NOT_EMPTY_CELL_BG_COLOR = 'orange';
const ACTIVE_CELL_BG_COLOR = '#f7fafe';

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}: any) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
    })
  ]).start();
};

const VerifyRegistration = ({ navigation, route }: any) => {
  const user = useSelector((state: RootState) => state.user.user)
  const { email } = route.params
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [responseError, setResponseError] = useState('')
  const [verifyCode, { isLoading: isVerificationLoading }] = useVerifyCodeMutation()
  const [resendCode, { isLoading: isResendLoading }] = useResendCodeMutation()
  const dispatch = useDispatch()

  const handleVerification = async () => {
    try {
        setResponseError('')
        const res = await verifyCode({ user_id: user?.user_id as number, input: value }).unwrap() 
        if (res.verified) dispatch(confirmUser())
    } catch (error: any) {
        console.error(error)
        setResponseError(error.data.message)
    }
  }

  const handleResend = async () => {
    try {
        setResponseError('')
        setIsResendDisabled(true)
        await resendCode({ user_id: user?.user_id as number, email })
        setIsCodeSent(true)
        setTimeout(() => {
          setIsCodeSent(false)
        }, 3000)
    } catch (error: any) {
        console.error(error)
        setResponseError(error.data.message)
    }
  }

  const renderCell = ({index, symbol, isFocused}: any) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1],
          }),
        },
      ],
    };

    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    useEffect(() => {
      setTimeout(() => {
        isResendDisabled && setIsResendDisabled(false)
      }, 30000)
    }, [isResendDisabled])

    return (
      <AnimatedText
        key={index}
        style={[{
            marginHorizontal: 8, height: CELL_SIZE, width: CELL_SIZE, lineHeight: CELL_SIZE - 10, fontSize: 30, textAlign: 'center', borderRadius: CELL_BORDER_RADIUS, color: '#3759b8', backgroundColor: '#fff', shadowColor: 'white', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3
        }, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: blue, padding: 20, paddingTop: 30 }}>
      <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
         <AntDesign name="left" size={16} color={'white'} style={{ opacity: 0.9 }} />
         <CustomText style={{ color: 'white', opacity: 0.9 }}>Back</CustomText>
      </Pressable>
      <CustomText style={{ color: 'white', fontSize: 30, marginTop: 40 }}>Verify Registration</CustomText>
      <CustomText style={{ color: 'white', opacity: 0.8, marginTop: 10 }}>An email with your verification code was sent to {email}. Please enter it below.</CustomText>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={{ marginTop: 30 }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
        {responseError.length > 0 && <Text style={{ color: 'crimson', marginTop: 30, fontSize: 18 }}>{responseError}</Text>}
        {isCodeSent && <Text style={{ color: 'lightgreen', marginTop: 30, fontSize: 18 }}>Sent! Please check your inbox.</Text>}
        <TouchableOpacity disabled={isVerificationLoading} onPress={handleVerification} style={{ marginTop: 30, backgroundColor: isVerificationLoading ? 'darkorange' : 'orange', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
            {!isVerificationLoading && <CustomText style={{ color: blue, fontSize: 20, textAlign: 'center' }}>Verify</CustomText>}
            {isVerificationLoading && <ActivityIndicator color={blue} size='large'/>}
        </TouchableOpacity>
        <TouchableOpacity disabled={isResendDisabled} onPress={handleResend} style={{ marginTop: 15, backgroundColor: isResendDisabled ? 'gray' : 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
            {!isResendLoading && <CustomText style={{ color: blue, fontSize: 20, textAlign: 'center' }}>Resend Code</CustomText>}
            {isResendLoading && <ActivityIndicator color={blue} size='large'/>}
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VerifyRegistration;