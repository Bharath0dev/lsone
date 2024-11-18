import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-paper';

const ModalDemo = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.container}>
          <Button onPress={() => setModalVisible(true)}>Show Modal</Button>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello, this is a modal!</Text>
              <Button onPress={() => setModalVisible(false)}>Close Modal</Button>
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
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

  export default ModalDemo
  
  