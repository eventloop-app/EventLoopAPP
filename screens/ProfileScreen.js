import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image, Platform,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text, TextInput,
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
import Colors from "../constants/Colors";
import profileImageMock from "../assets/images/profileImage.jpg";
import Fonts from "../constants/Fonts";
import Color from "../constants/Colors";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import FormData from "form-data";


const tagss = [
  {name: "ดนตรี", icon: "music", source: "Feather", isSelect: false},
  {name: "กีฬา", icon: "football", source: "Ionicons", isSelect: false},
  {name: "บันเทิง", icon: "movie", source: "MaterialIcons", isSelect: false},
  {name: "ศิลปะ", icon: "draw", source: "MaterialCommunityIcons", isSelect: false},
  {name: "เกม", icon: "gamepad-variant-outline", source: "MaterialCommunityIcons", isSelect: false},
  {name: "ท่องเที่ยว", icon: "briefcase", source: "Feather", isSelect: false},
  {name: "การศึกษา", icon: "book-outline", source: "Ionicons", isSelect: false},
  {name: "สุขภาพ", icon: "md-heart", source: "Ionicons", isSelect: false},
  {name: "อาหาร", icon: "fast-food-outline", source: "Ionicons", isSelect: false},
]

const ProfileScreen = (props, {navigation}) => {
  const [isLoad, setIsLoad] = useState(true)
  const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
  const redirectUri = makeRedirectUri({scheme: null});
  const dispatch = useDispatch();
  //ดึงข้อมูลตอน Login
  const {authData, authDataError} = useSelector(state => state.auth)
  const {user} = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [tags, setTags] = useState(null)

  useEffect(() => {
    if (props.route.params !== undefined) {
      setIsLoad(true)
      setUserData(props.route.params.user)
      console.log(props.route.params.user)
      setTimeout(()=>{
        setIsLoad(false)
      }, 100)
    }
  }, [props])

  useEffect(() => {
    if ((user !== null || user !== undefined) && isEdit !== true) {
      setUserData(JSON.parse(user))
    }
  }, [])

  useEffect(() => {
    if (userData !== null && userData !== undefined && isEdit !== true) {
      setUpTag()
    }
  }, [userData])

  useEffect(() => {
    setIsLoad(true)
    if (authData !== null && authData !== undefined) {
      eventsService.checkEmail(authData.user.email).then(async res => {
        console.log(authData.user.email, res.data)
        if (!res.data.hasEmail) {
          setIsLoad(false)
          props.navigation.navigate('EditProfile', {user: authData.user})
        } else {
          dispatch(saveUser(JSON.stringify(res.data.member)))
          setUserData(res.data.member)
          setIsLoad(false)
        }
      })
    } else {
      setIsLoad(false)
    }

  }, [authData])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setUserData({...userData, profileUrl:result.uri})
    }
  };

  const setUpTag = () =>{
    let newTagee = []
    tagss.map( obj => {
      if(userData.tags.find( tag => tag === obj.name)){
        newTagee = [...newTagee, {...obj, isSelect: true}]
      }else {
        newTagee = [...newTagee, {...obj, isSelect: false}]
      }
    })
    setTags(newTagee)
  }

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

  useEffect(()=>{

  }, [isEdit])

  const onSubmit = (status) => {
    console.log(status)
    if(status === 'แก้ไขโปรไฟล์'){
      setIsEdit(!isEdit)
    }else if(status === 'อัปเดทโปรไฟล์'){
      let newUserData = {
        memberId: userData.id,
        username: userData.username,
        tags: userData.tags,
        description: userData.description
      }
      const filename = userData.profileUrl.split('/').pop()
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      const data = new FormData();
      data.append('profileImage', {uri: userData.profileUrl, name: filename, type: type});
      data.append('memberInfo', JSON.stringify(newUserData));

      console.log(data)
      eventsService.upDateProfile(data).then(res => {
        if(res.status === 200){
          console.log(res)
          dispatch(saveUser(JSON.stringify(res.data)))
          setIsEdit(!isEdit)
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }

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

  const manageEvent = async (name) => {
    props.navigation.navigate("ManageEvent", {page: name})
  }

  const signOut = async () => {
    setIsLoad(true)
    await dispatch(SignOut())
    setTimeout(() => {
      setUserData(null)
      setIsLoad(false)
      props.navigation.navigate("Profile")
    }, 1000)
  }

  return (
    userData ?
      <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: Colors.white}}>
        {
          (isLoad ?
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={'large'} color={Colors.primary}/>
              </View> :
              <ScrollView contentContainerStyle={{paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                <View style={{
                  position: 'relative',
                  width: '100%',
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: Platform.OS === 'ios' ? 50 : 10
                }}>
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

                  {(isEdit && <View style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <TouchableOpacity onPress={() => pickImage()}>
                      <Ionicons color={Colors.white} name={'image-outline'} size={40}/>
                    </TouchableOpacity>
                  </View>)}

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
                  {( !isEdit && <Text style={{
                    display: "flex",
                    color: userData?.description ? Color.black : "gray",
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                  }}>
                    {userData?.description ? userData?.description.trim() : "คุณยังไม่ได้เพิ่มคำอธิบาย"}
                  </Text>)}
                  {
                    ( isEdit && <TextInput onChange={(e)=> setUserData({...userData, description: e.nativeEvent.text})} style={{fontFamily: Fonts.primary, fontSize: FontSize.small, paddingLeft: 1}} value={userData.description} placeholder={'คุณยังไม่ได้เพิ่มคำอธิบาย'} />)
                  }

                </View>

                <View style={{padding: 20}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.medium,
                  }}>
                    กิจกรรมที่ฉันสนใจ
                  </Text>
                  <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap",}}>
                    {(!isEdit && userData?.tags.map((item, index) => {
                      return (
                        <View key={index} View style={{
                          flexDirection: "row",
                          backgroundColor: Colors.primary,
                          borderRadius: 8,
                          padding: 4,
                          paddingHorizontal: 8,
                          marginHorizontal: 2,
                          margin: 5
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Color.white
                          }}>{item}
                          </Text>
                        </View>
                      )
                    }))}
                    {(isEdit && tags?.map((item, index) => {
                      return (
                        <TouchableOpacity onPress={async () => {
                          await setTags([...tags.slice(0, index), {
                            ...item,
                            isSelect: !item.isSelect
                          }, ...tags.slice(index + 1)])

                          let newTags = [...tags.slice(0, index), {
                            ...item,
                            isSelect: !item.isSelect
                          }, ...tags.slice(index + 1)]

                          newTags = newTags.map(tag => {
                              if (tag.isSelect) {
                                return tag.name
                              }
                            }
                          ).filter(tag => tag !== undefined)

                          setUserData({...userData, tags:newTags})
                        }} key={index} View style={{
                          flexDirection: "row",
                          backgroundColor:  item.isSelect ? Colors.primary : Colors.gray,
                          borderRadius: 8,
                          padding: 4,
                          paddingHorizontal: 8,
                          marginHorizontal: 2,
                          margin: 5
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Color.white
                          }}>{item.name}
                          </Text>
                        </TouchableOpacity>
                      )
                    }))}
                  </View>
                </View>

                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                }}>
                  {(!isEdit && <TouchableOpacity activeOpacity={0.8} onPress={() => manageEvent('myEvent')}>
                    <View style={{
                      width: Platform.OS === "ios" ? 340 : 350,
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
                      }}>กิจกรรมที่เข้าร่วม</Text>
                    </View>
                  </TouchableOpacity>)}
                  {(!isEdit && <TouchableOpacity activeOpacity={0.8} onPress={() => manageEvent('manageEvent')}>
                    <View style={{
                      width: Platform.OS === "ios" ? 340 : 350,
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
                      }}>จัดการกิจกรรมที่สร้าง</Text>
                    </View>
                  </TouchableOpacity>)}
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    onSubmit((isEdit ? 'อัปเดทโปรไฟล์': 'แก้ไขโปรไฟล์'))
                  }}>
                    <View style={{
                      width: Platform.OS === "ios" ? 340 : 350,
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
                      }}>{isEdit ? 'อัปเดทโปรไฟล์': 'แก้ไขโปรไฟล์'}</Text>
                    </View>
                  </TouchableOpacity>
                  {( isEdit && <TouchableOpacity activeOpacity={0.8} onPress={() => setIsEdit(false)}>
                    <View style={{
                      width: Platform.OS === "ios" ? 340 : 350,
                      height: 45,
                      backgroundColor: Colors.red,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20
                    }}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: fontSize.primary,
                        color: Colors.white
                      }}>ยกเลิกแก้ไขโปรไฟล์</Text>
                    </View>
                  </TouchableOpacity>)}

                  {(!isEdit &&<TouchableOpacity activeOpacity={0.8} onPress={() => signOut()}>
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
                  </TouchableOpacity>)}
                </View>
              </ScrollView>
          )}
      </View>
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
