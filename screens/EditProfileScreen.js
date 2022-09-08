import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform, ActivityIndicator
} from "react-native";
import {Surface, Button} from 'react-native-paper';
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Color from "../constants/Colors";
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {Ionicons, Feather, MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import {Camera, CameraType} from 'expo-camera';
import Validate from '../services/Validate';
import eventsService from '../services/eventsService';
import {useDispatch, useSelector} from "react-redux";
import Colors from '../constants/Colors';
import FormData from 'form-data';
import * as Notifications from 'expo-notifications'
import storages from "../services/storages";
import {saveUser} from "../actions/user";

const EditProfileScreen = ({props, route, navigation}) => {
  //declare variable
  const [username, onChangeUsername] = useState(null);
  const [firstName, onChangeFirstName] = useState(null);
  const [lastName, onChangeLastName] = useState(null);
  const [email, onChangeEmail] = useState(null);
  const [number, onChangeNumber] = useState(null);
  const [imageProfile, setProfileImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isError, setIsError] = useState(false)
  const [isShowValidateMessage, SetIsShowValidateMessage] = useState("")
  const {userToken, userError} = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)
  const [isLoad, setIsLoad] = useState(true)
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [hasUser, setHasUser] = useState(false)
  const dispatch = useDispatch();
  const [tags, setTags] = useState([
    {title: "ดนตรี", icon: "music", source: "Feather", isSelect: false},
    {title: "กีฬา", icon: "football", source: "Ionicons", isSelect: false},
    {title: "บันเทิง", icon: "movie", source: "MaterialIcons", isSelect: false},
    {title: "ศิลปะ", icon: "draw", source: "MaterialCommunityIcons", isSelect: false},
    {title: "เกม", icon: "gamepad-variant-outline", source: "MaterialCommunityIcons", isSelect: false},
    {title: "ท่องเที่ยว", icon: "briefcase", source: "Feather", isSelect: false},
    {title: "การศึกษา", icon: "book-outline", source: "Ionicons", isSelect: false},
    {title: "สุขภาพ", icon: "md-heart", source: "Ionicons", isSelect: false},
    {title: "อาหาร", icon: "fast-food-outline", source: "Ionicons", isSelect: false},
  ])
  const [state, setState] = useState(null)
  const [waitSub, setWaitSub] = useState(false)

  // useEffect(() => {
  //   if (userToken !== null) {
  //     const idToken = JSON.parse(userToken).idToken
  //     const user = decode.jwt(idToken)
  //     setUserData(user)
  //   }
  //   if (userError) {
  //     console.log("userTokenErrorr : " + userError)
  //   }
  //   setIsLoad(false)
  // }, [userToken])

  useEffect(() => {
    const user = route.params.user
    setUserData(user)
    setState("GetToken")
  }, [])

  useEffect(() => {
    console.log("Get ToKen")
    let unmount = false
    if (userData !== null && unmount !== true && state == "GetToken") {
      registerForPushNotification().then(async token => {
        if (userData.deviceId === undefined && token !== null) {
          await console.log("TOKEN IS: " + token)
          await setUserData({...userData, deviceId: token})
          await setIsLoad(false)
        } else {
          console.log("Can't get token")
        }
      }).catch(e => {
        console.error(e)
      })
    }
    return () => {
      unmount = true
    }
  }, [state])

  const registerForPushNotification = async () => {
    if (userData.deviceId === undefined) {
      const {status} = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      } else {
        console.log("GET deviceId")
        try {
          return (await Notifications.getExpoPushTokenAsync()).data
        } catch (e) {
          return null
          console.log(e)
        }
      }
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const checkHasUserName = (value) => {
    const username = value.nativeEvent.text
    //Validate Username
    if (Validate.getValidateUsername(username)) {
      // setIsError(false)
      eventsService.hasUsername(username).then(res => {
        //Check response status.
        if (res.status === 200) {
          //check has current username in database. 
          if (res.data.hasUsername) {
            console.log(res.data.hasUsername)
            // setHasUser(true)
            setIsError(true)
            SetIsShowValidateMessage("Username " + username + " is used!")
          } else {
            // setHasUser(false)
            setIsError(false)
            SetIsShowValidateMessage("")
          }

        } else {
          alert("server error : " + res.status)
        }
      })
    } else {
      setIsError(true)
      SetIsShowValidateMessage("ชื่อผู้ใช้ต้องมีความยาวระหว่าง 3-15 ตัวอักษร\nต้องประกอบด้วยตัวอักษรหรือตัวเลขเท่านั้น")
    }
  }

  //Prevent input username
  const checkTextInput = (value) => {
    //Check for the Name TextInput
    if (Validate.getValidateUsername(username) && !isShowValidateMessage) {
      setIsError(false)
      SetIsShowValidateMessage("")
    } else {
      setIsError(true)
      if (!isShowValidateMessage) {
        SetIsShowValidateMessage("ชื่อผู้ใช้ต้องมีความยาวระหว่าง 3-15 ตัวอักษร\nต้องประกอบด้วยตัวอักษรหรือตัวเลขเท่านั้น")
      }
    }

  };

  const handleOnSelectTags = (indexToSelect, itemSelected) => {
    const newState = tags.map((item, index) => {
      return {
        ...item,
        isSelect: (indexToSelect === index ? !item.isSelect : item.isSelect),
      };
    });
    setTags(newState);
  };

  const handleSubmitForm = async () => {
    await handlePushTag()
    const filename = imageProfile?.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const localUri = imageProfile;

    let data = {
      username: username,
      firstName: userData.name.split(' ').slice(0, -1).join(' ').toLowerCase(),
      lastName: userData.name.split(' ').slice(-1).join(' ').toLowerCase(),
      email: userData.email,
      memberId: userData.memberId,
      tags: selectedTag,
      deviceId: userData.deviceId
    }
    const formData = new FormData();
    formData.append('profileImage', localUri ? {uri: localUri, name: filename, type: type} : null);
    formData.append('memberInfo', JSON.stringify(data));

    setWaitSub(true)
    try {
      await eventsService.transferMemberData(formData).then(async res => {
        if (res.status === 200) {
          await dispatch(saveUser(JSON.stringify(res.data.member)))
          setTimeout(() => {
            navigation.navigate('Profile', {user: res.data.member})
          }, 500)
        } else {
          navigation.navigate('Error')
        }
      })
    } catch (e) {
      navigation.navigate('Error')
      console.log(e)
    }
  }

  const handlePushTag = () => {
    setSelectedTag([])
    tags.map((item, index) => {
      if (item.isSelect === true) {
        selectedTag.push(item.title)
      }
    })
  }

  const handleUploadData = () => {
    // let localUri = imageProfile;
    // let filename = imageProfile.split('/').pop();
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;
    // let memberId = userData.memberId
    // let email = userData.email
    // let firstName = userData.name.split(' ').slice(0, -1).join(' ').toLowerCase();
    // let lastName = userData.name.split(' ').slice(-1).join(' ').toLowerCase()
    //
    // const formData = new FormData();
    // formData.append('profileImage', { uri: localUri, name: filename, type: type });
    // formData.append('memberInfo', JSON.stringify({ memberId: memberId, username: username, firstName: firstName, lastName: lastName, email: email, tags: selectedTag }));
    //
    // console.log(formData)
    // return axios({
    //   url: 'https://dev-eventloop.wavemoroc.app/eventService/members/transferMemberData',
    //   method: 'POST',
    //   data: formData,
    //   headers: {
    //     'Content-Type': `multipart/form-data`,
    //   },
    // }).then(res => {
    //   console.log(res)
    //   if (res.status === 200) {
    //     navigation.navigate('ProfileDetail')
    //   } else { alert(res.status) }
    // })
  }

  const formStep1 = () => {
    const firstName = userData?.name.split(' ').slice(0, -1).join(' ').toLowerCase();
    const lastName = userData?.name.split(' ').slice(-1).join(' ').toLowerCase()

    return (
      <View style={{}}>
        <View style={{alignItems: "center"}}>
          <Text style={{fontFamily:Fonts.primary, fontSize: FontSize.primary,width: "83%",}}>ชื่อผู้ใช้</Text>
          <Text style={{
            width: "83%",
            fontFamily: Fonts.primary,
            color: "red",
            marginTop: 5,
            display: isShowValidateMessage ? "flex" : "none"
          }}> {isShowValidateMessage}</Text>
          <TextInput style={[styles.input, {borderColor: isShowValidateMessage ? "red" : "#CBCBCB", }]}
                     onChangeText={(value) => onChangeUsername(value)} value={username}
                     onEndEditing={(value) => checkHasUserName(value)} placeholderTextColor={"gray"}
                     placeholder="ชื่อผู้ใช้ของคุณ"/>
          {/* <Text style={{ alignSelf: "flex-start", marginLeft: 35, color: "red", display: isShowValidateMessage ? "flex" : "none" }}>{`${username} is used !`}{isShowValidateMessage}</Text> */}
        </View>
        <View style={{alignItems: "center",}}>
          <Text style={{fontFamily:Fonts.primary, fontSize: FontSize.primary,width: "83%",}}>ชื่อ</Text>
          <TextInput style={[styles.input, {backgroundColor: "#E3E3E3"}]} onChangeText={onChangeFirstName}
                     value={firstName} editable={false} placeholderTextColor={"gray"} placeholder="Last name"/>
        </View>
        <View style={{alignItems: "center",}}>
          <Text style={{fontFamily:Fonts.primary, fontSize: FontSize.primary,width: "83%",}}>นามสกุล</Text>
          <TextInput style={[styles.input, {backgroundColor: "#E3E3E3"}]} onChangeText={onChangeLastName}
                     value={lastName} editable={false} placeholder="First name" placeholderTextColor={"gray"}/>
        </View>
        <View style={{alignItems: "center",}}>
          <Text style={{fontFamily:Fonts.primary, fontSize: FontSize.primary,width: "83%",}}>อีเมล</Text>
          <TextInput style={[styles.input, {backgroundColor: "#E3E3E3"}]} onChangeText={onChangeEmail}
                     value={userData?.email} editable={false} placeholder="Email" placeholderTextColor={"gray"}/>
        </View>
      </View>
    )
  }

  const formStep2 = () => {
    return (
      <View style={{alignItems: 'center', marginTop: 100}}>
        <TouchableOpacity style={{
          justifyContent: 'center',
          borderRadius: 150,
          borderColor: (imageProfile ? Colors.primary : Colors.gray),
          borderWidth: 4
        }} onPress={pickImage}>
          <Image source={imageProfile ? {uri: imageProfile} : require('../assets/images/profileImage.jpg')}
                 style={{width: 200, height: 200, borderRadius: 150}}/>
        </TouchableOpacity>
        <View style={{paddingTop: 8}}>
          <Button mode="contained" color={Colors.gray} onPress={pickImage} style={{borderRadius: 20,}}>
            Upload
          </Button>
        </View>
      </View>
    )
  }

  const formStep3 = () => {
    return (
      <View style={{
        flex: 1,
        width: "90%",
        height: "100%",
        marginTop: 50,
        justifyContent: "space-evenly",
        alignContent: "space-around",
        flexDirection: "row",
        flexWrap: 'wrap',
      }}>
        {tags.map((item, index) => {
          if (item.source == "Feather") {
            return (
              <TouchableOpacity key={index} style={{
                backgroundColor: Colors.white,
                height: 100,
                width: 90,
                marginVertical: 2,
                flexDirection: "column",
                borderWidth: 3,
                borderColor: item.isSelect ? Colors.primary : Colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.00,
                elevation: 1,
                borderRadius: 8
              }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{height: "100%", justifyContent: 'center', alignItems: 'center'}}>
                  <Feather style={{alignSelf: "center"}} name={item.icon} size={36} color="black"/>
                  <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>{item.title}</Text>
                </View>
              </TouchableOpacity>)
          } else if (item.source == "Ionicons") {
            return (
              <TouchableOpacity key={index} style={{
                backgroundColor: Colors.white,
                height: 100,
                width: 90,
                marginVertical: 2,
                flexDirection: "column",
                borderWidth: 3,
                borderColor: item.isSelect ? Colors.primary : Colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.00,
                elevation: 1,
                borderRadius: 8
              }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{height: "100%", justifyContent: 'center', alignItems: 'center'}}>
                  <Ionicons style={{alignSelf: "center"}} name={item.icon} size={36} color="black"/>
                  <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>{item.title}</Text>
                </View>
              </TouchableOpacity>)
          } else if (item.source == "MaterialIcons") {
            return (
              <TouchableOpacity key={index} style={{
                backgroundColor: Colors.white,
                height: 100,
                width: 90,
                marginVertical: 2,
                flexDirection: "column",
                borderWidth: 3,
                borderColor: item.isSelect ? Colors.primary : Colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.00,
                elevation: 1,
                borderRadius: 8
              }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{height: "100%", justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcons style={{alignSelf: "center"}} name={item.icon} size={36} color="black"/>
                  <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>{item.title}</Text>
                </View>
              </TouchableOpacity>)
          } else if (item.source == "MaterialCommunityIcons") {
            return (
              <TouchableOpacity key={index} style={{
                backgroundColor: Colors.white,
                height: 100,
                width: 90,
                marginVertical: 2,
                flexDirection: "column",
                borderWidth: 3,
                borderColor: item.isSelect ? Colors.primary : Colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.00,
                elevation: 1,
                borderRadius: 8
              }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{height: "100%", justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialCommunityIcons style={{alignSelf: "center"}} name={item.icon} size={36} color="black"/>
                  <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>{item.title}</Text>
                </View>
              </TouchableOpacity>)
          }
        })}
      </View>)
  }

  return (isLoad ? <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
      </SafeAreaView> :
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        {
          (waitSub && <SafeAreaView style={{
            position: "absolute",
            flex: 1,
            width: "100%",
            height: (Platform.OS === 'ios' ? "120%" : '100%'),
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "rgba(0,0,0,0.25)",
            zIndex: 50
          }}>
            <ActivityIndicator size={75} color={Colors.primary}/>
          </SafeAreaView>)
        }
        <View style={{flex: 1, height: "100%", width: "100%", marginTop: (Platform.OS === "android" ? 50 : null)}}>
          <ProgressSteps labelFontFamily={Fonts.primary} topOffset={20} marginBottom={30}>
            <ProgressStep nextBtnDisabled={(username ? false : true)} nextBtnText={'ต่อไป'}
                          nextBtnTextStyle={{fontFamily: Fonts.primary}} label="เพิ่มข้อมูล" onNext={checkTextInput}
                          errors={isError}>
              <View style={{alignItems: 'center', height: "100%", marginTop: 26}}>
                <View style={{width: "100%"}}>
                  {formStep1()}
                </View>
              </View>
            </ProgressStep>
            <ProgressStep previousBtnText={'ย้อนกลับ'} nextBtnText={'ต่อไป'}
                          previousBtnTextStyle={{fontFamily: Fonts.primary}}
                          nextBtnTextStyle={{fontFamily: Fonts.primary}} label="ตั้งค่ารูปโปรไฟล์">
              <View style={{flex: 1, height: "100%", width: "100%",}}>
                {formStep2()}
              </View>
            </ProgressStep>
            <ProgressStep onSubmit={() => handleSubmitForm()} previousBtnText={'ย้อนกลับ'} finishBtnText={'ยืนยัน'}
                          previousBtnTextStyle={{fontFamily: Fonts.primary}}
                          nextBtnTextStyle={{fontFamily: Fonts.primary}} label="สิ่งที่คุณสนใจ">
              <View style={{flex: 1, height: "100%", width: "100%", alignItems: "center"}}>
                {
                  formStep3()
                }
                <Text style={{fontFamily: Fonts.bold, color: Colors.yellow, marginTop: 20}}>[สามารถกลับมาเลือกภายหลังได้]</Text>
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "85%",
    marginTop: 4,
    marginBottom: 12,
    marginHorizontal: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    borderColor: "#CBCBCB",
    alignSelf: "center",
    fontFamily: Fonts.medium,
    fontSize: FontSize.primary,
    color: Color.black,
  },
  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "white",
    height: 265,
    width: 230,
    borderRadius: 15,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    elevation: 7,
    padding: 8
  },

  container: {
    flex: 1,
    backgroundColor: "grey",
    borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  buttonFormStep3: {
    backgroundColor: "pink",
    height: 100,
    width: 90,
    marginVertical: 2,
    flexDirection: "column",
    borderWidth: 3,
    borderColor: "red"
  }
});

export default EditProfileScreen;
