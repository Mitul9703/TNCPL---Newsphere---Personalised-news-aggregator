import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import {Ionicons} from '@expo/vector-icons'

export default function AllowPermissionsScreen({ navigation }) {
    const handlePermissions = async () => {
        let notificationPermission = await Notifications.getPermissionsAsync();
    
        // Only ask for the permissions if they have not already been granted
        if (notificationPermission.status !== 'granted') {
          notificationPermission = await Notifications.requestPermissionsAsync();
        }
        
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        if (locationStatus.status !== 'granted') {
          Alert.alert('Permission not granted', 'Your location is not available.');
          return; // Stop the function if permission is not granted
        }
    
        // Check if both permissions are granted
        if (notificationPermission.status === 'granted' && locationStatus.status === 'granted') {
          navigation.navigate("Auth", { screen: "Register" }); // Navigate to the HomeScreen if permissions are granted
        } else {
          Alert.alert('Permission Required', 'Please grant permissions to continue.');
        }
      };

    const dontAllow = () =>{
      navigation.navigate("Auth", { screen: "Register" });
      console.log("Permissions Denied.")
    } 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Allow permissions</Text>
      <Text style={styles.descriptionText}>
        To deliver a personalized experience, we need your permission to access certain features on your device.
      </Text>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Notifications</Text>
        <Text style={styles.permissionText}>
          To keep you up-to-date with breaking news and updates in your areas of interest.
        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Location</Text>
        <Text style={styles.permissionText}>
          To provide local news updates. This is entirely optional, but it helps in customizing your news feed.
        </Text>
      </View>
      <Text style={styles.footerText}>
        Remember, your privacy is our priority, and you can change these settings at any time
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePermissions}>
        <Text style={styles.buttonText}>Allow permission</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={dontAllow}>
        <Text style={styles.secondaryButtonText}>Don't Allow</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  backButton: {
    // Styles for the back button container if needed
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 18,
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  permissionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    paddingLeft: 40, // Adjusted to accommodate the bullet box
  },
  bulletBox: {
    position: 'absolute',
    top: 2,
    left: 20, // Position the bullet box closer to the edge
    width: 8, // Width of the bullet box
    height: 8, // Height of the bullet box
    backgroundColor: '#000',
    marginTop: 10, // Aligns with the title
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 20
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingTop: 150,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 25
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000'
    },
  secondaryButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
  },
});

