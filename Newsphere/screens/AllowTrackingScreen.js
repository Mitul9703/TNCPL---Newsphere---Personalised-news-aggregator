import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '../database/UserContext';
import { Ionicons } from '@expo/vector-icons'

export default function AllowTrackingScreen({ navigation }) {
    const { userEmail } = useUser();
    const handleAllowTracking = async () => {
        if (userEmail) {
            const userDocRef = doc(db, "users", userEmail);
            try {
                await updateDoc(userDocRef, {
                    allowTracking: true,
                });
                console.log("Tracking allowed");
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
        navigation.navigate('SelectCategoriesScreen');
    };

    const handleDisallowTracking = async () => {
        if (userEmail) {
            const userDocRef = doc(db, "users", userEmail);
            try {
                await updateDoc(userDocRef, {
                    allowTracking: false,
                });
                console.log("Tracking disallowed");
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
        navigation.navigate('SelectCategoriesScreen');
    };

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
      <Text style={styles.headerText}>Enhance Your Experience</Text>
      <Text style={styles.descriptionText}>
      We use your reading history to curate a news feed that aligns perfectly with your interests.
      </Text>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Reading History Tracking</Text>
        <Text style={styles.permissionText}>
        To tailor your news feed with articles that match your interests, we'd like to understand your reading habits. This helps us recommend stories you'll love.        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Privacy Assurance</Text>
        <Text style={styles.permissionText}>
        Your privacy matters to us. Tracking is solely for improving your article recommendations, and you have full control to disable it anytime in settings.        </Text>
      </View>
      <Text style={styles.footerText}>
      Remember, your privacy is our priority, and you can change these settings at any time
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleAllowTracking}>
        <Text style={styles.buttonText}>Allow Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleDisallowTracking}>
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
  Text: {
    fontFamily: 'Roboto'
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
    paddingHorizontal: 30,
    paddingTop: 100,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 50,
    marginTop: 35
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
    marginHorizontal: 50,
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#000'
    },
  secondaryButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20
  }
});

