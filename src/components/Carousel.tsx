import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Get screen dimensions
const { height, width } = Dimensions.get('window');

// Replace with your image URLs or local image imports
const imageData = [

  require('../assets/electrician-slider.jpg'),
  require('../assets/plumbing-slider.jpg'),
  require('../assets/repair-slider.jpg'),
  require('../assets/cleaning-slider.jpg'),
  require('../assets/painting-slider.jpg'),
  require('../assets/gardening-slider.jpg'),
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Autoplay interval setup
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (currentIndex + 1) % imageData.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000); // Change the interval duration as needed (3000 ms = 3 seconds)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <FlatList
          ref={flatListRef}
          data={imageData}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer} key={index}>
              <TouchableOpacity style={styles.item}>
                <Image source={item } style={styles.image} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.dotsContainer}>
        {imageData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: currentIndex === index ? 30 : 8,
                height: currentIndex === index ? 10 : 8,
                borderRadius: currentIndex === index ? 15 : 4,
                backgroundColor: currentIndex === index ? 'black' : 'gray',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    marginBottom: 10,
    // marginTop: 10,
  },
  itemContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: '95%',
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden', // Ensure images don't overflow the container
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust image sizing to cover the container
  },
  dotsContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -18,
  },
  dot: {
    marginLeft: 5,
  },
});

export default Carousel;
