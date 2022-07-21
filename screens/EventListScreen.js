import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import EventListCard from "../components/EventListCard";
import eventsService from "../services/eventsService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from '@react-navigation/native'
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";

const EventListScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [events, setEvent] = useState([])
  const [isVisible, setIsVisible] = useState(false)

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

  //ดึง Event ทั่งหมด
  useEffect(() => {
    getEvent()
  }, [])

  const getEvent = async () => {
    eventsService.get10Event().then(res => {
      setEvent(res.data.content)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
      alert('ผิดพลาดดด \n' + error.message)
    })
    await setIsLoading(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white', }}>
        {
          isLoading ? null :
            <View style={{ alignItems: "center", position: "absolute" }}>
              <FlatList
                style={{ width: "100%", height: "100%" }}
                data={events}
                renderItem={({ item }) => (<EventListCard item={item} onPress={() => navigation.navigate('EventDetail', { item: item, name: item.eventName })} />)}
                keyExtractor={(item) => item.id}

                horizontal={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
        }
      </View>
    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
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
});
export default EventListScreen;
