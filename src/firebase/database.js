// https://iconscout.com/icon-pack/facebook-reaction
import {  database } from '../../firebase';
import firebase from 'firebase';
import { uploadImage } from "../firebase/storage";
import { auth } from '../../firebase';
const getuserListRef = () => {
    return database.ref('users');
}



const addNewPrivateMessage = (chatData, reviewImages) => {
    chatData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    // const senderMessageKey = database.ref('messages').child(chatData.sender).child(chatData.receiver).push().key;
    // const receiverMessageKey = database.ref('messages').child(chatData.receiver).child(chatData.sender).push().set(chatData).key;
    const senderMessageKey =  database.ref('messages').child(chatData.sender).child(chatData.receiver).push().key;
    console.log("senderMessageKey"+senderMessageKey);

    database.ref('messages').child(chatData.sender).child(chatData.receiver).child(senderMessageKey).set(chatData).then(() => {
        const receiverMessageKey = database.ref('messages').child(chatData.receiver).child(chatData.sender).push().key;
        database.ref('messages').child(chatData.receiver).child(chatData.sender).child(receiverMessageKey).set(chatData).then(() => {
            if(reviewImages.length > 0 ){
                var pushedFireBaseimageUrls = [];
                var pushedFirebaseimageUrlsOb = {};

                for(var index = 0; index < reviewImages.length; index++){
                    // console.log("imageUrl");
                    // console.log(imageUrl);
                    
                    uploadImage("chat", reviewImages[index]).then((snapshot) => {
                        
                        snapshot.ref.getDownloadURL().then((downloadUrl) => {
                            // console.log("Type offfff");
                            // console.log(typeof(senderMessageKey));
                            pushedFireBaseimageUrls.push(downloadUrl);
                            // console.log(downloadUrl);
                            // if(index == (reviewImages.length - 1)){
                                // console.log("senderMessageKey:"+senderMessageKey);
                                Object.assign(pushedFirebaseimageUrlsOb, pushedFireBaseimageUrls); 
                                // console.log("pushedFirebaseimageUrlsOb");
                                // console.log(pushedFirebaseimageUrlsOb);
                                database.ref('messages/'+chatData.receiver+"/"+chatData.sender+"/"+String(receiverMessageKey)).child("imageUrls")
                                .set(pushedFirebaseimageUrlsOb);
                                database.ref('messages/'+chatData.sender+"/"+chatData.receiver+"/"+String(senderMessageKey)).child("imageUrls")
                                .set(pushedFirebaseimageUrlsOb);
                                // console.log("senderMessageKey"+senderMessageKey);
                                // database.ref('messages/'+chatData.receiver+"/"+chatData.sender+"/"+String(senderMessageKey)).remove();
                                // console.log(JSON.stringify(pushedFirebaseimageUrlsOb));

                            // }

                        })

                        // snapshot.ref.getDownloadURL().then(downloadUrl => pushedFireBaseimageUrls.push(downloadUrl));
                        // console.log("pushedFireBaseimageUrls "+pushedFireBaseimageUrls);
                    })

                   
                }
            }   
        }).catch((err) => {
            console.log("err"+err);
        });
    })
}   

const getAllChat = async (userId) =>{
    allchatlistRef = database.ref(`messages/${userId}`);
    allchatlistRef.on("value", (snapshot) => {
        let list = [];
        let newMessage = {
            name : '',
            avatar: '',
            latest_message : ''
        }
  
        snapshot.forEach((chat) => {
            // console.log(message.val());
            getUserById(snapshot.key).then((userInfo) => {
                newMessage.name = `${userInfo.val().firstName} ${userInfo.val().lastName}`;
                newMessage.avatar = userInfo.val().avatar;
            })
  
            getLastestMessagewithUserId(userId, chat.key).then((messages) => {
                messages.forEach((message) => {
                  newMessage.latest_message = message.val().text;
                })
                // console.log(newMessage);
                list.push(newMessage);
                
            })
        })
        
        return list;
      });
}

const getAllChatListRef = (userId) => {
    return database.ref(`messages/${userId}`);
}

