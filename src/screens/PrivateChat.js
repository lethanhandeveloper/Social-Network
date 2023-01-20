//https://instamobile.io/app-templates/react-native-social-network/
//https://developers.giphy.com/
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import theme from "../../assets/colors";
import ImageView from "react-native-image-view";
import { AntDesign, Feather } from "react-native-vector-icons";
import {
  addNewPrivateMessage,
  getDetailChatListRef,
} from "../firebase/database";
import { auth } from "../../firebase";
import { uploadImage } from "../firebase/storage";
import firebase from "firebase";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import EmojiModal from "react-native-emoji-modal";

const deviceHeigth = Dimensions.get("window").height;

const PrivateChat = ({ route, navigation }) => {
  const flatlistRef = useRef(null);
  const item = route.params.item;
  const [chatData, setChatData] = useState({
    sender: auth.currentUser.uid,
    receiver: item.id,
    text: "",
    timestamp: "",
  });
  const [chatDataList, setChatDataList] = useState([]);
  const [imgObjectTmp, setimgObjectTmp] = useState({});
  const [reviewImages, setReviewImages] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isChatFormBottomVisible, setChatFormBottomVisible] = useState(false);
  const [isShowImageLarge, setShowImageLarge] = useState(false);
  const [imageLargeData, setimageLargeData] = useState([]);

  useEffect(() => {
    const chatListRef = getDetailChatListRef(auth.currentUser.uid, item.id);

    chatListRef.on("value", (snapshot) => {
      let list_tmp = [];

      snapshot.forEach((chat) => {
        list_tmp.push(chat.val());
      });

      setChatDataList(list_tmp);

      scrollToEnd();
    });

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setChatFormBottomVisible(false);
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleClickImage = (uri) => {
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

  const pickImage = async () => {
    const options = {
      includeBase64: true,
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        const assets = response.assets;
        const reviewImages_Tmp = reviewImages;
        reviewImages_Tmp.push(assets[0]);

        setReviewImages([...reviewImages_Tmp]);
      }
    });
  };

  const renderMessageList = ({ item }) => {
    if (item.sender === auth.currentUser.uid) {
      return (
        <View>
          {item.text && (
            <View style={styles.myMessageTextWrapper}>
              <Text style={styles.myMessageText}>{item.text}</Text>
            </View>
          )}

          {item.imageUrls && (
            <View style={styles.myMessageImageWrapper}>
              <FlatList
                style={{ flex: 1 }}
                data={Object.keys(item.imageUrls).map(
                  (key) => item.imageUrls[key]
                )}
                renderItem={renderImageContent}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          <Text style={styles.myTimeSentText}>10 seconds ago</Text>
        </View>
      );
    } else {
      return (
        <View>
          {item.text && (
            <View style={styles.yourMessageTextWrapper}>
              <Text style={styles.yourMessageText}>{item.text}</Text>
            </View>
          )}

          {item.imageUrls && (
            <View style={styles.yourMessageImageWrapper}>
              <FlatList
                style={{ flex: 1 }}
                data={Object.keys(item.imageUrls).map(
                  (key) => item.imageUrls[key]
                )}
                renderItem={renderImageContent}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          <Text style={styles.myTimeSentText}>10 seconds ago</Text>
        </View>
      );
    }
    // return <View />
  };

  const renderImageContent = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => handleClickImage(item)}>
          <View style={{ width: 100, height: 100, padding: 5 }} key={index}  >
        <Image source={{ uri: item }} style={{ width: 90, height: 90 }} onPress={() => console.log(item)}/>
        <Text></Text>
      </View>
      </TouchableOpacity>
    );
  };

  const renderReviewingImages = ({ item, index }) => {
    return (
      <View style={{ width: 65, height: 65, padding: 5 }} >
        <TouchableOpacity>
          <Image source={{ uri: item.uri }} style={styles.reviewingImage} />
        </TouchableOpacity>
        <Pressable
          style={{ position: "absolute", top: 0, right: 2 }}
          onPress={() => {
            const reviewImages_tmp = reviewImages;
            reviewImages_tmp.splice(index, 1);
            if (reviewImages_tmp.length == 0) {
              setReviewImages([]);
            } else {
              setReviewImages([...reviewImages_tmp]);
            }
          }}
        >
          <MaterialCommunityIcons size={15} color="black" name="cancel" />
        </Pressable>
      </View>
    );
  };

  const scrollToEnd = () => {
    if (flatlistRef !== null) {
      const auto_scroll_timer = setTimeout(() => {
        try {
          flatlistRef.current.scrollToEnd();
        } catch (error) {}

        clearTimeout(auto_scroll_timer);
      }, 500);
    }
  };

  const handleSendMessage = () => {
    addNewPrivateMessage(chatData, reviewImages);
    setChatData({ ...chatData, text: null, imageUrls: null });
    setReviewImages([]);
  };

  return (
    <View styles={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.messageWrapper}>
          <View style={styles.avatarMessageWrapper}>
            <Image source={{ uri: item.avatar }} style={styles.avatarMessage} />
          </View>
          <View style={styles.headerWrapper}>
            <View style={styles.leftheaderWrapper}>
              <Text style={styles.itemUserText}>
                {typeof item.firstName !== "undefined"
                  ? item.firstName + " " + item.lastName
                  : item.name}
              </Text>
              <Text style={styles.itemactivingTimeText}>Online now</Text>
            </View>
            <View style={styles.rightheaderWrapper}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign
                  name="close"
                  size={30}
                  style={styles.closeIcon}
                  color={theme.colors.lightGray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.seperatorLine} />
        {chatDataList.length > 0 ? (
          <FlatList
            style={styles.contentMessageWrapper}
            data={chatDataList}
            renderItem={renderMessageList}
            keyExtractor={(item) => item.key}
            ref={flatlistRef}
            showsVerticalScrollIndicator={false}
          />
        ) : <View style={styles.welcomeFriendWrapper}>
                <Image source={require('../../assets/images/icons/waving-hand.gif')} style={styles.wavingHandIcon}/>
                <Text style={styles.welcomeFriendText}>"Say hello with { item.gender === "male" ?  "him" : "her"}"</Text>
            </View>
        }

        <View style={styles.chatFormWrapper}>
          <View style={styles.chatFormTop}>
            <TouchableOpacity
              style={styles.openMediaWrapper}
              onPress={pickImage}
            >
              <Entypo
                name="images"
                size={20}
                color={theme.colors.gray}
                style={styles.openMediaIcon}
              />
            </TouchableOpacity>
            {reviewImages.length < 1 ? (
              // https://github.com/staltz/react-native-emoji-modal
              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  num={10}
                  placeholder="Type your message..."
                  value={chatData.text}
                  onChangeText={(text) =>
                    setChatData({ ...chatData, text: text })
                  }

                  // showSoftInputOnFocus={isShowKeyboard}
                />
                <TouchableOpacity
                  onPress={() => {
                    // setChatFormBottomVisible(!isChatFormBottomVisible);
                    if (isChatFormBottomVisible) {
                      setChatFormBottomVisible(false);
                    } else {
                      setChatFormBottomVisible(true);
                      Keyboard.dismiss();
                    }
                  }}
                  style={styles.iconEmoticon}
                >
                  <MaterialCommunityIcons
                    name="emoticon"
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: "75%", padding: 10 }}>
                <FlatList
                  style={{ flex: 1 }}
                  data={reviewImages}
                  renderItem={renderReviewingImages}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                {/* <Image style={{ width: 50, height: 50 }}
              source={{ uri : "file:///data/user/0/com.zhungrychatappv2/cache/rn_image_picker_lib_temp_c6576ec6-356d-4028-910e-2455493e2d6b.jpg" }}/> */}
              </View>
            )}

            <TouchableOpacity
              style={styles.iconSendWrapper}
              onPress={() => {
                handleSendMessage();

                scrollToEnd();
              }}
            >
              <Feather name="send" size={30} color={theme.colors.lightGray} />
            </TouchableOpacity>
          </View>
          {isChatFormBottomVisible && (
            <View style={styles.chatFormBottom}>
              <EmojiModal
                columns={9}
                row
                containerStyle={{
                  borderRadius: 0,
                  width: "100%",
                  alignItems: "center",
                }}
                onEmojiSelected={(emoji) =>
                  setChatData({ ...chatData, text: chatData.text + emoji })
                }
              />
            </View>
          )}
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
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
  avatarMessageWrapper: {
    marginLeft: 10,
  },
  avatarMessage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  headerWrapper: {
    marginLeft: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  rightheaderWrapper: {},
  itemUserText: {
    color: theme.colors.black,
    fontFamily: "Rubik-Medium",
    fontSize: 13,
  },
  itemactivingTimeText: {
    color: theme.colors.green,
    fontFamily: "Rubik-Regular",
    fontSize: 9,
  },
  seperatorLine: {
    backgroundColor: theme.colors.green,
    width: "90%",
    height: 1,
    alignSelf: "center",
  },
  chatFormWrapper: {
    width: "100%",
    height: "auto",
    position: "absolute",
    bottom: 0,
  },
  chatFormTop: {
    width: "100%",
    height: 76,
    backgroundColor: "#F3F3F3",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  chatFormBottom: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
  },
  openMediaWrapper: {
    width: "10%",
  },
  textInputWrapper: {
    width: "75%",
    padding: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
  },
  textInput: {
    width: "90%",
    fontFamily: "Rubik-Regular",
  },
  iconEmoticon: {
    width: "10%",
    marginHorizontal: "2%",
  },
  iconSendWrapper: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  contentMessageWrapper: {
    width: "90%",
    height: "100%",
    marginBottom: 80,
    alignSelf: "center",
    marginTop: 13,
  },

  yourMessageTextWrapper: {
    backgroundColor: theme.colors.green,
    width: "80%",
    height: 41,
    justifyContent: "center",
    padding: 10,
  },
  yourMessageImageWrapper: {
    backgroundColor: theme.colors.green,
    width: "80%",
    height: 100,
    justifyContent: "center",
    padding: 10,
  },

  yourMessageText: {
    fontFamily: "Rubik-Regular",
    fontSize: 16,
    color: theme.colors.black,
  },
  timeSentText: {
    alignSelf: "flex-end",
    marginRight: "20%",
    marginVertical: 7,
    fontFamily: "Rubik-Regular",
    fontSize: 8,
    color: theme.colors.lightGray,
  },

  myMessageTextWrapper: {
    backgroundColor: theme.colors.tranparentGreen,
    width: "80%",
    height: 50,
    justifyContent: "center",
    right: 0,
    borderRadius: 5,
    padding: 10,
    marginLeft: "20%",
  },
  myMessageImageWrapper: {
    backgroundColor: theme.colors.tranparentGreen,
    width: "80%",
    height: 100,
    justifyContent: "center",
    right: 0,
    borderRadius: 5,
    padding: 10,
    marginLeft: "20%",
  },
  myMessageText: {
    fontFamily: "Rubik-Regular",
    fontSize: 16,
    color: theme.colors.black,
  },
  myTimeSentText: {
    alignSelf: "flex-end",
    marginVertical: 7,
    fontFamily: "Rubik-Regular",
    fontSize: 10,
    color: theme.colors.black,
  },
  reviewingImage: {
    height: 50,
    width: 50,
  },
  welcomeFriendWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  wavingHandIcon: {
    width: 200,
    height: 200,
  },
  welcomeFriendText: {
    fontSize: 20,
    color: theme.colors.darkGray
  }
});

export default PrivateChat;
