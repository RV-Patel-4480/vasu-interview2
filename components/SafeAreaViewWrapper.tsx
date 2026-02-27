import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

interface props extends SafeAreaViewProps  {
style?: ViewStyle,

}
const SafeAreaViewWrapper: React.FC<props> = ({style, children, ...props}) => {
  return (
    <SafeAreaView style={[{flex: 1 }, style]} edges={['top', 'left', 'right']} {...props}>
      {children}
    </SafeAreaView>
  )
}

export default SafeAreaViewWrapper

const styles = StyleSheet.create({})