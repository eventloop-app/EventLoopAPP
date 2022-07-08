import {Text, TouchableOpacity, View} from "react-native";
import React, {useEffect} from 'react';
import test from "../services/test";

export const SignInButtons = (props) =>{

  const CallAPI = () => {
    console.log("CallAPI")
    test.checkAPI().then(res => {
      console.log(res.status)
    }).catch(e => {
      console.log(e)
    })
  }

  return (
    <TouchableOpacity onPress={()=> CallAPI()}>
      <View>
        <Text>{props.msg}</Text>
      </View>
    </TouchableOpacity>
  )
}


