import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid
} from "react-native";
import { Entypo, Feather, EvilIcons } from "react-native-vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import theme from "../../assets/colors";
import "../../utils/imageUtil";

const genderList = ["Male", "Female"];
const SignUpForm = (props) => {
  
  const [isVisiblePw, setVisiblePw] = useState(false);
  const [userInfo, setUserInfo] = useState({id : '', avatar: [], firstName: '', lastName : '', email: '', password: '', phone: '', gender: 'Male'});

  

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

        setUserInfo({ ...userInfo, avatar: assets[0] })
      }
    })
  };

  return (
    <View style={styles.formInputWrapper}>
       {/* <Menu
        visible={true}
        style={styles.avatarWrapper}
        anchor
      >
        <MenuItem >Menu item 1</MenuItem>
        <MenuItem >Menu item 2</MenuItem>
      </Menu>
       */}
       <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
     <Image
       source={userInfo.avatar.uri ? {uri : userInfo.avatar.uri}  : require("../../assets/images/avatars/male.png")}
       style={styles.avatar}
       resizeMode="contain"
     />
      
     <View style={styles.cameraIconWrapper}>
       <Feather
         size={20}
         name="camera"
         style={styles.cameraIcon}
         color="white"
       />
     </View>
     </TouchableOpacity>
      
      <Text style={styles.textLabel}>First Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Le"
        returnKeyType="next"
        value={ userInfo.firstName }
        onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
      />
      <Text style={styles.textLabel}>Last Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="An"
        returnKeyType="next"
        value={ userInfo.lastName }
        onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
      />
      <Text style={styles.textLabel}>Email Address</Text>
      <TextInput
        style={styles.textInput}
        placeholder="lethanhan@gmail.com"
        returnKeyType="next"
        keyboardType="email-address"
        value={ userInfo.email }
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
      />
      <Text style={styles.textLabel}>Password</Text>
      <TextInput
        style={styles.textInput}
        placeholder="..."
        secureTextEntry={true}
        returnKeyType="next"
        value={ userInfo.password }
        onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
      />
      <Text style={styles.textLabel}>Phone Number</Text>
      <TextInput
        style={styles.textInput}
        placeholder="0374374747"
        returnKeyType="next"
        keyboardType="number-pad"
        value={ userInfo.phone }
        onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
      />
      <Text style={styles.textLabel}>Gender</Text>
      <SelectDropdown
        style={styles.textInput}
        data={genderList}
        onSelect={(selectedItem, index) => {
          setUserInfo({ ...userInfo, gender: selectedItem })
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />

      <TouchableOpacity
        style={styles.loginWrapper}
        onPress={() => props.handleSignUp(userInfo)}
      >
        <Text style={styles.loginTextWrapper}>Sign up</Text>
      </TouchableOpacity>
      {/* <Text style={styles.textLabel}>Email Address</Text>
          <TextInput style={styles.textInput} placeholder="" returnKeyType="next" value={email} onChangeText={text => setEmail(text)} />
          <Text style={styles.textLabel}>Password</Text>
          <View style={styles.textInput}>
              <TextInput secureTextEntry={isVisiblePw} style={styles.textInputPassword} value={password} onChangeText={text => setPassword(text)}/>
              <Pressable style={styles.toggleVisiblePwIcon} onPress={() => setVisiblePw(!isVisiblePw)}>
                  {isVisiblePw ? <Entypo name="eye" size={27} /> : <Entypo name="eye-with-line" size={27} />}
              </Pressable>
          </View>
          <Pressable style={styles.forgetPasswordWrapper}>
              <Text style={styles.forgetPasswordText}>Forget Password ?</Text>
          </Pressable>
          <TouchableOpacity style={styles.loginWrapper} onPress={() => props.handleLogin(email, password)}>
              <Text style={styles.loginTextWrapper}>Log in</Text>
          </TouchableOpacity> */}
    </View>
  );
};

const styles = {
  formInputWrapper: {
    width: "90%",
    alignSelf: "center",
    marginTop: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  textLabel: {
    marginBottom: 5,
    fontSize: 9,
    fontFamily: "Rubik-Regular",
    color: "#676767",
    marginTop: 5,
  },
  textInput: {
    width: "100%",
    height: 58,
    borderColor: "#AEAEAE",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
    flexDirection: "row",
  },
  textInputPassword: {
    width: "90%",
  },
  toggleVisiblePwIcon: {
    width: "10%",
    alignSelf: "center",
    marginHorizontal: 5,
  },
  forgetPasswordWrapper: {
    marginTop: 5,
  },
  forgetPasswordText: {
    color: theme.colors.black,
    fontSize: 9,
    fontFamily: "Rubik-Regular",
    alignSelf: "flex-end",
  },
  loginWrapper: {
    marginTop: 25,
    backgroundColor: "#06E523",
    width: "100%",
    height: 58,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  loginTextWrapper: {
    color: theme.colors.white,
    fontSize: 20,
    fontFamily: "Rubik-Regular",
  },
  avatarWrapper: {
    alignSelf: "center",
  },
  cameraIconWrapper: {
    backgroundColor: theme.colors.green,
    padding: 8,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: -30,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  cameraIcon: {},
};

export default SignUpForm;
