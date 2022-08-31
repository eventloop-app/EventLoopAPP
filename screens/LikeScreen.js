import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import Colors from "../constants/Colors";

const LikeScreen = (props) => {
  return(
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.purple}}>
      <View>
        <View style={{position: 'relative',width: 100, height: 100, backgroundColor: 'blue', borderRadius: 15, zIndex: 10}}>
        </View>
        <ScrollView>
          <View style={{width: '80%', height: 300,backgroundColor: 'red', margin: 3}}>

          </View>
          <View style={{width: '80%', height: 300,backgroundColor: 'red', margin: 3}}>

          </View>
          <View style={{width: '80%', height: 300,backgroundColor: 'red', margin: 3}}>

          </View>
          <View style={{width: '80%', height: 300,backgroundColor: 'red', margin: 3}}>

          </View>
          <View style={{width: '80%', height: 300,backgroundColor: 'red', margin: 3}}>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default LikeScreen;
