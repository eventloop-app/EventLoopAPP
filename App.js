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

setupInterceptors(configureStore)
const App = () => {
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
              <Tab.Screen name={'Feed'} component={FeedScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
              <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
              <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
                          options={{headerShown: false, tabBarShowLabel: false}}/>
              <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
              <Tab.Screen name={'Profile'} component={ProfileScreen}
                          options={{headerShown: false, tabBarShowLabel: false}}/>
            </Tab.Navigator>
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
