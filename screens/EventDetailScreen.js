import React, {useEffect, useState} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment/moment";
import {useDispatch, useSelector} from "react-redux";
import decode from "../services/decode";
import {getUserToken} from "../actions/user";
import fontSize from "../constants/FontSize";
import eventsService from "../services/eventsService";
import AwesomeAlert from "react-native-awesome-alerts";

const EventDetailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState(null)
  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showConfirmCancelEvent, setShowConfirmCancelEvent] = useState(false)
  const [showRegisterEvent, setShowRegisterEvent] = useState(false)
  const [isRegister, setIsRegister] = useState(null)
  const dispatch = useDispatch();
  const { userToken, userError } = useSelector(state => state.user)

  useEffect(()=>{
    if(props.route.params.QRcode){
      console.log(props)
    }
  },[props])

  useEffect(() => {
    dispatch(getUserToken())
    getEvent()
  }, [])

  useEffect(()=> {
    if(userData !== null && event !== null){
      eventsService.isRegisterEvent(userData.memberId, event.id).then(res => {
        setIsRegister(res.data.isRegister)
      })
    }
  },[userData])

  useEffect(()=> {
    if(userToken !== null){
      setUserData(decode.jwt(JSON.parse(userToken).idToken))
      setIsLogin(true)
    }
  }, [userToken])

  const getEvent = async () => {
    await setEvent(props.route.params.item)
    await setIsLoading(false)
  }

  const onLoadImage = () => {
    checkPlatform()
    setTimeout(() => {
      setIsLoading(true)
    }, 1000)
  }

  const hideAlert = () => {
    setShowConfirmCancelEvent(false)
    setShowRegisterEvent(false)
  };

  const checkPlatform = () => {
    const platform = ['Discord', 'Zoom', 'Google', 'Microsoft']
    platform.map(items => {
      if (event.location.includes(items.toLocaleLowerCase())) {
        event.location = items
      }
    })
  }

  const onUnregisterEvent = async () => {
    await eventsService.unRegisterEvent(userData.memberId, event.id).then( res => {
      if( res.status === 200 ){
        setIsRegister(false)
      }
    }).catch(e => {
      console.log('unRegisterEvent: ' + e.message)
    })
    await hideAlert()
  }

  const onRegisterEvent = async () => {
    await eventsService.registerEvent(userData.memberId, event.id).then( res => {
      if(res.status === 200){
        setIsRegister(true)
      }
    }).catch(e => {
      console.log('RegisterEvent: ' + e.message)
    })
    await hideAlert()
  }

  const checkButton =()=>{
    if(isRegister && isLogin){
      return(
          <TouchableOpacity activeOpacity={0.8} disabled={!isLogin} onPress={()=> setShowConfirmCancelEvent(true)}>
            <View style={{width: 340, height: 60, backgroundColor: (isLogin ? Colors.yellow : Colors.gray), borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, color: Colors.white}}>ยกเลิกการเข้าร่วมกิจกรรม</Text>
            </View>
          </TouchableOpacity>
      )
    }else{
      return(
          <TouchableOpacity activeOpacity={0.8} disabled={!isLogin} onPress={()=> setShowRegisterEvent(true)}>
            <View style={{width: 340, height: 60, backgroundColor: (isLogin ? Colors.primary : Colors.gray), borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, color: Colors.white}}>เข้าร่วมกิจกรรม</Text>
            </View>
          </TouchableOpacity>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageCover}>
        <Image style={styles.image}
               source={{
                 uri: (isLoading ? event.coverImageUrl : 'https://cdn.dribbble.com/users/1284666/screenshots/6321168/__3.gif')
               }}
               onLoad={onLoadImage}
        />
      </View>
      <View style={styles.content}>
        <ScrollView  showsVerticalScrollIndicator={false} style={{ flex: 1, paddingLeft: 15, paddingRight: 15}}>
          <View style={{paddingBottom: 200}}>
            <Text style={styles.title}>{event?.eventName}</Text>
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
                  <Text style={styles.sub_title}>{moment(event?.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
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
                <Ionicons name={event?.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={35}
                          color={Colors.primary}/>
              </View>
              <View style={{height: 50, marginLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.sub_title}>
                  {
                    event?.location
                  }
                </Text>
                {
                  event?.type === "ONLINE" ?
                    <Text style={styles.sub_title}>LINK</Text>
                    : null
                }
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
            <View style={{marginTop : 20}}>
              <Text style={styles.sub_title}>
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
                checkButton()
              }
            </View>
            <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity activeOpacity={0.8} disabled={!isLogin} onPress={()=> console.log(props.navigation.navigate('Scanner', {event: event}))}>
                <View style={{width: 340, height: 60, backgroundColor: (isLogin ? Colors.yellow : Colors.gray), borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, color: Colors.white}}>เช็คอิน</Text>
                </View>
              </TouchableOpacity>
            </View>
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
          confirmButtonColor= {Colors.primary}
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
