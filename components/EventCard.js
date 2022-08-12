import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fontSize from "../constants/FontSize";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import moment from "moment";
import { toBuddhistYear } from "../constants/Buddhist-year";

const platform = ['Discord', 'Zoom', 'Google', 'Microsoft']

const EventCard = ({ item, onPress }) => {

  const eventName = item.eventName
  const [isLoading, setIsLoading] = useState(false)
  const eventDate = toBuddhistYear(moment(item.startDate), "DD/MM/YYYY")
  const eventTime = moment(item.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."
  const eventLocation = item.type === 'ONLINE' ? platform.map(items => {
    if (item.location.includes(items.toLocaleLowerCase())) {
      return items
    }
  }) : item.location.slice(0, 18) + '...'
  const ImageCover = item.coverImageUrl

  const checkPlatForm = (url) => {
    console.log(url)
    //
    // platform.map(item => url.includes(item))
    // return ""
  }

  const onLoadImage = () => {
    setTimeout(() => {
      setIsLoading(true)
    }, 1000)
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.shadowsButton} >

      <View style={styles.Container}>
        <View style={styles.ImageCover}>
          <Image
            style={styles.Image}
            source={{
              uri: (isLoading ? ImageCover : 'https://cdn.dribbble.com/users/1284666/screenshots/6321168/__3.gif')
            }}
            onLoad={onLoadImage}
          />
        </View>
        <View style={styles.DateBox}>
          <Text style={styles.TextDateBoxNum}>{moment(item.startDate).format("DD")}</Text>
          <Text style={styles.TextDateBox}>{moment.monthsShort(moment(item.startDate).month())}</Text>
        </View>
        <View style={styles.BookmarkBox}>
          <Ionicons name={'md-bookmark-outline'} size={25} color={Colors.red} />
        </View>
        <View style={styles.Title}>
          <Text numberOfLines={1} style={styles.TextTitle}>{(eventName.length >= 20 ? eventName.slice(0, 20) + "..." : eventName)}</Text>
        </View>
        <View style={styles.Date}>
          <Ionicons name={'calendar-sharp'} size={25} color={Colors.primary} />
          <Text style={styles.TextDate}>{eventDate}</Text>
        </View>
        <View style={styles.Time}>
          <Ionicons name={'ios-time-outline'} size={25} color={Colors.primary} />
          <Text style={styles.TextDate}>{eventTime}</Text>
        </View>
        <View style={styles.Location}>
          <Ionicons name={item.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={25} color={Colors.primary} />
          <Text style={styles.TextLocation}>{eventLocation}</Text>
        </View>
      </View>
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    width: 240,
    height: 300,
    backgroundColor: "white",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 15,
  },
  ImageCover: {
    position: "absolute",
    left: 9,
    top: 9,
    borderRadius: 15,
    width: 220,
    height: 160
  },
  Image: {
    borderRadius: 15,
    width: '100%',
    height: '100%',
  },
  DateBox: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    left: 18,
    top: 18,
    borderRadius: 8,
    width: 55,
    height: 55,
    backgroundColor: "white",
  },
  BookmarkBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 18,
    top: 18,
    borderRadius: 6,
    width: 30,
    height: 30,
    backgroundColor: "white",
  },
  Title: {
    position: "absolute",
    bottom: 95,
    left: 9
  },
  Date: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 65,
    left: 9,
  },
  Time: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 35,
    left: 9,
  },
  Location: {
    position: "absolute",
    bottom: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 9,
  },
  TextTitle: {
    fontFamily: Fonts.bold,
    fontSize: fontSize.medium,
    color: Colors.black,
    textAlign: 'left'
  },
  TextTime: {
    fontFamily: Fonts.primary,
    fontSize: fontSize.primary,
    color: Colors.black,
    textAlign: 'left',
    marginLeft: 5
  },
  TextDate: {
    fontFamily: Fonts.primary,
    fontSize: fontSize.primary,
    color: Colors.black,
    textAlign: 'left',
    marginLeft: 5
  },
  TextLocation: {
    fontFamily: Fonts.primary,
    fontSize: fontSize.primary,
    color: Colors.black,
    textAlign: 'left',
    marginLeft: 5
  },
  TextDateBoxNum: {
    fontFamily: Fonts.bold,
    fontSize: fontSize.big,
    color: Colors.black,
    textAlign: 'center',
  },
  TextDateBox: {
    fontFamily: Fonts.bold,
    fontSize: fontSize.medium,
    color: Colors.black,
    textAlign: 'center',
    marginTop: -15
  },
  shadowsButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 8,
    borderRadius: 15,
  }

});

export default EventCard;
