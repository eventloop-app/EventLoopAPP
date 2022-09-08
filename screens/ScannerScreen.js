import React, {useEffect, useState} from 'react';
import {BarCodeScanner} from "expo-barcode-scanner";
import {Button, Text, View, StyleSheet} from "react-native";

const ScannerScreen = (props) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    // useEffect(()=> {
    //     console.log(props)
    // })
    useEffect(() => {
        (async () => {
            let unmount = false
            if(unmount !== true){
                const {status} = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
            }
            return ()=> {
                unmount = true
            }
        })();
    }, []);

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setTimeout(() => {
            props.navigation.navigate('EventDetail', {QRcode: data})
        }, 500)
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const test = () => {
        setTimeout(() => {
            setScanned(false)
        }, 3000)
    }

    return (
        <View style={styles.container}>
            <View style={{
                height: 300,
                width: '90%',
                borderRadius: 15,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: scanned ? 'green' : 'red'
            }}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{flex: 1, width: '100%'}}
                />

                {scanned && test()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ScannerScreen;