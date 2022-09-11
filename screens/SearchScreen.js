import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
  Platform
} from "react-native";
import eventsService from "../services/eventsService";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from '../constants/FontSize';
import EventCardType4 from "../components/EventCardType4";
import {ActivityIndicator} from 'react-native-paper';

const SearchScreen = ({route, navigation}) => {
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [event, setEvent] = useState([])
  const [searchText, setSearchText] = useState("")
  const [eventId, setEventId] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [pageCurrent, setPageCurrent] = useState(1)
  const [platform, setPlatform] = useState(["microsoft", "google", "discord", "zoom"])
  const [onLoadData, setLoadData] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)

  const getEvent = (keyword) => {
    if (keyword !== "") {
      setPage(0)
      eventsService.getEventBySearch(keyword).then(res => {
        if (res.status === 200) {
          let newEvent = res.data.content
          setTotalPage(res.data.totalPages)
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
    } else {
      handleClearText()
    }
  }


  const getNewEvent = (keyword = "", newPage) => {
    setLoadData(true)
    eventsService.getEventBySearch(keyword, newPage).then(res => {
      if (res.status === 200) {
        setLoadData(false)
        let newEvent = res.data.content
        let currentData = event.concat(newEvent)

        currentData.map((item, index) => {
            if (typeof (item.location?.name) === "string") {
              platform.map((platformItem) => {
                if (item.location?.name.includes(platformItem)) {
                  switch (platformItem) {
                    case 'google':
                      return currentData[index].location.name = "Google Meet"
                    case 'zoom':
                      return currentData[index].location.name = "Zoom"
                    case 'discord':
                      return currentData[index].location.name = "Discord"
                    case 'microsoft':
                      return currentData[index].location.name = "Microsoft Team"
                    default:
                      return null
                  }
                }
              })

            }
          }
        )
        setEvent(currentData)
        setIsLoading(true)
        setLoadData(false)
      } else {
        setLoadData(false)
      }
    })
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
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 4}}>
        <TextInput style={[styles.textInputStyle, {}]} autoFocus={true} placeholder={"ค้นหากิจกรรม"}
                   placeholderTextColor={Colors.darkGray} onChangeText={(value) => handleSearch(value)}
                   value={searchText}/>
        <TouchableOpacity title="clear" style={{
          backgroundColor: Colors.skyBlue,
          padding: 6,
          borderRadius: 30,
          margin: 2,
          marginLeft: 4,
          width: "20%",
          alignItems: 'center',
        }} onPress={() => handleClearText()}>
          <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.small, color: Colors.white}}>ยกเลิก</Text>
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

  const renderFooter = () => {
    if (!onLoadData) return null;
    return (
      <ActivityIndicator
        style={{color: '#000'}}
      />
    );
  }

  const handleLoadMore = () => {
    let newPage = page;
    if (!onLoadData && newPage <= totalPage) {
      newPage = page + 1
      getNewEvent(searchText, newPage);
      setPage(newPage)
    }
  }

  return (
    <View style={{flex: 1, paddingTop: Platform.OS === "ios" ? 44 : 0, backgroundColor: Colors.white}}>
      <View style={styles.container}>
        <View style={[{display: Platform.OS === "android" ? "flex" : "none", paddingTop: 24}]}>
          {renderSearchSection()}
        </View>
        <View style={[{display: Platform.OS === "ios" ? "flex" : "none"}]}>
          {renderSearchSection()}
        </View>

        {
          searchText ? (event.length !== 0 ? null :
              <View style={{
                width: "100%",
                height: "100%",
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.black}}>
                  ไม่มีกิจกรรมที่คุณค้นหา
                </Text>
              </View>) :
            <View style={{
              width: "100%",
              height: "100%",
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.black}}>
                ค้นหากิจกรรมที่คุณสนใจ
              </Text>
            </View>
        }


        {
          (event && <FlatList
              data={event}
              renderItem={({item}) => (<EventCardType4 item={item} onPress={() => navigation.navigate('EventDetail', {
                item: item,
                name: item.eventName
              })}/>)}
              keyExtractor={(item, index) => index.toString()}
              extraData={eventId}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.2}
              onEndReached={handleLoadMore}
            />
          )
        }
      </View>
    </View>

  )
};
const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      flex: 1
    },
    textInputStyle: {
      height: 42, backgroundColor: "white",
      borderWidth: 1,
      borderColor: Colors.lightgray,
      borderRadius: 30,
      width: "75%",
      paddingHorizontal: 12,
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


