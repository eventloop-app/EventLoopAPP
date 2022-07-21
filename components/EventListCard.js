import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fontSize from "../constants/FontSize";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "../constants/Colors";
import moment from "moment";
import { toBuddhistYear } from "../constants/Buddhist-year";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

const platform = ['Discord', 'Zoom', 'Google', 'Microsoft']
const EventListCard = ({ item, onPress }) => {

    const eventName = item.eventName
    const [isLoading, setIsLoading] = useState(false)
    const eventDate = toBuddhistYear(moment(item.startDate), "DD/MM/YYYY")
    const eventTime = moment(item.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."
    const ImageCover = item.coverImageUrl
    const eventLocation = item.type === 'ONLINE' ? platform.map(items => {
        if (item.location.includes(items.toLocaleLowerCase())) {
            return items
        }
    }) : item.location.slice(0, 18) + '...'


    const checkPlatForm = (url) => {
        console.log(url)
        //
        // platform.map(item => url.includes(item))
        // return ""
    }

    const onLoadImage = () => {
        setTimeout(() => {
            setIsLoading(true)
        }, 1000)
    }

    return (
        <TouchableOpacity style={{ flex: 1, }} activeOpacity={0.7} onPress={onPress}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", width: "100%", height: "100%", borderRadius: 15, }}>
                <View style={{ width: "32%", paddingLeft: 5 }}>
                    <Image style={[styles.imageCard, {}]} resizeMode="cover" source={{
                        uri: (isLoading ? ImageCover : 'https://cdn.dribbble.com/users/1284666/screenshots/6321168/__3.gif')
                    }}
                        onLoad={onLoadImage} />
                </View>
                <View style={{ width: "65%", padding: 5 }}>
                    <Text numberOfLines={1} style={{ fontFamily: Fonts.bold, fontSize: FontSize.primary, color: "black" }}>{eventName}</Text>
                    <View style={{ flexDirection: "row", marginRight: 8, alignItems: "center" }}>
                        <Ionicons name={'calendar-sharp'} size={25} color={Colors.primary} style={{ margin: 1 }} />
                        <Text style={{ color: "gray", fontFamily: Fonts.primary }}>{
                            toBuddhistYear(moment(item.startDate), "DD/MM/YY")}</Text>
                        <Ionicons name={'ios-time-outline'} size={25} color={Colors.primary} />
                        <Text style={{ color: "gray", fontFamily: Fonts.primary }}> {moment(item.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <Ionicons name={item.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={25} color={Colors.primary} />
                        <Text style={{ color: "gray", fontFamily: Fonts.primary }} numberOfLines={1}> {eventLocation} </Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Container: {
        position: "relative",
        width: "100%",
        height: 300,
        backgroundColor: "white",
        alignItems: "center",
        overflow: "hidden",
    },
    ImageCover: {
        position: "absolute",
        left: 9,
        top: 9,
        borderRadius: 15,
        width: 200,
        height: 100
    },
    Image: {
        height: 90,
        width: 110,
        borderRadius: 15,
    },
    DateBox: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        left: 18,
        top: 18,
        borderRadius: 8,
        width: 55,
        height: 55,
        backgroundColor: "white",
    },
    BookmarkBox: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        right: 18,
        top: 18,
        borderRadius: 6,
        width: 30,
        height: 30,
        backgroundColor: "white",
    },
    Title: {
        position: "absolute",
        bottom: 95,
        left: 9
    },
    Date: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 65,
        left: 9,
    },
    Time: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 35,
        left: 9,
    },
    Location: {
        position: "absolute",
        bottom: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        left: 9,
    },
    TextTitle: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.medium,
        color: Colors.black,
        textAlign: 'left'
    },
    TextTime: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        textAlign: 'left',
        marginLeft: 5
    },
    TextDate: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        textAlign: 'left',
        marginLeft: 5
    },
    TextLocation: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        textAlign: 'left',
        marginLeft: 5
    },
    TextDateBoxNum: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.big,
        color: Colors.black,
        textAlign: 'center',
    },
    TextDateBox: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.medium,
        color: Colors.black,
        textAlign: 'center',
        marginTop: -15
    },
    imageCard: {
        height: 90,
        width: 110,
        borderRadius: 15,


    },
    card: {
        height: 120,
        width: "100%",
        alignItems: "center",
        paddingVertical: 2,
        paddingHorizontal: 8,


    },
});

export default EventListCard;
