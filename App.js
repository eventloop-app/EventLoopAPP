import React, {useCallback, useEffect, useState} from "react";
import configureStore from './configStore';
import {Provider} from "react-redux";
import * as Font from 'expo-font';
import setupInterceptors from "./services/interceptors";
import "moment/locale/th"
import moment from "moment/moment";
import { LogBox } from 'react-native';
import Routing from "./constants/Routing";
moment().locale('th')
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'EventEmitter.removeListener',
  'Can\'t perform a React state update on an unmounted component'
]);
import * as Notifications from 'expo-notifications'
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

  useEffect(() => {
    loadData()

    registerForPushNotification().then(token =>{
      console.log(token)
    }).catch(e =>{
      console.log(e)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, [])

  useEffect( () =>{
    Notifications.addNotificationResponseReceivedListener(res => {
      console.log('When click')
      // console.log(res)r
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

  return (
    <Provider store={configureStore}>
      {(!LoadFront && <Routing/>)}
    </Provider>
  );
};


export default App;
