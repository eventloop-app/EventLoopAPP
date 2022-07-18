import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Surface, Button } from 'react-native-paper';
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Color from "../constants/Colors";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import Validate from '../services/Validate';
import eventsService from '../services/eventsService';
import { useDispatch, useSelector } from "react-redux";
import decode from "../services/decode";
import BubbleSelect, { Bubble } from 'react-native-bubble-select';
import Colors from '../constants/Colors';

const EditProfileScreen = (props) => {
  //declare variable
  const [username, onChangeUsername] = useState(null);
  const [firstName, onChangeFirstName] = useState("somsak");
  const [lastName, onChangeLastName] = useState("makmee");
  const [email, onChangeEmail] = useState("Somsak@mail.kmutt.ac.th");
  const [number, onChangeNumber] = useState(null);
  const [imageProfile, setProfileImage] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isValidUsername, setIsValidUsername] = useState(false)
  const { userToken, userError } = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)
  const [isLoad, setIsLoad] = useState(true)
  // const [isSelect, setIsSelect] = useState(false)
  const [selectedTag, setSelectedTag] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [tags, setTags] = useState([
    { title: "Music", icon: "music", source: "Feather", isSelect: false },
    { title: "Sport", icon: "football", source: "Ionicons", isSelect: false },
    { title: "Movie", icon: "movie", source: "MaterialIcons", isSelect: false },
    { title: "Art", icon: "draw", source: "MaterialCommunityIcons", isSelect: false },
    { title: "Game", icon: "gamepad-variant-outline", source: "MaterialCommunityIcons", isSelect: false },
    { title: "Music", icon: "music", source: "Feather", isSelect: false },
    { title: "Sport", icon: "football", source: "Ionicons", isSelect: false },
    { title: "Movie", icon: "movie", source: "MaterialIcons", isSelect: false },
    { title: "Art", icon: "draw", source: "MaterialCommunityIcons", isSelect: false },
    { title: "Game", icon: "gamepad-variant-outline", source: "MaterialCommunityIcons", isSelect: false },


  ])



  //useEffect
  useEffect(() => {
    if (userToken !== null) {
      const idToken = JSON.parse(userToken).idToken
      const user = decode.jwt(idToken)
      setUserData(user)
    }
    if (userError) {
      console.log("userTokenErrorr : " + userError)
    }
    setIsLoad(false)
  }, [userToken])

  //function
  const getData = () => {
    return eventsService.transferMemberData().then((res) => {

    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  //Prevent input username
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (Validate.getValidateUsername(username)) {
      setIsValidUsername(true)
      alert(username)
      return
    } else {
      setIsValidUsername(false)
      alert("NOOOOOO")
    }

  };

  // const selectTags = (index, item) => {
  //   console.log(index)
  //   console.log(item)
  //   // setIsSelect(!isSelect)
  // }

  const handleOnSelectTags = (indexToSelect, itemSelected) => {

    const newState = tags.map((item, index) => {

      return {
        ...item,
        isSelect: (indexToSelect === index ? !item.isSelect : item.isSelect),

      };

    });

    setTags(newState);
  };


  const handleSubmitForm = () => {
    tags.map((item, index) => {
      if (item.isSelect === true) {
        return selectedTag.push(item.title)
      }
    })

    console.log(selectedTag)
    setUserInfo({ username, imageProfile, selectedTag, })
    console.log(userInfo)
  }

  const test = () => {
    console.log(userInfo)
  }

  const formStep1 = () => {
    const firstName = userData.name.split(' ').slice(0, -1).join(' ').toLowerCase();
    const lastName = userData.name.split(' ').slice(-1).join(' ').toLowerCase()
    return (
      <View style={{}}>

        <View style={{ alignItems: "center", }}>
          <Text style={{ width: "83%", }}>ชื่อผู้ใช้</Text>
          <TextInput style={[styles.input, { borderColor: !isValidUsername ? "#CBCBCB" : "red" }]} onChangeText={(value) => onChangeUsername(value.trim())} value={username} placeholderTextColor={"gray"} placeholder="ขื่อผู้ใช้ของคุณ" />
        </View>

        <View style={{ alignItems: "center", }}>
          <Text style={{ width: "83%", }}>ชื่อ</Text>
          <TextInput style={[styles.input, { backgroundColor: "#E3E3E3" }]} onChangeText={onChangeFirstName} value={firstName} editable={false} placeholderTextColor={"gray"} placeholder="Last name" />
        </View>

        <View style={{ alignItems: "center", }}>
          <Text style={{ width: "83%", }}>นามสกุล</Text>
          <TextInput style={[styles.input, { backgroundColor: "#E3E3E3" }]} onChangeText={onChangeLastName} value={lastName} editable={false} placeholder="First name" placeholderTextColor={"gray"} />
        </View>

        <View style={{ alignItems: "center", }}>
          <Text style={{ width: "83%", }}>อีเมล</Text>
          <TextInput style={[styles.input, { backgroundColor: "#E3E3E3" }]} onChangeText={onChangeEmail} value={userData.email} editable={false} placeholder="Email" placeholderTextColor={"gray"} />
        </View>
      </View>
    )
  }
  const formStep2 = () => {
    return (
      <View style={{ alignItems: 'center', }}>
        <View style={{ borderRadius: 150, borderColor: "lightgray", borderWidth: 4 }}>
          <Image source={{ uri: imageProfile }} style={{ width: 200, height: 200, borderRadius: 150 }} />
        </View>
        <View style={{ paddingTop: 8 }}>
          <Button mode="contained" color={Color.bag5Bg} onPress={pickImage} style={{ borderRadius: 20, }}>
            Upload
          </Button>
        </View>

        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View> */}
      </View>
    )
  }

  const formStep3 = () => {
    return (
      <View style={{ width: "90%", height: "100%", justifyContent: "space-evenly", alignContent: "space-around", flexDirection: "row", flexWrap: 'wrap' }}>
        <Button style={{ backgroundColor: "pink", height: 100, width: 90, }} onPress={test}><Text>sss</Text></Button>
        {tags.map((item, index) => {
          if (item.source == "Feather") {
            return (
              <Button key={index} style={{ backgroundColor: "pink", height: 100, width: 90, marginVertical: 2, flexDirection: "column", borderWidth: 3, borderColor: item.isSelect ? "red" : "pink" }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{ height: "100%", justifyContent: 'center', }}>
                  <Feather style={{ alignSelf: "center" }} name={item.icon} size={36} color="black" />
                  <Text style={{}} >{item.title}</Text>
                </View>
              </Button>)
          } else if (item.source == "Ionicons") {
            return (
              <Button key={index} style={{ backgroundColor: "pink", height: 100, width: 90, marginVertical: 2, flexDirection: "column", borderWidth: 3, borderColor: item.isSelect ? "red" : "pink" }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{ height: "100%", justifyContent: 'center' }}>
                  <Ionicons style={{ alignSelf: "center" }} name={item.icon} size={36} color="black" />
                  <Text>{item.title}</Text>
                </View>
              </Button>)
          } else if (item.source == "MaterialIcons") {
            return (
              <Button key={index} style={{ backgroundColor: "pink", height: 100, width: 90, marginVertical: 2, flexDirection: "column", borderWidth: 3, borderColor: item.isSelect ? "red" : "pink" }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{ height: "100%", justifyContent: 'center' }}>
                  <MaterialIcons style={{ alignSelf: "center" }} name={item.icon} size={36} color="black" />
                  <Text>{item.title}</Text>
                </View>
              </Button>)
          } else if (item.source == "MaterialCommunityIcons") {
            return (
              <Button key={index} style={{ backgroundColor: "pink", height: 100, width: 90, marginVertical: 2, flexDirection: "column", borderWidth: 3, borderColor: item.isSelect ? "red" : "pink" }} mode="contained" onPress={() => handleOnSelectTags(index, item)}>
                <View style={{ height: "100%", justifyContent: 'center' }}>
                  <MaterialCommunityIcons style={{ alignSelf: "center" }} name={item.icon} size={36} color="black" />
                  <Text>{item.title}</Text>
                </View>
              </Button>)
          }

        })}

        {/* <Button style={{ height: 100, width: 90, margin: 2, }} color='pink' mode="contained" onPress={() => console.log('Pressed')}>
          <Feather name="music" size={24} color="black" />
        </Button>
        <Button style={{ height: 100, width: 90, margin: 2, }} color='pink' mode="contained" onPress={() => console.log('Pressed')}>
          <Feather name="music" size={24} color="black" />
        </Button> */}
      </View>)
  }

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      {
        isLoad ?
          <Text style={styles.CenterScreenText}>
            Loading...
          </Text>
          :
          (<View style={{ flex: 1, height: "100%", width: "100%", }}>
            <ProgressSteps topOffset={20} marginBottom={30}>
              <ProgressStep label="เพิ่มข้อมูล"  >
                <View style={{ alignItems: 'center', height: "100%", marginTop: 26 }}>
                  <View style={{ width: "100%" }}>
                    {formStep1()}
                  </View>
                </View>
              </ProgressStep>
              <ProgressStep label="ตั้งค่ารูปโปรไฟล์">
                <View style={{ flex: 1, height: "100%", width: "100%", }}>
                  <View style={{ width: "100%", backgroundColor: "white" }}>
                    {formStep2()}
                  </View>
                </View>
              </ProgressStep>
              <ProgressStep label="สิ่งที่คุณสนใจ" onSubmit={handleSubmitForm}>
                <View style={{ flex: 1, height: "100%", width: "100%", alignItems: "center" }}>
                  <Text>Tags</Text>
                  {formStep3()}
                </View>
              </ProgressStep>
            </ProgressSteps>
          </View>)
      }

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
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    borderColor: "#CBCBCB",
    alignSelf: "center",
    fontFamily: Fonts.medium,
    fontSize: FontSize.primary,
    color: Color.black,
    borderWidth: 2
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
    backgroundColor: "pink", height: 100, width: 90, marginVertical: 2, flexDirection: "column", borderWidth: 3, borderColor: "red"
  }

});
export default EditProfileScreen;
