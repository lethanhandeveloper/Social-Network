import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  GroupChatTab,
  AccountTab,
  HomeTab,
  PrivateChatTab,
  SearchTab,
  NotiTab,
} from "./tabs";
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  FontAwesome5,
} from "react-native-vector-icons";
import theme from "../../assets/colors";
import FriendTab from "./tabs/FriendTab";
import { notifee } from "@notifee/react-native";
import { getNotificationRef } from "../firebase/database";

// https://github.com/sarmad1995/react-native-easy-content-loader
const Tab = createBottomTabNavigator();

const Main = () => {
  // async function displayNotification(notify) {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: "default",
  //     name: "Default Channel",
  //   });

  //   await notifee.onBackgroundEvent({
  //     title: notify.username,
  //     body: notify.username+ " " + notify.content,
  //     smallIcon: notify.avatar,
  //     android: {
  //       channelId,
  //       largeIcon: notify.avatar,
  //     },
  //   });
  // }


  // useEffect(() => {
  //   const notificationRef = getNotificationRef(auth.currentUser.uid);

  // })

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={30}
              color={focused ? theme.colors.green : "black"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SearchTab"
        component={SearchTab}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="search"
              size={30}
              color={focused ? theme.colors.green : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PrivateChatTab"
        component={PrivateChatTab}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="message"
              color={focused ? theme.colors.green : "black"}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FriendTab"
        component={FriendTab}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="user-friends"
              color={focused ? theme.colors.green : "black"}
              size={23}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountTab}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? theme.colors.green : "black"}
              size={30}
            />
          ),
          activeTintColor: "#81B247",
        }}
      />
     
    </Tab.Navigator>
  );
};

export default Main;
