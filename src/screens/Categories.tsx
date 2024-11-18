import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    const navigation = useNavigation();

    const getCategories = async () => {
        const response = await axios.get('http://192.168.1.218:4021/getCategories');
        console.log(response.data);

        // Create a map to count occurrences of each category
        const categoryCountMap = {};

        response.data.forEach(item => {
            const category = item.category;
            if (categoryCountMap[category]) {
                categoryCountMap[category].count += 1;
            } else {
                categoryCountMap[category] = { ...item, count: 1 };
            }
        });

        // Convert the map back to an array of unique categories
        const uniqueCategories = Object.values(categoryCountMap);
        setCategories(uniqueCategories);
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <View style={ styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={ styles.categorycard}
                    onPress={()=> navigation.navigate('ServicesScreen', { category: item.category })}
                    >
                        <View>
                            <Text style={ styles.categoryTitle}>{item.category}</Text>
                            <Text style={ styles.categoryServices}>{item.count} services</Text>
                        </View>
                        <View >
                            <MaterialIcons 
                            name='arrow-forward-ios'
                            size= {22}
                            // color= '#212121'
                            style={styles.arrow}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex: 1
    },
    categorycard:{
        height: 100,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 18,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#212121',
        flexDirection: 'row'
    },
    categoryTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        // color:'#52be80',
        color: '#055240',
        marginHorizontal: 15
    },
    categoryServices:{
        fontSize: 15,
        marginHorizontal: 15
    },
    arrow:{
        marginRight: 20
    }
});
