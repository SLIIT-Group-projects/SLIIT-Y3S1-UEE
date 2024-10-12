import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const apiUrl = "http://192.168.232.185:3000";

export default function PostEvent() {
  const [form, setForm] = useState({
    organization: "",
    eventName: "",
    category: "",
    description: "",
    location: "",
    date: new Date(),
    fromTime: new Date(),
    toTime: new Date(),
    financialContribution: "",
    totalDonation: "",
    toolsSupplies: "",
    image: null,
    Pressable,
  });

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();
  const [dateOfEvent, setDateOfEvent] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [openFromTime, setOpenFromTime] = useState(false);
  const [openToTime, setOpenToTime] = useState(false);
  const [images, setImages] = useState([]);
  //const [selectedImage, setSelectedImage] = useState(null);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      setForm({ ...form, date: selectedDate });
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfEvent(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  const confirmIOSDate = () => {
    setDateOfEvent(formatDate(date));
    toggleDatePicker();
  };
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${day}-${month}-${year}`;
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedImage = result.assets[0].uri;
      console.log("Picked Image URI:", pickedImage);
      // Update the form with the selected image URI
      setForm({ ...form, image: pickedImage });
    } else {
      console.log("Image selection was canceled or failed.");
    }
    //const pickedImage = result.assets[0].uri;
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   image: pickedImage,
    // }));
  };

  // Handle Image Deletion
  const handleDeleteImage = () => {
    setForm((prevForm) => ({
      ...prevForm,
      image: null,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("organization", form.organization);
    formData.append("eventName", form.eventName);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("date", form.date.toISOString());
    formData.append("fromTime", form.fromTime.toISOString());
    formData.append("toTime", form.toTime.toISOString());
    formData.append("totalDonation", form.totalDonation);
    formData.append("financialContribution", form.financialContribution);
    formData.append("toolsSupplies", form.toolsSupplies);

    // Append selected images to formData

    if (form.image && form.image.uri > 0) {
      const fileType = form.image.uri.endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      formData.append("image", {
        uri: form.image.uri,
        name: `image.${fileType === "image/png" ? "png" : "jpg"}`,
        type: fileType,
      });
    } else {
      console.log("No image selected");
    }
    //   if (form.image) {
    //   const fileType = form.image.endsWith(".png") ? "image/png" : "image/jpeg";
    //   formData.append("image", {
    //     uri: form.image,
    //     type: fileType,
    //     name: `event_image.${fileType === "image/png" ? "png" : "jpg"}`,
    //   });
    // }

    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      console.log("Upload data", data);
      if (response.status === 200) {
        alert("Event submitted successfully!");
        router.back();
      } else {
        alert("submitted event: " + data.message);
      }
    } catch (error) {
      alert("Error uploading the image: " + error.message);
    }
  };

  console.log("Selected Image:", form.image); // Log images before submission

  return (
    <ScrollView className="m-4 bg-white">
      <View className="p-4">
        <Text className="text-xl font-pmedium text-primary mb-4">
          Post an Event
        </Text>

        {/* Organization Name */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Organization
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Organization Name"
          onChangeText={(text) => setForm({ ...form, organization: text })}
        />

        {/* Event Name */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Event Name
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Event Name"
          onChangeText={(text) => setForm({ ...form, eventName: text })}
        />

        {/* Category */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Category
        </Text>
        <Picker
          selectedValue={form.category}
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          onValueChange={(itemValue) =>
            setForm({ ...form, category: itemValue })
          }
        >
          <Picker.Item label="Tree Planting" value="tree_planting" />
          <Picker.Item label="Reforestation" value="reforestation" />
          <Picker.Item label="Beach Cleanup" value="beach_cleanup" />
          <Picker.Item label="Community Cleanup" value="community_cleanup" />

          <Picker.Item
            label="Mangrove Restoration"
            value="mangrove_restoration"
          />
          <Picker.Item
            label="Wildlife Conservation"
            value="wildlife_conservation"
          />
          <Picker.Item
            label="Coral Reef Restoration"
            value="coral_reef_restoration"
          />
        </Picker>

        {/* Description */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Description
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Event Description"
          multiline
          rows={6}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />

        {/* Location */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Location
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Event Location"
          onChangeText={(text) => setForm({ ...form, location: text })}
        />

        {/* Date */}
        <View>
          <Text className="text-lg mb-2 font-pregular text-primary">
            Date of Event
          </Text>

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
              style={styles.datePicker}
              maximumDate={new Date("2030-01-01")}
              minimumDate={new Date()}
            />
          )}
          {showPicker && Platform.OS === "ios" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Pressable
                style={[
                  styles.button,
                  styles.pickerButton,
                  { backgroundColor: "C4DAD2" },
                ]}
                onPress={toggleDatePicker}
              >
                <Text style={[styles.buttonText, { color: "black" }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.pickerButton]}
                onPress={confirmIOSDate}
              >
                <Text style={[styles.buttonText]}>Confirm</Text>
              </Pressable>
            </View>
          )}

          {!showPicker && (
            <Pressable onPress={toggleDatePicker}>
              <TextInput
                className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
                placeholder="Select Date"
                value={dateOfEvent}
                onChangeText={setDateOfEvent}
                placeholderTextColor={"grey"}
                readOnly={false}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          )}
        </View>

        {/* Time From & To */}
        <Text className="text-lg mb-2 font-pregular text-primary">Time</Text>
        <View className="flex-row justify-between mb-4">
          <Pressable
            onPress={() => setOpenFromTime(true)}
            className="justify-between w-32 border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          >
            <Text>{form.fromTime.toLocaleTimeString()}</Text>
          </Pressable>
          <Pressable
            onPress={() => setOpenToTime(true)}
            className="justify-between w-32 border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          >
            <Text>{form.toTime.toLocaleTimeString()}</Text>
          </Pressable>
        </View>
        {openFromTime && (
          <DateTimePicker
            mode="time"
            display="default"
            value={form.fromTime}
            onChange={(event, selectedTime) => {
              const time = selectedTime || form.fromTime;
              setOpenFromTime(false);
              setForm({ ...form, fromTime: time });
            }}
          />
        )}

        {openToTime && (
          <DateTimePicker
            mode="time"
            display="default"
            value={form.toTime}
            onChange={(event, selectedTime) => {
              const time = selectedTime || form.toTime;
              setOpenToTime(false);
              setForm({ ...form, toTime: time });
            }}
          />
        )}

        <Text className="text-lg mb-2 font-pregular text-primary">
          Total Donation to reach
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Total Donation"
          inputMode="numeric"
          onChangeText={(text) => setForm({ ...form, totalDonation: text })}
        />

        {/* Financial Contribution */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Financial Contribution
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Financial Contribution"
          inputMode="numeric"
          onChangeText={(text) =>
            setForm({ ...form, financialContribution: text })
          }
        />

        {/* Tools and Supplies */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Tools and Supplies Offered
        </Text>
        <TextInput
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
          placeholder="Tools and Supplies"
          onChangeText={(text) => setForm({ ...form, toolsSupplies: text })}
        />

        {/* Image Picker */}
        <Text className="text-lg mb-2 font-pregular text-primary">
          Images to Post
        </Text>
        <Pressable
          onPress={handleImagePick}
          className="border-2 border-secondary-100 p-2 mb-4 rounded text-primary font-pregular bg-secondary-50"
        >
          <Text className="text-primary">Pick Image</Text>
        </Pressable>
        {/* Display Selected Images */}
        {form.image && (
          <View className="mr-2 mb-2 relative">
            <Image
              source={{ uri: form.image }}
              className="w-20 h-20 rounded-md"
            />
            <Pressable
              onPress={handleDeleteImage}
              className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
            >
              <Text className="text-white font-bold">X</Text>
            </Pressable>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="bg-primary p-2 rounded-md mt-6"
        >
          <Text className="text-white text-center font-pmedium text-lg">
            Submit
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    height: 50,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "grey",
    height: 120,
    marginTop: -10,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    height: 50,
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 15,
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
});
