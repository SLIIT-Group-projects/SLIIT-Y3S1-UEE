import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash, formatDate, getRoomId } from "@/utils/common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function ChatItem({ item, router, noBorder, currentUser }) {
  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    //let roomId = getRoomId(currentUser?.userId, item?.userId);
    let roomId = getRoomId(item.eventId); // Generate roomId based on eventId
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unsub;
  }, [item.eventId]);

  //console.log("last message ", lastMessage);

  // const openChatRoom = () => {
  //   router.push({ pathname: "/chatRoom", params: item });
  // };

  const openChatRoom = () => {
    router.push({
      pathname: "/chatRoom",
      params: { eventId: item.eventId },
    });
  };

  const renderTime = () => {
    if (lastMessage) {
      //console.log("last message time: ", lastMessage?.createdAt);
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
  };

  const renderLastMessage = () => {
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser?.userId == lastMessage?.userId)
        return "You: " + lastMessage?.text;
      return lastMessage?.text;
    } else {
      return "Say Hi 👋";
    }
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 
    pl-4 pb-2 ${noBorder ? "" : " border-b border-b-neutral-300"}`}
    >
      {/* Show event image URL */}
      <Image
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        source={item?.imageURL} // Display event image instead of profile image
        placeholder={blurhash}
        transition={500}
      />
      {/* <Image
        source={{ uri: item?.profileURL }}
        style={{ height: hp(6), width: hp(6) }}
        className="rounded-full"
      /> */}
      {/* <Image
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        source={item?.profileURL}
        placeholder={blurhash}
        transition={500}
      /> */}

      {/* name and last message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(2) }}
            className="font-semibold text-neutral-800"
          >
            {item?.eventName}
          </Text>
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>

        <Text
          style={{ fontSize: hp(1.8) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
