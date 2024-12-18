import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'react-native-paper';
import Scheduler from '../components/Scheduler';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import BookingModal from '../Modals/BookingModal';
import RatingStars from '../components/StarRatingComponent';
import StarRatingComponent from '../components/StarRatingComponent';

const { height, width } = Dimensions.get('window');

const ProviderServiceImagesCarousel = ({imageData, baseUrl}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Autoplay interval setup
  useEffect(() => {
    const interval = setInterval(() => {
        if (flatListRef.current) {
            const nextIndex = (currentIndex + 1) % imageData.length;
            // Only scroll if nextIndex is valid
            if (nextIndex >= 0 && nextIndex < imageData.length) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                setCurrentIndex(nextIndex);
            }
        }
    }, 3000);

    // console.log('Image Data Length:', imageData.length);
    return () => clearInterval(interval);
}, [currentIndex, imageData.length]); // Add imageData.length to dependencies



const handleScroll = (event) => {
  const x = event.nativeEvent.contentOffset.x;
  const newIndex = Math.round(x / width);

  if (newIndex !== currentIndex && newIndex >= 0 && newIndex < imageData.length) {
      setCurrentIndex(newIndex);
      // console.log('New Index:', newIndex);
  }
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
                <Image source={ { uri: baseUrl + item} } style={styles.image} />
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

const ProviderDetailsScreen = ({ route }) => {
    const { providerId, customer_Id, service_Id } = route.params;
    const [activeScheduler, setActiveScheduler] = useState(null);
    const [providerData, setProviderData] = useState('');
    const [providerServiceImages,setProviderServiceImages] = useState([]);
    const [customerId, setCustomerId] = useState(customer_Id);
    const [serviceId, setServiceId] = useState(service_Id);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [isAlreadyBooked, setIsAlreadyBooked] = useState(true);

    const navigation = useNavigation();

    const baseUrl = 'http://192.168.1.218:4021/';

 
    useEffect(()=>{
        console.log(providerId);
        console.log(customerId);
        console.log(service_Id);
    })


    const getProviderDetails = async () => {
      const response = await axios.get('http://192.168.1.218:4021/getProviderDetails', {params: {providerId:providerId}})
        console.log('consoling providerData in ProviderDetailsScreen: ',response.data);
        setProviderData(response.data.data);
    }
  
    useFocusEffect(
      useCallback(()=>{
      getProviderDetails();
      },[])
    )

    useEffect(()=>{
      
      console.log('providerData: ',providerData);

      if (providerData && providerData.providerDetails) {
        setProviderServiceImages(providerData.providerDetails.providerServiceImages || []);
    }    
  },[providerData])


  useEffect(() => {
    console.log('providerServiceImages:', providerServiceImages);
  }, [providerServiceImages]);

const ProviderReviewsData = ({ providerId }) => {

  const [providerReviews, setProviderReviews] = useState([]); 

  const getProviderReviews = async () => {
    const response = await axios.get('http://192.168.1.218:4021/getProviderReviews', {params: {providerId: providerId}});
    console.log('getProviderReviews: ',response.data);
  
    if (response.data && response.data.length > 0) {
      setProviderReviews(response.data);
    }
  }

  useEffect(()=>{
    getProviderReviews();
  },[providerId])


  // Function to format the date and time from the createdAt field
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp); 
  
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });

  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return { date: dateString, time: timeString };
};

  return(
    <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
      
      {/* {providerReviews.length > 0 ? (
        <FlatList
        data={providerReviews}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.customerName}</Text>
            <Text>{item.comment}</Text>
            <Text>Rating: {item.rating}</Text>
          </View>
        )}
            />
            
            ) : (
              <Text>No reviews available</Text>
            )} */}

      {providerReviews.length > 0 ? (
        providerReviews.map((review, index) => {
          const { date, time } = formatDateTime(review.createdAt);
          return(
          <ScrollView key={review.id || index} style={styles.reviewScrollview}>
            <View style={styles.reviewView}>
              <View style={{flexDirection: 'row', justifyContent:'space-between', height: 50, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <View>
                    <Image source={{uri: `http://192.168.1.218:4021/${review.customerProfileImage}`}}
                    style={{height: 35, width: 35, borderRadius: 50}}/>
                  </View>
                  <View>
                    <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>{review.customerName}</Text>
                    <Text style={{fontSize: 13}}>{date} at {time}</Text>
                  </View> 
                </View>
                <View>
                  {/* <Text>{review.rating}</Text> */}
                  {/* <Text>{<StarRatingComponent rating={review.rating} />}</Text> */}

                  {/* <Text>{<StarRatingComponent rating={review.rating} displayType="stars" />}</Text>
                  {/* Or display only rating */}
                  {/* //<Text>{<StarRatingComponent rating={review.rating} displayType="rating" />}</Text>  */}

                  {review?.rating !== undefined ? (
                    <View>
                      <Text>{<StarRatingComponent rating={review.rating} displayType="stars" />}</Text>
                      <Text>{<StarRatingComponent rating={review.rating} displayType="rating" />}</Text>
                    </View>
                
              ) : (
                <Text>No rating available</Text> // Placeholder if no rating is available
              )}
                </View>
              </View>
              <View style={{height: 0.8,width: '100%', backgroundColor: 'lightgrey', marginHorizontal: 'auto'}}>
              </View>  
              <View>
                <Text>{review.comment}</Text>
              </View> 
              
            </View>
          </ScrollView>
        )
})
      ) : (
        <View style={{alignItems: 'center', margin: 20}}>
          <Text>No reviews</Text>
        </View>
      )}
    </View>
  )
}

const isBookedAlready = async () => {

  if (!customerId || !serviceId || !providerId) {
    console.log('Missing data for booking check');
    return;
  }
  
  const response = await axios.get('http://192.168.1.218:4021/bookingDataBycustomerIdAndProviderId', 
    { params: { serviceId: serviceId, customerId: customerId, providerId: providerId}});
  
  console.log(response.data);

  if(response.data.status === 'noData'){
    setIsAlreadyBooked(false);
  }else if(response.data.status === 'yes')
    setIsAlreadyBooked(true);
}

useEffect(()=>{
  isBookedAlready();
},[]);

const handleProceedToBook = () => {
  if(isAlreadyBooked){
    Alert.alert(
      "You have already booked this provider", 
      "Do you want to proceed?", 
      [
        {
          text: "Cancel",
          onPress: () => navigation.goBack(),
          style: "cancel", 
        },
        {
          text: "OK", 
          onPress: () => setBookingModalVisible(true),
        }
      ],
      { cancelable: false } 
    );
  }else{
    setBookingModalVisible(true);
  }
  
}


  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
      <ProviderServiceImagesCarousel imageData={providerServiceImages} baseUrl={baseUrl}/>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.header}>Provider Details</Text>
      </View>
      <View>
          <View style={{flexDirection:'row', justifyContent: 'space-between',  marginHorizontal: 15}}>
            <View>
              <Text style={styles.flatlistText}>{providerData.name}</Text>
              <Text style={styles.flatlistText}>{providerData.email}</Text>
              <Text style={styles.flatlistText}>{providerData.mobile}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {providerData?.providerDetails?.rating !== undefined ? (
                providerData?.providerDetails?.rating == null ? (
                  <View style={{marginTop: 20}}>
                    <Text>No Ratings</Text>
                  </View>
                ) : (
                  <View>
                    <Text>{<StarRatingComponent rating={providerData.providerDetails.rating} displayType="stars" />}</Text>
                    <Text>{<StarRatingComponent rating={providerData.providerDetails.rating} displayType="rating" />}</Text>
                  </View>
                )
                
              ) : (
                <Text>Loading...</Text> // Show loading or placeholder if rating is not available
              )}
          </View>
        </View>
        <View style={{marginHorizontal: 15,}}>
          {/* {providerData.providerDetails.experience ? (
            <View style={{flexDirection: 'row', rowGap: 8}}>
              <Text style={{fontSize: 15, color: '#333', fontWeight: '600'}}>Experience: </Text>
              <Text style={{fontWeight: '500', color: '#333', marginTop: 2}}>{providerData.providerDetails.experience} years</Text>
            </View>
          ) : (null)}

          {providerData.providerDetails.description ? (
            <View style={{flexDirection: 'row', rowGap: 8}}>
              <Text style={{fontSize: 15, color: '#333', fontWeight: '600'}}>Description: </Text>
              <Text style={styles.flatlistTextDescription}>{providerData.providerDetails.description}</Text>
            </View>
          ) : (null)} */}

          {providerData.providerDetails?.experience ? (
            <View style={{flexDirection: 'row', rowGap: 8}}>
              <Text style={{fontSize: 15, color: '#333', fontWeight: '600'}}>Experience: </Text>
              <Text style={{fontWeight: '500', color: '#333', marginTop: 2}}>{providerData.providerDetails.experience} years</Text>
            </View>
          ) : null}

          {providerData.providerDetails?.description ? (
            <View style={{flexDirection: 'row', rowGap: 8}}>
              <Text style={{fontSize: 15, color: '#333', fontWeight: '600'}}>Description: </Text>
              <Text style={styles.flatlistTextDescription}>{providerData.providerDetails.description}</Text>
            </View>
          ) : null}

          
        </View>

      </View>
        
        <View style={{marginTop: 15}}>
            <View style={{borderWidth: 0.2, borderColor: 'grey', marginHorizontal: 15, marginVertical: 15}}>

            </View>
            <View >
              <Text style={{fontSize: 18, color: '#333', fontWeight: '500', textAlign: 'center'}}>Reviews</Text>
            </View>
            <View>
              <ProviderReviewsData providerId={providerId} />
            </View>
        </View>
        
      
     </ScrollView>

     <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center',}}>

        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={() => handleProceedToBook()} // Show the modal
        >
          Proceed To Book
        </Button>
      </View>

      <BookingModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)} // Function to close the modal
        customerId={customer_Id} serviceId={service_Id} providerId={providerId}
      />

    </View>
    
  )
}

