import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Image, Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {useSelector} from "react-redux";
import MapView, {Marker} from "react-native-maps";
import {platforms} from "react-native/react-native.config";
import FormData from "form-data";
import eventsService from "../services/eventsService";
import {stringify} from "qs";
import {useIsFocused} from "@react-navigation/native";

const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')

const tagss = [
  {name: 'การเรียน1', isSelect: false},
  {name: 'การเรียน2', isSelect: false},
  {name: 'การเรียน3', isSelect: false},
  {name: 'การเรียน4', isSelect: false},
  {name: 'การเรียน5', isSelect: false},
  {name: 'การเรียน6', isSelect: false},
  {name: 'การเรียน7', isSelect: false},
  {name: 'การเรียน8', isSelect: false},
]

const kind = [
  {name: 'ออนไซต์', en_name: 'ONSITE', isSelect: true},
  {name: 'ออนไลน์', en_name: 'ONLINE', isSelect: false}
]

const CreateEventScreen = (props) => {
  const [isLoad, setIsLoad] = useState(true)
  const [coverImage, setCoverImage] = useState(null)
  const [isEditTime, setIsEditTime] = useState(false)
  const [isEndTime, setIsEndTime] = useState(false)
  const [tags, setTags] = useState(tagss)
  const [kinds, setKinds] = useState(kind)
  const [eventDetail, setEventDetail] = useState({
    type: "ONSITE",
    tags: [],
    eventName: 'ชื่อกิจกรรม',
    startDate: new Date(),
    endDate: new Date(),
    location: null,
    latitude: 0,
    longitude: 0,
    description: 'ใส่รายละเอียดกิจกรรม',
    numberOfPeople: 0,
    memberId: null
  })
  const {user} = useSelector(state => state.user)
  const userData = JSON.parse(user)
  const mapRef = createRef();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused === false) {
      setEventDetail({
        type: "ONSITE",
        tags: [],
        eventName: 'ชื่อกิจกรรม',
        startDate: new Date(),
        endDate: new Date(),
        location: null,
        latitude: 0,
        longitude: 0,
        description: 'ใส่รายละเอียดกิจกรรม',
        numberOfPeople: 0,
        memberId: null
      })
      setIsLoad(true)
      setCoverImage(null)
      setKinds(kind)
      setTags(tagss)
    }
  }, [isFocused])

  useEffect(() => {
    if (userData !== undefined && userData !== null && isFocused) {
      setEventDetail({...eventDetail, memberId: userData?.id})
    }
    setTimeout(() => {
      setIsLoad(false)
    }, 1000)
  }, [isFocused])

  useEffect(() => {
    if (props.route.params) {
      setEventDetail({
        ...eventDetail,
        location: null,
      })
      setTimeout(() => {
        setEventDetail({
          ...eventDetail,
          location: props.route.params.data.name,
          latitude: props.route.params.data.lat,
          longitude: props.route.params.data.lng
        })
      }, 100)
    }
  }, [props])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setCoverImage(result)
    }
  };

  const changeDateTime = (event, date) => {
      setEventDetail({...eventDetail, startDate: date, endDate: date})
  }

  const onSubmit = async () => {
    let newEventDetail = {
      ...eventDetail,
      startDate: moment(eventDetail.startDate).unix() * 1000,
      endDate: moment(eventDetail.endDate).unix() * 1000
    }
    const filename = coverImage.uri.toString().split('/').pop()
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const data = new FormData();
    data.append('coverImage', coverImage ? {uri: coverImage.uri, name: filename, type: type} : null);
    data.append('eventInfo', JSON.stringify(newEventDetail));

    eventsService.createEvent(data).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }

  const renderUI = () => (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{height: 200, width: '100%', backgroundColor: Colors.gray, position: 'absolute', top: 0}}>
        {
          coverImage ?
            <TouchableOpacity onPress={() => pickImage()}
                              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{width: '100%', height: '100%'}}
                     source={{
                       uri: (coverImage.uri)
                     }}
              />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => pickImage()}
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{backgroundColor: 'rgba(255,255,255,0.7)', padding: 10, borderRadius: 100}}>
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

        <KeyboardAwareScrollView extraScrollHeight={150}>
          <ScrollView showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}>
            <View style={{paddingBottom: 200}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                <TextInput placeholder={'ใส่ชื่อกิจกรรม'} placeholderTextColor={Colors.gray}
                           style={{fontFamily: Fonts.bold, fontSize: FontSize.large}}
                           onChange={(e) => setEventDetail({...eventDetail, eventName: e.nativeEvent.text})}/>
              </View>

              <View style={{marginTop: 10}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.medium
                }}>แท็ก
                </Text>
                <View style={{
                  flex: 1,
                  height: 80,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}>
                  {
                    tags.map((item, index) => (
                      <TouchableOpacity key={index} onPress={async () => {

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
                        )

                        setEventDetail({...eventDetail, tags: newTags.filter(tag => tag !== undefined)})

                      }}>
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 80,
                          height: 30,
                          backgroundColor: (item.isSelect ? Colors.primary : Colors.gray),
                          margin: 3,
                          borderRadius: 8,
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small
                          }}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={'mail-open-outline'} color={Colors.primary} size={35}/>
                </View>
                <View style={{marginLeft: 20}}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    {
                      kinds.map((item, index) => (
                        <TouchableOpacity onPress={() => {
                          if (index === 0) {
                            setKinds([{name: 'ออนไซต์', en_name: 'ONSITE', isSelect: true},
                              {name: 'ออนไลน์', en_name: 'ONLINE', isSelect: false}])
                          } else {
                            setKinds([{name: 'ออนไซต์', en_name: 'ONSITE', isSelect: false},
                              {name: 'ออนไลน์', en_name: 'ONLINE', isSelect: true}])
                          }
                          setEventDetail({...eventDetail, type: item.en_name})
                        }} key={index}>
                          <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 80,
                            height: 30,
                            backgroundColor: (item.isSelect ? Colors.primary : Colors.gray),
                            margin: 3,
                            borderRadius: 8,
                          }}>
                            <Text style={{
                              fontFamily: Fonts.primary,
                              fontSize: FontSize.small
                            }}>
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  <Image style={{
                    width: '100%',
                    height: '100%'
                  }}
                         source={{
                           uri: userData?.profileUrl
                         }}
                  />
                </View>
                <View style={{marginLeft: 20}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={{
                      fontFamily: Fonts.primary,
                      fontSize: FontSize.small
                    }}>{userData?.username}</Text>
                  </View>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={'mail-open-outline'} color={Colors.primary} size={35}/>
                </View>
                <View style={{marginLeft: 20}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={{
                      fontFamily: Fonts.primary,
                      fontSize: FontSize.small
                    }}>{userData?.email}</Text>
                  </View>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
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

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableOpacity style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name={'people-sharp'} color={Colors.primary} size={35}/>
                </TouchableOpacity>
                <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.primary
                  }}>จำนวนผู้เข้าร่วมสูงสุด</Text>
                  <TextInput keyboardType={"number-pad"} maxLength={2}
                             onChange={(e) => setEventDetail({...eventDetail, numberOfPeople: e.nativeEvent.text})}
                             style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}
                             value={eventDetail.numberOfPeople.toString()}/>
                </View>
              </View>

              <View style={{display: 'flex', width: '80%', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableOpacity onPress={() => {
                  props.navigation.navigate('GoogleMap')
                }} style={{
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
                  <Text numberOfLines={1}
                        style={{
                          fontFamily: Fonts.primary,
                          fontSize: FontSize.primary
                        }}>{(eventDetail.location === null ? 'สถานที่จัดกิจกรรม' : eventDetail.location)}</Text>
                </View>
              </View>

              {
                (eventDetail?.location !== null &&
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                    <MapView
                      scrollDuringRotateOrZoomEnabled={false}
                      zoomControlEnabled={false}
                      zoomEnabled={false}
                      rotateEnabled={false}
                      showsTraffic={true}
                      scrollEnabled={false}
                      provider={"google"}
                      followsUserLocation={true}
                      ref={mapRef}
                      initialRegion={{
                        latitude: eventDetail.latitude,
                        longitude: eventDetail.longitude,
                        latitudeDelta: 0.0116193304764995,
                        longitudeDelta: 0.01165230321884155
                      }}
                      style={{
                        borderRadius: 15,
                        width: Dimensions.get("window").width - 30,
                        height: Dimensions.get("window").height / 5
                      }}>
                      <Marker
                        image={'https://cdn.discordapp.com/emojis/855437648718069771.webp?size=96&quality=lossless'}
                        coordinate={{latitude: eventDetail.latitude, longitude: eventDetail.longitude}}/>
                    </MapView>
                  </View>)
              }

              <View style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                  รายระเอียดกิจกรรม
                </Text>
                <View style={{display: 'flex', width: '95%', marginTop: 5}}>
                  <TextInput style={{fontFamily: Fonts.primary}} multiline={true}
                             value={eventDetail.description}
                             onChange={(e) => setEventDetail({...eventDetail, description: e.nativeEvent.text})}/>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                <Button onPress={() => onSubmit()} title={'สร้างกิจกรมม'}/>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        {
          ((isEditTime && !isEndTime && Platform.OS !== "android") &&
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                width: '100%',
                height: 'auto',
                bottom: 170,
                left: 15,
                padding: 10,
                borderRadius: 15,
                backgroundColor: 'rgba(000,000,000,0.8)'
              }}>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.primary,
                textAlign: 'center',
                color: Colors.white
              }}>กำหนดวันเวลาเริ่มกิจกรรม</Text>

              <RNDateTimePicker
                minimumDate={new Date()}
                style={{height: 100, fontFamily: Fonts.primary}}
                textColor={Colors.primary}
                display="spinner" locale={'th'}
                mode="datetime"
                value={eventDetail.startDate}
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
          ((isEndTime && Platform.OS !== "android") &&
            <View style={{
              position: 'absolute',
              display: 'flex',
              width: '100%',
              height: 'auto',
              bottom: 170,
              left: 15,
              padding: 10,
              borderRadius: 15,
              backgroundColor: 'rgba(000,000,000,0.8)'
            }}>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.primary,
                color: Colors.white,
                textAlign: 'center'
              }}>กำหนดเวลาสิ้นสุดกิจกรรม
              </Text>
              <RNDateTimePicker style={{height: 100, fontFamily: Fonts.primary}} textColor={Colors.primary}
                                display="spinner"
                                locale={'th'}
                                mode="time"
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

        {
          ((isEditTime && !isEndTime && Platform.OS === "android") &&
            <View>
              <RNDateTimePicker
                minimumDate={new Date()}
                style={{height: 100, fontFamily: Fonts.primary}}
                textColor={Colors.primary}
                display="default"
                locale={'th'}
                mode="date"
                value={eventDetail.startDate}
                onChange={(event, date) => {
                  if(event.type !== "dismissed"){
                    changeDateTime(event, date)
                    setIsEndTime(!isEndTime)
                  }
                }}
              />
            </View>
          )
        }

        {
          ((isEndTime && Platform.OS === "android") &&
            <View>
              <RNDateTimePicker
                minimumDate={new Date()}
                style={{height: 100, fontFamily: Fonts.primary}}
                textColor={Colors.primary}
                display="default"
                locale={'th'}
                mode="time"
                value={eventDetail.startDate}
                onChange={(event, date) => {
                  console.log(date)
                  if(event.type !== "dismissed"){
                    setEventDetail({...eventDetail, endDate: date})
                    setIsEditTime(!isEditTime)
                    setIsEndTime(!isEndTime)
                  }
                }}
              />
            </View>
          )
        }
      </View>
    </View>
  )

  return (
    (isLoad ?
        <SafeAreaView>
          <View>
            <Text> Load...</Text>
          </View>
        </SafeAreaView> : renderUI()
    )
  )
};

export default CreateEventScreen;
