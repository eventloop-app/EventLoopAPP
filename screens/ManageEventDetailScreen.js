import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
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
  useEffect(() => {
    setEventId(props.route.params.id)
  }, [])

  useEffect(() => {
    if (evntId !== null) {
      eventsService.getMemberRegistedEvent(userData.id, evntId).then(res => {
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
      </View>
    </View>
  )

  return (isLoad ?
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
      </SafeAreaView> :
      <SafeAreaView style={{flex: 1, marginTop: (Platform.OS === "ios" ? 0 : 50), backgroundColor: Colors.white}}>
        <View style={{height: 350, margin: 10}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>รายชื่อของผู้ร่วมกิจกรรม</Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: 20}}
            data={userJoin}
            renderItem={({item}) => renderCard(item)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        </View>
        <TouchableOpacity
          style={{position: "absolute", width: "100%", bottom: 100, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => props.navigation.pop()}>
          <Text style={{textAlign: 'center'}}>ปิดหน้าต่าง</Text>
        </TouchableOpacity>
      </SafeAreaView>
  );
};

export default ManageEventDetailScreen;