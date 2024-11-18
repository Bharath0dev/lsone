import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const ImageUpload = () => {
    const [imageUri, setImageUri] = useState(null);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const asset = response.assets[0]; // Get the first selected asset
                const source = { uri: asset.uri };
                setImageUri(source.uri);
                uploadImage(source.uri, asset.type, asset.fileName);
            }
        });
    };

    const uploadImage = async (uri, type, name) => {
        const formData = new FormData();
        formData.append('image', {
            uri,
            type: type || 'image/jpeg', // Use the provided type, default to 'image/jpeg'
            name: name || 'photo.jpg', // Use the provided name, default to 'photo.jpg'
        });

        try {
            const response = await axios.post('http://192.168.1.218:4021/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <View>
            <Button title="Select Image" onPress={selectImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        </View>
    );
};

export default ImageUpload;
