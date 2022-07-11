import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment/moment";
import monthThai from "../constants/MonthThai";

import {toBuddhistYear} from "../constants/Buddhist-year";
//
// item.type === 'ONLINE' ? platform.map(items => {
//   if(item.location.includes(items.toLocaleLowerCase())){
//     return items
//   }
// }) : item.location.slice(0, 18)+'...'


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
    checkPlatform()
    setTimeout(() => {
      setIsLoading(true)
    }, 1000)
  }

  const checkPlatform = () => {
    const platform = ['Discords', 'Zoom', 'Google', 'Microsoft']
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
      {
        isLoading ?
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
              <View style={{marginLeft: 10}}>
                <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={styles.sub_title}>{moment(event.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
                  <Text
                    style={styles.message}>{moment.weekdaysShort(event.startDate) + ', ' + moment(event.startDate).format("HH:mm A") + ' - ' + moment(event.endDate).format("HH:mm A")}</Text>
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
                <Ionicons name={event?.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={35}
                          color={Colors.primary}/>
              </View>
              <View style={{height: 50, marginLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.sub_title}>
                  {
                    event.location
                  }
                </Text>
                {
                  event.type === "ONLINE" ?
                    <Text style={styles.sub_title}>LINK</Text>
                    : null
                }
              </View>
            </View>
          </View>
          :
          <View style={styles.content}>
            <View style={{flex:0.7 , justifyContent: 'center'}}>
              <Text style={{textAlign:'center'}}>Loading..</Text>
            </View>

          </View>
      }

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
    height: 250,
    overflow: 'hidden'
  },
  content: {
    position: 'relative',
    top: 180,
    flex: 1,
    flexDirection: 'column',
    padding: 10,
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
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    marginTop: 20,
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
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
