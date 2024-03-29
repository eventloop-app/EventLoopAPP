import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator, Button,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import eventsService from "../services/eventsService";
import {useSelector} from "react-redux";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import profileImageMock from "../assets/images/profileImage.jpg";
import Colors from "../constants/Colors";


const ManageEventDetailScreen = (props) => {
  const {user} = useSelector(state => state.user)
  const [userData, SetUserData] = useState(JSON.parse(user))
  const [evntId, setEventId] = useState(null)
  const [userJoin, setUserJoin] = useState({})
  const [isLoad, setIsLoad] = useState(true)
  const [showQr, setShowQr] = useState(false)
  const [checkInData, setCheckInData] = useState({qr : null, code: null})
  const [endDate, setEndDate] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    setEventId(props.route.params.id)
    setEndDate(props.route.params.endDate)
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log(userData.id, evntId)
    eventsService.getMemberRegistedEvent(userData.id, props.route.params.id).then(res => {
      console.log(res.data)
      setUserJoin(res.data)
      setRefreshing(false)
    }).catch(e => console.log(e))
  }, []);

  useEffect(() => {
    if (evntId !== null) {
      eventsService.getMemberRegistedEvent(userData.id, evntId).then(res => {
        console.log(res.data)
        setUserJoin(res.data)
        setIsLoad(false)
      }).catch(e => console.log(e))
    }
  }, [evntId])

  const renderCard = (user) => (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={{
        flex:1,
        flexDirection: "row",
        width: '100%',
        height: '12%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
      }}>
        <Image source={user?.profileUrl ? {uri: user?.profileUrl} : profileImageMock}
               style={{width: 60, height: 60, borderRadius: 60 / 2}}/>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.small, paddingLeft:8}}>{user?.username}</Text>
        <View style={{flex: 1, width: "100%", alignItems: "flex-end"}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.small, paddingRight:8, color: (user.isCheckIn ? Colors.green : Colors.lightgray)}}>{(user.isCheckIn ? "เช็คอินเรียบร้อย" : "ยังไม่ได้เช็คอิน")}</Text>
        </View>
      </View>
    </View>
  )

  const onCheckIn = () => {
    setIsLoad(true)
    eventsService.getCodeCheckIn(userData.id, evntId).then( res => {
      console.log(res.data)
      if(res.status === 200){
        setCheckInData({qr: res.data.base64CheckInCode, code: res.data.checkInCode})
        setShowQr(true)
        setIsLoad(false)
      }
    })
  }

  return (isLoad ?
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
      </SafeAreaView> :
      <SafeAreaView style={{flex: 1, marginTop: (Platform.OS === "ios" ? 0 : 50), backgroundColor: Colors.white}}>
        <View style={{height: 300, margin: 10}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>รายชื่อของผู้ร่วมกิจกรรม</Text>
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: 20}}
            data={userJoin}
            renderItem={({item}) => renderCard(item)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        </View>
        <TouchableOpacity
          style={{position: "absolute", width: "100%", bottom: 150, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => onCheckIn()}>
          <Text style={{textAlign: 'center'}}>เช็คอิน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{position: "absolute", width: "100%", bottom: 100, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => props.navigation.pop()}>
          <Text style={{textAlign: 'center'}}>ปิดหน้าต่าง</Text>
        </TouchableOpacity>
        {
          (showQr &&
            <View style={{position: "absolute", flex: 1, width: "100%", height:"120%", backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50}}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{uri: `data:image/jpeg;base64,${checkInData.qr}`}}
                       style={{width: 270, height: 270, borderRadius: 12}}/>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium, color: Colors.white}}>{`Code : ${checkInData.code}`}</Text>
                <TouchableOpacity onPress={()=> setShowQr(!showQr)}>
                  <View style={{marginTop: 20, backgroundColor: Colors.red, padding: 8, borderRadius: 20}}>
                    <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.white}}>ปิดหน้าต่าง</Text>
                  </View>
                </TouchableOpacity>
              </View>
          </View>)
        }
      </SafeAreaView>

  );
};

export default ManageEventDetailScreen;