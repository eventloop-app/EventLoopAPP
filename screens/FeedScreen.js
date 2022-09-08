import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button
} from "react-native";
import React, { useCallback, useEffect, useState, } from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from '@react-navigation/native'
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import EventCardHorizon from "../components/EventCardHorizon";
import { Ionicons, Feather, AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";


const FeedScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [allEvents, setAllEvent] = useState("")
  const [eventByTag, setEventByTag] = useState("")
  const [eventByRegistered, setEventByRegistered] = useState("")
  const [eventByAttention, setEventByAttention] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [title, setTitle] = useState("กิจกรรมที่กำลังจะเริ่มเร็วๆนี้")
  const [feedbackImageCover, setFeedbackImageCover] = useState("https://cdn.zipeventapp.com/blog/2020/09/2020-09-09_04-59-46_zip-onlineevent.png")
  const [feedbackTitle, setFeedbackTitle] = useState("ราชสีมาวิทยาลัย")
  const [selectedTag, setSelectedTag] = useState(["บันเทิง", "การศึกษา", "อาหาร", "กีฬา", "ท่องเที่ยว"])
  const [feedBack, setFeedBack] = useState("")
  const [hasFeedBack, setHasFeedBack] = useState(false)
  const [stepReward, setStepReward] = useState(0);

  const [onLoadData, setLoadData] = useState(false)
  const [page, setPage] = useState(0)

  // useFocusEffect(
  //   useCallback(() => {
  //     setIsVisible(true)
  //     console.log('true')
  //     return () => {
  //       setIsVisible(false)
  //       console.log('false')
  //     }
  //   }, [])
  // )

  //ดึง Event ทั้งหมด
  useEffect(() => {
    getAllEvent()
    getEventByTag()
    getEventByAttention()
    getRegisterEvent()
  }, [])


  // get Event
  const getAllEvent = async () => {
    console.log("Get Event")
    const timeout = setTimeout(() => {
      console.log("TimeOut !")
      navigation.navigate("Error")
    }, 5000)
    eventsService.getAllEvent().then(res => {
      if (res.status === 200) {
        clearTimeout(timeout);
        setAllEvent(res.data.content)
      } else {
        console.log(res.status)
      }
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
      alert('ผิดพลาดดด \n' + error.message)
    })
    await setIsLoading(false)
  }

  const getEventByTag = async () => {
    eventsService.getEventByTag(selectedTag).then((res) => {
      setEventByTag(res.data.content)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })
    await setIsLoading(false)
  }

  const getEventByAttention = async () => {
    eventsService.getEventByAttention().then(res => {
      setEventByAttention(res.data.content)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
      alert('ผิดพลาดดด \n' + error.message)
    })
    await setIsLoading(false)
  }

  const getRegisterEvent = async () => {
    eventsService.getAllRegisteredEvent().then(res => {
      setEventByRegistered(res.data.content)
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
      alert('ผิดพลาดดด \n' + error.message)
    })
    await setIsLoading(false)
  }

//-----------------------------------------------------------
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

  const renderFooter = () => {
    if (!onLoadData) return null;
    return (
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    );
  }

  const handleLoadMore = () => {
    if (!onLoadData) {

      let newPage = page + 1; // increase page by 1
      getNewEvent(searchText, newPage); // method for API call 
      setPage(newPage)
      console.log(newPage)
    }
  }
//-----------------------------------------------------------------


  const renderEventShortcutSection = () => {
    return (
      <View style={[styles.shadowsCard, { backgroundColor: Colors.bag9Bg, alignItems: "center" }]}>

        <View>
          <View style={{ paddingVertical: 10, flexDirection: "row", flexWrap: "wrap", width: "100%", alignItems: "center", }}>

            <TouchableOpacity style={[styles.shortcutBtn, { display: eventByAttention ? "flex" : "none" }]} onPress={() => navigation.navigate('ListSelectedEvent', { name: "กำลังมาแรง", data: eventByAttention })}>
              <View style={styles.subShortcutBtn}>
                <MaterialCommunityIcons color={"red"} name={"fire"} size={30} />
              </View>
              <Text>มาแรง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "กิจกรรมที่เหมาะกับคุณ", data: eventByTag })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"pricetag"} size={30} />
              </View>
              <Text>ความสนใจ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "บุ๊กมาร์ก", })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"bookmark"} size={30} />
              </View>
              <Text>บุ๊กมาร์ก</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "ใกล้ฉัน" })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"md-location-sharp"} size={30} />
              </View><Text>ใกล้ฉัน</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "กำลังจะเริ่ม" })}>
              <View style={styles.subShortcutBtn}>
                <MaterialCommunityIcons color={"black"} name={"calendar-clock"} size={30} />
              </View>
              <Text>กำลังจะเริ่ม</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "ที่ลงทะเบียน", data: eventByRegistered })}>
              <View style={styles.subShortcutBtn}>
                <AntDesign color={"black"} name={"form"} size={30} />
              </View><Text>ที่ลงทะเบียน</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "ทั้งหมด", data: allEvents })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"ios-layers"} size={30} />
              </View><Text>ทั้งหมด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }


  const renderRemindFeedback = () => {
    return (
      <View style={[styles.shadowsCard, styles.feedBack, { display: "flex" }]}>
        <View style={{}}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 6 }}>
            <Text style={styles.textTitle}>กิจกรรมที่ยังไม่รีวิว</Text>
            <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
              <Text style={styles.textMore}>เพิ่มเติม</Text>
              <Ionicons name={'play'} color={Colors.black} size={10} />
            </View>
          </View>

          <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 4 }}>
            <View style={[styles.ImageCover, { backgroundColor: "white", borderRadius: 15, padding: 1 }]}>
              <Image
                style={[styles.Image, { height: 100, width: 160, borderRadius: 15 }]}
                source={{
                  uri: "https://cdn.zipeventapp.com/blog/2020/09/2020-09-09_04-59-46_zip-onlineevent.png"
                }}
              />
            </View>

            <View style={{ paddingHorizontal: 10, }}>
              <View style={{ height: 20, }}>
                <Text numberOfLines={1}
                  style={{ fontFamily: Fonts.medium, fontSize: FontSize.primary }}>{feedbackTitle}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
                <AntDesign color={"yellow"} name={"staro"} size={32}></AntDesign>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  //Event render
  const renderAllEventSection = () => {
    return (
      <View style={[styles.eventSection, { display: allEvents ? "flex" : "none" }]}>
        <View style={[styles.cardHeader]}>
          <View style={{ flex: 0.7, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={styles.textTitle}>กิจกรรม</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', { name: 'กิจกรรม', data: allEvents })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10} />
          </View>
        </View>
        <FlatList
          data={allEvents}
          renderItem={({ item }) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }

  const renderEventByTagSection = () => {
    return (
      <View style={[styles.eventSection, { display: eventByTag ? "flex" : "none" }]}>
        <View style={[styles.cardHeader]}>
          <View style={{ flex: 0.7, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={styles.textTitle}>กิจกรรมที่เหมาะกับคุณ</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', { name: 'กิจกรรมที่เหมาะกับคุณ', data: eventByTag })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10} />
          </View>
        </View>
        <FlatList
          data={eventByTag}
          renderItem={({ item }) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }

  const renderEventByAttentionSection = () => {
    return (
      <View style={[styles.eventSection, { display: eventByAttention ? "flex" : "none" }]}>
        <View style={[styles.cardHeader]}>
          <View style={{ flex: 0.7, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={styles.textTitle}>กำลังมาแรง</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', { name: 'กำลังมาแรง', data: eventByAttention })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10} />
          </View>
        </View>
        <FlatList
          data={eventByAttention}
          renderItem={({ item }) => (<EventCardHorizon item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}

          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.2}
          onEndReached={handleLoadMore}
        />
      </View>
    )
  }

  const renderRegisteredEventSection = () => {
    return (
      <View style={[styles.eventSection, { display: eventByRegistered ? "flex" : "none" }]}>
        <View style={[styles.cardHeader]}>
          <View style={{ flex: 0.7, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={styles.textTitle}>กิจกรรมที่คุณได้ลงทะเบียน</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', { name: 'รายการกิจกรรมที่ลงทะเบียน', data: eventByRegistered })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10} />
          </View>
        </View>
        <FlatList
          data={eventByRegistered}
          renderItem={({ item }) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })} />)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={styles.header}>
          {/*something*/}
        </View>
        {/* <Button title="Test" onPress={() => console.log(eventByTag)} /> */}
        <ScrollView style={{ paddingTop: 100 }} >
          <View style={{ paddingBottom: 200 }}>
            {renderEventByAttentionSection()}
            {renderEventShortcutSection()}
            {renderAllEventSection()}
            {renderEventByTagSection()}
            {renderRegisteredEventSection()}
            <View style={{ display: hasFeedBack ? "flex" : "none" }}>
              {renderRemindFeedback()}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: Colors.white
  },
  textTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.primary,
    color: Colors.black,
    marginLeft: 10,
  },
  textMore: {
    fontFamily: Fonts.primary,
    fontSize: FontSize.small,
    color: Colors.black,
    marginRight: 3,
  },
  header: {
    position: 'absolute',
    display: 'flex',
    width: "100%",
    height: 100,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: Colors.primary,
    zIndex: 10,
    overflow: "hidden"
  },
  shadowsCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 8,
    borderRadius: 15,
  },
  feedBack: {
    height: 150,
    backgroundColor: Colors.bag1Bg,
  },
  eventSection: {
    marginVertical: 6,
    backgroundColor: "White"
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 30
  },
  shortcutBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 80, marginVertical: 3
  },
  subShortcutBtn: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center"
  }




  // ImageCover: {
  //   borderRadius: 15,
  //   width: 220,
  //   height: 160
  // },
  // Image: {
  //   borderRadius: 15,
  //   width: '60%',
  //   height: '60%',
  // },
});
export default FeedScreen;
