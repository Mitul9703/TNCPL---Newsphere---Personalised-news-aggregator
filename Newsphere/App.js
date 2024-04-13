import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import Welcome from "./screens/Welcome";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HowItWorksScreen from "./screens/HowItWorksScreen";
import AllowPermissionsScreen from "./screens/AllowPermissionsScreen";
import AllowTrackingScreen from "./screens/AllowTrackingScreen";
import SelectCategoriesScreen from "./screens/SelectCategoriesScreen";

import HomeScreen from "./screens/HomeScreen";
import TrendingScreen from "./screens/TrendingScreen";
import SearchScreen from "./screens/SearchScreen";
import ARScreen from "./screens/ARScreen";
import NativeLanguageScreen from "./screens/NativeLanguageScreen";
import CameraScreen from "./screens/CameraScreen";

import DriveModeScreen from "./screens/DriveModeScreen";

import { UserProvider } from "./database/UserContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Trending") {
            iconName = "trending-up-sharp";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "NewsLens") {
            return (
              <MaterialCommunityIcons
                name="cube-scan"
                size={size}
                color={color}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 15,
          paddingTop: 15,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="NewsLens"
        component={ARScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllowPermissionsScreen"
            component={AllowPermissionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HowItWorksScreen"
            component={HowItWorksScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllowTrackingScreen"
            component={AllowTrackingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectCategoriesScreen"
            component={SelectCategoriesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriveModeScreen"
            component={DriveModeScreen}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen
            name="NativeLanguageScreen"
            component={NativeLanguageScreen}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{ headerShown: true, title: "" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
