import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  AntDesign,
  FontAwesome6,
} from "@expo/vector-icons";
import * as Speech from "expo-speech";

export default function DriveModeScreen({ route, navigation }) {
  const { item } = route.params;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ... (rest of your imports and beginning of the DriveModeScreen component)

  const chunkSize = 4000; // Define the maximum chunk size

  const startReading = () => {
    setIsSpeaking(true);
    readTextByChunks(item.body);
  };

  const readTextByChunks = (text, position = 0) => {
    if (position >= text.length) {
      setIsSpeaking(false);
      return;
    }
    const nextChunk = text.substring(
      position,
      Math.min(position + chunkSize, text.length)
    );
    Speech.speak(nextChunk, {
      onDone: () => readTextByChunks(text, position + chunkSize),
      // Include other options if needed
    });
  };

  // ... (rest of your component)

  const stopReading = () => {
    setIsSpeaking(false);
    Speech.stop();
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

  // This effect will clean up the speech when the component is unmounted
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const ProgressBar = ({ currentTime, totalTime }) => {
    const progress = (currentTime / totalTime) * 100;

    return (
      <View style={styles.container}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.timeText}>{totalTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#c9c9c9",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "red",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Drive Mode
        </Text>
      </View>
      <View>
        <ScrollView style={styles.titlecard}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.sourceDate}>
            {item.source_title} • {calculateTimeSincePublication(item.date)}
          </Text>
        </ScrollView>
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.body}>{item.body}</Text>
      </ScrollView>

      <View style={styles.controls}>
        {isSpeaking ? (
          <TouchableOpacity onPress={stopReading} style={styles.controlButton}>
            <FontAwesome6 name="circle-pause" size={70} color="black" />
            <Text style={styles.controlText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startReading} style={styles.controlButton}>
            <AntDesign name="play" size={70} color="black" />
            <Text style={styles.controlText}>Play</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelbutton}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
            Cancel Drive Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
{
  /* <ScrollView style={styles.scrollView}>
<Text style={styles.title}>{item.title}</Text>
<Text style={styles.body}>{item.body}</Text>
<Text
  style={styles.sourceDate}
>{`${item.source_title} - ${item.date}`}</Text>
</ScrollView> */
}

const styles = StyleSheet.create({
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
    fontWeight: "300",
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
