import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "@/components/ChatRoomHeader";
import MessageList from "@/components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import CustomeKeyboardView from "@/components/CustomeKeyboardView";
import { useAuth } from "@/context/authContext";
import { getRoomId } from "@/utils/common";
import {
  setDoc,
  getDoc,
  Timestamp,
  doc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function ChatRoom() {
  const item = useLocalSearchParams(); //second user
  const { eventId } = useLocalSearchParams();
  const { user } = useAuth(); //logged in user
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [imageURL, setEventImageURL] = useState(null);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId(eventId); // Now we're using eventId
    //let roomId = getRoomId(eventId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          messageId: doc.id, // Assign Firestore document ID as messageId
        };
      });
      setMessages([...allMessages]);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, [eventId]);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const roomId = getRoomId(eventId);
      const docRef = doc(db, "rooms", roomId);
      const roomSnapshot = await getDoc(docRef);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        console.log("Fetched room data: ", roomData); // Check if imageURL is fetched
        setEventImageURL(roomData.imageURL); // Fetch event image URL from Firestore
        setEventName(roomData.eventName); // Fetch event name
      } else {
        console.log("Room not found.");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  //group event room
  const createRoomIfNotExists = async () => {
    //let eventId = item?.eventId; // Assuming `item` contains event data
    let roomId = getRoomId(eventId);

    const docRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(docRef);

    if (!roomSnapshot.exists()) {
      await setDoc(doc(db, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
        eventId: eventId,
      });
    }
  };

  // const createRoomIfNotExists = async () => {
  //   //roomId
  //   let roomId = getRoomId(user?.userId, item?.userId);
  //   await setDoc(doc(db, "rooms", roomId), {
  //     roomId,
  //     createdAt: Timestamp.fromDate(new Date()),
  //   });
  // };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      //let roomId = getRoomId(user?.userId, item?.userId);
      let roomId = getRoomId(eventId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messagesRef, {
        userId: user?.userId,
        text: message,
        profileURL: user?.profileURL,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log("new message id: ", newDoc.id);
    } catch (err) {
      Alert.alert("Message", err.message);
    }
  };

  //console.log("messages: ", messages);
  //console.log("got item data: ", item); // Outputs the search parameters from the URL
  return (
    <CustomeKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader
          user={item}
          router={router}
          eventImageURL={imageURL}
          eventName={eventName}
        />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-secondary-100 overflow-visible">
          <View className="flex-1">
            <MessageList
              scrollViewRef={scrollViewRef}
              messages={messages}
              currentUser={user}
            />
          </View>
          <View style={{ marginBottom: hp(2.7) }} className="pt-2">
            <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
              <TextInput
                ref={inputRef}
                onChangeText={(value) => (textRef.current = value)}
                placeholder="Type message..."
                style={{ fontSize: hp(2) }}
                className="flex-1 mr-2"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-neutral-200 p-2 mr-[1px] rounded-full"
              >
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomeKeyboardView>
  );
}
