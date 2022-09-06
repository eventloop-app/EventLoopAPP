import React from 'react';
import {Image, SafeAreaView, Text, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

const ErrorScreen = () => {
  return (
    <SafeAreaView style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white
    }}>
      <View>
        <Text style={{textAlign: 'center', fontFamily: Fonts.bold, fontSize: FontSize.medium}}>มีบางอย่างผิดพลาด</Text>
        <Text style={{textAlign: 'center', fontFamily: Fonts.bold, fontSize: FontSize.primary}}>กรุณากลับมาใหม่อีกครั้ง</Text>
        <Image style={{marginRight: 40}} source={require('../assets/images/brown.gif')} />
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;

