import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import languages from "../constants/Language";
import { Picker } from "@react-native-picker/picker";

export default function NativeLanguageScreen({ route, navigation }) {
  const { item } = route.params;
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedTitle, setTranslatedTitle] = useState(item.title);
  const [translatedBody, setTranslatedBody] = useState(item.body);
  const [isLoading, setIsLoading] = useState(false);

  const translateText = async () => {
    if (selectedLanguage === "en") {
      setTranslatedTitle(item.title);
      setTranslatedBody(item.body);
      return;
    }

    setIsLoading(true);
    console.log(selectedLanguage);
    try {
      const response = await fetch(
        "https://22c0-35-229-247-161.ngrok-free.app/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: item.title,
            body: item.body,
            target_lang: selectedLanguage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setTranslatedTitle(result.title);
      setTranslatedBody(result.body);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    translateText();
  }, [selectedLanguage]);

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

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: 20,
        }}
      >
        Choose any language you like
      </Text>
      <View style={{ borderBottomWidth: 1, paddingTop: 10 }}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={styles.picker}
        >
          {Object.entries(languages).map(([label, value]) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text>Translating...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <ScrollView style={styles.titlecard}>
              <Text style={styles.title}>{translatedTitle}</Text>

              <Text style={styles.sourceDate}>
                {item.source_title} • {calculateTimeSincePublication(item.date)}
              </Text>
            </ScrollView>
          </View>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.body}>{translatedBody}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderTopWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    padding: 20,
  },
  titlecard: {
    flexWrap: "wrap",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#c9c9c9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    flexShrink: 1,
  },
  body: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "justify",
    padding: 5,
  },
  sourceDate: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    textAlign: "center",
  },
  controls: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopColor: "#e1e1e1",
    borderTopWidth: 1,
    alignItems: "center",
    borderRadius: 10,
  },
  controlButton: {
    alignItems: "center",
  },
  controlText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginTop: 4,
  },
  cancelbutton: {
    marginVertical: 15,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: "red",
    borderRadius: 10,
  },

  progressBarBackground: {
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "black",
    borderRadius: 2.5,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "black",
  },
});
