import React, {useEffect, useState} from 'react';
import {Button, FlatList, SafeAreaView, ScrollView, Text,} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../actions/user";
import decode from "../services/decode";
import eventsService from "../services/eventsService";
import EventCardList from "../components/EventCardList";
import Colors from "../constants/Colors";

const CreatedEventListScreen = ({route, navigation}) => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null)
    const [event, setEvent] = useState([])
    const { userToken, userError } = useSelector(state => state.user)


    useEffect(() => {
        dispatch(getUser())
    }, [])

    useEffect(()=> {
        if (userToken !== null) {
            const idToken = JSON.parse(userToken).idToken
            const user = decode.jwt(idToken)
            setUserData(user)
        }
        if (userError){
            console.log("userTokenErrorr : " + userError)
        }
    }, [userToken])

    useEffect( ()=> {
        getEvent()
    }, [userData])

    const getEvent = () => {
        if(userData !== null) {
            eventsService.getEventByOrganizerId(userData.memberId).then(res => {
                if(res.status === 200){
                    setEvent(res.data)
                }
            })
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
            <FlatList
                data={event}
                renderItem={(item) => <EventCardList item={item} onPress={ ()=> navigation.navigate('ManageEvent', item)}/>}
            />
            {/*<Button title={'go to manage screen'} onPress={()=> navigation.navigate('ManageEvent')}/>*/}
        </SafeAreaView>
    );
};

export default CreatedEventListScreen;
