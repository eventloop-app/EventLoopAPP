import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {toBuddhistYear} from "../constants/Buddhist-year";

const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')
const CreateEventScreen = (props) => {

  const [coverImage, setCoverImage] = useState(null)
  const [isEditTime, setIsEditTime] = useState(false)
  const [isEndTime, setIsEndTime] = useState(false)
  const [eventDetail, setEventDetail] = useState({
    eventName: 'ชื่อกิจกรรม',
    startDate: new Date(),
    endDate: new Date(),
    location: 'สถานที่จัดกิจกรรม',
    latitude: 0,
    longitude: 0,
  })

  useEffect(()=>{
    if(props.route.params){
      // console.log(props.route.params.data)
      setEventDetail({...eventDetail, location: props.route.params.data.name, latitude: props.route.params.data.lat, longitude: props.route.params.data.lng})
    }
    return ;
  },[props])

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

  const changeDateTime = (event, date) => {
    if (isEndTime) {
      console.log(date)
      // setEventDetail({...eventDetail, endDate: date})
    } else {
      setEventDetail({...eventDetail, startDate: date})
    }
  }

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
          <TextInput style={{fontFamily: Fonts.bold, fontSize: FontSize.large}} value={eventDetail.eventName}
                     onChange={(e) => setEventDetail({...eventDetail, eventName: e.nativeEvent.text})}/>
        </View>

        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setIsEditTime(!isEditTime)} style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: 'rgba(214, 234, 248, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name={'calendar-sharp'} color={Colors.primary} size={35}/>
          </TouchableOpacity>
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
            <Text style={{
              fontFamily: Fonts.primary,
              fontSize: FontSize.primary
            }}>{moment(eventDetail.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
            <Text style={{
              fontFamily: Fonts.primary,
              fontSize: FontSize.small
            }}>{weekdays[(moment(eventDetail.startDate).day())] + ', ' + moment(eventDetail.startDate).format("HH:mm A") + ' - ' + moment(eventDetail.endDate).format("HH:mm A")}</Text>
          </View>
        </View>

        <View style={{display: 'flex', width: '80%', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('GoogleMap')} style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: 'rgba(214, 234, 248, 0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Ionicons name={'ios-location-outline'}
                      size={35}
                      color={Colors.primary}/>
          </TouchableOpacity>
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
            <Text numberOfLines={1} style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>{eventDetail.location}</Text>
          </View>
        </View>


        {
          ((isEditTime && !isEndTime) &&
            <View style={{position: 'absolute', display: 'flex', width: '100%', height: 100, bottom: 250, left: 15}}>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.primary,
                textAlign: 'center'
              }}>กำหนดวันเริ่มกิจกรรม</Text>
              <RNDateTimePicker style={{height: 100, fontFamily: Fonts.primary}} textColor={Colors.primary}
                                display="spinner" locale={'th'} mode="datetime" value={eventDetail.startDate}
                                onChange={(event, date) => changeDateTime(event, date)}/>
              <TouchableOpacity onPress={() => setIsEndTime(!isEndTime)} style={{marginTop: 5}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.primary,
                  textAlign: 'center',
                  color: Colors.primary
                }}>
                  ต่อไป
                </Text>
              </TouchableOpacity>
            </View>
          )
        }

        {
          (isEndTime &&
            <View style={{position: 'absolute', display: 'flex', width: '100%', height: 100, bottom: 250, left: 15}}>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.primary,
                textAlign: 'center'
              }}>กำหนดวันเริ่มกิจกรรม</Text>
              <RNDateTimePicker style={{height: 100, fontFamily: Fonts.primary}} textColor={Colors.primary}
                                display="spinner" minimumDate={new Date()} locale={'th'} mode="time"
                                value={eventDetail.endDate}
                                onChange={(event, date) => setEventDetail({...eventDetail, endDate: date})}/>
              <TouchableOpacity onPress={() => {
                setIsEditTime(!isEditTime)
                setIsEndTime(!isEndTime)
              }} style={{marginTop: 5}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.primary,
                  textAlign: 'center',
                  color: Colors.primary
                }}>
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    </View>
  )
};

export default CreateEventScreen;
