import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import FormData from "form-data";
import eventsService from "../services/eventsService";
import {useIsFocused} from "@react-navigation/native";
import fontSize from "../constants/FontSize";
import Mapin from  "../assets/images/pin.png"
import {trim} from "react-native-axios/lib/utils";

const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')

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

const kind = [
  {name: 'ออนไซต์', en_name: 'ONSITE', isSelect: true},
  {name: 'ออนไลน์', en_name: 'ONLINE', isSelect: false}
]

const CreateEventScreen = (props) => {
  const [isLoad, setIsLoad] = useState(true)
  const [coverImage, setCoverImage] = useState(null)
  const [isEditTime, setIsEditTime] = useState(false)
  const [isEndTime, setIsEndTime] = useState(false)
  const [isAnEditDate, setIsAnEditDate] = useState(false)
  const [isAnEditTime, setIsAnEditTime] = useState(false)
  const [isAnEndTime, setIsAnEndTime] = useState(false)
  const [tags, setTags] = useState(tagss)
  const [kinds, setKinds] = useState(kind)
  const [eventDetail, setEventDetail] = useState({
    type: "ONSITE",
    tags: [],
    eventName: null,
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: null,
    latitude: -1,
    longitude: -1,
    description: null,
    numberOfPeople: 2,
    memberId: null
  })
  const {user} = useSelector(state => state.user)
  const userData = JSON.parse(user)
  const mapRef = createRef();
  const isFocused = useIsFocused();
  const input_num = useRef()
  const input_loc = useRef()
  const [waitSub, setWaitSub] = useState(false)
  const [error, setError] = useState({
    eventName: null,
    startDate: null,
    tags: null,
    numberOfPeople: null,
    location: null,
    description: null,
    all: true
  })
  // useEffect(() => {
  //   if (isFocused === false) {
  //     setEventDetail({
  //       type: "ONSITE",
  //       tags: [],
  //       eventName: 'ชื่อกิจกรรม',
  //       startDate: new Date(),
  //       endDate: new Date(),
  //       location: null,
  //       latitude: 0,
  //       longitude: 0,
  //       description: 'ใส่รายละเอียดกิจกรรม',
  //       numberOfPeople: 0,
  //       memberId: null
  //     })
  //     setIsLoad(true)
  //     setCoverImage(null)
  //     setKinds(kind)
  //     setTags(tagss)
  //   }
  // }, [isFocused])

  useEffect(() => {
    if (userData !== undefined && userData !== null) {
      console.log("setMemberId")
      setEventDetail({...eventDetail, memberId: userData?.id})
    }
  }, [])

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
        setError({...error, location: null})
      }, 100)
    }
  }, [props])

  useEffect(() => {
      let count = 1
      for (const [key, value] of Object.entries(eventDetail)) {
        switch (key) {
          case "eventName":
            if (value === '' || value === undefined || value === null) {
              count += 1
              setError({...error, eventName: "ชื่อกิจกรรมต้องไม่เป็นช่องว่าง", all: true})
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, eventName: null})
              } else {
                setError({...error, all: true, eventName: null})
              }
            }

            break
          case "startDate":
            if (new Date(value).getDate() <= new Date().getDate() + 3) {
              count += 1
              setError({...error, startDate: "วันเริ่มกิจกรรมต้องหากจากวันปัจจุบันอย่างน้อย 3 วัน", all: true})
            } else if (new Date(value).getHours() > new Date(eventDetail.endDate).getHours()) {
              count += 1
              setError({...error, startDate: "เวลาสิ้นสุดกิจกรรมต้องมากกว่าเวลาเริ่มต้นกิจกรรม", all: true})
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, startDate: null})
              } else {
                setError({...error, all: true, startDate: null})
              }
            }
            break
          case "tags":
            if (value.length === 0) {
              count += 1
              setError({...error, tags: "ต้องระบุแท็กอย่างน้อย 1 แท็ก", all: true})
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, tags: null})
              } else {
                setError({...error, all: true, tags: null})
              }
            }
            break
          case "numberOfPeople":
            if (value < 2) {
              count += 1
              setError({...error, numberOfPeople: "จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 2 คน", all: true})
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, numberOfPeople: null})
              } else {
                setError({...error, all: true, numberOfPeople: null})
              }
            }
            break
          case "location":

            if (value !== '' && value !== undefined && value !== null && eventDetail.type === "ONLINE") {
              const http = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
              console.log(http.test(value))
              if (!http.test(value)) {
                count += 1
                setError({...error, location: ("ลิงค์กิจกรรมไม่ถูกต้อง")})
              } else {
                count -= 1
                if (count === 0) {
                  setError({...error, all: false, location: null})
                } else {
                  setError({...error, all: true, location: null})
                }
              }
            } else if (value === '' || value === undefined || value === null) {
              count += 1
              setError({
                ...error,
                location: (eventDetail.type === "ONSITE" ? "สถานที่กิจกรรมต้องไม่เป็นช่องว่าง" : "ลิงค์กิจกรรมต้องไม่ว่าง"),
                all: true
              })
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, location: null})
              } else {
                setError({...error, all: true, location: null})
              }
            }
            break
          case "description":
            if (value === '' || value === undefined || value === null) {
              count += 1
              setError({...error, description: "รายละเอียดกิจกรรมต้องไม่เป็นช่องว่าง", all: true})
            } else {
              count -= 1
              if (count === 0) {
                setError({...error, all: false, description: null})
              } else {
                setError({...error, all: true, description: null})
              }
            }
            break
          default:
            count += 1
            if (count === 0) {
              setError({...error, all: false})
            } else {
              setError({...error, all: true})
            }
            setIsLoad(false)
            break
        }
      }
    }
    ,
    [eventDetail]
  )

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
    setEventDetail({
      ...eventDetail,
      startDate: date,
      endDate: new Date(new Date(date).setHours(new Date(date).getHours() + 1))
    })
  }

  const onSubmit = async () => {
    let newEventDetail = {
      ...eventDetail,
      startDate: moment(eventDetail.startDate).unix() * 1000,
      endDate: moment(eventDetail.endDate).unix() * 1000
    }
    const filename = coverImage?.uri.toString().split('/').pop()
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const data = new FormData();
    data.append('coverImage', coverImage ? {uri: coverImage.uri, name: filename, type: type} : null);
    data.append('eventInfo', JSON.stringify(newEventDetail));

    console.log(newEventDetail)
    setWaitSub(true)
    eventsService.createEvent(data).then(async res => {
      if (res.status === 200) {
        await setEventDetail({
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
        await setCoverImage(null)
        await setKinds(kind)
        await setTags(tagss)
        await setWaitSub(false)
        await setIsLoad(true)
        await setError({
          eventName: null,
          startDate: null,
          tags: null,
          numberOfPeople: null,
          location: null,
          description: null,
          all: true
        })

        await props.navigation.navigate('Feed')

      }
    }).catch(error => {
      console.log(error)
    })
  }

  const renderUI = () => (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {
        (waitSub && <View style={{
          position: "absolute",
          flex: 1,
          width: "100%",
          height: (Platform.OS === 'ios' ? "100%" : '100%'),
          top: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(0,0,0,0.25)",
          zIndex: 50
        }}>
          <ActivityIndicator size={75} color={Colors.primary}/>
        </View>)
      }
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

        <KeyboardAwareScrollView
          extraScrollHeight={200}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <ScrollView showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingBottom: 100}}
          >
            <View style={{paddingBottom: 200}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
                <TextInput placeholder={'ใส่ชื่อกิจกรรม'} placeholderTextColor={Colors.lightgray}
                           style={{fontFamily: Fonts.bold, fontSize: FontSize.large}}
                           onChange={(e) => {
                             setEventDetail({...eventDetail, eventName: e.nativeEvent.text})
                             if (e.nativeEvent.text === "" && Platform.OS === "ios") {
                               setError({...error, eventName: "ชื่อกิจกรรมต้องไม่เป็นช่องว่าง"})
                             } else {
                               setError({...error, eventName: null})
                             }
                           }}/>
              </View>
              {(error.eventName &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.eventName}</Text>
                </View>)}

              <View style={{marginTop: 10}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.medium
                }}>แท็ก
                </Text>
                <View style={{
                  flex: 1,
                  height: 110,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
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
                        ).filter(tag => tag !== undefined)

                        if (newTags.length === 0 && Platform.OS === "ios") {
                          setError({...error, tags: "ต้องระบุแท็กอย่างน้อย 1 แท็ก"})
                        } else {
                          setError({...error, tags: null})
                        }
                        setEventDetail({...eventDetail, tags: newTags})
                      }}>
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 80,
                          height: 30,
                          backgroundColor: (item.isSelect ? Colors.primary : Colors.lightgray),
                          margin: 3,
                          borderRadius: 8,
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: (item.isSelect ? Colors.white : Colors.black)
                          }}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
              {(error.tags &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.tags}</Text>
                </View>)}

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={(eventDetail.type === "ONSITE" ? 'ios-home-outline' : 'ios-globe-outline')}
                            color={Colors.primary} size={35}/>
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
                            backgroundColor: (item.isSelect ? Colors.primary : Colors.lightgray),
                            margin: 3,
                            borderRadius: 8,
                          }}>
                            <Text style={{
                              fontFamily: Fonts.primary,
                              fontSize: FontSize.small,
                              color: (item.isSelect ? Colors.white : Colors.black)
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
                    }}>{trim(userData?.email)}</Text>
                  </View>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableOpacity onPress={() => {
                  setIsEditTime(!isEditTime)
                  setIsAnEditDate(!isAnEditDate)
                }} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name={'calendar-sharp'} color={Colors.primary} size={35}/>
                </TouchableOpacity>
                <View
                  style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
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

              {(error.startDate &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.startDate}</Text>
                </View>)}

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableOpacity onPress={() => input_num.current.focus()} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name={'people-sharp'} color={Colors.primary} size={35}/>
                </TouchableOpacity>
                <View
                  style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.primary
                  }}>จำนวนผู้เข้าร่วมสูงสุด</Text>

                  <TextInput id={'number_people'} keyboardType={"number-pad"} maxLength={2}
                             placeholder={"10"}
                             placeholderTextColor={Colors.lightgray}
                             ref={input_num}
                             onChange={(e) => {
                               setEventDetail({...eventDetail, numberOfPeople: e.nativeEvent.text})
                               if ((parseInt(e.nativeEvent.text) < 2 || e.nativeEvent.text === '')&& Platform.OS === "ios") {
                                 setError({...error, numberOfPeople: "จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 2 คน"})
                               } else {
                                 setError({...error, numberOfPeople: null})
                               }
                             }}
                             style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}
                    // value={eventDetail.numberOfPeople.toString()}
                  />
                </View>
              </View>
              {(error.numberOfPeople &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.numberOfPeople}</Text>
                </View>)}

              <View style={{display: 'flex', width: '80%', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableOpacity onPress={() => {
                  (eventDetail.type === "ONSITE" ? props.navigation.navigate('GoogleMap') : input_loc.current.focus())
                }} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={(eventDetail.type === "ONSITE" ? 'ios-location-outline' : 'laptop-outline')}
                            size={35}
                            color={Colors.primary}/>
                </TouchableOpacity>
                <View
                  style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>

                  {
                    (eventDetail.type !== "ONSITE" ?
                      <View>
                        <Text style={{
                          fontFamily: Fonts.primary,
                          fontSize: FontSize.primary
                        }}>ลิงค์ในการเข้าร่วมกิจกรรม</Text>
                        <TextInput id={'number_people'} keyboardType={"web-search"}
                                   placeholder={"https://google.meet/acb/"}
                                   value={eventDetail.location}
                                   placeholderTextColor={Colors.lightgray}
                                   ref={input_loc}
                                   onChange={(e) => {
                                     setEventDetail({
                                       ...eventDetail, location: e.nativeEvent.text
                                     })

                                     // if (value !== '' && value !== undefined && value !== null && eventDetail.type === "ONLINE") {
                                     //   const http = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
                                     //   console.log(http.test(value))
                                     //   if(!http.test(value)){
                                     //     count += 1
                                     //     setError({...error, location: ("ลิงค์กิจกรรมไม่ถูกต้อง")})
                                     //   }else{
                                     //     count -= 1
                                     //     if (count === 0) {
                                     //       setError({...error, all: false, location: null})
                                     //     } else {
                                     //       setError({...error, all: true, location: null})
                                     //     }
                                     //   }
                                     // }
                                     if (e.nativeEvent.text === "" && Platform.OS === "ios") {
                                       setError({
                                         ...error,
                                         location: (eventDetail.type === "ONSITE" ? "สถานที่กิจกรรมต้องไม่เป็นช่องว่าง" : "ลิงค์กิจกรรมต้องไม่เป็นช่องว่าง")
                                       })
                                     } else if (e.nativeEvent.text !== '' && e.nativeEvent.text !== undefined && e.nativeEvent.text !== null && eventDetail.type === "ONLINE" && Platform.OS === "ios") {
                                       const http = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
                                         if(!http.test(e.nativeEvent.text)){
                                           setError({...error, location: ("ลิงค์กิจกรรมไม่ถูกต้อง")})
                                         }else {
                                           setError({...error, location: null})
                                         }
                                     }else if (e.nativeEvent.text !== "" || eventDetail.location !== null || eventDetail.location !== "") {
                                       setError({...error, location: null})
                                     }
                                   }}


                                   style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}
                        />
                      </View>
                      : <Text numberOfLines={1}
                              style={{
                                fontFamily: Fonts.primary,
                                fontSize: FontSize.primary
                              }}>{(eventDetail.location === null ? 'สถานที่จัดกิจกรรม' : eventDetail.location)}
                      </Text>)
                  }

                </View>
              </View>
              {(error.location &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.location}</Text>
                </View>)}

              {
                ((eventDetail?.location !== null && eventDetail?.latitude !== -1 && eventDetail.type === "ONSITE") &&
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
                        image={Mapin}
                        coordinate={{latitude: eventDetail.latitude, longitude: eventDetail.longitude}}/>
                    </MapView>
                  </View>)
              }

              <View style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                  รายระเอียดกิจกรรม
                </Text>
                <View style={{display: 'flex', width: '95%', marginTop: 5}}>
                  <TextInput style={{fontFamily: Fonts.primary, fontSize: fontSize.small}} multiline={true}
                    // value={eventDetail.description}
                             placeholder={"ใส่รายละเอียดกิจกรรม"}
                             placeholderTextColor={Colors.lightgray}
                             onChange={(e) => {
                               setEventDetail({...eventDetail, description: e.nativeEvent.text})
                               if (e.nativeEvent.text === "" && Platform.OS === "ios") {
                                 setError({...error, description: "ต้องระบุรายละเอียดกิจกรรม"})
                               } else {
                                 setError({...error, description: null})
                               }
                             }}/>
                </View>
              </View>
              {(error.description &&
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.red
                  }}>{error.description}</Text>
                </View>)}

              <View style={{flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <TouchableOpacity activeOpacity={0.8}
                                  disabled={error.all}
                                  onPress={() => onSubmit()}>
                  <View style={{
                    width: 340,
                    height: 60,
                    backgroundColor: (error.all ? Colors.gray : Colors.primary),
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.primary,
                      color: Colors.white
                    }}>สร้างกิจกรรม</Text>
                  </View>
                </TouchableOpacity>
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
                onChange={(event, date) => {
                  changeDateTime(event, date)
                  if (Platform.OS === "ios" && new Date(date).getDate() <= new Date().getDate() + 3) {
                    setError({
                      ...error,
                      startDate: "วันเริ่มกิจกรรมต้องหากจากวันปัจจุบันอย่างน้อย 3 วัน"
                    })
                  } else {
                    setError({...error, startDate: null})
                  }
                }}/>

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
                                onChange={(event, date) => {
                                  setEventDetail({...eventDetail, endDate: date})

                                  if (Platform.OS === "ios" && eventDetail.startDate.getDate() < new Date().getDate() + 3) {
                                    setError({
                                      ...error,
                                      startDate: "วันเริ่มกิจกรรมต้องหากจากวันปัจจุบันอย่างน้อย 3 วัน"
                                    })
                                  } else if (Platform.OS === "ios" && eventDetail.startDate.getHours() > date.getHours()) {
                                    setError({
                                      ...error,
                                      startDate: "เวลาสิ้นสุดกิจกรรมต้องมากกว่าเวลาเริ่มต้นกิจกรรม"
                                    })
                                  } else {
                                    setError({...error, startDate: null})
                                  }
                                }
                                }/>
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
          ((isAnEditDate && !isAnEditTime && !isAnEndTime && Platform.OS === "android") &&
            <View>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.primary,
                color: Colors.white,
                textAlign: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 50
              }}>กำหนดเวลาสิ้นสุดกิจกรรม
              </Text>
              <RNDateTimePicker
                minimumDate={new Date()}
                textColor={Colors.pink}
                display="default"
                style={{background: Colors.primary}}
                locale={'th'}
                mode="date"
                value={eventDetail.startDate}
                onChange={(event, date) => {
                  if (event.type !== "dismissed") {
                    changeDateTime(event, date)
                    setIsAnEditTime(!isAnEditTime)
                  }
                }
                }
              />
            </View>
          )
        }

        {
          ((isAnEditDate && isAnEditTime && !isAnEndTime && Platform.OS === "android") &&
            <View>
              <RNDateTimePicker
                positiveButtonLabel="ตกลง"
                minimumDate={new Date()}
                style={{height: 100, fontFamily: Fonts.primary}}
                textColor={Colors.primary}
                display="default"
                locale={'th'}
                mode="time"
                value={eventDetail.startDate}
                onChange={(event, date) => {
                  if (event.type !== "dismissed") {
                    setEventDetail({
                      ...eventDetail,
                      startDate: date,
                      endDate: new Date(new Date(date).setHours(new Date(date).getHours() + 1))
                    })
                    setIsAnEndTime(!isAnEndTime)
                  }
                }}
              />
            </View>
          )
        }

        {
          ((isAnEditDate && isAnEditTime && isAnEndTime && Platform.OS === "android") &&
            <View>
              <RNDateTimePicker
                minimumDate={new Date()}
                display="default"
                locale={'th'}
                mode="time"
                value={eventDetail.endDate}
                onChange={(event, date) => {
                  if (event.type !== "dismissed" && event.nativeEvent.timestamp !== null) {
                    setEventDetail({...eventDetail, endDate: date})
                    setIsAnEditTime(false)
                    setIsAnEditDate(false)
                    setIsAnEndTime(false)
                  }
                }}
              />
            </View>
          )
        }
      </View>
    </View>
  )

  return (isLoad ?
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
      </SafeAreaView> : (user ? renderUI() : <SafeAreaView></SafeAreaView>)
  )
};

export default CreateEventScreen;