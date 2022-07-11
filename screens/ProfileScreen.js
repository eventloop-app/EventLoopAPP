import React, {useCallback, useEffect, useState} from 'react';
import {Button, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View} from "react-native";
import {makeRedirectUri, useAuthRequest, useAutoDiscovery} from "expo-auth-session";
import {useDispatch, useSelector} from "react-redux";
import {SignIn, SignOut} from "../actions/auth";
import {getUserToken} from "../actions/user";
import jwt_decode from "jwt-decode";
import decode from "../services/decode";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {SignInButtons} from "../components/SignInButtons";
import { useFocusEffect } from '@react-navigation/native'


const ProfileScreen = ({ route, navigation }) => {
  const [isLoad, setIsLoad] = useState(true)
  const [userData, setUserData] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true)
      console.log('true')
      return () => {
        setIsVisible(false)
        console.log('false')
      }
    }, [])
  )

  const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
  const redirectUri = makeRedirectUri({scheme:"exp://fy-kbp.eventloop.eventloopapp.exp.direct:80"});
  const dispatch = useDispatch();

  //ดึงข้อมูลตอน Login
  const { authData, authDataError } = useSelector(state => state.auth)
  //ดึงข้อมูลตอน User จาก Storage
  const { userToken, userError } = useSelector(state => state.user)

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("Profileeee")
    });
    return unsubscribe;
  },[navigation])


  useEffect(() => {
    console.log("Check Token")
    dispatch(getUserToken())
  }, [])

  useEffect(() => {
      if(authData){
        setUserData(authData)
      }
      if(authDataError){
        console.log('Error:' + authDataError)
      }
  }, [authData])

  useEffect( () => {
    if (userToken) {
      const idToken = JSON.parse(userToken).idToken
      const user = decode.jwt(idToken)
      setUserData(user)
    }
    if (userError){
      console.log("userTokenError : " + userError)
    }
    setIsLoad(false)
  }, [userToken])

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "4bf4a100-9aeb-42be-8649-8fd4ef42722b",
      clientSecret: "3~68Q~sLI_5IxI1m7m8PdKEP_XGT4xWXfXCdIdfG",
      scopes: ["openid", "profile", "email", "offline_access"],
      responseType: "code",
      prompt: "login",
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
      if (response && "params" in response) {
        if (response.params && "code" in response.params) {
          console.log("-----------------------");
          console.log(response.params.code);
          console.log("-----------------------");
          console.log(request.codeVerifier);
          console.log("-----------------------");
          dispatch(SignIn(response.params.code, request.codeVerifier))
        }
      }
    }, [response]);

  const signOut = () => {
    dispatch(SignOut())
    setUserData(null)
  }

  const renderProfile = () => (
    <SafeAreaView>
      {
        (userData !== null) ?
          <SafeAreaView>
            <Text style={styles.CenterScreenText}>
              Hello
            </Text>
            <Text style={styles.CenterScreenText}>
              {userData.name}
            </Text>
            <Button
              title="Sign out"
              onPress={signOut}
            />
            <SignInButtons msg={'CallAPI'}/>
          </SafeAreaView>
          :
          <View>
            <Text style={styles.CenterScreenText}>คุณยังไม่ได้เข้าสู่ระบบ</Text>
            <Button
              title="Sign in"
              onPress={()=> promptAsync()}
            />

          </View>
      }
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.Container}>
      {
        isLoad ?
          <Text style={styles.CenterScreenText}>
            Loading...
          </Text>
          :
          renderProfile()
      }
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  CenterScreenText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: fontSize.primary
  }
});

export default ProfileScreen;
