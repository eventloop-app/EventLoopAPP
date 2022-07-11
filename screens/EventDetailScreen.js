import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment/moment";
import monthThai from "../constants/MonthThai";

import {toBuddhistYear} from "../constants/Buddhist-year";

const EventDetailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    getEvent()
  }, [])

  const getEvent = async () => {
    console.log(props.route.params.item)
    await setEvent(props.route.params.item)
    await setIsLoading(false)
  }

  const onLoadImage = () => {
    setTimeout(() => {
      setIsLoading(true)
    }, 1000)
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
        <Text style={styles.title}>{event?.eventName}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 20}}>
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
          <View style={{ marginLeft: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text style={styles.sub_title}>{moment(event?.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
              <Text style={styles.message}>{moment.weekdaysShort(event?.startDate) + ', ' + moment(event?.startDate).format("HH:mm A") + ' - ' + moment(event?.endDate).format("HH:mm A")}</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginTop: 20}}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: 'rgba(214, 234, 248, 0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Ionicons name={event?.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={35} color={Colors.primary}/>
          </View>
          <View style={{ marginLeft: 10}}>
              <Text style={styles.sub_title}>{(event?.location ? event?.location : event?.platform)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  imageCover: {
    width: '100%',
    height: 200,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    overflow: 'hidden'
  },
  content: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
    textAlign: 'left'
  },
  sub_title: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.medium,
    textAlign: 'left'
  },
  message: {
    fontFamily: Fonts.primary,
    fontSize: FontSize.small,
    textAlign: 'left'
  }
})

export default EventDetailScreen;
