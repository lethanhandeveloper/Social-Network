import { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard,
  ToastAndroid,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import theme from "../../assets/colors";
import { addNewComment, getCommentRef, getUserInfoByKey, getUserInfo } from "../firebase/database";
import { auth } from "../../firebase";
import { getTimeAgo } from "../../utils/timeUtil";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Comment = ({ route, navigation }) => {
  const [commenttext, setCommentText] = useState("");
  const [commentList, setcommentList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { postKey } = route.params;

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getCommentRef(postKey).on("value", datasnapshot => {
        const commentArr = [];
        const comments = datasnapshot.val();
        datasnapshot.forEach(element => {
      
            getUserInfo(element.val().userKey).then(userInfo => {
                commentArr.push({
                    postKey : element.key,
                    content : element.val().content,
                    timestamp : element.val().timestamp,
                    username : userInfo.val().firstName+" "+userInfo.val().lastName,
                    avatar : userInfo.val().avatar,
                });

                commentArr.sort(function (x, y) {
                    return y.timestamp - x.timestamp;
                });

                setcommentList(commentArr);
            });

            
        });



       
    })
  }, [])

  const handleSendComment = () => {
    addNewComment(auth.currentUser.uid, postKey, commenttext);
    setCommentText('');
  };

  const renderComments = ({ item }) => {
    return(
        <View style={{ width: "100%", height: 60, flexDirection: "row", padding: 10, marginVertical: 20 }}>
            <View style={{ width: "20%", height: "100%", alignItems: "center" }}>
                <Image source={{ uri : item.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }}/>
            </View>
            <View style={{ width: "80%", height: "auto" }}>
                <Text style={{ fontWeight: "bold", fontSize: 16  }}>{ item.username }</Text>
                <View style={{ width: "100%", height: "auto", borderRadius: 10, padding: 10,  backgroundColor: "#e8e9eb" }}>
                    <Text style={{ fontSize: 18  }}>{ item.content }</Text>
                    <Text style={{ fontSize: 14  }}>{ getTimeAgo(item.timestamp) }</Text>
                </View>
            </View>
        </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.reactionInfoWrapper}>
        <View style={styles.reactionIconWrapper}>
          <Image
            source={require("./../../assets/images/icons/like.png")}
            style={styles.reactionIcon}
          />
          <Image
            source={require("./../../assets/images/icons/haha.png")}
            style={styles.reactionIcon}
          />
          <Image
            source={require("./../../assets/images/icons/angry.png")}
            style={styles.reactionIcon}
          />
        </View>
        <View style={styles.lableInfoWrapper}>
          <Text style={styles.lableInfo}>30 People reacted to this post</Text>
        </View>
      </View>
        <View style={{  width: "100%", height: 500 }}>
        <FlatList
            data={commentList}
            refreshControl={
            <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
            />
            }
            renderItem={renderComments}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ flex : 1 }}
            />
        </View>
        <View style={styles.commentBoxWrapper}>
        <TextInput
          placeholder="Type here to comment..."
          style={styles.commentBox}
          value={commenttext}
          onChangeText={(text) => setCommentText(text)}
        />
        
        <TouchableOpacity
          style={styles.sendCommentButton}
          onPress={() => handleSendComment()}
        >
          <Ionicons name="send" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  reactionInfoWrapper: {
    width: "100%",
    height: windowHeight / 10,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#00000033",
    shadowRadius: 3.84,
  },
  reactionIconWrapper: {
    height: "100%",
    width: "auto",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  reactionIcon: {
    width: 25,
    height: 25,
    marginLeft: 2,
  },
  lableInfoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  lableInfo: {
    fontWeight: "bold",
    fontSize: 18,
  },
  commentBoxWrapper: {
    backgroundColor: "white",
    borderWidth: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    borderTopWidth: 2,
    borderTopColor: "#00000033",
    shadowRadius: 3.84,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  commentBox: {
    borderWidth: 0.5,
    height: 40,
    width: "85%",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  sendCommentButton: {
    justifyContent: "center",
    marginHorizontal: 10,
  },
});

export default Comment;
