import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import EventCard from "../components/EventCard";
import eventsService from "../services/eventsService";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useFocusEffect} from '@react-navigation/native'
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";

const FeedScreen = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [eventId, setEventId] = useState(true)
    const [events, setEvent] = useState([])
    const [isVisible, setIsVisible] = useState(false)

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

    //ดึง Event ทั่งหมด
    useEffect(() => {
        getEvent()
    }, [])

    const getEvent = async () => {
        eventsService.getEventAll().then(res => {
            setEvent(res.data.content)
        }).catch(error => {
            console.log('get_all_event: ' + error.message)
            alert('ผิดพลาดดด \n' + error.message)
        })
        await setIsLoading(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            {
                isLoading ? null :
                    <View>
                        <View style={styles.header}>
                            {/*something*/}
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', width: '100%', height: 30}}>
                            <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={styles.textTitle}>กิจกรรมที่กำลังจะเริ่มเร็วๆนี้</Text>
                            </View>
                            <View
                                onTouchEnd={() => navigation.navigate('EventList', {name: 'รายการกิจกรรมที่ลงทะเบียน'})}
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
                            data={events}
                            renderItem={({item}) => (
                                    <EventCard item={item} onPress={() => navigation.navigate('EventDetail', {
                                        item: item,
                                        name: item.eventName
                                    })}/>
                            )}
                            keyExtractor={(item) => item.id}
                            extraData={eventId}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        />
                    </View>

            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        flex: 1,
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
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: 100,
        backgroundColor: Colors.primary,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        marginBottom: 10
    },
});
export default FeedScreen;
