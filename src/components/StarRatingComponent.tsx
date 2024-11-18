// import { Image, StyleSheet, Text, View } from "react-native";
// import react from 'react';

// const RatingStars = ({ rating }) => {
//     const maxRating = 5;
    
//     // Function to get the filled star count
//     const getFilledStars = () => {
//       const filledStars = Math.floor(rating); // Round down to nearest integer
//       const halfStar = rating % 1 >= 0.5;   // Check if there's a half-star (e.g. 4.5, 3.5)
//       return { filledStars, halfStar };
//     };
  
//     const { filledStars, halfStar } = getFilledStars();
  
//     const renderStars = () => {
//       let stars = [];
      
//       // Loop through max rating and display filled/empty stars
//       for (let i = 0; i < maxRating; i++) {
//         if (i < filledStars) {
//           stars.push(<Image key={i} source={require('../assets/stars/star_filled.png')} style={styles.star} />);
//         } else if (i === filledStars && halfStar) {
//           stars.push(<Image key={i} source={require('../assets/stars/half_filled.png')} style={styles.star} />);
//         } else {
//           stars.push(<Image key={i} source={require('../assets/stars/star_corner.png')} style={styles.star} />);
//         }
//       }
      
//       return stars;
//     };
  
//     return (
//       <View style={styles.starMainContainer}>
//         <View style={styles.starsContainer}>
//           {renderStars()}
//         </View>
//         <Text style={styles.ratingText}>{rating} / 5</Text>
//       </View>
//     );
//   };

//   const styles = StyleSheet.create({
//     starMainContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
//       starsContainer: {
//         flexDirection: 'row',
//       },
//       star: {
//         width: 15, // Set appropriate size for the stars
//         height: 15,
//         marginRight: 5,
//       },
//       ratingText: {
//         marginTop: 5,
//         fontSize: 12,
//         color: '#333',
//       },
//   })
//   export default RatingStars;


import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const StarRatingComponent = ({rating, displayType}) => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {displayType === 'stars' && (
        <Rating
          onFinishRating={rating}
          startingValue={rating}
          style={{ paddingVertical: 5 }}
          fractions={10}
          imageSize={15}
        />
      )}
      {displayType === 'rating' && (
        <Text>{rating}/5</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({})
export default StarRatingComponent;
