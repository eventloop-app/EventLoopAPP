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
import FormData from 'form-data';
import axios from "react-native-axios";
import demoprofileImage from '../assets/images/profileImage.jpg'


const ProfileImageCard = (props) => {
  const [isLoad, setIsLoad] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const { userToken, userError } = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // console.log(result);
    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  useEffect(() => {
    if (userToken !== null) {
      const idToken = JSON.parse(userToken).idToken;
      const user = decode.jwt(idToken);
      setUserData(user);
    }
    if (userError) {
      console.log('userTokenErrorr : ' + userError);
    }
    setIsLoad(false);
  }, [userToken]);

  useEffect(() => {
    let setOldProfileImage = ""
    if (props.status === "EDIT") {
      setOldProfileImage = profileImage
      // sendProfileImage(props.status, setOldProfileImage)
    } else if (props.status === "DISCARD") {
      setProfileImage(setOldProfileImage)
    } else if (props.status === "SAVE") {
      sendProfileImage(profileImage)
    } else {
      setProfileImage(setOldProfileImage)
    }

  }, [props.status])


  const sendProfileImage = ( ) => {
    // let currentImage = status === "SAVE" ? profileImage : oldImage
    props.getData(profileImage)
  }

  return (
    <View style={{ alignItems: 'center' }}>
      {console.log(props.uploadImageBtt)}
      <TouchableOpacity disabled={!props.isEdit}
        style={{ borderRadius: 150, borderColor: 'lightgray', borderWidth: 4 }}
        onPress={pickImage}>
        <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", borderRadius: 20, height: 40, width: 40, borderColor: "white", borderWidth: 1, backgroundColor: "lightgray", marginTop: 166, marginLeft: 135, zIndex: 1, display: props.isEdit ? "flex" : "none" }}>
          <Ionicons style={{ backgroundColor: "lightgray" }} name={"camera"} size={24} color="black" />
        </View>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/images/profileImage.jpg')
          }
          style={{ width: 200, height: 200, borderRadius: 150 }}
        />
      </TouchableOpacity>
      <View style={{ paddingTop: 8, display: props.uploadImageBtt ? "flex" : "none" }}>
        <Button
          mode="contained"
          color={Color.bag5Bg}
          onPress={pickImage}
          style={{ borderRadius: 20 }}>
          Upload
        </Button>
      </View>

    </View>
  );
};

export default ProfileImageCard;
