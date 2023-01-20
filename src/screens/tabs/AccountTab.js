import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {MaterialIcons} from "react-native-vector-icons"
import theme from "../../../assets/colors";
import News from "../../components/News";
import userList from "../../../assets/data/userList";
import newsList from "../../../assets/data/newsList";
// import { getUserInfo } from "../../firebase/database";
import { auth } from "../../../firebase";
import { getUserInfo } from "../../../utils/localstorage";

const AccountTab = () => {
  const [myUserInfo, setMyUserInfo] = useState({});
  useEffect(() => {
    getUserInfo().then(userInfo => {
      setMyUserInfo(JSON.parse(userInfo));
      // alert(JSON.stringify(myUserInfo))
  });
  })

  const renderfriendList = ({ item }) => {
    return (
      <View style={styles.friendItemWrapper}>
        <Image
          source={item.avatar}
          style={{ width: 70, height: 70 }}
          resizeMode="contain"
          width={70}
          height={70}
        />
        <Text>{item.firstName}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Profile</Text>
        {/* <MaterialIcons name="post-add" size={37} onPress={() => navigation.navigate("PostCreate")}/> */}
      </View>

      <ScrollView>
        <View style={styles.userSelfInfoWrapper}>
          <TouchableOpacity style={styles.userAvatarSeftWrapper}>
            <Image
              source={{ uri : myUserInfo.avatar }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.userNameSeftText}>{ myUserInfo.firstName+" "+myUserInfo.lastName }</Text>
          <TouchableOpacity style={styles.profileSettingButtonWrapper}>
            <Text style={styles.profileSettingTextWrapper}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.friendListWrapper}>
          <Text style={styles.friendListTitle}>Friends</Text>
          <FlatList
            key={"_"}
            data={userList}
            renderItem={renderfriendList}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            numColumns={3}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.profileSettingButtonWrapper,
            { width: "90%", alignSelf: "center" },
          ]}
        >
          <Text style={styles.profileSettingTextWrapper}>See All Friend</Text>
        </TouchableOpacity>
        {/* <News newsList={newsList} /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  userSelfInfoWrapper: {
    padding: 10,
    alignItems: "center",
  },
  userAvatarSeftWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarSeft: {
    flex: 1,
  },
  userNameSeftText: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    
  },
  profileSettingButtonWrapper: {
    marginTop: 25,
    backgroundColor: "#06E523",
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSettingTextWrapper: {
    color: theme.colors.white,
    fontSize: 18,
    fontFamily: "Rubik-Regular",
  },
  friendListWrapper: {
    padding: 10,
  },
  friendItemWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1 / 3,
    width: 100,
    height: 100,
    backgroundColor: theme.colors.white,
    margin: 5,
    borderRadius: 5,
  },
  friendListTitle: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
  },
});

export default AccountTab;
