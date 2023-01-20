import AsyncStorage from '@react-native-async-storage/async-storage';

const setUserInfo = async (user) => {
    const userJson = JSON.stringify(user)
    await AsyncStorage.setItem('userInfo', userJson)
}

const getUserInfo = async () => {
    return await AsyncStorage.getItem('userInfo');
}

export {
    setUserInfo,
    getUserInfo
}