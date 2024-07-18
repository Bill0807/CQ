import AsyncStorage from "@react-native-async-storage/async-storage";

// get
const get = async (key, defaultValue) => {
  const result = await AsyncStorage.getItem(key);
  return result ? JSON.parse(result) : defaultValue;
};

// set
const set = async (key, value) => {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
};

// remove
const remove = async (key) => {
  return await AsyncStorage.removeItem(key);
};

export default { get, set, remove };
