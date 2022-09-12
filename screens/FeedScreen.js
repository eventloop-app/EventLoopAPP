import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator, Platform, RefreshControl
} from "react-native";
import React, {useCallback, useEffect, useState,} from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import EventCardHorizon from "../components/EventCardHorizon";
import {Ionicons, AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {useSelector} from "react-redux";

import {useIsFocused} from "@react-navigation/native";
const FeedScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(true)
  const [allEvents, setAllEvent] = useState([])
  const [eventByTag, setEventByTag] = useState([])
  const [eventByRegistered, setEventByRegistered] = useState([])
  const [eventByAttention, setEventByAttention] = useState([])
  const [feedbackTitle, setFeedbackTitle] = useState("ราชสีมาวิทยาลัย")
  const [hasFeedBack, setHasFeedBack] = useState(false)
  const [onLoadData, setLoadData] = useState(false)
  const [page, setPage] = useState(0)
  const {user} = useSelector(state => state.user)
  const [userData, setUserData] = useState(null)
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getEvent()
  }, []);

  useEffect(() => {
    if (isFocused !== false) {
      if(user !== null && userData === null){
        setIsLoading(true)
        setUserData(JSON.parse(user))
        getEvent()
        setTimeout(()=>{
          setIsLoading(false)
        },50)
      }else if (user === null && userData !== null){
        setIsLoading(true)
        setUserData(null)
        setTimeout(()=>{
          setIsLoading(false)
        },50)
      }else{
        setUserData(JSON.parse(user))
      }
    }
  }, [isFocused])

  //ดึง Event ทั้งหมด
  useEffect(() => {
    getEvent()
  }, [userData])

  // get Event
  const getEvent = async () => {
    console.log('============ GetEvent =============')
    const timeout = setTimeout(() => {
      console.log("TimeOut !")
      navigation.navigate("Error")
    }, 5000)
    eventsService.getAllEvent().then(async res => {
      if (res.status === 200) {
        await clearTimeout(timeout);
        await setAllEvent(res.data.content)
        await setRefreshing(false)
        if(user){
          await getEventByTag()
        }else{
          await getEventByAttention()
        }
      }
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })
    await setIsLoading(false)
  }

  const getEventByTag = async () => {
    eventsService.getEventByTag(userData.tags).then(async (res) => {
      if (res.status === 200) {
        await setEventByTag(res.data.content)
        await getEventByAttention()
      } else {
        console.log("TagsError")
      }
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })

    await setIsLoading(false)
  }

  const getEventByAttention = async () => {
    eventsService.getEventByAttention().then(async res => {
      if (res.status === 200) {
        await setEventByAttention(res.data.content)
        await getRegisterEvent()
      }

    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })
  }

  const getRegisterEvent = async () => {
    eventsService.getAllRegisteredEvent().then(async res => {
      if (res.status === 200) {
        await setEventByRegistered(res.data.content)
        await setIsLoading(false)
      }
    }).catch(error => {
      console.log('get_all_event: ' + error.message)
    })
    await setIsLoading(false)
  }

  const renderEventShortcutSection = () => {
    return ( user &&
      <View style={[styles.shadowsCard, {backgroundColor: Colors.lightpink, alignItems: "center"}]}>

        <View>
          <View
            style={{paddingVertical: 10, flexDirection: "row", flexWrap: "wrap", width: "100%", alignItems: "center",}}>

            <TouchableOpacity style={[styles.shortcutBtn, {display: eventByAttention ? "flex" : "none"}]}
                              onPress={() => navigation.navigate('ListSelectedEvent', {
                                name: "กำลังมาแรง",
                                data: eventByAttention
                              })}>
              <View style={styles.subShortcutBtn}>
                <MaterialCommunityIcons color={"red"} name={"fire"} size={30}/>
              </View>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.small,
                color: Colors.black
              }}>มาแรง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', {
              name: "กิจกรรมที่เหมาะกับคุณ",
              data: eventByTag
            })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"pricetag"} size={30}/>
              </View>
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: FontSize.small,
                color: Colors.black
              }}>ความสนใจ</Text>
            </TouchableOpacity>

            {/*<TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', { name: "บุ๊กมาร์ก", })}>*/}
            {/*  <View style={styles.subShortcutBtn}>*/}
            {/*    <Ionicons color={"black"} name={"bookmark"} size={30} />*/}
            {/*  </View>*/}
            {/*  <Text>บุ๊กมาร์ก</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity style={styles.shortcutBtn}
                              onPress={() => navigation.navigate('ListSelectedEvent', {name: "ใกล้ฉัน"})}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"md-location-sharp"} size={30}/>
              </View><Text style={{
              fontFamily: Fonts.primary,
              fontSize: FontSize.small,
              color: Colors.black
            }}>ใกล้ฉัน</Text>
            </TouchableOpacity>

            {/*<TouchableOpacity style={styles.shortcutBtn}*/}
            {/*                  onPress={() => navigation.navigate('ListSelectedEvent', {name: "กำลังจะเริ่ม"})}>*/}
            {/*  <View style={styles.subShortcutBtn}>*/}
            {/*    <MaterialCommunityIcons color={"black"} name={"calendar-clock"} size={30}/>*/}
            {/*  </View>*/}
            {/*  <Text style={{*/}
            {/*    fontFamily: Fonts.primary,*/}
            {/*    fontSize: FontSize.small,*/}
            {/*    color: Colors.black*/}
            {/*  }}>กำลังจะเริ่ม</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', {
              name: "ที่ลงทะเบียน",
              data: eventByRegistered
            })}>
              <View style={styles.subShortcutBtn}>
                <AntDesign color={"black"} name={"form"} size={30}/>
              </View><Text style={{
              fontFamily: Fonts.primary,
              fontSize: FontSize.small,
              color: Colors.black
            }}>ที่ลงทะเบียน</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('ListSelectedEvent', {
              name: "ทั้งหมด",
              data: allEvents
            })}>
              <View style={styles.subShortcutBtn}>
                <Ionicons color={"black"} name={"ios-layers"} size={30}/>
              </View><Text style={{
              fontFamily: Fonts.primary,
              fontSize: FontSize.small,
              color: Colors.black
            }}>ทั้งหมด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }


  const renderRemindFeedback = () => {
    return (
      <View style={[styles.shadowsCard, styles.feedBack, {display: "flex"}]}>
        <View style={{}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 6}}>
            <Text style={styles.textTitle}>กิจกรรมที่ยังไม่รีวิว</Text>
            <View style={{flexDirection: "row", alignItems: "center", paddingRight: 10}}>
              <Text style={styles.textMore}>เพิ่มเติม</Text>
              <Ionicons name={'play'} color={Colors.black} size={10}/>
            </View>
          </View>

          <TouchableOpacity style={{flexDirection: "row", marginHorizontal: 10, marginTop: 4}}>
            <View style={[styles.ImageCover, {backgroundColor: "white", borderRadius: 15, padding: 1}]}>
              <Image
                style={[styles.Image, {height: 100, width: 160, borderRadius: 15}]}
                source={{
                  uri: "https://cdn.zipeventapp.com/blog/2020/09/2020-09-09_04-59-46_zip-onlineevent.png"
                }}
              />
            </View>

            <View style={{paddingHorizontal: 10,}}>
              <View style={{height: 20,}}>
                <Text numberOfLines={1}
                      style={{fontFamily: Fonts.medium, fontSize: FontSize.primary}}>{feedbackTitle}</Text>
              </View>
              <View style={{flexDirection: "row", marginTop: 10}}>
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
      <View style={[styles.eventSection, {display: allEvents ? "flex" : "none"}]}>
        <View style={[styles.cardHeader]}>
          <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Text style={styles.textTitle}>กิจกรรม</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', {name: 'กิจกรรม', data: allEvents})} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10}/>
          </View>
        </View>
        <FlatList
          data={allEvents}
          renderItem={({item}) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })}/>)}
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
      <View style={[styles.eventSection, {display: eventByTag ? "flex" : "none"}]}>
        <View style={[styles.cardHeader]}>
          <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Text style={styles.textTitle}>กิจกรรมที่เหมาะกับคุณ</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', {
            name: 'กิจกรรมที่เหมาะกับคุณ',
            data: eventByTag
          })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10}/>
          </View>
        </View>
        <FlatList
          data={eventByTag}
          renderItem={({item}) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })}/>)}
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
      <View style={[styles.eventSection, {display: eventByAttention ? "flex" : "none"}]}>
        <View style={[styles.cardHeader]}>
          <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Text style={styles.textTitle}>กำลังมาแรง</Text>
          </View>
          <View
            onTouchEnd={() => navigation.navigate('ListSelectedEvent', {name: 'กำลังมาแรง', data: eventByAttention})}
            style={{
              flex: 0.3,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: 10
            }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10}/>
          </View>
        </View>
        <FlatList
          data={eventByAttention}
          renderItem={({item}) => (<EventCardHorizon item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })}/>)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }

  const renderRegisteredEventSection = () => {
    return (
      <View style={[styles.eventSection, {display: eventByRegistered ? "flex" : "none"}]}>
        <View style={[styles.cardHeader]}>
          <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Text style={styles.textTitle}>กิจกรรมที่คุณได้ลงทะเบียน</Text>
          </View>
          <View onTouchEnd={() => navigation.navigate('ListSelectedEvent', {
            name: 'รายการกิจกรรมที่ลงทะเบียน',
            data: eventByRegistered
          })} style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Text style={styles.textMore}>
              เพิ่มเติม
            </Text>
            <Ionicons name={'play'} color={Colors.black} size={10}/>
          </View>
        </View>
        <FlatList
          data={eventByRegistered}
          renderItem={({item}) => (<EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
            item: item,
            name: item.eventName
          })}/>)}
          keyExtractor={(item) => item.id}
          extraData={eventId}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    )
  }


  return (isLoading ?
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
      </SafeAreaView> :
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          {Platform.OS === 'android' ?
            (
              <View style={[styles.iphoneHeaderBar, {
                paddingTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }]}>
                <View style={{flexDirection: "row", marginLeft: 16}}>
                  <Image
                    source={userData?.profileUrl ? {uri: userData?.profileUrl} : require('../assets/images/profileImage.jpg')}
                    style={{
                      height: 50,
                      width: 50,
                      backgroundColor: Colors.gray,
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: Colors.white
                    }}/>
                  <View style={{
                    backgroundColor: Colors.white,
                    alignSelf: 'flex-start',
                    borderRadius: 30,
                    paddingHorizontal: 8,
                    marginTop: 12,
                    marginLeft: 4
                  }}>
                    <Text numberOfLines={1} style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                    }}>{userData?.username ? userData?.username : "คุณยังไม่ได้เข้าสู้ระบบ"}</Text>
                  </View>
                </View>
                {/*<View style={{ backgroundColor: Colors.white, borderRadius: 30, padding: 6, margin: 6, marginTop: 12, marginRight: 16, alignItems: "center", justifyContent: "center" }}>*/}
                {/*  <Feather name={"bell"} size={24} color="black" />*/}
                {/*</View>*/}
              </View>
            )
            :
            (
              <View style={[styles.iphoneHeaderBar, {
                paddingTop: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }]}>
                <View style={{flexDirection: "row", marginLeft: 16}}>
                  <Image
                    source={userData?.profileUrl ? {uri: userData?.profileUrl} : require('../assets/images/profileImage.jpg')}
                    style={{
                      height: 50,
                      width: 50,
                      backgroundColor: Colors.gray,
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: Colors.white
                    }}/>
                  <View style={{
                    backgroundColor: Colors.white,
                    alignSelf: 'flex-start',
                    borderRadius: 30,
                    paddingHorizontal: 8,
                    marginTop: 12,
                    marginLeft: 4
                  }}>
                    <Text numberOfLines={1} style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                    }}>{userData?.username ? userData?.username : "คุณยังไม่ได้เข้าสู้ระบบ"}</Text>
                  </View>
                  {/* <TouchableOpacity style={{ display: userData ? "flex" : "none", backgroundColor: "white", alignSelf: 'flex-start', borderRadius: 30, paddingHorizontal: 8, marginTop: 12, marginLeft: 4 }}>
                  <Text numberOfLines={1} style={{ fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.black, }}> "Login" </Text>
                </TouchableOpacity> */}
                </View>
                {/*<View style={{ backgroundColor: Colors.white, borderRadius: 30, padding: 6, margin: 6, marginTop: 12, marginRight: 16, alignItems: "center", justifyContent: "center" }}>*/}
                {/*  <Feather name={"bell"} size={24} color="black" />*/}
                {/*</View>*/}
              </View>
            )
          }
          <ScrollView
            refreshControl = {<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{paddingTop: 110}}>
            <View style={{paddingBottom: 110}}>
              {renderEventByAttentionSection()}
              {renderEventShortcutSection()}
              {renderAllEventSection()}
              { user && renderEventByTagSection()}
              {/*{ user && renderRegisteredEventSection()}*/}
              <View style={{display: hasFeedBack ? "flex" : "none"}}>
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
  iphoneHeaderBar: {
    position: 'absolute',
    display: 'flex',
    width: "100%",
    height: (Platform.OS === "ios" ? 110 : 80),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  androidHeaderBar: {
    position: 'absolute',
    display: 'flex',
    width: "100%",
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.primary,
    zIndex: 10,
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
