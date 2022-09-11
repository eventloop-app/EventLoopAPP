import {View, Text, SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Platform, StatusBar} from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../constants/Colors'
import FontSize from '../constants/FontSize'
import Fonts from '../constants/Fonts'
import EventCardType4 from './../components/EventCardType4';
import * as Location from 'expo-location';
import eventsService from "../services/eventsService";
const ListEventScreen = ({ route, navigation }) => {
    const [event, setEvent] = useState(route.params.data)
    const [eventId, setEventId] = useState(true)
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
      console.log(route.params.name === 'ใกล้ฉัน')
      if(route.params.name === 'ใกล้ฉัน'){
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          setLoading(false)
        })();
      }else{
        setLoading(false)
      }
    }, [])

  useEffect(()=>{
    if(location !== null){
      const data = location.coords
      getEventByRange(data)
    }
  },[location])

  const getEventByRange = (data) => {

      eventsService.getEventByRange(data).then(res => {
        if(res.status === 200){
          console.log(res.data)
          setEvent(res.data.content)
        }else{
          console.log(res.status)
        }
      }).catch(e => {
        console.log(e)
      })
  }

    return (loading ?
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <StatusBar hidden={Platform.OS === "android" ? true : false} barStyle={'dark-content'}/>
          <ActivityIndicator size={'large'} color={Colors.primary}/>
        </SafeAreaView> :
        < SafeAreaView style={{ flex: 1, backgroundColor: Colors.white}} >
          <StatusBar hidden={Platform.OS === "android" ? true : false} barStyle={'dark-content'}/>
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 20}}
                    style={{ marginBottom: -30 }}
                    data={event}
                    renderItem={({ item }) => (<EventCardType4 item={item} onPress={() => navigation.navigate('EventDetail', {
                        item: item,
                        name: item.eventName
                    })} />)}
                    keyExtractor={(item) => item.id}
                    extraData={eventId}
                    showsHorizontalScrollIndicator={false}
                    horizontal={false}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        
    },
})
export default ListEventScreen