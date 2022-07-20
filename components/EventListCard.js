import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fontSize from "../constants/FontSize";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import moment from "moment";
import { toBuddhistYear } from "../constants/Buddhist-year";


const EventListCard = ({ item, onPress }) => {
    const [isLoading, setIsLoading] = useState(false)
    const eventDate = toBuddhistYear(moment(item.startDate), "DD/MM/YYYY")
    const eventTime = moment(item.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."
    const eventName = item.eventName
    const eventLocation = item.location
    const ImageCover = item.coverImageUrl

    const onLoadImage = () => {
        setTimeout(() => {
            setIsLoading(true)
        }, 1000)
    }


    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>

        </TouchableOpacity>
    )
}

export default EventListCard