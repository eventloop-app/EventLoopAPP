import React, {createRef, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import fontSize from "../constants/FontSize";
import eventsService from "../services/eventsService";
import AwesomeAlert from "react-native-awesome-alerts";
import MapView, {Marker} from "react-native-maps";
import {wrap} from "@babel/runtime/helpers/regeneratorRuntime";

const EventDetailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showConfirmCancelEvent, setShowConfirmCancelEvent] = useState(false)
  const [showRegisterEvent, setShowRegisterEvent] = useState(false)
  const [isRegister, setIsRegister] = useState(null)
  const {user} = useSelector(state => state.user)
  const [isCheckIn, setIsCheckIn] = useState(false)
  const [CheckInCode, setCheckInCode] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const mapRef = createRef();

  useEffect(() => {
    if (props.route.params.QRcode) {
      console.log('QRCODE')
      setTimeout(async () => {
        await CheckInByQrCode()
      }, 500)
    }
  }, [props])

  useEffect(() => {
      console.log("Check User")
      setUserData(user)
      getEvent()
  }, [])

  // useEffect(()=>{
  //   console.log('EventDetail')
  //   getEvent()
  // },[])

  useEffect(() => {
    if (userData !== null && event !== null) {
      eventsService.isRegisterEvent(userData.id, event.id).then(res => {
        setIsRegister(res.data.isRegister)
      }).catch(e => {
        console.log("CheckUserRegisterEventError:", e.message)
      })
      if (userData.email === event.email) {
        console.log('Is owner event')
        setIsOwner(true)
      }
      CheckUserCheckIn()
    }
  }, [event])

  useEffect(() => {
    if (user !== null) {
      setUserData(JSON.parse(user))
      setIsLogin(true)
    }
  }, [user])

  const CheckUserCheckIn = () => {
    eventsService.isCheckIn(userData.id, event.id).then(async res => {
      if (res.status === 200 && res.data.isCheckIn === true) {
        setIsCheckIn(true)
        await console.log('User is Checked in !')
      } else {
        await console.log('User not Check in !')
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const CheckInByQrCode = () => {
    eventsService.checkInByCode(userData.id, props.route.params.QRcode, event.id).then(res => {
      if (res.status === 200) {
        console.log('Pass')
        alert(`ยืนยันการเช็คอินเรียบร้อยแล้ว`)
        setIsCheckIn(true)
      }
    })
  }

  const getEvent = async () => {
    const evId = props.route.params.item.id
    // await setEvent(props.route.params.item)
    eventsService.getEventById(evId).then(res => {
      console.log("get event")
      if (res.status === 200) {
        setEvent(res.data)
        setTimeout(()=>{
          setIsLoading(false)
        },1000)
      }
    }).catch(e =>{
      console.log(e)
      props.navigation.navigate('Error')
    })

    return;
  }

  const hideAlert = () => {
    setShowConfirmCancelEvent(false)
    setShowRegisterEvent(false)
  };

  const onUnregisterEvent = async () => {
    await eventsService.unRegisterEvent(userData.id, event.id).then(res => {
      if (res.status === 200) {
        setIsRegister(false)
      }
    }).catch(e => {
      console.log('unRegisterEvent: ' + e.message)
    })
    await hideAlert()
  }

  const onRegisterEvent = async () => {
    await eventsService.registerEvent(userData.id, event.id).then(res => {
      if (res.status === 200) {
        setIsRegister(true)
      }
    }).catch(e => {
      console.log('RegisterEvent: ' + e.message)
    })
    await hideAlert()
  }

  const checkButton = () => {
    if (isRegister && isLogin && !isCheckIn) {
      return (
        <TouchableOpacity activeOpacity={0.8} disabled={!isLogin}
                          onPress={() => setShowConfirmCancelEvent(true)}>
          <View style={{
            width: 340,
            height: 60,
            backgroundColor: (isLogin ? Colors.yellow : Colors.gray),
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.white
            }}>ยกเลิกการเข้าร่วมกิจกรรม</Text>
          </View>
        </TouchableOpacity>
      )
    } else if (isRegister && isLogin && isCheckIn) {
      return (
        <TouchableOpacity activeOpacity={0.8} disabled={!isLogin}
                          onPress={() => props.navigation.navigate('ReviewEvent')}>
          <View style={{
            width: 360,
            height: 60,
            backgroundColor: (isLogin ? Colors.primary : Colors.gray),
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.white
            }}>รีวิวกิจกรรม</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity activeOpacity={0.8} disabled={!isLogin} onPress={() => setShowRegisterEvent(true)}>
          <View style={{
            width: 340,
            height: 60,
            backgroundColor: (isLogin ? Colors.primary : Colors.gray),
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.white
            }}>เข้าร่วมกิจกรรม</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  return (
      <View style={styles.container}>
        {(isLoading && <SafeAreaView style={{position: 'absolute', flex: 1, width: '100%', height: "100%", zIndex: 50}}>
          <View style={{flex: 1, backgroundColor: Colors.white, justifyContent: 'center', zIndex: 50}}>
            <ActivityIndicator size={'large'} color={Colors.primary}/>
            <Text style={{
              textAlign: 'center',
              fontFamily: Fonts.primary,
              fontSize: fontSize.primary,
              color: Colors.black,
              marginTop: 20
            }}>กำลังโหลดข้อมูลกิจกรรม</Text>
          </View>
        </SafeAreaView>)}
        <View style={styles.imageCover}>
          <Image style={styles.image}
                 source={{
                   uri: (event?.coverImageUrl)
                 }}
          />
        </View>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, paddingLeft: 15, paddingRight: 15}}>
            <View style={{paddingBottom: 200}}>
              <Text style={styles.title}>{event?.eventName}</Text>
              <View style={{marginTop: 10}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.medium
                }}>แท็ก
                </Text>
                <View style={{
                  flex: 1,
                  height: "auto",
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}>
                  {
                    event?.tags.map((item, index) => (
                      <View key={index} style={{
                        width: 'auto',
                        height: 30,
                        backgroundColor: (Colors.primary),
                        padding: 5,
                        borderRadius: 8,
                        margin: 3,
                      }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Colors.white,
                            textAlign: 'center'
                          }}>
                            {item}
                          </Text>
                        </View>

                      </View>
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
                  <Ionicons name={(event?.type === "ONSITE" ? 'ios-home-outline' : 'ios-globe-outline')} color={Colors.primary} size={35}/>
                </View>
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    {
                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 80,
                        height: 30,
                        backgroundColor: Colors.primary,
                        margin: 3,
                        borderRadius: 8,
                      }}>
                        <Text style={{
                          fontFamily: Fonts.primary,
                          fontSize: FontSize.small,
                          color: Colors.white
                        }}>
                          {event?.type}
                        </Text>
                      </View>
                    }
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 10}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  <Image style={styles.image}
                         source={{
                           uri: event?.profileUrl
                         }}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={styles.sub_title}>{event?.username}</Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 10}}>
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
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={styles.sub_title}>{event?.email}</Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 10}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={'calendar-sharp'} color={Colors.primary} size={35}/>
                </View>
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text
                      style={styles.sub_title}>{moment(event?.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
                    <Text
                      style={styles.message}>{moment.weekdaysShort(event?.startDate) + ', ' + moment(event?.startDate).format("HH:mm A") + ' - ' + moment(event?.endDate).format("HH:mm A")}</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 10}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name={event?.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'}
                            size={35}
                            color={Colors.primary}/>
                </View>
                <View style={{height: 50, marginLeft: 10, justifyContent: 'center'}}>
                  <Text numberOfLines={1} style={styles.sub_title}>
                    {
                      (event?.location?.name ?? "ไม่มีข้อมูล")
                    }
                  </Text>
                </View>
              </View>

              {
                ((event?.type === "ONSITE" && event?.location) &&
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                    <MapView
                      scrollDuringRotateOrZoomEnabled={false}
                      zoomControlEnabled={false}
                      zoomEnabled={false}
                      rotateEnabled={false}
                      showsTraffic={true}
                      scrollEnabled={false}
                      provider={"google"}
                      ref={mapRef}
                      followsUserLocation={true}
                      initialRegion={{
                        latitude: parseFloat(event?.location?.latitude) ,
                        longitude: parseFloat(event?.location?.longitude),
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
                        coordinate={{latitude: parseFloat(event?.location?.latitude), longitude: parseFloat(event?.location?.longitude)}}/>
                    </MapView>
                  </View>
                )
              }


              <View style={{marginTop: 20}}>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                  รายละเอียดกิจกรรม
                </Text>
                <View style={{marginTop: 10}}>
                  <Text style={styles.message}>
                    {event?.description}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                {
                  isOwner ? null : checkButton()
                }
              </View>
              {
                (isRegister && !isCheckIn) ?
                  <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={0.8} disabled={!isLogin}
                                      onPress={() => props.navigation.navigate('Scanner', {event: event})}>
                      <View style={{
                        width: 340,
                        height: 60,
                        backgroundColor: (isLogin ? Colors.green : Colors.gray),
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Text style={{
                          fontFamily: Fonts.bold,
                          fontSize: fontSize.primary,
                          color: Colors.white
                        }}>เช็คอิน</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  :
                  null
              }
            </View>
          </ScrollView>
        </View>

        <AwesomeAlert
          show={showConfirmCancelEvent}
          showProgress={false}
          messageStyle={{
            textAlign: 'left',
            fontFamily: Fonts.primary,
            fontSize: FontSize.small,
          }}
          titleStyle={{
            textAlign: 'center',
            fontFamily: Fonts.bold,
            fontSize: FontSize.primary,
          }}
          title="ยกเลิกการเข้าร่วมกิจกรรม"
          message="คุณแน่ใจหรือไม่ที่จะยกเลิกการเข้าร่วมกิจกรรม"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="ยกเลิก"
          confirmText="ตกลง"
          confirmButtonColor="#DD6B55"
          cancelButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          confirmButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          cancelButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            onUnregisterEvent()
          }}
        />

        <AwesomeAlert
          show={showRegisterEvent}
          showProgress={false}
          messageStyle={{
            textAlign: 'center',
            fontFamily: Fonts.primary,
            fontSize: FontSize.small,
          }}
          titleStyle={{
            textAlign: 'center',
            fontFamily: Fonts.bold,
            fontSize: FontSize.primary,
          }}
          title="เข้าร่วมกิจกรรม"
          message={`คุณแน่ใจที่จะเข้าร่วมกิจกรรม \n${event?.eventName}\n หรือไม่`}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="ยกเลิก"
          confirmText="ตกลง"
          cancelButtonColor={Colors.red}
          confirmButtonColor={Colors.primary}
          cancelButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          confirmButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          cancelButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            onRegisterEvent()
          }}
        />

        <AwesomeAlert
          show={showRegisterEvent}
          showProgress={false}
          messageStyle={{
            textAlign: 'center',
            fontFamily: Fonts.primary,
            fontSize: FontSize.small,
          }}
          titleStyle={{
            textAlign: 'center',
            fontFamily: Fonts.bold,
            fontSize: FontSize.primary,
          }}
          title="เข้าร่วมกิจกรรม"
          message={`คุณแน่ใจที่จะเข้าร่วมกิจกรรม \n${event?.eventName}\n หรือไม่`}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="ยกเลิก"
          confirmText="ตกลง"
          cancelButtonColor={Colors.red}
          confirmButtonColor={Colors.primary}
          cancelButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonStyle={{
            flex: 1,
            width: 70,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          confirmButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          cancelButtonTextStyle={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
          }}
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            onRegisterEvent()
          }}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageCover: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 200,
    overflow: 'hidden'
  },
  content: {
    top: 150,
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    marginTop: 20,
    fontFamily: Fonts.bold,
    fontSize: FontSize.large,
    textAlign: 'left'
  },
  sub_title: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.primary,
    textAlign: 'left'
  },
  message: {
    fontFamily: Fonts.primary,
    fontSize: FontSize.small,
    textAlign: 'left'
  }
})

export default EventDetailScreen;
