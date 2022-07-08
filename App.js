import React, {useEffect, useState} from "react";
import {Platform, SafeAreaView, StatusBar, StyleSheet, Text,} from "react-native";


import configureStore from './configStore';
import {Provider} from "react-redux";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LikeScreen from "./screens/LikeScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Font from 'expo-font';
import Colors from "./constants/Colors";
import setupInterceptors from "./services/interceptors";
import EventDetailScreen from "./screens/EventDetailScreen";
import Fonts from "./constants/Fonts";
import fontSize from "./constants/FontSize";

setupInterceptors(configureStore)

const App = ({route, navigation}) => {
  const [LoadFront, setLoadFront] = useState(true)
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await Font.loadAsync({
      SukhumvitSet: require('./assets/fonts/SukhumvitSet-Text.ttf'),
      SukhumvitSetMedium: require('./assets/fonts/SukhumvitSet-Medium.ttf'),
      SukhumvitSetBold: require('./assets/fonts/SukhumvitSet-Bold.ttf')
    });
    await setLoadFront(false)
  }

  return (
    <Provider store={configureStore}>
      {
        LoadFront ?
          null
          :
          <NavigationContainer>
            <StatusBar hidden={Platform.OS === "android" ? true : false}/>
            <Stack.Navigator>
              <Stack.Screen name={'Home'} component={FeedScreen}
                            options={{headerShown: false, tabBarShowLabel: false}}/>
              <Stack.Screen name={'EventDetail'} component={EventDetailScreen} options={ ({route}) => ({
                headerShown: true,
                headerTransparent: true,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                title: route.params.name
              })}/>
            </Stack.Navigator>
          </NavigationContainer>
      }
    </Provider>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default App;
