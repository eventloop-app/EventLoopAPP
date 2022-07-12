import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment/moment";
import {useDispatch, useSelector} from "react-redux";
import decode from "../services/decode";
import {getUserToken} from "../actions/user";
import fontSize from "../constants/FontSize";

const EventDetailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState(null)
  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState(null)
  const { userToken, userError } = useSelector(state => state.user)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserToken())
    getEvent()
  }, [])

  useEffect(()=> {
    if(userToken !== null){
      console.log(decode.jwt(JSON.parse(userToken).idToken))
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

  const checkPlatform = () => {
    const platform = ['Discord', 'Zoom', 'Google', 'Microsoft']
    platform.map(items => {
      if (event.location.includes(items.toLocaleLowerCase())) {
        event.location = items
      }
    })
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
        <ScrollView  showsVerticalScrollIndicator={false} style={{ flex: 1, paddingLeft: 10, paddingRight: 10}}>
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
              <TouchableOpacity activeOpacity={0.8} disabled={!isLogin} onPress={()=> Vibration.vibrate(10000)}>
                <View style={{width: 340, height: 60, backgroundColor: (isLogin ? Colors.primary : Colors.gray), borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, color: Colors.white}}>เข้าร่วมกิจกรรม</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
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
