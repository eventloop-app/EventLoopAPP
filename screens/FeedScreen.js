import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState, } from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from '@react-navigation/native'
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

import { Ionicons, Feather, AntDesign, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const FeedScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [events, setEvent] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [title, setTitle] = useState("กิจกรรมที่กำลังจะเริ่มเร็วๆนี้")
  const [feedbackImageCover, setFeedbackImageCover] = useState("https://cdn.zipeventapp.com/blog/2020/09/2020-09-09_04-59-46_zip-onlineevent.png")
  const [feedbackTitle, setFeedbackTitle] = useState("ราชสีมาวิทยาลัย")

  // useFocusEffect(
  //   useCallback(() => {
  //     setIsVisible(true)
  //     console.log('true')
  //     return () => {
  //       setIsVisible(false)
  //       console.log('false')
  //     }
  //   }, [])
  // )

  //ดึง Event ทั้งหมด
  useEffect(() => {
    getEvent()
  }, [])

  const getEvent = async () => {
    eventsService.getEventAll().then(res => {
      setEvent(res.data.content)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
      alert('ผิดพลาดดด \n' + error.message)
    })
    await setIsLoading(false)
  }





  const renderRemindFeedback = () => {
    return (
      <View style={[styles.shadowsCard, { backgroundColor: "lightgray", height: 150, backgroundColor: Colors.bag1Bg, }]}>
        <View style={{}}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 6 }}>
            <Text style={styles.textTitle}>กิจกรรมที่ยังไม่รีวิว</Text>
            <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
              <Text style={styles.textMore}>เพิ่มเติม</Text>
              <Ionicons name={'play'} color={Colors.black} size={10} />
            </View>
          </View>

          <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 4 }}>
            <View style={[styles.ImageCover, { backgroundColor: "white", borderRadius: 15, padding: 1 }]}>
              <Image
                style={[styles.Image, { height: 100, width: 160, borderRadius: 15 }]}
                source={{
                  uri: "https://cdn.zipeventapp.com/blog/2020/09/2020-09-09_04-59-46_zip-onlineevent.png"
                }}
              />
            </View>

            <View style={{ paddingHorizontal: 10, }}>
              <View style={{ height: 20, }}>
                <Text numberOfLines={1} style={{ fontFamily: Fonts.medium, fontSize: FontSize.primary }}>{feedbackTitle}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
              </View>

            </View>
          </TouchableOpacity>

        </View>
      </View >
    )
  }

  const renderEventSection = () => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 30 }}>
          <View style={{ flex: 0.7, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={styles.textTitle}>{title}</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('EventList', { name: 'รายการกิจกรรมที่ลงทะเบียน' })} style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 10 }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10} />
          </View>
        </View>
        <FlatList
          data={events}
          renderItem={({ item }) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {
        isLoading ? null :
          <View style={{ flex: 1 }} >
            <View style={styles.header}>
              {/*something*/}
            </View>
            <ScrollView style={{}}>
              {renderEventSection()}
              <View style={{ display: "flex" }}>
                {renderRemindFeedback()}
              </View>
              {renderEventSection()}

            </ScrollView>
          </View>


      }



    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: Colors.white
  },
  textTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.primary,
    color: Colors.black,
    marginLeft: 10,
  },
  textMore: {
    fontFamily: Fonts.primary,
    fontSize: FontSize.small,
    color: Colors.black,
    marginRight: 3,
  },
  header: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 100,
    backgroundColor: Colors.primary,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    marginBottom: 10
  },
  shadowsCard: {
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


  // ImageCover: {
  //   borderRadius: 15,
  //   width: 220,
  //   height: 160
  // },
  // Image: {
  //   borderRadius: 15,
  //   width: '60%',
  //   height: '60%',
  // },
});
export default FeedScreen;
