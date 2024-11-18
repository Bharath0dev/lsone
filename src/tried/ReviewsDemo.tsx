import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-paper'
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import { TextInput } from 'react-native-gesture-handler';
// import halfStarImage  from '';

const ReviewsDemo = () => {

    const [defaultRating, setDefaultRating] = useState(0);
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

    const [count, setCount] = useState(0);
    const [halfFilledStar, setHalfFilledStar] = useState(-1);
    const [activeHalfStar, setActiveHalfStar] = useState(false);

    const [comment, setComment] = useState('');

    const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/refs/heads/main/star_filled.png';
    const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/refs/heads/main/star_corner.png';
    const starImgHalfFilled = '../assets/20241029_145629.png';

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
                                    ? (halfFilledStar === key ? require(starImgHalfFilled) : { uri: starImgFilled })
                                    : { uri: starImgCorner }
                                }
                                />
                            </TouchableOpacity>                        
                        )
                    })
                }
            </View>
        )
    }

    const adjustedRating = activeHalfStar ? defaultRating : (defaultRating > 0 ? defaultRating - 0.5 : defaultRating);

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center'}}>ReviewsDemo</Text>
      <CustomeRatingBar/>
      <Text style={styles.textStyle}>
        {/* {activeHalfStar ? ( 
            defaultRating + '/'+maxRating.length 
        ) : ( 
            defaultRating>0 ? defaultRating-0.5 + '/'+maxRating.length 
            : 
            defaultRating + '/'+maxRating.length
            )
        } */}
        {adjustedRating + '/' + maxRating.length}
        {/* {console.log(adjustedRating)} */}

        {/* {activeHalfStar ? ( 
            defaultRating + '/'+maxRating.length 
        ) : ( 
            defaultRating + '/'+maxRating.length
            )
        } */}

      </Text>

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
      onPress={()=> {Alert.alert(`${defaultRating}`)}}
      >
        <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>Submit</Text>
      </TouchableOpacity>

      {/* <Image source={ require(starImgHalfFilled)} style={{height: 40, width: 40, }}/> */}
    </View>
  )
}

export default ReviewsDemo

const styles = StyleSheet.create({
    container :{
        flex:1,
        margin: 10,
        justifyContent: 'center',
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
        borderRadius: 8
    },
    textInputStyle:{
        borderWidth: 0.5,
        borderRadius: 5,
        // height: 100,
        marginTop: 20,
        fontSize: 18
    }
})