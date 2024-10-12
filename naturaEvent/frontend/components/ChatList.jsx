import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ChatItem from "./ChatItem";
import { useRouter } from "expo-router";

export default function ChatList({ users, currentUser, events }) {
  const [fetchedEvents, setFetchedEvents] = useState([]); // To store event rooms

  // Fetch event rooms from Firestore
  useEffect(() => {
    const fetchEventRooms = async () => {
      const roomsCollectionRef = collection(db, "rooms"); // Replace "rooms" with your actual collection name
      const snapshot = await getDocs(roomsCollectionRef);
      const roomsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Use doc.id for unique identification
      }));
      setFetchedEvents(roomsData); // Set the fetched event rooms
    };

    fetchEventRooms();
  }, []);
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={fetchedEvents}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id} // Ensure you have unique keys
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            noBorder={index + 1 === fetchedEvents.length}
            router={router}
            currentUser={currentUser}
            item={item} //Pass the event item
            index={index}
          />
        )}
      />
    </View>
  );
}
