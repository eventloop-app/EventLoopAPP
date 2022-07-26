import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Text, View, Dimensions, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import * as Location from 'expo-location';
import {createRef, useEffect, useState} from "react";

const MapScreen = () => {
    const [location, setLocation] = useState({
        latitude: 13.655195982451191,
        longitude: 100.49923007148183,
        latitudeDelta: 0.6616193304764995,
        longitudeDelta: 0.34865230321884155
    })
    const mapRef = createRef();

    const [marker, setMarker] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let nowLocation = await Location.getCurrentPositionAsync({});
            await setLocation({
                ...location,
                latitude: nowLocation.coords.latitude,
                longitude: nowLocation.coords.longitude
            })
        })();
    }, []);

    useEffect(()=>{
        if(marker.lat !== 0){
            mapRef.current.animateToRegion({
                latitude: marker.lat,
                longitude: marker.lng,
                longitudeDelta: 0.03,
                latitudeDelta: 0.03
            })
        }
    },[marker])

    return (
        <View style={styles.container}>
            <View>
                <MapView
                    ref={mapRef}
                    moveOnMarkerPress={true}
                    onMarkerDrag={()=> console.log('Mark')}
                    style={styles.maps}
                    provider={"google"}
                    showsUserLocation={true}
                    initialRegion={location}
                    followsUserLocation={true}
                    onPoiClick={(a) => console.log(a.nativeEvent)}
                >
                        <Marker onPress={()=> console.log('asdasd')}  description={"บันทาว"} coordinate={{ latitude: marker.lat, longitude: marker.lng }} />
                </MapView>
                <View style={{position: 'absolute', top: 44, width: '90%', left: "5%"}}>
                    <GooglePlacesAutocomplete
                        autoFocus={true}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            // console.log(data, details)
                            setMarker({
                                lat: details.geometry.location.lat,
                                lng: details.geometry.location.lng,
                            })

                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                        }}
                        query={{
                            key: 'AIzaSyBaiAdtJEvMsBB1MRKo_ld90kxv-kTEMi4',
                            location: `${location.latitude}, ${location.longitude}`,
                            radius: '15000',
                            language: 'th',
                            components: 'country:th',

                        }}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maps: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
});

export default MapScreen;