export default ProviderDetailsScreen

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#00634B',
        width: '95%',
        borderRadius: 8, 
        marginHorizontal:'auto',
    },
    buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    container: {
      // marginVertical: 10
      // justifyContent: 'center',
      // alignItems: 'center',
      // flex: 1,
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
      width: '100%',
      // height: '90%',
      borderRadius: 8,
      overflow: 'hidden', 
    },
    image: {
      width: '100%',
      height: 500,
      resizeMode: 'cover',
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
      marginTop: -20
    },
    header:{
      fontSize: 18
    },
    flatlistText:{
      color: 'black',
      fontSize: 18,
      fontWeight: '500',
      margin: 3,
    },
    overlay: {
      position: 'absolute',
      top: 200,
      left: 10,
      right: 10,
      bottom: 250,
      backgroundColor: 'white', // Semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, // Make sure it's on top
      height: 350,
      borderRadius: 20,
      paddingVertical: 20,

    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    reviewScrollview:{
      // height: 350,
      backgroundColor: 'white',
    },
    reviewView:{
      margin: 10,
      backgroundColor: 'white',
      elevation: 2,
      padding: 10,
      borderRadius: 8,
    },
    flatlistTextDescription:{
      margin: 3,
      fontSize: 13,
      width: '75%'
    }
})
