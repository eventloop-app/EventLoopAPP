import React, {useEffect, useState} from 'react';
import {Button,  SafeAreaView, StyleSheet, Text, View} from "react-native";
import {makeRedirectUri, useAuthRequest, useAutoDiscovery} from "expo-auth-session";
import {useDispatch, useSelector} from "react-redux";
import {SignIn, SignOut} from "../actions/auth";
import {saveUser} from "../actions/user";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import eventsService from "../services/eventsService";
import ProfileDetailScreen from "./ProfileDetailScreen";

const ProfileScreen = ({navigation}) => {
    const [isLoad, setIsLoad] = useState(false)
    const discovery = useAutoDiscovery("https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0");
    const redirectUri = makeRedirectUri({scheme: null});
    const dispatch = useDispatch();
    //ดึงข้อมูลตอน Login
    const {authData, authDataError} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.user)

    useEffect( ()=> {
        if(authData !== null && user === null){
            eventsService.checkEmail(authData.user.email).then( async res => {
                if(!res.data.hasEmail) {
                    navigation.navigate('EditProfile', {user: authData.user})
                }else{
                    setTimeout(()=>{
                        dispatch(saveUser(JSON.stringify(res.data.member)))
                    }, 200)
                }
            })
        }
    }, [authData])

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: "4bf4a100-9aeb-42be-8649-8fd4ef42722b",
            clientSecret: "3~68Q~sLI_5IxI1m7m8PdKEP_XGT4xWXfXCdIdfG",
            scopes: ["openid", "profile", "email", "offline_access"],
            responseType: "code",
            prompt: "login",
            redirectUri,
        },
        discovery,
    );

    useEffect(() => {
        if (response && "params" in response) {
            if (response.params && "code" in response.params) {
                // console.log("-----------------------");
                // console.log(response.params.code);
                // console.log("-----------------------");
                // console.log(request.codeVerifier);
                // console.log("-----------------------")
                dispatch(SignIn(response.params.code, request.codeVerifier))
            }
        }
    }, [response]);

    const renderProfile = () => (
        <SafeAreaView>
            <View>
                <Text style={styles.CenterScreenText}>คุณยังไม่ได้เข้าสู่ระบบ</Text>
                <Button
                    title="Sign in"
                    onPress={() => promptAsync()}
                />
            </View>
        </SafeAreaView>
    )

    return (
      user ?
      <ProfileDetailScreen/>
        :
        <SafeAreaView style={styles.Container}>
            {
                isLoad ?
                    <Text style={styles.CenterScreenText}>
                        Loading...
                    </Text>
                    :
                    renderProfile()
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    CenterScreenText: {
        textAlign: 'center',
        fontFamily: fonts.bold,
        fontSize: fontSize.primary
    }
});

export default ProfileScreen;
