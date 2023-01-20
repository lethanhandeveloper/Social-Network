import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard,
  ToastAndroid
} from "react-native";
import theme from "../../assets/colors";
import { Ionicons } from "react-native-vector-icons";
import userList from "../../assets/data/userList";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { getUserInfo } from "../../utils/localstorage";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { useEffect, useState } from "react";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { addNewPost } from "../firebase/database";

const PostCreate = ({ navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [postData, setPostData] = useState({caption: "", reviewImages: [], location: "Unknow Location"});
  const [caption, setCaption] = useState("");
  const [myuserInfo, setMyUserInfo] = useState({});

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); 
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); 
      }
    );

    getUserInfo().then((userInfo) => {
        setMyUserInfo(JSON.parse(userInfo));
    })
    
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  })

  const pickImage = async () => {
    const options = {
      includeBase64: true,
      storageOptions: {
        path: 'images',
        mediaType: 'photo'
      } 
    }

    launchImageLibrary(options, response => {
      if(!response.didCancel){
        const assets = response.assets;
        const reviewImages_Tmp = postData.reviewImages;
        reviewImages_Tmp.push(assets[0]);

        setCaption({ ...postData, reviewImages : reviewImages_Tmp });
      }
    })
  };

  const renderReviewingImages = ({ item, index }) => {
    return (
      <View style={{ height: 80, width: 80, marginHorizontal: 5, justifyContent: "center" }} key={index}>
        <Image source={{ uri: item.uri }} style={{ height: 70, width: 70, borderRadius: 15 }} />
        <Pressable
          style={{ position: "absolute", top: 1, right: 1 }}
          onPress={() => {
            const reviewImages_tmp = postData.reviewImages;
            reviewImages_tmp.splice(index, 1);
            if (reviewImages_tmp.length == 0) {
              setPostData({...postData, reviewImages: []});
            } else {
              setPostData({...postData, reviewImages: [...reviewImages_tmp]});
            }
          }}
        >
          <MaterialCommunityIcons size={20} color="black" name="cancel" />
        </Pressable>
      </View>
    );
  };

  const handlePost = () => {
    
    const postDataTemp = {...postData};
    postDataTemp.userKey = myuserInfo.key;
    
    addNewPost(postDataTemp, [...postDataTemp.reviewImages]);

    setPostData({...postData, reviewImages: []});
    ToastAndroid.showWithGravity(
      "News Posted",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );

    navigation.navigate("Main");
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={() => handlePost()}>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainViewWrapper}>
        <View style={styles.newsUserWrapper}>
          <View style={styles.newsUserLeft}>
            <Image source={ { uri : myuserInfo.avatar } } style={{ width: 40, height: 40, borderRadius: 20 }}/>
          </View>

          <View style={styles.newsUserRight}>
            <Text style={styles.newsUserNameText}>{myuserInfo.firstName+" "+myuserInfo.lastName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location-outline" size={15}/>
            <Text>{postData.location}</Text>
            </View>
          </View>
        </View>
        <TextInput placeholder="Write something...." multiline={true}  fontSize={caption ? 15 : 20} fontWeight={caption ? "regular" : "bold"} value={postData.caption}
                onChangeText={text => setPostData({...postData, caption : text})} underlineColorAndroid='rgba(0,0,0,0)' 
                textAlignVertical="top"
                
                 style={[{width: "100%", height: 130, fontFamily: theme.fonts.regular}, keyboardVisible ? {fontSize: 40} : {fontSize: 20}]}
                 />
                
      </View>
      {
        !keyboardVisible && 
        <View style={styles.reviewImageWrapper}>
          <FlatList
                      style={{ flex: 1 }}
                      data={postData.reviewImages}
                      renderItem={renderReviewingImages}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
          />
        </View>
      }
      {!keyboardVisible &&
        <View style={styles.moreInfoWrapper}>
        <Text>Add to your post</Text>
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => pickImage()}>
                <Ionicons name="camera" size={20} style={{ marginRight: 20 }}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPostData({...postData, location: "Da Nang, Viet Nam"})}
            >
                <Ionicons name="location-outline" size={20}/>
            </TouchableOpacity>
        </View>
      </View>
      }
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
  postText: {
    color: theme.colors.green,
    fontSize: 15,
    fontFamily: theme.fonts.regular,
  },
  newsUserWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 60  
  },
  newsUserLeft: {
    width: "10%",
    height: "100%",
    marginRight: 15,
    justifyContent: "center",
    
  },
  newsUserRight: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
  },
  newsUserNameText: {
    fontWeight: "bold",
  },
  mainViewWrapper: {
    padding: 10,
  },
  moreInfoWrapper:{
    position: "absolute",
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: 50,
    bottom : 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  reviewImageWrapper: { width: "90%", alignSelf: "center", height: 85,  position: "absolute", bottom : 60, justifyContent: "center"},
});

export default PostCreate;
