
import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { useCallback } from 'react';

const ProviderAvailabilityScreen = () => {
  const [userId, setUserId] = useState('');
  const [unAvailability, setUnAvailability] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [datesForFlatList, setDatesForFlatlist] = useState([]);

  const navigation = useNavigation();

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
  }

  useEffect(() => {
    getData();
  }, []);

  const getProviderUnAvailability = async () => {
    try {
      const response = await axios.get('http://192.168.1.218:4021/getProviderUnAvailability', {
        params: { providerId: userId },
      });
      setUnAvailability(response.data);
    } catch (error) {
      console.error('Error fetching unavailability:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        getProviderUnAvailability();
      }
    }, [userId])
  );

  useEffect(() => {
    const initialSelectedDates = unAvailability.reduce((acc, date) => {
      acc[date] = { selected: true };
      return acc;
    }, {});
    setSelectedDates(initialSelectedDates);
  }, [unAvailability]);

  const submitDates = async (dates) => {
    const response = await axios.post('http://192.168.1.218:4021/updateAvailability', {
      unAvailabilityDates: dates,
      providerId: userId,
    });

    if (response.data && response.data.availability && response.data.availability.unAvailableDates) {
      setUnAvailability(response.data.availability.unAvailableDates);
    }
  };

  // useEffect(()=>{
  //   const today = new Date();
  //   const yesterday = new Date(today);
  //   yesterday.setDate(today.getDate() - 1); 

  //   const filterDatesGreaterThanYesterday = (dates) => {
  //       return dates.filter(dateString => {
  //           const date = new Date(dateString);
  //           return date > yesterday; 
  //       });
  //   };

  //   const result = filterDatesGreaterThanYesterday(unAvailability);
  //   // console.log(result); 
  //   setDatesForFlatlist(result);
    
  // }, [unAvailability])

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const filterDatesGreaterThanYesterday = (dates) => {
      return dates.filter((dateString) => {
        const date = new Date(dateString);
        return date > yesterday;
      });
    };
  
    // Deduplicate dates using Set and filter dates
    const uniqueDates = [...new Set(unAvailability)];
    const result = filterDatesGreaterThanYesterday(uniqueDates);
  
    setDatesForFlatlist(result);
  }, [unAvailability]);
  


  const MultiDatePicker = () => {
    const onDayPress = (day) => {
      const dateString = day.dateString;
      const newSelectedDates = { ...selectedDates };

      if (newSelectedDates[dateString]) {
        delete newSelectedDates[dateString]; // Deselect if already selected
      } else {
        newSelectedDates[dateString] = { selected: true }; // Select if not selected
      }

      setSelectedDates(newSelectedDates);
    //   setSelectedDates(newSelectedDates);
    };

    const handleSubmit = () => {
      const datesArray = Object.keys(selectedDates);
      submitDates(datesArray);
      setShowCalendar(!showCalendar);
    };

  

    
    
    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...unAvailability.reduce((acc, date) => {
              acc[date] = { selected: true, marked: true, selectedColor: '#E3524E' };
              return acc;
            }, {}),
            ...Object.keys(selectedDates).reduce((acc, date) => {
              acc[date] = { selected: true, selectedColor: '#00634B' }; // Highlight selected dates
              return acc;
            }, {}),
          }}
          markingType={'multi-dot'}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button onPress={handleSubmit} style={styles.button} labelStyle={styles.buttonText}>
            Cancel
            </Button>

            <Button onPress={handleSubmit} style={styles.button} labelStyle={styles.buttonText}>
            Submit Dates
            </Button>
            
        </View>
        
        <Text style={styles.selectedDatesText}>
          Selected Dates: {Object.keys(selectedDates).join(', ')}
        </Text>
      </View>
    );
  };

  const handleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <View style={styles.pageContainer}>
      <View>
      <Text style={styles.headerText}>My Leaves</Text>
        <FlatList
          data={datesForFlatList}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item} // Assuming each item is unique
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Leaves</Text>
            </View>
        }     
        />
      </View>

      <View>
        {showCalendar ? null : 
        <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleCalendar}
      >
        Add More Leaves
      </Button>
      }
        
      </View>
      {showCalendar ? <MultiDatePicker /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
      },
      container: {
        padding: 20,
      },
      headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        // color: '#333'
      },
      itemContainer: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        // shadowRadius: 3,
        elevation: 2,
      },
      itemText: {
        fontSize: 16,
        color: '#333',
      },
      separator: {
        height: 6, // Space between items
      },
      selectedDatesText: {
        marginTop: 20,
      },
      button: {
        backgroundColor: '#00634B',
        borderRadius: 8,
        marginVertical: 15,
      },
      buttonText: {
        color: 'white',
        fontSize: 15,
      },
      emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
      },
      emptyText: {
        fontSize: 18,
        color: 'gray',
      },
});

export default ProviderAvailabilityScreen;

