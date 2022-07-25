import {Button, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import ReactNativeParallaxHeader from "react-native-parallax-header";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import 'react-native-gesture-handler';
import eventsService from "../services/eventsService";
import {useSelector} from "react-redux";
import decode from "../services/decode";


const ManageEventScreen = (props) => {
    const [event, setEvent] = useState(null)
    const bottomSheetModalRef = useRef(null);
    const { userToken, userError } = useSelector(state => state.user)
    const snapPoints = useMemo(() => ['20%', '50%'], []);
    const [userData, setUserData] = useState(null)
    const [code, setCode] = useState(null)

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    useEffect(() => {
        setEvent(props.route.params.item)
    }, [])

    useEffect( () => {
        if (userToken !== null) {
            const idToken = JSON.parse(userToken).idToken
            const user = decode.jwt(idToken)
            setUserData(user)
        }
        if (userError){
            console.log("userTokenErrorr : " + userError)
        }
    }, [userToken])

    const onCheckIn = () => {
        if(code === null){
            eventsService.getCodeCheckIn(userData.memberId,event.id).then( async res => {
                if (res.status === 200) {
                    await setCode(res.data)

                    await handlePresentModalPress()
                }
            }).catch(e => {
                console.log(e)
            })
        }else if(code !== null){
            handlePresentModalPress()
        }
    }

    return (
        <View style={{flex: 1}}>
            <ReactNativeParallaxHeader
                headerMinHeight={100}
                headerMaxHeight={200}
                extraScrollHeight={100}
                backgroundColor={Colors.red}
                // navbarColor="#3498db"
                titleStyle={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.large,
                    color: Colors.white,
                    marginLeft: 10,
                }}
                title={event?.eventName}
                backgroundImage={{uri: event?.coverImageUrl}}
                backgroundImageScale={2}
                navbarColor="#FFF"
                alwaysShowNavBar={false}
                renderNavBar={() => (
                    <View style={{
                        height: 100,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 60
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: 'center',
                                fontFamily: Fonts.bold,
                                fontSize: FontSize.primary,
                                color: Colors.black,
                            }}>
                            {event?.eventName}
                        </Text>
                    </View>
                )}
                renderContent={() => (
                    <View style={{marginTop: 5, backgroundColor: Colors.white}}>
                        <TouchableOpacity onPress={() => onCheckIn()}>
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: Fonts.bold,
                                fontSize: FontSize.primary,
                                color: Colors.black,
                            }}>
                                เช็คอิน
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                // containerStyle={}
                // contentContainerStyle={{flex: 1, borderRadius: 15, overflow: 'hidden'}}
                // innerContainerStyle={{flex: 1, borderRadius: 15,  backgroundColor: 'transparent', overflow: 'hidden'}}
                scrollViewProps={{
                    onScrollBeginDrag: () => console.log('onScrollBeginDrag'),
                    onScrollEndDrag: () => console.log('onScrollEndDrag'),
                }}
            />
            <BottomSheetModalProvider>
                <View>
                    <BottomSheetModal
                        style={{
                            borderRadius: 20,
                            shadowColor: 'black',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            backgroundColor: 'white',
                            elevation: 5,
                        }}
                        ref={bottomSheetModalRef}
                        index={1}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                    >
                        <View style={styles.contentContainer}>
                            <Image style={{
                                width: 200,
                                height: 200,
                            }}
                                   source={{uri: 'data:image/png;base64,' + code?.base64CheckInCode}}
                            />
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: Fonts.bold,
                                fontSize: FontSize.primary,
                                color: Colors.black,
                            }}>{`CODE : ${code?.checkInCode}`}</Text>
                            <Button title={'Close'} onPress={() => bottomSheetModalRef.current?.dismiss()}/>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});
export default ManageEventScreen
