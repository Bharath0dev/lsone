import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';

const Dropdown = () => {


  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const getCategories = async ()=>{

      try{
          const response = await axios.get('http://192.168.1.218:4021/api/services')
          setServices(response.data.services);
          setCategories(Object.keys(response.data.services));

      }catch(error){
          console.error("Error fetching cats/services:", error);
      }
  }

  useEffect(()=>{
      getCategories();
  }, [])


  return (
    <View style={styles.ddcontainer}>
        <View style={styles.dropdownContainer}>
          <SelectList 
              setSelected={(value) => {
              setSelectedCategory(value);
              setSelectedService(''); // Reset service when category changes
              }} 
              data={categories.map(category => ({ key: category, value: category }))} 
              save="value"
              placeholder='Select category'
              boxStyles={styles.dropdown}
              search={false}
          />

          <SelectList 
              setSelected={setSelectedService} 
              data={services[selectedCategory] || []} 
              save="value"
              placeholder='Select service'
              boxStyles={styles.dropdown}
              search={false}
          />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})
export default Dropdown



{/* <View style={styles.ddcontainer}>
                <View style={styles.dropdownContainer}>
                  <SelectList 
                      setSelected={(value) => {
                      setSelectedCategory(value);
                      setSelectedService(''); // Reset service when category changes
                      }} 
                      data={categories.map(category => ({ key: category, value: category }))} 
                      save="value"
                      placeholder='Select category'
                      boxStyles={styles.dropdown}
                      search={false}
                  />

                  <SelectList 
                      setSelected={setSelectedService} 
                      // data={services[selectedCategory] || []}
                      data={selectedCategory && services[selectedCategory] ? services[selectedCategory] : []}  
                      save="value"
                      placeholder='Select service'
                      boxStyles={styles.dropdown}
                      search={false}
                  />
                </View>
              </View> */}
