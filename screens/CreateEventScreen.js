import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Button, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

const CreateEventScreen = (props) => {

  const [coverImage, setCoverImage] = useState(null)
  const [date, setDate] = useState(new Date());
  const [eventDetail, setEventDetail] = useState({
    eventName: 'ชื่อกิจกรรม'
  })

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
      setCoverImage(result.uri)
      // console.log(result.uri);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{height: 200, width: '100%', backgroundColor: Colors.gray, position: 'absolute', top: 0}}>
        {
          coverImage ?
            <Image style={{width: '100%', height: '100%'}}
                   source={{
                     uri: (coverImage)
                   }}
            />
            : <TouchableOpacity onPress={() => pickImage()}
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{backgroundColor: 'rgba(255,255,255,0.7)', padding: 10, borderRadius: '100'}}>
                <Ionicons color={Colors.black} name={'image-outline'} size={40}/>
              </View>
            </TouchableOpacity>
        }
      </View>
      <View style={{
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        top: 150,
        zIndex: 10,
        padding: 15
      }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput style={{ fontFamily: Fonts.bold, fontSize: FontSize.large}} value={eventDetail.eventName} onChange={(e)=> setEventDetail({...eventDetail, eventName: e.nativeEvent.text})}/>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'red'}}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: 'rgba(214, 234, 248, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name={'calendar-sharp'} color={Colors.primary} size={35}/>
          </View>
          <View style={{marginLeft: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 20}}>
            </View>
          </View>
        </View>
      </View>

    </View>
  )
};

export default CreateEventScreen;
