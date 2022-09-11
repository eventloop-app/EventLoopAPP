import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "./Colors";
import FeedScreen from "../screens/FeedScreen";
import SearchScreen from "../screens/SearchScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import LikeScreen from "../screens/LikeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {Platform, StatusBar, TouchableOpacity} from "react-native";
import EventDetailScreen from "../screens/EventDetailScreen";
import Fonts from "./Fonts";
import fontSize from "./FontSize";
import RegisterEventListScreen from "../screens/RegisterEventListScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import CreatedEventListScreen from "../screens/CreatedEventListScreen";
import ScannerScreen from "../screens/ScannerScreen";
import ManageEventScreen from "../screens/ManageEventScreen";
import ReviewEventScreen from "../screens/ReviewEventScreen";
import {NavigationContainer} from "@react-navigation/native";
import MapScreen from "../screens/MapScreen";
import ErrorScreen from "../screens/ErrorScreen";
import ListEventScreen from '../screens/ListEventScreen';
import ManageEventDetailScreen from "../screens/ManageEventDetailScreen";
import EditEventScreen from "../screens/EditEventScreen";

const Routing = () => {

    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

  const HomeScreen = () => {
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
        <Tab.Screen
          name={'Feed'}
          component={FeedScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Profile'}
                    component={ProfileScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar hidden={Platform.OS === "android" ? true : false}/>
      <Stack.Navigator >
        <Stack.Screen name={'Home'} component={HomeScreen}
                      options={{headerShown: false, tabBarShowLabel: false}}/>
        <Stack.Screen name={'Error'} component={ErrorScreen}
                      options={{headerShown: false, tabBarShowLabel: false}}/>
        <Stack.Screen name={'EventDetail'} component={EventDetailScreen} options={({route, navigation}) => ({
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
              <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
            </TouchableOpacity>
          )
        })}/>



        <Stack.Screen name={'EventList'} component={RegisterEventListScreen} options={({route}) => ({
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

        <Stack.Screen name={'EditProfile'} component={EditProfileScreen} options={({route, navigation}) => ({
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
          title: 'ตั้งค่าโปรไฟล์',
          headerBackVisible: false
        })}/>

        <Stack.Screen name={'ProfileDetail'} component={ProfileDetailScreen} options={({route, navigation}) => ({
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
          title: 'โปรไฟล์',
          headerLeft: () => (
            <TouchableOpacity
              style={{
                paddingLeft: 10,
                borderRadius: 100,
                backgroundColor: 'rgba(255,255,255,0.8)',
                width: 50,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => navigation.navigate('Feed')}
            >
              <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
            </TouchableOpacity>
          )
        })}/>

                <Stack.Screen name={'CreatedEventList'} component={CreatedEventListScreen} options={({ route }) => ({
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
                    title: 'รายการกิจกรรมที่สร้าง',
                })} />


                <Stack.Screen name={'ListSelectedEvent'} component={ListEventScreen} options={({ route }) => ({
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
                    title: route.params.name
                })} />

        <Stack.Screen name={'Scanner'} component={ScannerScreen} options={{headerShown: false}}/>

        <Stack.Screen name={'ManageEvent'} component={ManageEventScreen} options={({route, navigation}) => ({
          headerShown: true,
          headerTransparent: true,
          tabBarShowLabel: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: Fonts.bold,
            fontSize: fontSize.primary,
            color: Colors.black,
          },
          title: "จัดการกิจกรรม",
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
              <Ionicons name="md-close" size={25} color={Colors.black}/>
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //     style={{
          //       borderRadius: 100,
          //       backgroundColor: 'rgba(255,255,255,0.8)',
          //       width: 30,
          //       height: 30,
          //       justifyContent: 'center',
          //       alignItems: 'center'
          //     }}
          //     onPress={() => console.log('Edit Event')}
          //   >
          //     <Ionicons name="md-create-outline" size={25} color={Colors.black}/>
          //   </TouchableOpacity>
          // )
        })}/>

        <Stack.Group screenOptions={{presentation: 'fullScreenModal'}}>

          <Stack.Screen name={'EditEvent'} component={EditEventScreen} options={({route, navigation}) => ({
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
                <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'ReviewEvent'} component={ReviewEventScreen} options={({route, navigation}) => ({
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
                <Ionicons name="md-close" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'GoogleMap'} component={MapScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.black,
            },
            title: "เลือกสถานที่",
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
                onPress={() => navigation.pop()}
              >
                <Ionicons name="md-close" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>
        </Stack.Group>

        <Stack.Group screenOptions={{presentation: 'modal',gestureEnabled: false}} >
          <Stack.Screen name={'ManageEventDetail'} component={ManageEventDetailScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.medium,
              color: Colors.black,
            },
            title: route.params.name,
            headerTintColor: Colors.white,
            headerBackTitle: '',
            headerBackVisible: false
            // headerLeft: () => (
            //   <TouchableOpacity
            //     style={{
            //       borderRadius: 100,
            //       backgroundColor: 'rgba(255,255,255,0.8)',
            //       width: 30,
            //       height: 30,
            //       justifyContent: 'center',
            //       alignItems: 'center'
            //     }}
            //     onPress={() => navigation.pop()}
            //   >
            //     <Ionicons name="md-close" size={25} color={Colors.black}/>
            //   </TouchableOpacity>
            // ),
            // headerRight: () => (
            //   <TouchableOpacity
            //     style={{
            //       borderRadius: 100,
            //       backgroundColor: 'rgba(255,255,255,0.8)',
            //       width: 30,
            //       height: 30,
            //       justifyContent: 'center',
            //       alignItems: 'center'
            //     }}
            //     onPress={() => console.log('Edit Event')}
            //   >
            //     <Ionicons name="md-create-outline" size={25} color={Colors.black}/>
            //   </TouchableOpacity>
            // )
          })}/>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Routing;