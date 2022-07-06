import {SafeAreaView, Text} from "react-native";
import React, { useEffect, useState } from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import EventCard from "../components/EventCard";
const Tab = createBottomTabNavigator();

const FeedScreen = ({ route, navigation }) => {

  return (
    <SafeAreaView style={{flex:1,backgroundColor: 'white'}}>
      <EventCard/>
    </SafeAreaView>
  )
}


export default FeedScreen;
