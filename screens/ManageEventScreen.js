import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView, ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, {useEffect, useState} from 'react';
import eventsService from "../services/eventsService";
import {useSelector} from "react-redux";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import moment from "moment/moment";
import {toBuddhistYear} from "../constants/Buddhist-year";
import {Ionicons} from "@expo/vector-icons";
import EventCardList from "../components/EventCardList";
import EventCardType4 from "../components/EventCardType4";


const ManageEventScreen = (props) => {
  const {user} = useSelector(state => state.user)
  const [userData] = useState(JSON.parse(user))
  const [event, setEvent] = useState(null)
  const [isLoad, setIsLoad] = useState(true)
  const [page, setPage] = useState(null)

  useEffect(() => {
    if(props.route.params){
      setPage(props.route.params.page)
      if(props.route.params.page === "manageEvent"){
        getEventByOrganizer()
      }else {
        getEventRegisted()
      }
    }
  }, [])

  const getEventRegisted = () =>{
    if (user !== null) {
      eventsService.getAllRegisteredEvent(userData.id).then(res => {

        if (res.status === 200) {
          console.log(res.data.content)
          setEvent(res.data.content)
          setIsLoad(false)
        }
      })
    }
  }

  const getEventByOrganizer = () => {
    if (user !== null) {
      eventsService.getEventByOrganizerId(userData.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data.content)
          setIsLoad(false)
        }
      })
    }
  }

  const renderCard = (event) => (
    <View style={{
      width: "100%", height: 90, flexDirection: "row", shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
      marginTop: 10,
    }}>
      <View style={{flex: 0.6, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, backgroundColor: Colors.white}}>
        <View style={{padding: 5}}>
          <Text numberOfLines={1}
                style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>{event?.eventName}</Text>
          <Text numberOfLines={1} style={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.small
          }}>{toBuddhistYear(moment(event?.startDate), "DD/MM/YYYY")}</Text>
          <Text numberOfLines={1} style={{
            fontFamily: Fonts.primary,
            fontSize: FontSize.small
          }}>{moment(event?.startDate).format("HH:mm") + " - " + moment(event?.endDate).format("HH:mm") + " น."}</Text>
        </View>
      </View>
      <TouchableOpacity style={{flex: 0.2, backgroundColor: Colors.yellow, justifyContent: "center", alignItems: "center"}}>
        <Ionicons name={'ios-create-outline'} size={36} color={Colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=> props.navigation.push('ManageEventDetail',{name: event?.eventName, id: event?.id, endDate: event?.endDate})}
        style={{flex: 0.2, borderBottomRightRadius: 10, borderTopRightRadius: 10, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center"}}>
        <Ionicons name={'ios-reorder-three-outline'} size={36} color={Colors.white} />
      </TouchableOpacity>
    </View>
  )

  const renderManageEventByOrganizer = () => (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white, }}>
      <View style={{flex: 1, margin: 20, marginTop: (Platform.OS === 'ios' ? 0 : 50)}}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{padding: 1}}
          data={event}
          renderItem={({item}) => renderCard(item)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          horizontal={false}
        />
      </View>
    </SafeAreaView>
  )

  const renderMyEventList = () =>(
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView style={{flex: 1, margin: 1, marginTop: (Platform.OS === 'ios' ? 0 : 50)}}>
        {
          event.map( (item) => (
            <EventCardType4 key={item.id} item={item} onPress={() => props.navigation.navigate('EventDetail', {
              item: item,
              name: item.eventName
            })}/>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )

  return ( isLoad ?
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </SafeAreaView>
      :
      (page === "manageEvent" ? renderManageEventByOrganizer() : renderMyEventList())
  )
}

export default ManageEventScreen
