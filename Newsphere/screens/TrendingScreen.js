import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  RefreshControl,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import data from "../database/data";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useUser } from "../database/UserContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { firebase_auth } from "../database/firebaseconfig";
import NgrokURL from "../constants/NgrokURL";

const MoreOptionsModal = ({ visible, onClose, item, navigation }) => {
  const handleDriveModePress = () => {
    onClose();
    navigation.navigate("DriveModeScreen", { item });
  };

  const handleNativeLang = () => {
    onClose();
    navigation.navigate("NativeLanguageScreen", { item });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>More Options</Text>
          </View>
          <View style={styles.modalLine} />
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="white"
              style={{ paddingRight: 20 }}
            />
            <Text style={styles.optionText}>More about this topic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleNativeLang}
          >
            <FontAwesome
              name="language"
              size={24}
              color="white"
              style={{ paddingRight: 20 }}
            />
            <Text style={styles.optionText}>Read in your native language</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleDriveModePress}
          >
            <Ionicons
              name="car-outline"
              size={24}
              color="white"
              style={{ paddingRight: 20 }}
            />
            <Text style={styles.optionText}>Read in Drive Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons
              name="close-circle-outline"
              size={24}
              color="white"
              style={{ paddingRight: 20 }}
            />
            <Text style={styles.optionText}>Not interested</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color="white"
              style={{ paddingRight: 20 }}
            />
            <Text style={styles.optionText}>Report this article</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const NewsCard = ({ item, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userEmail } = useUser();
  const [loading, setLoading] = useState(false);
  const handlePress = () => {
    setLoading(true); // Show loading screen

    // Add item.uri to clicks_history
    const userDocRef = doc(db, "users", userEmail);
    updateDoc(userDocRef, {
      clicks_history: arrayUnion(item.uri),
    })
      .then(() => {
        console.log("Added to clicks history successfully");
        // Hide loading screen
        // Open the URL
        Linking.openURL(item.url).catch((err) =>
          console.error("An error occurred", err)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        setLoading(false); // Hide loading screen even if there's an error
      });
  };

  const truncateText = (text, maxLength) => {
    const singleLineText = text.replace(/\n/g, " ");

    if (singleLineText.length > maxLength) {
      let end = singleLineText.lastIndexOf(" ", maxLength);
      if (end === -1) end = maxLength;
      return singleLineText.substring(0, end) + " ..... more";
    }
    return singleLineText;
  };

  const calculateTimeSincePublication = (dateTimePub) => {
    const publicationDate = new Date(dateTimePub);
    const currentDate = new Date();
    const differenceInTime = currentDate - publicationDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const days = differenceInDays % 30;
    if (differenceInMonths === 0) {
      return `${days}d`;
    } else {
      return `${differenceInMonths}m ${days}d`;
    }
  };

  if (loading) {
    // Show an ActivityIndicator when loading
    return (
      <View style={[styles.card, styles.centeredContent]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={{ padding: 5 }}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <LinearGradient
          colors={["transparent", "white"]}
          style={styles.fadeEffect}
        />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{truncateText(item.body, 140)}</Text>
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", flex: 2 }}>
            <Text style={styles.sourceTitle}>{item.source_title}</Text>
            <Text style={styles.timeSince}>
              • {calculateTimeSincePublication(item.date)}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="heart-outline"
              size={24}
              color="red"
              style={{ paddingRight: 20 }}
            />
            <Ionicons
              name="share-social-outline"
              size={24}
              color="black"
              style={{ paddingRight: 20 }}
            />
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color="black"
              onPress={() => setModalVisible(true)}
            />
            <MoreOptionsModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              item={item}
              navigation={navigation}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TrendingScreen({ navigation }) {
  const { setUserEmail } = useUser();
  const { userEmail } = useUser();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout", // Title of the alert
      "Are you sure you want to log out?", // Message of the alert
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            signOut(firebase_auth)
              .then(() => {
                // Sign-out successful.
                setUserEmail(null); // Update the context if needed
                navigation.navigate("Login"); // Navigate to the login screen or wherever you want
              })
              .catch((error) => {
                // An error happened.
                console.error("Logout failed", error);
              });
          },
        },
      ]
    );
  };

  // Function to fetch articles from the API
  const fetchArticles = async () => {
    if (!isLoading) setIsLoading(true); // Only set loading if it's the initial load
    setRefreshing(true);
    const userId = userEmail; // Replace with actual user ID or whatever identifier your API expects

    try {
      const response = await fetch(`${NgrokURL}/trending`);

      const json = await response.json();
      if (json.trending) {
        console.log("Trending : ");
        setArticles(json.trending); // Set the articles in state
      } else {
        console.error("Failed to load Trending:", json.message);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
    setIsLoading(false); // Only unset loading if it was the initial load
    setRefreshing(false); // Stop loading after the fetch call is done
  };

  // Call fetchArticles for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchArticles(true);
  };
  // useEffect to call the API when the component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  if (isLoading) {
    // If data is still loading, show an activity indicator
    return (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={{ fontSize: 14, fontWeight: "400", padding: 10 }}>
          Fetching the trending articles...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={{
              uri: "https://pics.craiyon.com/2023-07-14/12e9935d37fe4e92843939f555c6d75b.webp",
            }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Newsphere</Text>
        <Ionicons name="menu-outline" size={28} style={{}} />
      </View>
      <View style={styles.lineStyle} />
      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <NewsCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.uri.toString()}
        ListHeaderComponent={
          <Text
            style={{
              color: "#666",
              fontSize: 16,
              paddingLeft: 15,
              marginBottom: 17,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Latest trending articles.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Call fetchArticles when the user pulls to refresh
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },

  headerText: {
    fontWeight: "bold",
    fontSize: 24,
  },
  profilePic: {
    width: 40, // Set the size of the profile picture
    height: 40,
    borderRadius: 20, // Make it circular
  },
  card: {
    marginBottom: 20,
    borderRadius: 35,
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  cardImage: {
    width: "100%",
    height: 175,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  fadeEffect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 10,
  },
  textContent: {
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  body: {
    fontSize: 15,
    color: "#666",
    marginVertical: 15,
  },
  lineStyle: {
    borderWidth: 0.2,
    borderColor: "#bbb",
    marginBottom: 15,
    elevation: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "no-wrap",
    justifyContent: "space-between",
  },
  sourceTitle: {
    paddingRight: 10,
    fontWeight: "bold",
  },
  timeSince: {
    paddingRight: 130,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#4B4B4B",
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  optionButton: {
    padding: 16,
    flexDirection: "row",
  },
  optionText: {
    fontSize: 16,
    color: "white",
  },
  modalLine: {
    borderWidth: 0.2,
    borderColor: "#bbb",
    marginBottom: 5,
    marginTop: 14,
  },
  modalHeaderText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    paddingLeft: 10,
  },
});
