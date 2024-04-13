import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../constants/colors";
import { firebase_auth } from "../database/firebaseconfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useUser } from "../database/UserContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserEmail } = useUser();

  useEffect(() => {
    const unsubscribe = firebase_auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeTabs");
        console.log(user);
        setUserEmail(user.email);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(firebase_auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with ", user.email);
        setUserEmail(userCredentials.user.email);
      })
      .catch((error) => alert("Invalid login credentials"));
  };

  const handlePasswordReset = () => {
    if (email.trim() === "") {
      alert("Please enter your email address.");
      return;
    }

    sendPasswordResetEmail(firebase_auth, email)
      .then(() => {
        alert("Password reset email sent. Please check your inbox.");
      })
      .catch((error) => {
        console.error("Failed to send password reset email:", error);
        alert(
          "Failed to send password reset email. Please check the email provided and try again."
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          // textAlign: "center",
          fontSize: 30,
          marginBottom: 20,
          fontWeight: "900",
        }}
      >
        Welcome back!
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={"black"}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"black"}
      />

      <TouchableOpacity
        onPress={handlePasswordReset}
        style={styles.resetPasswordButton}
      >
        <Text style={styles.resetPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.text}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 8,
  },
  loginButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.PrimaryButtonColor,
    alignItems: "center",
    marginTop: 450,
  },
  text: {
    fontSize: 15,
    color: "white",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  registerText: {
    color: colors.PrimaryButtonFontColor,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  resetPasswordButton: {
    marginTop: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  resetPasswordText: {
    color: colors.PrimaryButtonColor,
    fontSize: 14,
    fontWeight: "bold",
  },
});
