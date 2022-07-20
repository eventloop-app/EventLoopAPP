import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from '@react-navigation/native'
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";


const EventListScreen = () => {
  return (
    <SafeAreaView>
      <Text>EventList</Text>
    </SafeAreaView>
  );
};

export default EventListScreen;
