import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Image } from 'react-native';
import {Entypo} from "react-native-vector-icons";
import theme from "../../assets/colors";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


const LoginForm = (props) => {
    const [isVisiblePw, setVisiblePw] = useState(true);
    const [userInfo, setUserInfo] = useState({ email: '', password: '' });



    const pickImage = async () => {
      const options = {
        includeBase64: true,
        storageOptions: {
          path: 'images',
          mediaType: 'photo'
        } 
      }
  
      launchImageLibrary(options, response => {
        console.log("sss");
      })
    };
    return (
        <>
        <TouchableOpacity
        style={styles.loginwithGoogleWrapper}
        onPress={pickImage}
      >
        <Image
          source={require("../../assets/images/icons/google-icon.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.loginwithGoogleText}>Continue with Google</Text>
      </TouchableOpacity>
      <View style={styles.orSeperatorWrapper}>
            <View style={{ height: 1, width: "43%", backgroundColor: "#707070" }} />
            <Text>Or</Text>
            <View style={{ height: 1, width: "43%", backgroundColor: "#707070" }} />
      </View>
        <View style={styles.formInputWrapper}>
          <Text style={styles.textLabel}>Email Address</Text>
          <TextInput style={styles.textInput} placeholder="" returnKeyType="next" value={userInfo.email} 
                onChangeText={text => setUserInfo({ ...userInfo, email : text})} />
          <Text style={styles.textLabel}>Password</Text>
          <View style={styles.textInput}>
              <TextInput secureTextEntry={isVisiblePw} style={styles.textInputPassword} value={userInfo.password} 
                  onChangeText={text => setUserInfo({ ...userInfo, password : text})}/>
              <Pressable style={styles.toggleVisiblePwIcon} onPress={() => setVisiblePw(!isVisiblePw)}>
                  {isVisiblePw ? <Entypo name="eye" size={27} /> : <Entypo name="eye-with-line" size={27} />}
              </Pressable>
          </View>
          <Pressable style={styles.forgetPasswordWrapper}>
              <Text style={styles.forgetPasswordText}>Forget Password ?</Text>
          </Pressable>
          <TouchableOpacity style={styles.loginWrapper} onPress={() => props.handleLogin(userInfo)}>
              <Text style={styles.loginTextWrapper}>Log in</Text>
          </TouchableOpacity>
          
      </View>
      </>
    );
};

const styles = {
    formInputWrapper:{
        width: "90%",
        alignSelf: "center",
        marginTop: 30
      },
      textLabel:{
          marginBottom: 5,
          fontSize: 9,
          fontFamily: "Rubik-Regular",
          color : "#676767",
          marginTop: 5
      },
      textInput:{
        width: "100%",
        height: 58,
        borderColor: "#AEAEAE",
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 13,
        paddingVertical: 8,
        flexDirection: "row"
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
          marginTop: 5
      },
      forgetPasswordText: {
        color: theme.colors.black,
        fontSize: 9,
        fontFamily: "Rubik-Regular",
        alignSelf: "flex-end"
      },
      loginWrapper:{
          marginTop: 25,
          backgroundColor: "#06E523",
          width: "100%",
          height: 58,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center"
      },
      loginTextWrapper:{
          color: theme.colors.white,
          fontSize: 20,
          fontFamily: "Rubik-Regular"
      },
    
      loginwithGoogleWrapper: {
        width: "90%",
        height: 57,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#AEAEAE",
        alignSelf: "center",
        marginTop: 30,
        padding: 10,
        justifyContent: "center",
      },
      googleIcon: {},
      loginwithGoogleText: {
        color: theme.colors.lightGray,
        fontSize: 20,
        fontFamily: "Rubik-Regular",
        marginLeft: 20,
      },
      orSeperatorWrapper: {
        marginTop: 20,
        flexDirection: "row",
        alignSelf: "center",
        height: "auto",
        alignItems: "center",
      },
      orLeftSeperator: {
        borderWidth: 1,
        backgroundColor: theme.colors.lightGray,
        width: "50%",
        height: 1,
      },
      orText: {},
      orRightSeperator: {
        borderWidth: 1,
        backgroundColor: theme.colors.lightGray,
        width: "50%",
      },
}

export default LoginForm;