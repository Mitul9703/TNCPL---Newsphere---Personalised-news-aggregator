import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Camera, CameraType } from "expo-camera";

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      // Handle photo or do something with it
      console.log(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={CameraType.back}
          ref={(ref) => setCameraRef(ref)}
        />
        <Text style={{ fontSize: 25, fontWeight: "bold", padding: 20 }}>
          Point at the QR Code
        </Text>
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCameraRef(ref)}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </View>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cameraContainer: {
    margin: 40,
    height: 370,
    width: 370,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "black",
  },
});
