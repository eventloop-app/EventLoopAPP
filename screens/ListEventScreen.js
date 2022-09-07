import { View, Text, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../constants/Colors'
import FontSize from '../constants/FontSize'
import Fonts from '../constants/Fonts'
import EventCardType4 from './../components/EventCardType4';

const ListEventScreen = ({ route, navigation }) => {
    const [event, setEvent] = useState(route.params.data)
    const [eventId, setEventId] = useState(true)

    return (
        < SafeAreaView style={{ flex: 1 }} >
            <View style={styles.container}>
 
                <FlatList
                    style={{ paddingBottom: 20 }}
                    data={event}
                    renderItem={({ item }) => (<EventCardType4 item={item} onPress={() => navigation.navigate('EventDetail', {
                        item: item,
                        name: item.eventName
                    })} />)}
                    keyExtractor={(item) => item.id}
                    extraData={eventId}
                    showsHorizontalScrollIndicator={false}
                    horizontal={false}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
})
export default ListEventScreen