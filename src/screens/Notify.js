import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  LogBox,
} from "react-native";
import theme from "../../assets/colors";
import notiList from "../../assets/data/notiList";
import { getNotificationRef, getUserInfoByKey } from "../firebase/database";
import { auth } from "../../firebase";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { getTimeAgo } from "../../utils/timeUtil";
LogBox.ignoreLogs(['Warning: ...']);

const Notify = () => {
  const [notificationList, setNotificationList] = useState([]);

  async function displayNotification(notify) {
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
      title: notify.username,
      body: notify.username+ " " + notify.content,
      smallIcon: notify.avatar,
      android: {
        channelId,
        largeIcon: notify.avatar,
      },
    });
  }

  useEffect(() => {
    const notificationRef = getNotificationRef(auth.currentUser.uid);

    var notifyArr = [];

    notificationRef.on("value", (snapshot) => {
      
      const storeArr = [...notificationList];
      setNotificationList([]);

      if(snapshot.val()){
        notifyArr = [];
        //add to list
        Object.keys(snapshot.val()).map((key, index) => {
          

          //add
          const getUserInfoByKeyRef = getUserInfoByKey(
            snapshot.val()[key].fromUserKey
          );
  
          getUserInfoByKeyRef.get().then((usersnapshot) => {
            notifyArr.push({
              key: key,
              value: {
                username:
                  usersnapshot.val().firstName + " " + usersnapshot.val().lastName,
                avatar: usersnapshot.val().avatar,
                status: snapshot.val()[key].status,
                timestamp: snapshot.val()[key].timestamp,
                content: snapshot.val()[key].content,
              },
            });

            notifyArr.sort(function (x, y) {
              return y.value.timestamp - x.value.timestamp;
            });

            //display notification
            // storeArr.forEach((itemPre, index) => {
            //   // alert(itemPre.key);
            //   if(itemPre.key !== notifyArr[index].key){
                
            //     displayNotification(notifyArr[index].value);
            //   }
            // })
            
            if(index === 0){
              displayNotification(notifyArr[0].value);
            }
            //add
            setNotificationList(notifyArr);
          });
          
          
        });
      }

      
      
    });
  }, []);

  const renderNotification = ({ item }) => {
    return (
      <View
        style={[
          styles.notiItemWrapper,
          item.value.status === 0
            ? { backgroundColor: "#DDEFE1" }
            : { backgroundColor: "white" },
        ]}
      >
        <View style={styles.leftNotifyItemWrapper}>
          <Image
            source={{ uri : item.value.avatar }}
            style={{ height: 40, width: 40, borderRadius: 20}}
          />
        </View>
        <View style={styles.rightNotifyItemWrapper}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.notiItemText, { fontWeight: "bold" }]}>
              {item.value.username}
            </Text>
            <Text style={styles.notiItemText}>{" " + item.value.content}</Text>
          </View>
          <Text style={styles.timeNotiItemText}>{getTimeAgo(item.value.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.bodyWrapper}>
        {notificationList && (
          <FlatList
            data={notificationList}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  headerWrapper: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: theme.colors.darkGray,
    justifyContent: "center",
  },
  headerTitle: {
    color: theme.colors.black,
    fontWeight: "700",
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },
  bodyWrapper: {
    flex: 1,
  },
  notiItemWrapper: {
    width: "100%",
    padding: 10,
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.darkGray,
    flexDirection: "row",
  },
  leftNotifyItemWrapper: {
    width: 40,
    height: 40,
  },
  rightNotifyItemWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  notiItemText: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: theme.fonts.regular,
  },
  timeNotiItemText: {
    color: theme.colors.gray,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
  },
});

export default Notify;
