import React, {useEffect, useState, useRef} from "react";
import {Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import configureStore from './configStore';
import {Provider} from "react-redux";
import * as Font from 'expo-font';
import setupInterceptors from "./services/interceptors";
import "moment/locale/th"
import moment from "moment/moment";
moment().locale('th')
import { LogBox } from 'react-native';
import Routing from "./constants/Routing";
import * as Notifications from 'expo-notifications'
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'EventEmitter.removeListener'
]);

setupInterceptors(configureStore)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const App = () => {
  const [LoadFront, setLoadFront] = useState(true)
  // const Stack = createNativeStackNavigator();
  // const Tab = createBottomTabNavigator();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);


  useEffect(() => {
    loadData()
  }, [])

  useEffect( () =>{
    registerForPushNotification().then(token =>{
      console.log(token)
      setExpoPushToken(token)
    })

    Notifications.addNotificationResponseReceivedListener(res => {
      console.log('When click')
      // console.log(res)
    })

    Notifications.addNotificationReceivedListener(notification => {
      console.log('When stay in app')
      // console.log(notification)
    });
  },[])

  const registerForPushNotification = async () => {
    const {status} = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return ;
    }else{
      return (await Notifications.getExpoPushTokenAsync()).data
    }
  }

  const loadData = async () => {
    await Font.loadAsync({
      SukhumvitSet: require('./assets/fonts/SukhumvitSet-Text.ttf'),
      SukhumvitSetMedium: require('./assets/fonts/SukhumvitSet-Medium.ttf'),
      SukhumvitSetBold: require('./assets/fonts/SukhumvitSet-Bold.ttf')
    });

    setTimeout(()=>{
      setLoadFront(false)
    },500)

  }

  // const HomeScreen = () => {
  //   return(
  //     <Tab.Navigator screenOptions={({route}) => ({
  //       tabBarIcon: ({focused, color, size}) => {
  //         let iconName;
  //         switch (route.name) {
  //           case 'Feed':
  //             iconName = focused ? 'home' : 'home-outline';
  //             break;
  //           case 'Search':
  //             iconName = focused ? 'search' : 'search-outline';
  //             break;
  //           case 'CreateEvent':
  //             iconName = focused ? 'add-circle' : 'add-circle-outline';
  //             break;
  //           case 'Like':
  //             iconName = focused ? 'heart-sharp' : 'heart-outline';
  //             break;
  //           case 'Profile':
  //             iconName = focused ? 'ios-person' : 'ios-person-outline';
  //             break;
  //         }
  //         return <Ionicons name={iconName} size={size + 5} color={color}/>;
  //       },
  //       tabBarActiveTintColor: Colors.primary,
  //       tabBarInactiveTintColor: 'gray',
  //     })}>
  //       <Tab.Screen
  //         name={'Feed'}
  //         component={FeedScreen}
  //         options={{headerShown: false, tabBarShowLabel: false}}
  //       />
  //       <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
  //       <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
  //                   options={{headerShown: false, tabBarShowLabel: false}}/>
  //       <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
  //       <Tab.Screen name={'Profile'} component={ProfileScreen}
  //                   options={{headerShown: false, tabBarShowLabel: false}}
  //       />
  //     </Tab.Navigator>
  //   )
  // }

  return (
    <Provider store={configureStore}>
      {(!LoadFront && <Routing/>)}
    </Provider>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default App;