const getDetailChatListRef = (myId, yourId) => {
    return database.ref(`messages/${myId}/${yourId}`);
}

const getUserById = async (userId) => {
    return await database.ref(`users/${userId}`).get();
}

const getLastestMessagewithUserId = async (myId, yourId) => {
    return await database.ref(`messages/${myId}/${yourId}`).limitToLast(1).get()
}

const getUserbyName = async (name) => {
    return await database.ref().child('users').orderByChild("lastName").equalTo(name);
}

const setRelationShipDB = async (currentId, otherId, status) => {
    
    switch (status) {
        // currentId send request to otherId
        case 1:
            await database.ref().child('users').child(currentId).child("relationship").child(otherId).set(1);
            await database.ref().child('users').child(otherId).child("relationship").child(currentId).set(2);
            break;
        //currentId accept request
        case 3:
            await database.ref().child('users').child(currentId).child("relationship").child(otherId).set(3);    
            await database.ref().child('users').child(otherId).child("relationship").child(currentId).set(3);
        //unfriend
        case 4: 
            await database.ref().child('users').child(currentId).child("relationship").child(otherId).remove();  
            await database.ref().child('users').child(otherId).child("relationship").child(currentId).remove();
            break;
        default:
            break;
    }
}

const getUserInfoByKey = (key) => {
    return database.ref().child('users').child(key);
}

const getUserInfo = async (key) => {
    return await database.ref().child('users').child(key).get();
}

const addNewPost = (postData, reviewImages) => {
    postData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    delete postData.reviewImages;
    const postKey =  database.ref('post').push().key;

    
    if(reviewImages.length > 0){
        
        var imageUrlArr = [];

        reviewImages.forEach((image) => {
            uploadImage("post", image).then((snapshot => {
                snapshot.ref.getDownloadURL().then(downloadUrl => {
                    imageUrlArr.push(downloadUrl);

                    const pushFirebaseImageObj = {};
                    Object.assign(pushFirebaseImageObj, imageUrlArr); 
                    console.log(pushFirebaseImageObj);
                    postData.imageUrls = pushFirebaseImageObj;
                    
                    database.ref('post').child(postKey).set(postData);
                }).catch(e => console.log(e));
            }))
        })
    }else{
        database.ref('post').child(postKey).set(postData);
    }
}

const getPostRef = () => {
    return database.ref().child('post');
}

const getPost = () => {
    return database.ref().child('post').get();
}

const addPostReaction = (postKey, fromUserKey, toUserKey, type) => {
   
    if(type === 0){
        database.ref('post').child(postKey).child('reaction').child(fromUserKey).remove();
    }else{
        database.ref('post').child(postKey).child('reaction').child(fromUserKey).set({type});
        if(fromUserKey !== toUserKey){
            addNotification(fromUserKey, toUserKey, " just reacted to your post")
        }
    }
}

const addNotification = (fromUserKey, toUserKey, content) => {
    const notifyKey =  database.ref('notification').child(toUserKey).push().key;

    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    database.ref('notification').child(toUserKey).child(notifyKey).set(
        {
            fromUserKey,
            content,
            timestamp,
            status : 0
        }
    )
}

const getNotificationRef = (userKey) => {
    return database.ref('notification').child(userKey);
}

const addNewComment = (userKey, postKey, content) => {
    const commentKey = database.ref('post').child(postKey).child('comments').push().key;
    const timestamp = firebase.database.ServerValue.TIMESTAMP;

    database.ref('post').child(postKey).child('comments').child(commentKey).set({
        userKey, content, timestamp
    });
}

const getCommentRef = (postKey) => {
    return database.ref('post').child(postKey).child('comments');
}

export { 
    getuserListRef, 
    addNewPrivateMessage, 
    getDetailChatListRef,
    getAllChatListRef,
    getUserById,
    getLastestMessagewithUserId,
    getAllChat,
    getUserbyName,
    setRelationShipDB,
    getUserInfoByKey,
    addNewPost,
    getPostRef,
    getPost,
    addPostReaction,
    addNotification,
    getNotificationRef,
    addNewComment,
    getCommentRef,
    getUserInfo
}