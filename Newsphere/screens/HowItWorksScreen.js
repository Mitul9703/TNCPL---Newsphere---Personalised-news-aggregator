import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

export default function HowItWorksScreen({ navigation }){
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>How it works?</Text>
      <View style = {styles.lineStyle} />
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Personalized News Selection</Text>
        <Text style={styles.descriptionText}>
          Every day, we curate a selection of news articles that align with your interests. Simply choose your favorite topics, and we'll do the rest.
        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Customize Your Feed</Text>
        <Text style={styles.descriptionText}>
          Your news feed is fully customizable. Love an article? Tap the heart icon. Not interested? Swipe it away. Your choices continually refine your feed.
        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.bulletBox} />
        <Text style={styles.titleText}>Stay Informed, Stay Connected</Text>
        <Text style={styles.descriptionText}>
          Connect with a community of readers. Share your thoughts on articles and see what's trending in your network.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AllowPermissionsScreen")}>
        <Text style={styles.buttonText}>Dive in!</Text>
      </TouchableOpacity>
      <View style={styles.loginSuggestion}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate("Auth", { screen: "Login" })}
        >
          <Text style={styles.loginButton}>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  headerText: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 20,
  },
  lineStyle:{
    borderWidth: 0.2,
    borderColor:'#bbb',
    marginBottom:30,
},
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  bulletBox: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 10,
    height: 10,
    backgroundColor: '#000',
    marginLeft: 20
  },
  titleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 40,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    paddingLeft: 40,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 175
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  loginSuggestion: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 4,
  },
});


