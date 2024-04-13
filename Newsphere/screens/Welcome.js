import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function Welcome({ navigation }) {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require('../assets/images/newspaper.jpg')}
            style={styles.backgroundImage}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Welcome to Newsphere,</Text>
          <Text style={styles.subHeaderText}>Your Personal News Hub</Text>
          <Text style={styles.descriptionText}>
            Your personalized news adventure begins now.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HowItWorksScreen')}
          >
            <Text style={styles.buttonText}>Learn how it works</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      height: '45%',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: 20, 
      backgroundColor: 'white'
    },
    headerText: {
      color: '#000',
      fontSize: 32,
      fontWeight: 'bold',
    },
    subHeaderText: {
      color: '#000',
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    descriptionText: {
      color: '#666',
      fontSize: 18,
      marginBottom: 80,
    },
    button: {
      backgroundColor: '#000',
      paddingVertical: 17,
      paddingHorizontal: 30,
      borderRadius: 15,
      marginTop: 190,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center'
    },
  });
  