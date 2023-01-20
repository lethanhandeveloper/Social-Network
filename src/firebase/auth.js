import { auth, database } from '../../firebase';

const login = async (email, password) => {
    // setLoading(true);
    return await auth.signInWithEmailAndPassword(email, password);
}


const signup = async (userInfo) => {
    // console.log(userInfo.email);
    // setLoading(true);
    let res =  await auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password);

    return await database.ref('users/' + res.user.uid).set({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone : userInfo.phone,
        gender: userInfo.gender,
        avatar: userInfo.avatar
    });
}

export { login, signup };