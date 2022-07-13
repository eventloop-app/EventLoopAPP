import React from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet } from "react-native";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

const EditProfileScreen = (props) => {

  const [text, onChangeText] = React.useState(null);
  const [number, onChangeNumber] = React.useState(null);

  const formStep1 = () => {
    return (

      <View>
        <View  >
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            editable={false}
          />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
      </View>

    )
  }



  return (
    <SafeAreaView style={{ backgroundColor: "yellow", height: "100%" }}>
      {/* <View>
        <Text style={{ backgroundColor: "red", fontFamily: Fonts.bold, fontSize: FontSize.primary }}>ตั้งค่าโปรไฟล์</Text>

      </View> */}
      <View style={{ backgroundColor: "lightgreen", flex: 1, height: "100%", width: "100%" }}>
        <ProgressSteps>
          <ProgressStep label="First Step">
            <View style={{ alignItems: 'center', height: "100%", }}>
              <Text>This is the content within step 1!</Text>
              <View style={{ width: "100%", backgroundColor: "pink" }}>{formStep1()}</View>
            </View>
          </ProgressStep>
          <ProgressStep label="Second Step">a
            <View style={{ alignItems: 'center' }}>
              <Text>This is the content within step 2!</Text>
            </View>
          </ProgressStep>
          <ProgressStep label="Third Step">
            <View style={{ alignItems: 'center' }}>
              <Text>This is the content within step 3!</Text>
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
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    alignSelf: "center"
  },
});
export default EditProfileScreen;
