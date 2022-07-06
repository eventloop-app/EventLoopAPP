import React, {useEffect, useState} from "react";
import {StyleSheet,} from "react-native";


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

const App = () => {

  const RootStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();



  // const getToken = async () => {
  //   const data = new FormData()
  //   data.append('grant_type', 'authorization_code');
  //   data.append('client_id', '4bf4a100-9aeb-42be-8649-8fd4ef42722b');
  //   data.append('redirect_uri', 'exp://g6-ciw.anonymous.eventloop.exp.direct:80');
  //   data.append('code', response.params.code);
  //   data.append('scope', 'https://graph.microsoft.com/.default');
  //   data.append('code_verifier', request.codeVerifier);
  //   axios.post(
  //     'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token',
  //     data,
  //     {'Content-Type': 'application/x-www-form-urlencoded'}).then(result => {
  //     console.log(result.data)
  //   }).catch(error => {
  //     console.log("Auth Error: " + error)
  //   })
  // }

  return (
    <Provider store={configureStore}>
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
    </Provider>
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
