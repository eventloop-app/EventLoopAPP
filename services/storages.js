import AsyncStorage from '@react-native-async-storage/async-storage';

class storages  {
  save = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log("SaveStorageError:" + error);
    }
  }

  remove = async (name) => {
    try {
      await AsyncStorage.removeItem(name)
    } catch (error) {
      console.log("RemoveStorageError:" + error);
    }
  }

  getData = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return data;
      }
    } catch (error) {
      console.log("GetStorageError:" + error);
    }
  }

  getDataV2 = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return new Promise(resolve => resolve(data))
      }
    } catch (error) {
      console.log("GetStorageError:" + error);
    }
  }
}

export default new storages();
