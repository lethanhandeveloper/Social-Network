import { registerRootComponent } from 'expo';
import { auth } from './firebase';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfoByKey } from './src/firebase/database';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
auth.onAuthStateChanged(() => {
    if (auth.currentUser.uid) {
      getUserInfoByKey(auth.currentUser.uid).on("value", async (snapshot) => {
        const userJson = snapshot.val();
        userJson.key = auth.currentUser.uid;
        await AsyncStorage.setItem('userInfo', JSON.stringify(userJson));
      })
    }else{
      console.log(auth.currentUser);
    }
  })

registerRootComponent(App);
