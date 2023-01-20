import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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

      return assets[0];
    }
  });
};
