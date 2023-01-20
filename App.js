import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Auth from "./src/screens/Auth";
import Main from "./src/screens/Main";
import Notify from "./src/screens/Notify";
import Comment from "./src/screens/Comment";
import PrivateChat from "./src/screens/PrivateChat";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import PostCreate from "./src/screens/PostCreate";
import { auth } from "./firebase";
import {setUserInfo} from './utils/localstorage';
import { getUserInfoByKey } from "./src/firebase/database";

// https://www.figma.com/file/qBt2LDAR0VtItMqVqFwYPK/App-Chat-(Community)?node-id=0%3A1
const Stack = createNativeStackNavigator();

const App = () => {
  const [userLoggedIn, setuserLoggedIn] = useState(false);
  

  useEffect(() => {
     auth.onAuthStateChanged(() => {
      if (auth.currentUser.uid) {
         setuserLoggedIn(true);
         console.log("Da dang nhap");

         //set userInfo again wherever it's changed value
         getUserInfoByKey(auth.currentUser.uid).on("value", async (snapshot) => {
          setUserInfo(snapshot.val());
        })
      }else{
        setuserLoggedIn(false);
        console.log("Chua dang nhap");
      }
    })
  })

  return (
    <NavigationContainer >
      <Stack.Navigator
        defaultScreenOptions= "Main"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="PrivateChat" component={PrivateChat} /> 
        <Stack.Screen name="PostCreate" component={PostCreate} />
        <Stack.Screen name="Notify" component={Notify} />
        <Stack.Screen name="Comment" component={Comment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
