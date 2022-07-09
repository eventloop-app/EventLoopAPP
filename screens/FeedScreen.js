import {FlatList, SafeAreaView, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";
import SearchScreen from "./SearchScreen";
import CreateEventScreen from "./CreateEventScreen";
import LikeScreen from "./LikeScreen";
import ProfileScreen from "./ProfileScreen";
import {useFocusEffect} from '@react-navigation/native'

const Tab = createBottomTabNavigator();
const FeedScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [events, setEvent] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true)
      console.log('true')
      return () => {
        setIsVisible(false)
        console.log('false')
      }
    }, [])
  )

  //ดึง Event ทั่งหมด
  useEffect(() => {
    console.log('LoadEvent..')
    eventsService.getEventAll().then(async res => {
      await setEvent(res.data.content)
      await setIsLoading(false)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })
  }, [])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {
        isLoading ? null :
          <View>
            <FlatList
              data={events}
              renderItem={({item}) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
                item: item,
                name: item.eventName
              })}/>)}
              keyExtractor={(item) => item.id}
              extraData={eventId}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
      }
    </SafeAreaView>
  )
}

export default FeedScreen;
