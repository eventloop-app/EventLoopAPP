import React, {useEffect, useState} from 'react';
import {Button, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text} from "react-native";
import {makeRedirectUri, useAuthRequest, useAutoDiscovery} from "expo-auth-session";
import {useDispatch, useSelector} from "react-redux";
import {SignIn, SignOut} from "../actions/auth";
import {getUserToken} from "../actions/user";
import jwt_decode from "jwt-decode";
import decode from "../services/decode";


const ProfileScreen = (props) => {
  const [isLoad, setIsLoad] = useState(true)
  const [userData, setUserData] = useState(null)

  const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
  const redirectUri = makeRedirectUri({scheme: "exp://fy-kbp.anonymous.eventloopapp.exp.direct:80"});
  const dispatch = useDispatch();

  //ดึงข้อมูลตอน Login
  const { authData, authDataError } = useSelector(state => state.auth)
  //ดึงข้อมูลตอน User จาก Storage
  const { userToken, userError } = useSelector(state => state.user)

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
      const accessToken = JSON.parse(userToken).accessToken
      const user = decode.jwt(accessToken)
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
      scopes: ["openid", "profile", "email", "offline_access", "user.read"],
      responseType: "code",
      prompt: "login",
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
      if (response && "params" in response) {
        if (response.params && "code" in response.params) {
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
              disabled={!request}
              title="Sign out"
              onPress={signOut}
            />
          </SafeAreaView>
          :
          <Button
            disabled={!request}
            title="Sign in "
            onPress={()=> promptAsync()}
          />
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
  },
  CenterScreenText: {
    textAlign: 'center'
  }
});
export default ProfileScreen;
