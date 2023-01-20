import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  LogBox
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import theme from "../../assets/colors";
import { Entypo, Feather } from "react-native-vector-icons";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { login, signup } from "../firebase/auth";
import { auth } from "../../firebase";
import { uploadImage } from "../firebase/storage";
import messaging from "@react-native-firebase/messaging";
import { getUserInfoByKey } from "../../src/firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';


LogBox.ignoreLogs(['AsyncStorage']);

//https://www.youtube.com/watch?v=DCYOxZcMgHQ&t=310s
const Auth = ({ navigation }) => {
  const [switchForm, setSwitchForm] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState({ isShow: false, message: "" });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }

    console.log("Token :" + (await messaging().getToken()));

    // messaging().onTokenRefresh(async () => {
    //   console.log("RToken :"+await messaging().getToken());
    // })
  }

  useEffect(() => {

    console.log("Current user "+ auth.currentUser);
    auth.onAuthStateChanged(() => {
      if (auth.currentUser.uid) {
        getUserInfoByKey(auth.currentUser.uid).on("value", async (snapshot) => {
          const userJson = snapshot.val();
          userJson.key = auth.currentUser.uid;
          await AsyncStorage.setItem('userInfo', JSON.stringify(userJson));
        })
        navigation.navigate("Main");
        
      }else{
        console.log("Chua dang nhap");
        console.log(auth.currentUser);
      }
    })
   

    try {
      requestUserPermission();

      messaging().onMessage((remoteMessage) => {
        console.log("OOOOOOOOOOO");
        displayNotification(
          remoteMessage.notification.title,
          remoteMessage.notification.body
        );

        messaging()
          .setBackgroundMessageHandler((remoteMessage) => {
            displayNotification(
              remoteMessage.notification.title,
              remoteMessage.notification.body
            );

            
          })
        
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLogin = (userInfo) => {
    setLoading(true);

    login(userInfo.email, userInfo.password)
      .then((res) => {
        setLoading(false);
        getUserInfoByKey(auth.currentUser.uid).on("value", async (snapshot) => {
          const userJson = snapshot.val();
          userJson.key = auth.currentUser.uid;
          await AsyncStorage.setItem('userInfo', JSON.stringify(userJson));
        })
        navigation.navigate("Main");
      })
      .catch((err) => {
        setLoading(false);
        setAlertProps({ isShow: true, message: err.message });
      });
  };

  const handleSignUp = (userInfo) => {
    setLoading(true);

    uploadImage("avatars", userInfo.avatar)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadUrl) => {
          // console.log({ avatar : downloadUrl,
          //   email : userInfo.email,
          //   password: userInfo.password,
          //   firstName: userInfo.firstName,
          //   lastName : userInfo.lastName,
          //   gender : userInfo.gender,
          //   phone : userInfo.phone  });
          // userInfo.avatar.uri = downloadUrl;
          signup({
            avatar: downloadUrl,
            email: userInfo.email,
            password: userInfo.password,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            gender: userInfo.gender,
            phone: userInfo.phone,
          })
            .then((res) => {
              setLoading(false);
              setAlertProps({ isShow: true, message: "Sign up Successfully" });
              setSwitchForm(true);
            })
            .catch((err) => {
              setAlertProps({ isShow: true, message: err.message });
              setLoading(false);
            });
        });
      })
      .catch((err) => console.log(err.message));    
  };

  async function displayNotification(title, body) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    // notifee.createChannel({
    //   id: 'custom-sound',
    //   name: 'Channel with custom sound',
    //   sound: 'hollow',
    // });

    await notifee.displayNotification({
      title: title,
      body: body,
      smallIcon: "ic_launcher",
      android: {
        channelId,
        largeIcon:
          "https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__480.png",
        
        sound: "ting"
      },
      
    });
  }

  return (
    <ScrollView style={styles.container}>
      <AwesomeAlert
        show={alertProps.isShow}
        showProgress={false}
        title=""
        message={alertProps.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={theme.colors.green}
        onCancelPressed={() => {
          this.hideAlert();
        }}
        onConfirmPressed={() => {
          setAlertProps({ ...alertProps, isShow: false });
        }}
      />
      {isLoading && (
        <ActivityIndicator
          size="large"
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 2,
          }}
        />
      )}
      <View style={styles.logoWrapper}>
        <Image source={require("../../assets/images/icons/logo.png")} />
        <Text style={styles.bigLogoText}>Z Hungry</Text>
        <Text style={styles.smallLogoText}>Welcome back</Text>
      </View>

      {/* <LoginForm handleLogin={handleLogin}/> */}
      {switchForm ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <SignUpForm handleSignUp={handleSignUp} />
      )}
      <Pressable
        style={styles.toggleFromLabelWrapper}
        onPress={() => setSwitchForm(!switchForm)}
      >
        {switchForm ? (
          <Text style={styles.toggleFromLabelText}>
            Bạn chưa có tài khoản ? Đăng ký ngay
          </Text>
        ) : (
          <Text style={styles.toggleFromLabelText}>
            Bạn đã có tài khoản ? Đăng nhập
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
      },
    });
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 13,
    backgroundColor: theme.colors.white,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  bigLogoText: {
    fontSize: 24,
    fontFamily: "Rubik-Regular",
    color: "#2D3F65",
  },
  smallLogoText: {
    fontSize: 9,
    fontFamily: "Rubik-Regular",
    color: theme.colors.lightGray,
  },

  designByText: {
    color: theme.colors.lightGray,
    fontSize: 9,
    fontFamily: "Rubik-Regular",
  },
  toggleFromLabelWrapper: {
    alignSelf: "center",
    marginTop: 8,
  },
  toggleFromLabelText: {
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: "Rubik-Regular",
    alignSelf: "flex-end",
    marginBottom: 30,
  },
});

export default Auth;
