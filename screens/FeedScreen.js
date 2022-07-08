import {FlatList, SafeAreaView, Text, View} from "react-native";
import React, { useEffect, useState } from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";

const FeedScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvent] = useState([])

  //ดึง Event ทั่งหมด
  useEffect(()=>{
    eventsService.getEventAll().then( async res => {
      await setEvent(res.data.content)
      await setIsLoading(false)
    }).catch(error => {
      console.log('get_all_event: ' + error)
    })
  },[])

  return (
    <SafeAreaView style={{flex:1,backgroundColor: 'white'}}>
      {
        isLoading ? null :
          <View>
            <FlatList
              data={events}
              renderItem={EventCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
      }
    </SafeAreaView>
  )
}

export default FeedScreen;
