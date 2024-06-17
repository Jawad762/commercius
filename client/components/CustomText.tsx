import React, { ReactNode } from 'react'
import { Text, TextProps } from 'react-native'
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat'
import { useFonts } from 'expo-font'

interface Props extends TextProps {
    style: object,
    children: ReactNode,
}

const CustomText = ({style, children, ...props}: Props) => {

  useFonts({ 'Montserrat': Montserrat_500Medium })

  return (
    <Text style={{...style, fontFamily: 'Montserrat' }} {...props}>
        {children}
    </Text>
  )
}

export default CustomText
