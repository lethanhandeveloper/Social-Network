import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import theme from "../../assets/colors";
import {
  EvilIcons,
  AntDesign,
  Entypo,
  MaterialIcons,
  Feather,
  FontAwesome,
  Ionicons,
} from "react-native-vector-icons";
import timeUtil, { getTimeAgo } from "../../utils/timeUtil";
import FbGrid from "react-native-fb-image-grid";
import { getUserById, addPostReaction, getPostReactionNumberRef, getPostRef } from "../firebase/database";
import { auth } from "../../firebase";
// userKey, content, images, location, time, interaction: {type, num}

var newsListFlatList = [];

const News = (props) => {
  // console.log(JSON.stringify(newsList));
  const [newsListState, setNewsListState] = useState([]);
  const [newList, setNewList] = useState(props);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isVisibleReaction, setIsVisibleReaction] = useState(false);
  const navigation = props.navigation;
  const handleClickImage = props.handleClickImage;
  // const handleClickMoreIcon = props.handleClickMoreIcon;

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  // console.log(newsList);

  useLayoutEffect(() => {
    let postDataTemp = [];
    // alert(JSON.stringify(props.newsList));
    setNewsListState([]);

    if (Object.keys(props.newsList).length !== 0) {
      props.newsList.forEach((post) => {
        // alert(JSON.stringify(post.val()))
        let postObj = {};
        postObj.key = post.key;
  
        postObj.caption = post.val().caption;
        postObj.location = post.val().location;
        postObj.timestamp = post.val().timestamp;
        postObj.userKey = post.val().userKey;
  
        postObj.imageUrls = [];
        
        const reactionArr = [];

        if(post.val().reaction){
          Object.keys(post.val().reaction).map((key) => {
            reactionArr.push({ userKey : key, type : post.val().reaction[key].type });
          });
  
        }


        postObj.reactionNumber = reactionArr.length;
        postObj.reacted = 0;

        if(reactionArr.length > 0){
          reactionArr.forEach((reactionItem) => {
            if(reactionItem.userKey === auth.currentUser.uid){
              postObj.reacted = reactionItem.type;
              
            }
          })
        }
        

        if (post.val().imageUrls) {
          Object.keys(post.val().imageUrls).map((key) => {
            postObj.imageUrls.push(post.val().imageUrls[key]);
          });
        }
  
        //   postDataTemp = newListTemp.reduce((acc, current) => {
        //   const x = newListTemp.find(item => item.key === current.key);
        //   if (!x) {
        //     return acc.concat([current]);
        //   } else {
        //     return acc;
        //   }
        // });
  
        // let newListTemp = [...newsList];
  
        getUserById(post.val().userKey).then((userInfo) => {
          // postData.push({...postObj});
          postObj.userInfo = { userInfo: userInfo };
          postObj.isVisibleReaction = false;
          postDataTemp.sort(function (x, y) {
            return y.timestamp - x.timestamp;
          });
  
          postDataTemp.push({ ...postObj });
          postDataTemp.sort(function (x, y) {
            return y.timestamp - x.timestamp;
          });

          setNewsListState(postDataTemp);
  
          
        });
      });
  
      // let newListTemp = [...newsList];
  
      // newListTemp.sort(function(x, y){
      //   return y.timestamp - x.timestamp;
      // })
  
      // newsListFlatList = [...postDataTemp];
      // setNewsListState(postDataTemp);
    }
  }, [props])



  const renderNews = ({ item }) => {
    // let usI = {...item.userInfo};
    var reactionIconSource = require("./../../assets/images/icons/likenormal.png");
    if (item.userInfo.userInfo) {
      // console.log(item.userInfo.userInfo);
      var userInfoJson = JSON.stringify(item.userInfo.userInfo);

      userInfoJson = JSON.parse(userInfoJson);
      console.log(JSON.stringify(item.userInfo));
    }

    switch (item.reacted) {
      case 1:
        reactionIconSource = require("./../../assets/images/icons/like.png");
        break;
      case 2:
        reactionIconSource = require("./../../assets/images/icons/love.png");
        break;
      case 3:
          reactionIconSource = require("./../../assets/images/icons/haha.png");
          break;
      case 4:
        reactionIconSource = require("./../../assets/images/icons/wow.png");
        break;
      case 5:
        reactionIconSource = require("./../../assets/images/icons/sad.png");
        break;
      case 6:
        reactionIconSource = require("./../../assets/images/icons/angry.png");
        break;
      default:
        reactionIconSource = require("./../../assets/images/icons/likenormal.png");
        break;
    }

    return (
      <View style={styles.newsItem} key={item.key}>
        <View style={styles.newsUserWrapper}>
          <View style={styles.newsUserLeft}>
            <Image
              source={{ uri: userInfoJson.avatar }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </View>

          <View style={styles.newsUserRight}>
            <Text style={styles.newsUserNameText}>
              {userInfoJson.firstName + " " + userInfoJson.lastName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="clock" size={14} />
              <Text style={{ color: theme.colors.lightGray, marginLeft: 5 }}>
                {getTimeAgo(item.timestamp)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location" size={14} />
              <Text style={{ color: theme.colors.lightGray, marginLeft: 5 }}>
                {item.location}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather
              name="more-horizontal"
              size={22}
              style={{ position: "absolute", right: 10, top: 1 }}
            />
          </TouchableOpacity>
         
        </View>
        <View style={styles.newsContentWrapper}>
          {item.isVisibleReaction && (
            <View style={styles.reactionWrapper}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 1)}>
                  <Image
                    source={require("./../../assets/images/icons/like.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 2)} >
                  <Image
                    source={require("./../../assets/images/icons/love.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 3)}>
                  <Image
                    source={require("./../../assets/images/icons/haha.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 4)}>
                  <Image
                    source={require("./../../assets/images/icons/wow.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 5)}>
                  <Image
                    source={require("./../../assets/images/icons/sad.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionItemWrapper} onPress={() => handlecLickReactionItem(item.key, item.userKey, 6)}>
                  <Image
                    source={require("./../../assets/images/icons/angry.png")}
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.newsCaptionText}>{item.caption}</Text>
          {item.imageUrls.length > 0 && (
            <View style={{ width: "100%", height: 200 }}>
              <FbGrid images={item.imageUrls} onPress={(url, index, event) => handleClickImage(url)}/>
            </View>
          )}
        </View>
        <View style={styles.newsInteractWrapper}>
          <TouchableOpacity 
            onLongPress={() => toggleVisibleReaction(item.key)}
            onPress={() => {
              if(item.reacted){
                handlecLickReactionItem(item.key, item.userKey, 0);
              }else{
               
                handlecLickReactionItem(item.key, item.userKey, 1);
              }
            }}
            >
            <Image
              source={reactionIconSource}
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
          </TouchableOpacity>
          <Text style={{ marginRight: 10 }}>{ item.reactionNumber }</Text>
          <TouchableOpacity onPress={() => navigation(item.key)}>
            <FontAwesome name="comment-o" size={18} style={{ marginRight: 5 }} />
          </TouchableOpacity>
          <Text style={{ marginRight: 10 }}>{ item.reactionNumber }</Text>
        </View>
      </View>
    );
  };

  const toggleVisibleReaction = (key) => {
    let newsListClone = [...newsListState];
    newsListClone.forEach((news) => {
      if(news.key === key){
          news.isVisibleReaction = !news.isVisibleReaction;
      }else{
        news.isVisibleReaction = false;
      }
    })

    setNewsListState(newsListClone);
  }

  const handlecLickReactionItem = (itemKey, userKey, type) => {
    addPostReaction(itemKey, auth.currentUser.uid, userKey, type);
  }

  return (
    <View style={styles.newsWrapper}>
      <FlatList
        data={newsListState}
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        renderItem={renderNews}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  newsWrapper: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  newsItem: {
    backgroundColor: theme.colors.white,
    width: "100%",
    height: "auto",
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  newsUserWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    marginLeft: 10,
  },
  newsUserLeft: {
    width: "15%",
    height: "100%",
    marginRight: 5,
    justifyContent: "center",
  },
  newsUserRight: {
    width: "80%",
    height: "100%",
  },
  newsUserNameText: {
    fontWeight: "bold",
    marginLeft: 2,
  },
  newsContentWrapper: {
    padding: 5,
    width: "100%",
    height: "auto",
  },
  newsCaptionText: {
    marginBottom: 5,
    fontFamily: theme.fonts.regular,
    fontSize: 17,
    marginLeft: 10,
    marginVertical: 10,
  },
  newsInteractWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  iconInteractWrapper: {
    width: 24,
    height: 24,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  reactionWrapper: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    zIndex: 1,
    position: "absolute",
    bottom: 10,
    left: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 10,
  },
  reactionItemWrapper: {
    justifyContent: "center",
    height: "100%",
    width: "16.66%",
    alignItems: "center",
  },
  reactionIcon: {
    width: 30,
    height: 30,
  },
  justifyContent: "center",
  flexDirection: "row",
});

export default News;
