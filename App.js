import React, {useEffect, useState} from "react";
import {Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity,} from "react-native";


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
import RegisterEventListScreen from "./screens/RegisterEventListScreen";
import "moment/locale/th"
import moment from "moment/moment";
import EditProfileScreen from "./screens/EditProfileScreen";
import CreatedEventListScreen from "./screens/CreatedEventListScreen";
import ManageEventScreen from "./screens/ManageEventScreen";
moment().locale('th')
import { LogBox } from 'react-native';
import ScannerScreen from "./screens/ScannerScreen";
import ProfileDetailScreen from './screens/ProfileDetailScreen';
import ReviewEventScreen from "./screens/ReviewEventScreen";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

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
    setTimeout(()=>{
      setLoadFront(false)
    },500)
  }

  const HomeScreen = () => {
    return(
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
        <Tab.Screen
          name={'Feed'}
          component={FeedScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Profile'} component={ProfileScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}
        />
      </Tab.Navigator>
    )
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
              <Stack.Screen name={'Home'} component={HomeScreen}
                            options={{headerShown: false, tabBarShowLabel: false}}/>
              <Stack.Screen name={'EventDetail'} component={EventDetailScreen} options={ ({route,navigation}) => ({
                headerShown: true,
                headerTransparent: true,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                title: "",
                headerTintColor: Colors.white,
                headerBackTitle: '',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      borderRadius: 100,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      width: 30,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back-outline" size={25} color="back" />
                  </TouchableOpacity>
                ),
              })}/>

              <Stack.Screen name={'EventList'} component={RegisterEventListScreen} options={ ({route}) => ({
                headerShown: true,
                headerTransparent: true,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                headerBackTitle: '',
                title: route.params.name
              })}/>

              <Stack.Screen  name={'EditProfile'} component={EditProfileScreen} options={ ({route}) => ({
                headerShown: true,
                headerTransparent: true,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                headerBackTitle: '',
                title: 'ตั้งค่าโปรไฟล์'
              })} />

              <Stack.Screen name={'ProfileDetail'} component={ProfileDetailScreen} options={({ route }) => ({
                headerShown: true,
                headerTransparent: true,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                headerBackTitle: '',
                title: 'โปรไฟล์'
              })} />

              <Stack.Screen  name={'CreatedEventList'} component={CreatedEventListScreen} options={ ({route}) => ({
                headerShown: true,
                headerTransparent: false,
                tabBarShowLabel: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                },
                headerBackTitle: '',
                title: 'รายการกิจกรรมที่สร้าง'
              })}/>

              <Stack.Screen name={'Scanner'} component={ScannerScreen} options={{ headerShown:false}}/>

              <Stack.Group screenOptions={{ presentation: 'fullScreenModal'}}>
                <Stack.Screen name={'ManageEvent'} component={ManageEventScreen} options={ ({route,navigation}) => ({
                  headerShown: true,
                  headerTransparent: true,
                  tabBarShowLabel: false,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontFamily: Fonts.bold,
                    fontSize: fontSize.primary,
                    color: Colors.black,
                  },
                  title: "",
                  headerTintColor: Colors.white,
                  headerBackTitle: '',
                  headerLeft: () => (
                      <TouchableOpacity
                          style={{
                            borderRadius: 100,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onPress={() => navigation.goBack()}
                      >
                        <Ionicons name="md-close" size={25} color={Colors.black} />
                      </TouchableOpacity>
                  ),
                  headerRight: () => (
                      <TouchableOpacity
                          style={{
                            borderRadius: 100,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onPress={() => console.log('Edit Event')}
                      >
                        <Ionicons name="md-create-outline" size={25} color={Colors.black} />
                      </TouchableOpacity>
                  )
                })}/>

                <Stack.Screen name={'ReviewEvent'} component={ReviewEventScreen} options={ ({route,navigation}) => ({
                  headerShown: true,
                  headerTransparent: true,
                  tabBarShowLabel: false,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontFamily: Fonts.bold,
                    fontSize: fontSize.primary,
                    color: Colors.black,
                  },
                  title: "รีวิวกิจกรรม",
                  headerTintColor: Colors.white,
                  headerBackTitle: '',
                  headerLeft: () => (
                      <TouchableOpacity
                          style={{
                            borderRadius: 100,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onPress={() => navigation.goBack()}
                      >
                        <Ionicons name="md-close" size={25} color={Colors.black} />
                      </TouchableOpacity>
                  )
                })}/>
              </Stack.Group>
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
