import React from 'react';
import {
    Keyboard,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {AirbnbRating, Rating} from "react-native-ratings";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";

const Star = require('../assets/images/star.png')
const ReviewEventScreen = ({ route, navigation }) => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 1, marginTop: Platform.OS === 'Android' ? 50 : 10}}>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: fonts.bold,
                    fontSize: fontSize.primary,
                    marginBottom: 15
                }}>
                    ความพึงพอใจในการเข้าร่วมกิจกรรม
                </Text>
                <AirbnbRating
                    starImage={Star}
                    count={5}
                    showRating={false}
                    defaultRating={5}
                    size={40}
                />
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={true}>
                    <View style={{paddingTop: 30}}>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: fonts.bold,
                            fontSize: fontSize.primary,
                            marginBottom: 5
                        }}>
                            รีวิวกิจกรรม
                        </Text>
                        <TextInput
                            multiline
                            style={{
                                margin: 12,
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 12,
                                height: 200,
                                fontFamily: fonts.primary,
                                fontSize: fontSize.primary,
                            }}
                            placeholder=""
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{position: 'absolute', bottom: 20, left: 12}}>
                    <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.goBack()}>
                            <View style={{width: 350, height: 60, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, color: Colors.white}}>ยืนยัน</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ReviewEventScreen;