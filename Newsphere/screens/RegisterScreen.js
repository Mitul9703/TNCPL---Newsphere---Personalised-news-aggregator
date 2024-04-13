import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../constants/colors";
import { firebase_auth } from "../database/firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from "../database/UserContext";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const { setUserEmail } = useUser();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [age, setAge] = React.useState("");

  const handleregister = () => {
    createUserWithEmailAndPassword(firebase_auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        setUserEmail(userCredentials.user.email);
        console.log("User registered:", user.email);

        const userDocRef = doc(db, "users", user.email);
        await setDoc(userDocRef, {
          Age: age,
          Email: email,
          Name: name,
          clicks_history: [],
        });

        navigation.navigate("AllowTrackingScreen");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.topView}>
              <Text style={styles.topText}>Create Your Profile</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={{ fontWeight: 500, fontSize: 20, padding: 5 }}>
                What's your name?
              </Text>
              <Text
                style={{
                  color: colors.SecondaryTextColor,
                  fontSize: 16,
                  paddingLeft: 5,
                  paddingBottom: 10,
                }}
              >
                So we can personalize your experience.
              </Text>
              <TextInput
                style={styles.input}
                inputName="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={"black"}
              />
              <Text style={{ fontWeight: 500, fontSize: 20, padding: 5 }}>
                Email Address
              </Text>
              <Text
                style={{
                  color: colors.SecondaryTextColor,
                  fontSize: 16,
                  paddingLeft: 5,
                  paddingBottom: 10,
                }}
              >
                For account setup, news digests, and important updates.
              </Text>
              <TextInput
                style={styles.input}
                inputName="Email ID"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={"black"}
                keyboardType="email-address"
              />
              <Text style={{ fontWeight: 500, fontSize: 20, padding: 5 }}>
                Create a Password
              </Text>
              <Text
                style={{
                  color: colors.SecondaryTextColor,
                  fontSize: 16,
                  paddingLeft: 5,
                  paddingBottom: 10,
                }}
              >
                To keep your account secure.
              </Text>
              <TextInput
                style={styles.input}
                inputName="Create a password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor={"black"}
              />
              <View style={styles.pickerContainer}>
                <Text style={{ fontWeight: 500, fontSize: 20, padding: 5 }}>
                  Age
                </Text>
                <Text
                  style={{
                    color: colors.SecondaryTextColor,
                    fontSize: 16,
                    paddingLeft: 5,
                    paddingBottom: 10,
                  }}
                >
                  To provide age-appropriate content.
                </Text>
                <Picker
                  selectedValue={age}
                  onValueChange={(itemValue, itemIndex) => setAge(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="12 - 18 Years" value="12-18yrs" />
                  <Picker.Item label="19 - 29 Years" value="19-29yrs" />
                  <Picker.Item label="30 - 44 Years" value="30-44yrs" />
                  <Picker.Item label="45 - 64 Years" value="45-64yrs" />
                  <Picker.Item label="65 Years & Above" value="65yrs&above" />
                </Picker>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={handleregister}
          style={styles.registerButton}
        >
          <Text style={styles.text}>That's me!</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  input: {
    height: 50,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topView: {
    padding: 10,
  },
  topText: {
    fontWeight: "bold",
    fontSize: 27,
    padding: 10,
  },
  inputContainer: {
    padding: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ageInput: {
    flex: 1,
    marginRight: 25,
  },
  pickerContainer: {
    flex: 1,
  },
  registerButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.PrimaryButtonColor,
    alignItems: "center",
    margin: 20,
    height: 54,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  loginText: {
    color: colors.PrimaryButtonFontColor,
    fontWeight: "bold",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
});
