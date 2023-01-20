import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Keyboard,
  Animated,
  FlatList,
  TouchableOpacity,
  LogBox,
  TouchableWithoutFeedback,
} from "react-native";
import { Fontisto } from "react-native-vector-icons";
import theme from "../../../assets/colors";
// import userList from "../../../assets/data/userList";
import { auth, database } from "../../../firebase";
import { setRelationShipDB } from "../../../src/firebase/database";
import { getUserInfo } from "../../../utils/localstorage";

LogBox.ignoreLogs(["Animated", "FIREBASE WARNING"]);

var userList = [];

const SearchTab = () => {
  const [searchText, setsearchText] = useState("");

  const getUserResult = (text) => {
    database
      .ref()
      .child("users")
      .orderByChild("lastName")
      .equalTo(text)
      .on("value", (snapshot) => {
        userList = [];
        snapshot.forEach((user) => {
          if (user.key !== auth.currentUser.uid) {
            const userResult = {
              ...user.val(),
              userKey: user.key,
            };

            userList.push(userResult);
          }
        });
      });
  };

  const renderUserResult = ({ item }) => {
    return (
      <View style={styles.userResultItemWrapper} key={item.userKey}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.userImageResultItem}
        />
        <Text style={styles.userNameTextResultItem}>
          {item.firstName + " " + item.lastName}
        </Text>
        <TouchableOpacity
          style={styles.userRelationshipItemWrapper}
          // 1 self 
          // 
          // 
          // 
          onPress={() => {}}
        >
          <Text style={styles.userRelationShipTextItemWrapper}>Add friend</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView>
        <Animated.View style={[styles.searchBoxWrapper]}>
          <Fontisto name="search" size={15} />
          <TextInput
            placeholder="Enter here to search..."
            value={searchText}
            onChangeText={(text) => {
              getUserResult(text);
              setsearchText(text);
            }}
            style={[styles.searchBox]}
          />
        </Animated.View>
        {!searchText && (
          <Image
            // source={require("../../../assets/images/icons/search-duck.gif")}
            style={styles.searchChickenIcon}
          />
        )}
        {userList.length > 0 && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            style={styles.userResultWrapper}
            data={userList}
            renderItem={renderUserResult}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  // searchTextInput: {
  //     borderWidth: 1,
  //     borderRadius:10,
  //     height: 40,
  //     padding: 10
  // }
  searchBoxWrapper: {
    borderRadius: 10,
    height: 40,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchBox: {
    marginLeft: 10,
    flex: 1,
  },
  searchChickenIcon: {
    alignSelf: "center",
    width: 150,
    height: 150,
  },
  userResultWrapper: {
    marginTop: 20,
  },
  userResultItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  userImageResultItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 6,
  },
  userNameTextResultItem: {
    marginLeft: 10,
  },
  userRelationshipItemWrapper: {
    position: "absolute",
    right: 0,
    backgroundColor: "#f5f5f5",
    padding: 3,
    borderRadius: 5,
    marginRight: 15,
  },
  userRelationShipTextItemWrapper: {
    fontSize: 14,
  },
});

export default SearchTab;
