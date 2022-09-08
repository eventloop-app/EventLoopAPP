import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image, Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {makeRedirectUri, useAuthRequest, useAutoDiscovery} from "expo-auth-session";
import {useDispatch, useSelector} from "react-redux";
import {SignIn, SignOut} from "../actions/auth";
import {saveUser} from "../actions/user";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import eventsService from "../services/eventsService";
import ProfileDetailScreen from "./ProfileDetailScreen";
import Colors from "../constants/Colors";
import profileImageMock from "../assets/images/profileImage.jpg";
import {AntDesign} from "@expo/vector-icons";
import Fonts from "../constants/Fonts";
import Color from "../constants/Colors";
import FontSize from "../constants/FontSize";
import {useIsFocused} from "@react-navigation/native";

const ProfileScreen = (props, {navigation}) => {
  const [isLoad, setIsLoad] = useState(true)
  const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
  const redirectUri = makeRedirectUri({scheme: null});
  const dispatch = useDispatch();
  //ดึงข้อมูลตอน Login
  const {authData, authDataError} = useSelector(state => state.auth)
  const {user} = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (props.route.params !== undefined) {
      setIsLoad(true)
      console.log(props.route.params.user)
      setUserData(props.route.params.user)
      setTimeout(() => {
        setIsLoad(false)
      }, 500)
    }
  }, [props])

  useEffect(() => {
    if (user !== null || user !== undefined) {
      setUserData(JSON.parse(user))
    }
  }, [])

  useEffect(() => {
    setIsLoad(true)
    console.log("-----------------------------------")
    if (userData !== null && userData !== undefined) {
      console.log("Has user " + userData.id)
    }
    setIsLoad(false)
  }, [userData])

  useEffect(() => {
    if (authData !== null && authData !== undefined) {
      eventsService.checkEmail(authData.user.email).then(async res => {
        if (!res.data.hasEmail) {
          setIsLoad(false)
          props.navigation.navigate('EditProfile', {user: authData.user})
        } else {
          setTimeout(() => {
            dispatch(saveUser(JSON.stringify(res.data.member)))
          }, 200)
        }
      })
    } else {
      setIsLoad(false)
    }
  }, [authData])

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
      try {
        if (response.params && "code" in response.params) {
          // console.log("-----------------------");
          // console.log(response.params.code);
          // console.log("-----------------------");
          // console.log(request.codeVerifier);
          // console.log("-----------------------")
          dispatch(SignIn(response.params.code, request.codeVerifier))
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [response]);

  const renderProfile = () => (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <Text style={styles.CenterScreenText}>คุณยังไม่ได้เข้าสู่ระบบ</Text>
        <Button
          title="Sign in"
          onPress={() => promptAsync()}
        />
      </View>
    </SafeAreaView>
  )

  const manageEvent = async () => {
    props.navigation.navigate("ManageEvent")
  }

  const signOut = async () => {
    await dispatch(SignOut())
    setTimeout(() => {
      try {
        navigation.navigate("Profile")
      } catch (e) {
        return;
      }
    }, 1000)
  }

  return (
    user ?
      <SafeAreaView style={{flex: 1, width: "100%", height: "100%", backgroundColor: Colors.white}}>
        {
          (isLoad ?
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={'large'} color={Colors.primary}/>
              </View> :
              <View>
                <View style={{width: '100%', height: 220, justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={userData?.profileUrl ? {uri: userData?.profileUrl} : profileImageMock}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 200 / 2,
                      borderWidth: 4,
                      borderColor: Colors.primary
                    }}
                  />
                </View>
                <View style={{alignItems: "center"}}>
                  <View style={{flexDirection: "row"}}>
                    <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.large}}>{userData?.username}</Text>
                  </View>
                  <View style={{flexDirection: "row", marginTop: 4}}>
                    <View style={{alignItems: "center", width: 100}}>
                      <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>กำลังติดตาม</Text>
                      <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>xxx</Text>
                    </View>
                    <View style={{marginLeft: 11, marginRight: 0, borderColor: "black", borderWidth: 1}}></View>
                    <View style={{alignItems: "center", width: 100}}>
                      <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>ผู้ติดตาม</Text>
                      <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>xxx</Text>
                    </View>
                  </View>
                </View>
                <View style={{padding: 20}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.medium,
                  }}>เกี่ยวกับฉัน</Text>
                  <Text style={{
                    display: "flex",
                    color: userData?.description ? Color.black : "gray",
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                  }}>{userData?.description ? userData?.description.trim() : "คุณยังไม่ได้เพิ่มคำอธิบาย"}</Text>
                </View>

                <View style={{padding: 20}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.medium,
                  }}>
                    กิจกรรมที่ฉันสนใจ
                  </Text>
                  <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap",}}>
                    {userData?.tags.map((item, index) => {
                      return (
                        <View key={index} View style={{
                          flexDirection: "row",
                          backgroundColor: Colors.primary,
                          borderRadius: 8,
                          padding: 4,
                          paddingHorizontal: 8,
                          marginHorizontal: 2,
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Color.white
                          }}>{item}
                          </Text>
                        </View>
                      )

                    })}
                  </View>
                </View>

                <View style={{justifyContent: 'center', alignItems: 'center', marginTop:(Platform.OS === "ios" ? 20: 100)}}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => manageEvent()}>
                    <View style={{
                      width: 350,
                      height: 45,
                      backgroundColor: Colors.primary,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20
                    }}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: fontSize.primary,
                        color: Colors.white
                      }}>จัดการกิจกรรม</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.8} onPress={() => signOut()}>
                    <View style={{
                      // backgroundColor: Colors.red,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: fontSize.primary,
                        color: Colors.red
                      }}>ออกจากระบบ</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </View>
          )}
      </SafeAreaView>
      :
      renderProfile()
    // <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <ActivityIndicator size={'large'} color={Colors.primary}/>
    // </SafeAreaView>
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
