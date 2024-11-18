import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';




const ReviewsModal = ({ visible, onClose, customerId, bookingId, providerId }) => {

    // const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
    const [defaultRating, setDefaultRating] = useState(0);
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

    const [count, setCount] = useState(0);
    const [halfFilledStar, setHalfFilledStar] = useState(-1);
    const [activeHalfStar, setActiveHalfStar] = useState(false);

    const [bookingReviewed, SetBookingReviewed] = useState(false);

    const [comment, setComment] = useState('');

    // const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/refs/heads/main/star_filled.png';
    const starImgFilled = '../assets/stars/star_filled.png';
    // const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/refs/heads/main/star_corner.png';
    const starImgCorner = '../assets/stars/star_corner.png';
    const starImgHalfFilled = '../assets/stars/half_filled.png';

    const isBookingReviewed = async () => {
        const response = await axios.get('http://192.168.1.218:4021/isBookingReviewed', {params: { bookingId: bookingId }});
        console.log(response.data);
        SetBookingReviewed(response.data);
    }

    useEffect(()=>{
        isBookingReviewed();
    },[bookingId])

    const handleRatingStar = (item, key) => {
        if (halfFilledStar === key) {
            // If the same star is clicked again, clear the half-filled state
            setHalfFilledStar(-1);
            setDefaultRating(item); 
            setActiveHalfStar(true);
        } else {
            setHalfFilledStar(key); // Set the clicked star as half-filled
            setDefaultRating(item); // Update the rating to the selected star
            setActiveHalfStar(false);
        }
    }

    const CustomeRatingBar = () => {
        return(
            <View style={styles.customRatingBarStyle}>
                {
                    maxRating.map((item, key)=>{
                        // console.log(key);
                        return(
                            <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                                onPress={()=> handleRatingStar(item, key)}
                            >
                                <Image
                                style={styles.starImgStyle}
                                source={
                                    item <= defaultRating 
                                    ? (halfFilledStar === key ? require(starImgHalfFilled) : require(starImgFilled) )
                                    :  require( starImgCorner )
                                }
                                />
                            </TouchableOpacity>                        
                        )
                    })
                }
            </View>
        )
    }

    const handleSubmitReview = async (adjustedRating, customerId, providerId, bookingId) => {
        // Alert.alert(`${adjustedRating}`);
        if (!adjustedRating || !customerId || !providerId || !bookingId) {
            console.log('Please fill in all fields.');
            return;
        }
        // console.log('bookingId',bookingId);
        // console.log('provider_Id',providerId);
        // console.log('customerId',customerId);
        // console.log('comment: ',comment);

        const Data = {
            bookingId: bookingId,
            providerId: providerId,
            customerId: customerId,
            comment: comment,
            rating: adjustedRating,
        }
        console.log(Data);

        try{
            const response = await axios.post('http://192.168.1.218:4021/newReview', Data);
            console.log(response.data);
            if (response.data.status === 'ok') {
                Alert.alert('Review Submitted', 'Thankyou for your feedback.', 
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                onClose(); // Close the modal after the alert is acknowledged
                            }
                        }
                    ]);
            }
        }catch(error){
            console.error('Error while sending review:', error.message);
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Response status:', error.response.status);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('Request data:', error.request);
        }
        }
        
    }

    const adjustedRating = activeHalfStar ? defaultRating : (defaultRating > 0 ? defaultRating - 0.5 : defaultRating);
    

    return (
        <View style={styles.container}>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            >

            <View style={styles.modalContainer}>
                <Button onPress={onClose} style={{ margin: 20, alignItems: 'flex-end' }}>Close</Button>

                { !bookingReviewed ? (
                    <View style={styles.reviewContainer}>
                        <CustomeRatingBar/>

                        <Text style={styles.textStyle}>{adjustedRating + '/' + maxRating.length}</Text>

                        <TextInput
                        style={styles.textInputStyle}
                        value={comment}
                        onChangeText={text => setComment(text)}
                        placeholder="Enter your review"
                        multiline={true}
                        />

                        <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.buttonStyle}
                        onPress={()=> {handleSubmitReview(adjustedRating, customerId, providerId, bookingId)}}
                        >
                            <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                ): (<View style={{justifyContent: 'center', alignItems: 'center',}}>
                        <Text>Your Review Already Submitted for This Booking, </Text>
                        {/* <Text>If You want to write any feedback you can write to admin@localserve.com</Text> */}
                    </View>
                )}
                                
                

            </View>
          
          </Modal>
        </View>
      );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    modalContainer:{
        flex:1,
        backgroundColor: 'white',
      },
    reviewContainer:{
        justifyContent: 'center',
        alignItems: 'center',
      },
    textStyle:{
        textAlign: 'center',
        fontSize: 23,
        marginTop: 20,
        color: '#f0cc4c',
        fontWeight: '900'
    },
    customRatingBarStyle:{
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    starImgStyle:{
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    buttonStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        padding: 10,
        backgroundColor: '#00634B',
        borderRadius: 8,
        width: '90%'
    },
    textInputStyle:{
        borderWidth: 0.5,
        borderRadius: 5,
        height: 60,
        marginTop: 20,
        fontSize: 18,
        width: '90%',
    }
})

export default ReviewsModal