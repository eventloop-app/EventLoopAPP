import React, {useEffect, useState} from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Button,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from 'react-native-axios'
import FormData from 'form-data';
import {makeRedirectUri, useAuthRequest, useAutoDiscovery} from "expo-auth-session";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import FeedScreen from "./Screens/FeedScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import LikeScreen from "./Screens/LikeScreen";
import CreateEventScreen from "./Screens/CreateEventScreen";
import SearchScreen from "./Screens/SearchScreen";
import Ionicons from '@expo/vector-icons/Ionicons';

WebBrowser.maybeCompleteAuthSession();

const App = () => {
  // const discovery = useAutoDiscovery('https://eventloop.jp.auth0.com/authorize');
  const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
  const redirectUri = makeRedirectUri({scheme: "exp://g6-ciw.anonymous.eventloop.exp.direct:80"});


  const RootStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [request, response, promptAsync] = useAuthRequest(
    {
      // clientId: '1bp7lTyd3mVuC861J3dVKEWJUcC2aOEu',
      // responseType: 'id_token',
      // scopes: ['openid', 'profile', 'email'],
      // redirectUri,
      // extraParams: {
      //   nonce: 'nonce',
      // },
      clientId: "4bf4a100-9aeb-42be-8649-8fd4ef42722b",
      clientSecret: "3~68Q~sLI_5IxI1m7m8PdKEP_XGT4xWXfXCdIdfG",
      scopes: ["openid", "profile", "email", "offline_access", "user.read"],
      responseType: "code",
      prompt: "login",
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
      try {
        if (response && "params" in response) {
          if (response.params && "code" in response.params) {
            // console.log("-----------------------");
            // console.log(response.params.code);
            // console.log("-----------------------");
            // console.log(request.codeVerifier);
            // console.log("-----------------------");
            // const data = JSON.stringify({});
            getToken()
          }
        }
      } catch (e) {
        console.log('hekko')
      }

    }
    , [response]);

  const getToken = async () => {
    const data = new FormData()
    data.append('grant_type', 'authorization_code');
    data.append('client_id', '4bf4a100-9aeb-42be-8649-8fd4ef42722b');
    data.append('redirect_uri', 'exp://g6-ciw.anonymous.eventloop.exp.direct:80');
    data.append('code', response.params.code);
    data.append('scope', 'https://graph.microsoft.com/.default');
    data.append('code_verifier', request.codeVerifier);
    axios.post(
      'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token',
      data,
      {'Content-Type': 'application/x-www-form-urlencoded'}).then(result => {
      console.log(result.data)
    }).catch(error => {
      console.log("Auth Error: " + error)
    })
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
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
          return <Ionicons name={iconName} size={size + 5} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tab.Screen name={'Feed'} component={FeedScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'CreateEvent'} component={CreateEventScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Like'} component={LikeScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Profile'} component={ProfileScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
      </Tab.Navigator>
    </NavigationContainer>
    // <SafeAreaView style={styles.Container}>
    //   <StatusBar barStyle={"dark-content"} />
    //   <Button
    //     disabled={!request}
    //     title="Loginnnnsdasd"
    //     onPress={() => promptAsync()}
    //   />
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default App;
