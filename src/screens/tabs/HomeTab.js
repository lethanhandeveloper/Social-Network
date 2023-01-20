import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  LogBox,
} from "react-native";
import theme from "../../../assets/colors";
import {
  EvilIcons,
  AntDesign,
  Entypo,
  MaterialIcons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import ImageView from "react-native-image-view";
import News from "../../components/News";
import { getPostRef, getUserById, getPost } from "../../firebase/database";
import newsList from "../../../assets/data/newsList";
import userList from "../../../assets/data/userList";
import RBSheet from "react-native-raw-bottom-sheet";
LogBox.ignoreAllLogs();
// var postData = {};

const HomeTab = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  var [postData, setPostData] = useState({});
  const [isShowImageLarge, setShowImageLarge] = useState(false);
  const [imageLargeData, setimageLargeData] = useState([]);
  const [postMoreSelected, setPostMoreSelected] = useState("");
  const refRBSheet = useRef();


  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const updateNews = () => {
    getPostRef().on("value", (snapshot) => {
      // let postDataTemp = [];
      // postData = {};
      // postData = snapshot;

      // snapshot.forEach(post => {

      // let postObj = {};
      // postObj.key = post.key;
      // const postValue = post.val();

      // postObj.caption = postValue.caption;
      // postObj.location = postValue.location;
      // postObj.timestamp = postValue.timestamp;
      // postObj.userKey = postValue.userKey;
      // postObj.imageUrls = [];

      // // console.log(post.val());
      // if(post.val().imageUrls){
      //   Object.keys(post.val().imageUrls).map(
      //     (key) => {
      //       postObj.imageUrls.push(post.val().imageUrls[key]);
      //     }
      //   )

      // }

      // postDataTemp.push({...postObj});
      // setPostData([...postDataTemp]);

      // getUserById(postObj.userKey).then(userInfo => {
      //     postObj.userInfo = {...userInfo.val()}
      //     setPostData([...postData, postObj])
      //     postData.push({...postObj});

      // })

      setPostData(snapshot);
      // });
    });
  };

  useEffect(() => {
    updateNews();

    // alert(JSON.stringify(postData));
  }, []);

  const renderStory = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.activeUserItemWrapper}
        onPress={() => navigation.navigate("PrivateChat", { item: item })}
      >
        <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />
        <View style={styles.firstnameWrapper}>
          <Text style={styles.firstNameText}>{item.firstName}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  // const handleClickMoreIcon = (key) => {
  //   refRBSheet.current.open();
  //   // setPostMoreSelected(key);
  //   // console.log(key);
  // }

  const handleNavigateCommentScreen = (postKey) => {
    navigation.navigate("Comment", { postKey });
  };

  const handleClickImage = (uri) => {
    console.log(uri);
    setimageLargeData([
      {
        source: {
          uri: uri,
        },
        title: "Image",
        width: 806,
        height: 720,
      }
    ])

    setShowImageLarge(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <MaterialIcons
          name="post-add"
          size={37}
          onPress={() => navigation.navigate("PostCreate")}
        />

        <Text style={styles.headerTitle}>Feed</Text>
        <MaterialCommunityIcons
          name="bell"
          size={37}
          onPress={() => navigation.navigate("Notify")}
        />
      </View>

      <View style={styles.storyWrapper}>
        <Pressable style={styles.addNewWrapper}>
          <View style={styles.addNewCircleWrapper}>
            <AntDesign name="plus" size={20} />
          </View>
          <View style={styles.addNewTextWrapper}>
            <Text style={styles.addNewText}>Add New</Text>
          </View>
        </Pressable>

        <FlatList
          data={userList}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ImageView
        images={imageLargeData}
        imageIndex={0}
        isVisible={isShowImageLarge}
        renderFooter={(currentImage) => (
          <View>
            <Text>My footer</Text>
          </View>
        )}
        onClose={() => setShowImageLarge(false)}
      />

      {/* <Text>{JSON.stringify(postData)}</Text> */}
      <News newsList={postData} navigation={handleNavigateCommentScreen} handleClickImage={handleClickImage}
          // handleClickMoreIcon={handleClickMoreIcon}
      />
      <View style={{}}></View>
      {/* <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
       
      >
         <View style={{ flex :1 , padding : 10 }}>
              <TouchableOpacity style={{  width: "100%", height: 40, justifyContent: "center" }} >
                <Text style={{ fontSize: 16 }}>Delete this post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{  width: "100%", height: 40, justifyContent: "center" }}>
                <Text style={{ fontSize: 16 }}>Share this post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "100%", height: 40, justifyContent: "center" }}>
                <Text style={{ fontSize: 16 }}>Report this post</Text>
              </TouchableOpacity>
         </View>
      </RBSheet> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  headerWrapper: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: theme.colors.darkGray,
  },
  headerTitle: {
    color: theme.colors.black,
    fontWeight: "700",
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },

  storyWrapper: {
    // borderWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
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
    marginBottom: 2,
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
  newsWrapper: {
    // borderWidth: 1,
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },

  activeUserItemWrapper: {
    paddingHorizontal: 4,
    marginLeft: 5,
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
});

export default HomeTab;
