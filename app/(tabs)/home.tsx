import React, { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { UserContext } from "../../src/context/UserContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;

interface QuickAction {
  id: string;
  title: string;
  icon: JSX.Element;
  route: string;
}

interface Promotion {
  id: string;
  image: { uri: string };
}

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // 🔥 Curtain Dropdown Animation
  const dropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, []);

  // Quick Actions
  const actions: QuickAction[] = [
    {
      id: "1",
      title: "Profile",
      icon: <Ionicons name="person-circle-outline" size={28} color="#fff" />,
      route: "/profile",
    },
    {
      id: "2",
      title: "Settings",
      icon: <Ionicons name="settings-outline" size={28} color="#fff" />,
      route: "/settings",
    },
    {
      id: "3",
      title: "Wallet",
      icon: <MaterialCommunityIcons name="wallet-outline" size={28} color="#fff" />,
      route: "/wallet",
    },
    {
      id: "4",
      title: "Transact",
      icon: <Ionicons name="send-outline" size={28} color="#fff" />,
      route: "/transact",
    },
  ];

  const promotions: Promotion[] = [
    { id: "1", image: { uri: "https://images.unsplash.com/photo-1523759533935-e4b770303b1d?w=800" } },
    { id: "2", image: { uri: "https://images.unsplash.com/photo-1577742410730-a83c01f60d8e?w=800" } },
    { id: "3", image: { uri: "https://images.unsplash.com/photo-1518688248740-7c31f1a945c4?w=800" } },
    { id: "4", image: { uri: "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=800" } },
    { id: "5", image: { uri: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=800" } },
    { id: "6", image: { uri: "https://images.unsplash.com/photo-1566563255308-753861417000?w=800" } },
  ];

  // Scale animation for press effect
  const [pressedIndex, setPressedIndex] = useState<string | null>(null);


  const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        {/* 🔥 Dropdown Curtain Header */}
        <Animated.View
          style={[
            styles.dropdownWrapper,
            {
              height: dropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenHeight * 0.3],
              }),
              opacity: dropAnim,
            },
          ]}
        >
          <Text style={styles.dropdownLabel}>Gibi</Text>
          <Text style={styles.dropdownSubLabel}>Smart Banking • Secure • Instant</Text>

        </Animated.View>

        {/* Greeting */}
        <Text style={styles.bigHi}>Hi {capitalize(user?.name ?? "User")}</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsContainer}
        >
          {actions.map((item, index) => {
            const scale = pressedIndex === item.id ? 0.95 : 1;
            return (
              <Animated.View key={item.id} style={{ transform: [{ scale }], marginRight: 16 }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPressIn={() => setPressedIndex(item.id)}
                  onPressOut={() => setPressedIndex(null)}
                  onPress={() => router.push(item.route)}
                >
                  <LinearGradient
                    colors={["#1F7C7A", "#488792"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.quickBtn}
                  >
                    {item.icon}
                  </LinearGradient>
                  <Text style={styles.quickBtnText}>{item.title}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* ⭐ Spend & Explore */}
        <Text style={styles.sectionTitle}>Spend</Text>

        <View style={styles.spendGrid}>
          {[
            { id: "1", title: "Electricity", icon: "flash-outline" },
            { id: "2", title: "Airtime & Data", icon: "phone-portrait-outline" },
            { id: "3", title: "Vouchers", icon: "gift-outline" },
            { id: "4", title: "Pay Bills", icon: "document-text-outline" },
            { id: "5", title: "Send Money", icon: "send-outline" },
            { id: "6", title: "Transport", icon: "bus-outline" },
          ].map((item) => (
            <TouchableOpacity key={item.id} style={styles.spendTile}>
              <Ionicons name={item.icon} size={26} color="#0F3D3E" />
              <Text style={styles.spendTileText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      <Text style={styles.sectionTitle}>Explore</Text>


        {/* AI Assistance */}
        <View style={styles.aiContainer}>
          <Text style={styles.aiTitle}>AI Assistance</Text>
          <Text style={styles.aiText}>
            Gibi AI helps you spend smarter, save better, and stay secure.
          </Text>

          <TouchableOpacity
            style={styles.aiBtn}
            onPress={() => router.push("/aichatbot")}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0F3D3E" />
            <Text style={styles.aiBtnText}>Open AI Chat</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbd0d8ff", // mostly white
  },

  dropdownWrapper: {
    width: "100%",
    backgroundColor: "#01532dff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 25,
    shadowColor: "#2b2e2dff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownLabel: {
    fontSize: 30,
    fontWeight: "900",
    fontFamily: "System",
    color: "#ffffffff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  bigHi: {
    fontSize: 34,
    fontWeight: "700",
    fontFamily: "System",
    color: "#111",
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "System",
    color: "#333",
    marginTop: 4,
    marginBottom: 25,
    marginHorizontal: 20,
  },

  quickActionsContainer: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  quickBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  quickBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "System",
    marginTop: 6,
    textAlign: "center",
  },

  sectionTitle: {
    color: "#111",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "System",
    marginLeft: 20,
    marginBottom: 12,
  },
  promoCard: {
    width: 180,
    height: 120,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    marginRight: 18,
    overflow: "hidden",
  },
  promoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  aiContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
    color: "#1F7C7A",
    marginBottom: 8,
  },
  aiText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "System",
    lineHeight: 22,
    marginBottom: 14,
  },
  aiBtn: {
    flexDirection: "row",
    backgroundColor: "#1F7C7A",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  aiBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "System",
    marginLeft: 6,
  },

  dropdownSubLabel: {
  fontSize: 12,
  fontWeight: "400",
  color: "#ffffffcc",
  marginTop: -5,
  letterSpacing: 1,
  fontFamily: "System",
},


/* Spend Grid */
spendGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginBottom: 30,
},

spendTile: {
  width: "30%",
  backgroundColor: "#fff",
  borderRadius: 14,
  paddingVertical: 18,
  alignItems: "center",
  marginBottom: 18,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
},

spendTileText: {
  marginTop: 6,
  fontSize: 12,
  fontWeight: "600",
  color: "#0F3D3E",
  textAlign: "center",
},

/* Explore Cards */
exploreCard: {
  width: 200,
  height: 130,
  borderRadius: 16,
  backgroundColor: "#ccc",
  marginRight: 18,
  overflow: "hidden",
  position: "relative",
},

exploreImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},

exploreOverlay: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: 12,
  backgroundColor: "rgba(0,0,0,0.45)",
},

exploreTitle: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

});

