import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef } from "react";

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />
      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.subheading}>to Currency Convertor</Text>
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.dot} />
              <Text style={styles.cardText}>
                Navigate to the main page using the tab below.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.bottomDecoration} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topDecoration: {
    height: 150,
    backgroundColor: "#FF6B6B",
    borderBottomLeftRadius: 30,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },
  bottomDecoration: {
    height: 200,
    backgroundColor: "#4ECDC4",
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 24,
    color: "#34495E",
    marginBottom: 40,
    fontWeight: "300",
  },
  cardContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ECDC4",
    marginRight: 10,
  },
  cardText: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "500",
  },
});
