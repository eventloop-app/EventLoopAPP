import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Surface, Button } from 'react-native-paper';
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Color from "../constants/Colors";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';


const EditProfileScreen = (props) => {

  const [username, onChangeUsername] = useState(null);
  const [firstName, onChangeFirstName] = useState("somsak");
  const [lastName, onChangeLastName] = useState("makmee");
  const [email, onChangeEmail] = useState("Somsak@mail.kmutt.ac.th");
  const [number, onChangeNumber] = useState(null);
  const [imageUri, setImageUri] = useState("https://ichef.bbci.co.uk/news/976/cpsprodpb/17638/production/_124800859_gettyimages-817514614.jpg");
  const [image, setImage] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
      setImage(result.uri);
    }
  };

  //Prevent input username
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!username.trim()) {
      alert('Please Enter Username');
      return;
    }
    alert('Success');
  };




  const formStep1 = () => {
    return (
      <View style={{}}>
        <View style={{ alignItems: "center", }}>
          <Text style={{ width: "83%", }}>ชื่อผู้ใช้</Text>
          <TextInput style={styles.input} onChangeText={(value) => onChangeUsername(value)} value={username} placeholderTextColor={"gray"} />
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
          <TextInput style={[styles.input, { backgroundColor: "#E3E3E3" }]} onChangeText={onChangeEmail} value={email} editable={false} placeholder="Email" placeholderTextColor={"gray"} />
        </View>
      </View>
    )
  }
  const formStep2 = () => {
    return (
      <View style={{ alignItems: 'center', }}>
        <View style={{ borderRadius: 150, borderColor: "lightgray", borderWidth: 4 }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 150 }} />
        </View>
        <View style={{ paddingTop: 8 }}>
          <Button mode="contained" color={Color.bag5Bg} onPress={pickImage} style={{ borderRadius: 20 }}>
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
      <View style={styles.container}>
        <Camera style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }}>
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>)
  }

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      {/* <View>
        <Text style={{ backgroundColor: "red", fontFamily: Fonts.bold, fontSize: FontSize.primary }}>ตั้งค่าโปรไฟล์</Text>

      </View> */}
      <View style={{ flex: 1, height: "100%", width: "100%", }}>
        <ProgressSteps topOffset={20} marginBottom={30}>
          <ProgressStep label="เพิ่มข้อมูล" onNext={checkTextInput}>
            <View style={{ alignItems: 'center', height: "100%", marginTop: 26 }}>
              <View style={{ width: "100%" }}>
                {formStep1()}
              </View>
            </View>
          </ProgressStep>
          <ProgressStep label="ตั้งค่ารูปโปรไฟล์">
            <View style={{ alignItems: 'center', height: "100%", }}>
              <View style={{ width: "100%", backgroundColor: "white" }}>
                {formStep2()}
              </View>
            </View>
          </ProgressStep>
          <ProgressStep label="เสร็จสิ้น">
            <View>
              {formStep3()}
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

});
export default EditProfileScreen;
