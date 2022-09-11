import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fontSize from "../constants/FontSize";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import moment from "moment";
import { toBuddhistYear } from "../constants/Buddhist-year";

const EventCard = ({ item, onPress }) => {
  console.log(item?.location?.name)
  const eventName = item?.eventName ?? 'ไม่มีข้อมูล'
  const [isLoading, setIsLoading] = useState(false)
  const eventDate = toBuddhistYear(moment(item?.startDate), "DD/MM/YYYY")
  const eventTime = moment(item?.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."
  const eventLocation = item?.location?.name ?? 'ไม่มีข้อมูล'
  const ImageCover = item?.coverImageUrl

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.shadowsButton} >
      <View style={styles.Container}>
        <View style={styles.ImageCover}>
          <Image
            style={styles.Image}
            source={{
              uri: (ImageCover)
            }}
          />
        </View>
        <View style={styles.DateBox}>
          <Text style={styles.TextDateBoxNum}>{moment(item.startDate).format("D")}</Text>
          <Text style={styles.TextDateBox}>{moment.monthsShort(moment(item.startDate).month())}</Text>
        </View>
        <View style={styles.BookmarkBox}>
          <Ionicons name={'md-bookmark-outline'} size={24} color={Colors.red} />
        </View>
        <View style={styles.Title}>
          <Text numberOfLines={1} style={styles.TextTitle}>{eventName}</Text>
        </View>
        <View style={styles.Date}>
          <Ionicons name={'calendar-sharp'} size={24} color={Colors.primary} />
          <Text style={styles.TextDate}>{eventDate}</Text>
        </View>
        <View style={styles.Time}>
          <Ionicons name={'ios-time-outline'} size={24} color={Colors.primary} />
          <Text style={styles.TextDate}>{eventTime}</Text>
        </View>
        <View style={styles.Location}>
          <Ionicons name={item.type === 'ONSITE' ? 'ios-map-outline' : 'laptop-outline'} size={25} color={Colors.primary} />
          <Text numberOfLines={1} style={styles.TextLocation}>{eventLocation}</Text>
        </View>
      </View>
    </TouchableOpacity>)
}
const styles = StyleSheet.create({
  Container: {
    position: "relative",
    width: 220,
    height: 280,
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
    width: 200,
    height: 140
  },
  Image: {
    borderRadius: 10,
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
    width:"91.5%",
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
    display: "flex",
    bottom: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
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
    width:"84.5%",
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
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    margin: 5,
    borderRadius: 15,
  }
});

export default EventCard;
