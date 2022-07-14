import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import moment from "moment/moment";
import {toBuddhistYear} from "../constants/Buddhist-year";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

function EventCardList({item, onPress}) {

    const name = item.item.eventName
    const image = item.item.coverImageUrl
    const start = toBuddhistYear(moment(item.item.startDate), "dd DD MMM YY")
    const end = toBuddhistYear(moment(item.item.endDate), "dd DD MMM YY")
    const startTime = moment(item.item.startDate).format('HH:mm')
    const endTime = moment(item.item.endDate).format('HH:mm')
    return (

        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={onPress}
        >
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    width: '90%',
                    height: 100,
                    borderRadius: 10,
                    marginTop: 10,
                    backgroundColor: 'white',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 0.4,
                        height: 80,
                        borderRadius: 10,
                        marginLeft: 12,
                        overflow: 'hidden'
                    }}>
                        <Image
                            style={{width: "100%", height: "100%"}}
                            source={{
                                uri: image
                            }}
                        />
                    </View>
                    <View style={{flex: 1, height: 75, marginLeft: 12, marginRight: 10, justifyContent: 'center'}}>
                        <Text style={{fontFamily: fonts.bold, fontSize: fontSize.small, }}>{`${start} - ${end}`}</Text>
                        <Text  numberOfLines={1}  style={{fontFamily: fonts.bold, fontSize: fontSize.medium}}>{name}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default EventCardList;