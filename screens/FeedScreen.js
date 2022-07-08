import {FlatList, SafeAreaView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";
import SearchScreen from "./SearchScreen";
import CreateEventScreen from "./CreateEventScreen";
import LikeScreen from "./LikeScreen";
import ProfileScreen from "./ProfileScreen";

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const FeedScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [events, setEvent] = useState([])

  //ดึง Event ทั่งหมด
  useEffect(() => {
      setIsLoading(true)
      console.log('LoadEvent..')
      eventsService.getEventAll().then(async res => {
        await setEvent(res.data.content)
        await setIsLoading(false)
      }).catch(error => {
        console.log('get_all_event: ' + error)
      })
  },[])

  const RenderFeed = () => (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {
        isLoading ? null :
          <View>
            <FlatList
              data={events}
              renderItem={({item}) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {item: item, name: item.eventName})}/>)}
              keyExtractor={(item) => item.id}
              extraData={eventId}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
      }
    </SafeAreaView>

  )

  return (
    <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        switch (route.name) {
          case 'Feed':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Search':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'CreateEvent':
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            break;
          case 'Like':
            iconName = focused ? 'heart-sharp' : 'heart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'ios-person' : 'ios-person-outline';
            break;
        }
        return <Ionicons name={iconName} size={size + 5} color={color}/>;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name={'Feed'} component={RenderFeed} options={{headerShown: false, tabBarShowLabel: false}}/>
      <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
      <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
                  options={{headerShown: false, tabBarShowLabel: false}}/>
      <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
      <Tab.Screen name={'Profile'} component={ProfileScreen}
                  options={{headerShown: false, tabBarShowLabel: false}}/>
    </Tab.Navigator>
  )
}

export default FeedScreen;
