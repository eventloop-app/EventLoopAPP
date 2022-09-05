import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, ScrollView, TextInput, TouchableOpacity, Button, Platform } from "react-native";
import eventsService from "../services/eventsService";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from '../constants/FontSize';
import EventCardType4 from "../components/EventCardType4";
import { ActivityIndicator } from 'react-native-paper';


const SearchScreen = ({ route, navigation }) => {
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [event, setEvent] = useState([])
  const [searchText, setSearchText] = useState("")
  const [eventId, setEventId] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [pageCurrent, setPageCurrent] = useState(1)
  const [platform, setPlatform] = useState(["microsoft", "google", "discord", "zoom"])





  const getEvent = (keyword) => {

    eventsService.getEventBySearch(keyword).then(res => {
      if (res.status === 200) {
        let newEvent = res.data.content
        newEvent.map((item, index) => {
          if (typeof (item.location?.name) === "string") {
            platform.map((platformItem) => {
              if (item.location?.name.includes(platformItem)) {
                switch (platformItem) {
                  case 'google':
                    return newEvent[index].location.name = "Google Meet"
                  case 'zoom':
                    return newEvent[index].location.name = "Zoom"
                  case 'discord':
                    return newEvent[index].location.name = "Discord"
                  case 'microsoft':
                    return newEvent[index].location.name = "Microsoft Team"
                  default:
                    return null
                }
              }
            })

          }
        }
        )
        setEvent(newEvent)
        setIsLoading(true)
      } else {
      }
    })
  }


  const matchPlatform = () => {

  }

  const handleSearch = (value) => {
    setSearchText(value)
    getEvent(value)
  }

  const handleClearText = () => {
    setEvent([])
    setSearchText("")
  }

  const renderSearchSection = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.bag9Bg, paddingVertical: 4 }}>
        <TextInput style={[styles.textInputStyle, {}]} autoFocus={true} placeholder={"ค้นหากิจกรรม"} placeholderTextColor={Colors.darkGray} onChangeText={(value) => handleSearch(value)} value={searchText} />
        <TouchableOpacity title="clear" style={{ backgroundColor: Colors.skyBlue, padding: 6, borderRadius: 30, margin: 2, marginLeft: 4, width: "20%", alignItems: 'center', }} onPress={() => handleClearText()}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>)
  }

  // const renderFooterCard = () => {
  //   return (
  //     isLoading ?
  //       <View style={[styles.loader,]}>
  //         <ActivityIndicator size="medium" />
  //       </View> : null
  //   )
  // }

  return (
    < SafeAreaView style={{ flex: 1 }} >
      <View style={styles.container}>
        <View style={[{ display: Platform.OS === "android" ? "flex" : "none", paddingTop: 24 }]} >
          {renderSearchSection()}

        </View>
        <View style={[{ display: Platform.OS === "ios" ? "flex" : "none" }]} >

          {renderSearchSection()}
        </View>

        {<FlatList
          data={event}
          renderItem={({ item }) => (<EventCardType4 item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={false}

        />}

      </View>
    </SafeAreaView>

  )
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },

  textInputStyle: {
    height: 42, backgroundColor: "white", borderRadius: 30, width: "75%", paddingHorizontal: 12,
    fontFamily: Fonts.medium,
    fontSize: FontSize.small,
  },
  loader: {
    marginTop: 10,
    alignItems: "center"
  }
}

)

export default SearchScreen;


