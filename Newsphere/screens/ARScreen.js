import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera } from "expo-camera";

export default function ARScreen() {
  const [hasPermission, setHasPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const uploadPhoto = async (photoUri) => {
    const formData = new FormData();
    formData.append("photo", {
      uri: photoUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    console.log("Sending req", formData);
    try {
      const response = await fetch(
        "https://030c-2401-4900-6347-1734-5123-6919-38b8-b613.ngrok-free.app/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseBody = await response.json();
      setResponseMessage(responseBody.message);
      setIsCameraReady(false); // Turn off camera view
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload Failed", "Failed to upload photo. Try again.");
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      console.log(photo.uri);
      uploadPhoto(photo.uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isCameraReady ? (
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCameraRef(ref)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.1, alignSelf: "flex-end", alignItems: "center" }}
              onPress={takePicture}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                Snap
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.container}>
          {responseMessage ? (
            <Text style={styles.message}>{responseMessage}</Text>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsCameraReady(true)}
            >
              <Text style={styles.text}>Open Camera</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
