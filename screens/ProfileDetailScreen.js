import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions, Keyboard } from "react-native";
import { Surface, Button } from 'react-native-paper';
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Color from "../constants/Colors";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons, Feather, AntDesign, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import Validate from '../services/Validate';
import eventsService from '../services/eventsService';
import { useDispatch, useSelector } from "react-redux";
import decode from "../services/decode";
import BubbleSelect, { Bubble } from 'react-native-bubble-select';
import Colors from '../constants/Colors';
import FormData from 'form-data';
import axios from "react-native-axios";
import demoImageProfile from '../assets/images/profileImage.jpg'
import ProfileImageCard from '../components/ProfileImageCard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const ProfileDetailScreen = (props) => {
  //declare variable
  const [isLoad, setIsLoad] = useState(false);
  // const [imageProfile, setProfileImage] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [imageProfile, setProfileImage] = useState("");
  const { userToken, userError } = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [aboutMeText, setAboutMeText] = useState("")
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
  const [selectedTag, setSelectedTag] = useState(["ดนตรี", "กีฬา", "เกม", "หนัง", "อนิเมะ"])
  // const [tags, setTags] = useState({ tag: '', tagsArray: [] })
  const setData = () => {
    setUserData(props.route.params.user)
  }


  // const updateTagState = (state) => {
  //   setTags(state)
  // };

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
    setData()
  })

  const updateProfile = (isEditForm) => {
    setIsEdit(isEditForm)
  }



  const removeTags = (currentItem, currentIndex) => {
    const filteredItems = selectedTag.filter((item, index) => index !== currentIndex)
    setSelectedTag(filteredItems)
    console.log(filteredItems)
  }


  const renderTags = () => {
    return (
      <View style={{ width: "100%", flexDirection: "row" }}>
        {selectedTag.map((item, index) => {
          return (
            <View key={index} View style={{ flexDirection: "row", backgroundColor: Color.skyBlue, alignSelf: 'flex-start', borderRadius: 15, padding: 4, paddingHorizontal: 8, marginHorizontal: 2 }}>
              <Text style={{ fontFamily: Fonts.primary, fontSize: FontSize.vary_small, }}>{item}</Text>
              <TouchableOpacity style={{ marginLeft: 1, alignSelf: "center", }} onPress={() => removeTags(item, index)}>
                <AntDesign name={"minuscircleo"} size={16} color="black" />
              </TouchableOpacity>
            </View>
          )

        })}
        <View View style={{ flexDirection: "row", backgroundColor: Color.yellow, alignSelf: 'flex-start', borderRadius: 15, padding: 4, paddingHorizontal: 12, marginHorizontal: 2 }}>
          <Text onPress={() => { formStep3() }} style={{ fontFamily: Fonts.primary, fontSize: FontSize.vary_small, }} >เพิ่ม</Text>
          <TouchableOpacity style={{ marginLeft: 1, alignSelf: "center", }}  >
            <AntDesign name={"pluscircleo"} size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View >
    )
  }


  const renderProfileScreen = () => {
    return (
      <View >
        <Button color="red" style={{ alignSelf: "flex-end", backgroundColor: Colors.bag7Bg, margin: 4 }} onPress={() => updateProfile(!isEdit)}>{isEdit ? "save" : "edit"}</Button>
        <View>
          {/* <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", borderRadius: 20, height: 40, width: 40, borderColor: "white", borderWidth: 1, backgroundColor: "lightgray", marginTop: 170, marginLeft: 230, zIndex: 1, display: isEdit ? "flex" : "none" }}>
            <Ionicons style={{ backgroundColor: "lightgray" }} name={"camera"} size={24} color="black" />
          </View> */}
          <ProfileImageCard uploadImageBtt={false} isEdit={!isEdit} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.Name}>Johnyman62</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={styles.followText}>กำลังติดตาม</Text>
              <Text style={styles.followText}>152</Text>
            </View>
            <View style={{ marginLeft: 11, marginRight: 0, borderColor: "black", borderWidth: 1 }}></View>
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={styles.followText}>ผู้ติดตาม</Text>
              <Text style={styles.followText}>125</Text>
            </View>
          </View>
        </View>
        <View style={{ padding: 4, }}>
          <View style={{}}>
            <Text style={{ fontFamily: Fonts.bold, fontSize: FontSize.primary, padding: 6, }} >เกี่ยวกับฉัน</Text>
            {/* <Text style={{ fontFamily: Fonts.primary, fontSize: FontSize.small, paddingLeft: 16, }} >Lorem Ipsum is simply dummy text of the printing and typesetting industry.  </Text> */}
            {/* <TextInput style={[styles.input, { backgroundColor: "white", height: 100, textAlignVertical: 'top', borderWidth: isEdit ? 1 : 0 }]}
            returnKeyType={"done"} onSubmitEditing={Keyboard.dismiss}
            multiline={true} numberOfLines={1} value={aboutMeText} onChangeText={setAboutMeText} editable={isEdit} placeholderTextColor={"gray"} placeholder="เพิ่มคำอธิบายเกี่ยวกับคุณ" /> */}

            <View style={[styles.textAreaContainer, { borderWidth: isEdit ? 1 : 0 }]} >
              <TextInput style={[styles.textArea, { display: (isEdit ? "flex" : "none"), }]} value={aboutMeText}
                onChangeText={setAboutMeText}
                placeholder={aboutMeText ? "" : "เพิ่มคำอธิบายเกี่ยวกับคุณ"}
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                maxLength={450}
                editable={isEdit}
              />
              <Text style={[styles.input, { display: isEdit ? "none" : "flex", color: aboutMeText ? Color.black : "gray", }]}>{aboutMeText ? aboutMeText.trim() : "เพิ่มคำอธิบายเกี่ยวกับคุณ"}</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontFamily: Fonts.bold, fontSize: FontSize.primary, padding: 6, }} >สิ่งที่ฉันสนใจ</Text>
            {renderTags()}

          </View>
        </View >

      </View >
    );
  };

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
      {isLoad ? (
        <Text style={styles.CenterScreenText}>Loading...</Text>
      ) : (
        <KeyboardAwareScrollView extraHeight={120}>
          {renderProfileScreen()}

        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  CenterScreenText: {
    position: 'relative',
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: FontSize.primary,
  },
  Name: {
    fontSize: FontSize.large, fontFamily: Fonts.bold
  },
  followText: {
    fontSize: FontSize.primary, fontFamily: Fonts.medium
  },
  input: {
    height: "auto",
    width: "100%",
    padding: 2,
    paddingLeft: 4,
    borderRadius: 15,
    borderColor: "#CBCBCB",
    fontFamily: Fonts.medium,
    fontSize: FontSize.small,

  },
  textAreaContainer: {
    borderColor: Color.bag10Bg,
    borderWidth: 1,
    borderRadius: 15,
    padding: 5

  },
  textArea: {
    height: 155,
    justifyContent: "flex-start",
    textAlignVertical: 'top',
    fontFamily: Fonts.primary,
    fontSize: FontSize.small,
  }
});

export default ProfileDetailScreen;
