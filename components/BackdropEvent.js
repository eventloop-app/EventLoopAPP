import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider, useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {Easing} from 'react-native-reanimated';
import 'react-native-gesture-handler';

const BackdropEvent = (props) => {
  const bottomSheetModalRef = useRef(null);

  useCallback(()=> {
    console.log('Working')
    props.isShow ? bottomSheetModalRef.current?.present() : null
  }, [props])

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.linear

  });

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClosePress = () => bottomSheetModalRef.current.close()
  const handleClosePress2 = () => bottomSheetModalRef.current.expand()

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/*<Button*/}
        {/*  onPress={handlePresentModalPress}*/}
        {/*  title="Present Modal"*/}
        {/*  color="black"*/}
        {/*/>*/}
        <BottomSheetModal
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,}}
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
export default BackdropEvent;
