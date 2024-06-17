import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import { blue } from '../assets/colors'
import Animated, { useSharedValue, withRepeat, withTiming, withDelay, withSequence } from 'react-native-reanimated'

const LoadingScreen = () => {
    const dotOneTranslate = useSharedValue(0)
    const dotTwoTranslate = useSharedValue(0)
    const dotThreeTranslate = useSharedValue(0)

    useEffect(() => {
        dotOneTranslate.value = withDelay(0, withRepeat(
            withSequence(
              withTiming(-4, { duration: 600 }),
              withTiming(0, { duration: 400 })
            ),
            -1,
            true
          ))

          dotTwoTranslate.value = withDelay(300, withRepeat(
            withSequence(
              withTiming(-4, { duration: 600 }),
              withTiming(0, { duration: 400 })
            ),
            -1,
            true
          ))

          dotThreeTranslate.value = withDelay(400, withRepeat(
            withSequence(
              withTiming(-4, { duration: 600 }),
              withTiming(0, { duration: 400 })
            ),
            -1,
            true
          ))
    }, [])

  return (
    <View style={{ flex: 1, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' }}>
        <Image style={{ height: 200, width: 200 }} source={require('../assets/logo.png')}/>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Animated.View style={{ backgroundColor: 'white', height: 8, width: 8, borderRadius: 50, transform: [{ translateY: dotOneTranslate}] }}/>
            <Animated.View style={{ backgroundColor: 'white', height: 8, width: 8, borderRadius: 50, transform: [{ translateY: dotTwoTranslate}] }}/>
            <Animated.View style={{ backgroundColor: 'white', height: 8, width: 8, borderRadius: 50, transform: [{ translateY: dotThreeTranslate}] }}/>
        </View>
    </View>
  )
}

export default LoadingScreen