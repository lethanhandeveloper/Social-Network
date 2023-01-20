import { storage } from "../../firebase";

var storageRef = storage.ref();

var convertUriToBlob = async (result) => {
    var blob = await new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', result.uri, true);
        xhr.send(null);
    });

    return blob;
};

var uploadImage = async (directory, image) => {
    var imagesRef = storageRef.child(directory);
    return await imagesRef.child(image.fileName).put(await convertUriToBlob(image));
    // console.log(image.fileName);
}

export { uploadImage }

