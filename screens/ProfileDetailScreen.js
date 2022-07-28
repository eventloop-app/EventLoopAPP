import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Fonts from '../constants/Fonts';
import FontSize from '../constants/FontSize';
const ProfileDetailScreen = props => {
  const [isLoad, setIsLoad] = useState(true);
  //useEffect
  // useEffect(() => {
  //     if (userToken !== null) {
  //         const idToken = JSON.parse(userToken).idToken
  //         const user = decode.jwt(idToken)
  //         setUserData(user)
  //     }
  //     if (userError) {
  //         console.log("userTokenErrorr : " + userError)
  //     }
  //     setIsLoad(false)
  // }, [userToken])

  const renderProfileScreen = () => {
    return (
      <View>
        <Text>55555555555</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
      {isLoad ? (
        <Text style={styles.CenterScreenText}>Loading...</Text>
      ) : (
        renderProfileScreen()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  CenterScreenText: {
    position: 'relative',
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: FontSize.primary,
  },
});

export default ProfileDetailScreen;
