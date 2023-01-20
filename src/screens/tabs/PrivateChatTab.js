import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import theme from '../../../assets/colors';
import {EvilIcons, AntDesign, Entypo} from "react-native-vector-icons";
import firebase from "firebase";

// import userList from "../../assets/data/userList";
import { getuserListRef, getAllChatListRef, getUserById, getLastestMessagewithUserId, getDetailChatListRef } from "../../firebase/database";
import { auth } from "../../../firebase";
import { getTimeAgo } from '../../../utils/timeUtil';


const PrivateChatTab = ({ navigation }) => {
  const [userList, setUserList] = useState([]);
  const [allChatList, setallChatList] = useState([]);
  
  useEffect(() => {
    
    let userListRef = getuserListRef();
    
    //get active users list
    userListRef.on("value", (snapshot) => {
      console.log(snapshot);
      const list = [];
      // console.log(snapshot);
      snapshot.forEach((user) => {
        
        const newUser = {
          id: user.key,
          firstName: user.val().firstName,
          lastName: user.val().lastName,
          avatar: user.val().avatar,
          isActive: true,
        };

        list.push(newUser);
        
        // setUserList([...userList, newUser]);
        
      });
      // console.log(list);
      setUserList(list);
    })

    //get all chat
    let allchatlistRef = getAllChatListRef(auth.currentUser.uid);
    
    allchatlistRef.on("value", (snapshot) => {
      let list = [];
      
      let newMessage = {
          id: '',
          name : '',
          avatar: '',
          latest_message : '',
          timestamp : ''
      }
      
      
      snapshot.forEach((chat) => {
        // console.log("lan"+ i++);
        // console.log(chat);
        
          getUserById(chat.key).then((userInfo) => {
            // console.log("11111111111111111");
            // console.log(userInfo);
              newMessage.id = chat.key;
              newMessage.name = `${userInfo.val().firstName} ${userInfo.val().lastName}`;
              newMessage.avatar = userInfo.val().avatar;

              
              
          })

          const detailChatListRef = getDetailChatListRef(auth.currentUser.uid, chat.key)
            detailChatListRef.get().then((messages) => {
              const msgArray = Object.values(messages.val());
              // console.log("aaaaaaaaaaaa");
              // console.log(msgArray);
                newMessage.latest_message = msgArray[msgArray.length -  1 ].text;
                newMessage.timestamp = msgArray[msgArray.length -  1 ].timestamp;
                list.push({...newMessage})
            })
            

            
      })

      const timer = setTimeout(() => {
        
        setallChatList(list);
        
      }, 1000)
    });

   
    

    return(() => {
      list = [];
      // allchatlistRef.remove();
    });
  }, []);

  const renderItem = ({ item }) => {
    if (item.id !== auth.currentUser.uid) {
      return (
        <TouchableOpacity
          style={styles.activeUserItemWrapper}
          onPress={() => navigation.navigate("PrivateChat", { item: item })}
        >
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.firstnameWrapper}>
            <Text style={styles.firstNameText}>{item.firstName}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderMessages = ({ item }) => {
    console.log("itemmmmmm");
    console.log(item.latest_message);
    console.log(JSON.stringify(item));

    return (
      <TouchableOpacity
        style={styles.messageWrapper}
        onPress={() => navigation.navigate("PrivateChat", { item: item })}
      >
        <View style={styles.avatarMessageWrapper}>
          <Image source={{ uri: item.avatar }} style={styles.avatarMessage} />
        </View>
        <View style={styles.contentMessageWrapper}>
          <View style={styles.leftContentMessageWrapper}>
            <Text style={styles.itemUserText}>
              {item.name}
            </Text>
            <Text style={styles.itemMessageText}>
              { item.latest_message || "Sent a file" }
            </Text>
          </View>
          <View style={styles.rightContentMessageWrapper}>
            <Text style={styles.itemTimeText}>{getTimeAgo(item.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View styles={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          paddingHorizontal: 13,
        }}
      >
        <Text style={styles.titleText}>Chat</Text>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search..."
            icon
          />
          <EvilIcons name="search" size={20} style={styles.iconSearch} />
        </View>
        <View style={styles.activeUserWrapper}>
          <Pressable style={styles.addNewWrapper}>
            <View style={styles.addNewCircleWrapper}>
              <AntDesign name="plus" size={20} />
            </View>
            <View style={styles.addNewTextWrapper}>
              <Text style={styles.addNewText}>Add New</Text>
            </View>
          </Pressable>

          <View style={styles.flatlistWrapper}>
            <FlatList
              data={userList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.recentTitleWrapper}>
          <Text style={styles.recentTitleText}>Recent</Text>
        </View>
        <View style={styles.seperator} />

        {
          allChatList.length == 0 ? <View style={styles.emptyMessageWrapper}>
              <Image source={require('../../../assets/images/icons/emptyMessage.png')} style={styles.emptyMessageImage}/>
              <Text style={styles.emptyMessageText}>You haven't any message recently</Text>
          </View>
          :
          <FlatList
          data={allChatList}
          renderItem={renderMessages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 13,
  },
  titleText: {
    color: theme.colors.green,
    fontSize: 48,
    marginLeft: 20,
    marginTop: 13,
    fontFamily: theme.fonts.regular,
  },
  searchWrapper: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  searchTextInput: {
    width: "100%",
    alignItems: "center",
    marginHorizontal: 13,
    borderBottomColor: theme.colors.green,
    height: 50,
    padding: 12,
    borderBottomWidth: 1,
    fontSize: 20,
    fontFamily: theme.fonts.regular,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  iconSearch: {
    position: "absolute",
    right: 15,
  },
  activeUserWrapper: {
    flexDirection: "row",
    marginTop: 13,
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingHorizontal: 13,
    alignSelf: "center",
  },
  flatlistWrapper: {
    flex: 1,
  },
  activeUserItemWrapper: {
    paddingHorizontal: 4,
    marginLeft: 5,
  },
  activeUserList: {},
  addNewWrapper: {
    height: 50,
    width: 50,
    // flexDirection: "row",
    // alignItems: "center"
  },
  addNewCircleWrapper: {
    height: 38,
    width: 38,
    borderWidth: 1,
    borderRadius: 19,
    borderStyle: "dashed",
    borderColor: theme.colors.red,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2
  },
  addNewText: {},
  avatar: {
    height: 43,
    width: 43,
    borderRadius: 100,
    overflow: "hidden",
  },
  firstnameWrapper: {
    height: "auto",
    width: "100%",
    fontSize: 9,
    fontFamily: "#2D3F65",
    alignItems: "center",
  },
  firstNameText: {
    fontSize: 9,
    fontFamily: "Rubik-Regular",
    color: "#2D3F65",
  },
  recentTitleWrapper: {
    marginTop: 8,
    marginLeft: 20,
  },
  recentTitleText: {
    color: "2D3F65",
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },
  seperator: {
    width: "100%",
    backgroundColor: theme.colors.darkGray,
    height: 1,
    marginTop: 13,
  },
  messageWrapper: {
    width: "100%",
    marginTop: 13,
    paddingVertical: 5,
    paddingHorizontal: 13,
    flexDirection: "row",
    marginVertical: 8,
  },
  itemNameMessage: {},
  avatarMessageWrapper: {},
  avatarMessage: {
    width: 35,
    height: 35,
    borderRadius: 17.5
  },
  contentMessageWrapper: {
    marginLeft: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  rightContentMessageWrapper: {},
  itemUserText: {
    color: theme.colors.black,
    fontFamily: "Rubik-Medium",
    fontSize: 15,
    fontWeight:"bold"
  },
  itemTimeText: {
    color: theme.colors.lightGray,
    fontFamily: "Rubik-Regular",
    fontSize: 12,
  },
  itemMessageText: {
    color: theme.colors.lightGray,
    fontFamily: "Rubik-Regular",
    fontSize: 12,
  },
  addNewTextWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  addNewText: {
    color: theme.colors.lightGray,
    fontFamily: "Rubik-Regular",
    fontSize: 9,
  },
  emptyMessageWrapper:{
    justifyContent: "center",
    alignItems: "center",
    flex: 1 
  },
  emptyMessageImage: {
    width: '10%',
    height: '10%',
  },  
  emptyMessageText:{
    fontFamily: "Rubik-Regular",
    color: theme.colors.gray,
    fontSize: 18  
  },
});

export default PrivateChatTab;
