import axios from "axios";

const host = "http://192.168.1.10:3000";

const signup = (userInfo) => {
    axios({
        method: 'post',
        url: `${host}/todo/create`,
        data: {
          avatar: "",
          email: userInfo.email,
          password: userInfo.password,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          gender: userInfo.gender,
          phone: userInfo.phone,
        }
      }).catch(err => console.log(err));
}

 