import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../utils/Colors'
import { Box, Text, Image, VStack, HStack, Button, AspectRatio, useToast, Divider, Badge} from 'native-base'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../utils/API';
import axios from 'axios';
import { Alert } from 'react-native';
import Loader from '../components/Loader';

const RegisteredEvents = ({ navigation }) => {

  const toast = useToast();
  const [token, setToken] = useState([null]);
  const [userData, setUserData] = useState([null]);
  const [events, setEvents] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const uData = await AsyncStorage.getItem('userData');

        if(token == null) {
          navigation.navigate('SignIn');
        }

        const parsedUserData = uData ? JSON.parse(uData) : null;

        setUserData(parsedUserData);
        setToken(token);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Calling All for User Events API');
        const baseURL = API.URL_GET_ALL_EVENTS;
        const userId = userData?._id;
        const fullURL = `${baseURL}${userId}/?status=1`;
        console.log(fullURL);

        const response = await axios.get(fullURL,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status == 200){
          const currentDate = new Date();
          const pastEvents = response.data.filter(event => new Date(event.date) > currentDate);
          setEvents(pastEvents);
          setLoading(false);
        }else{
          setLoading(false);
          toast.show({
            title: 'Error',
            status: 'error',
            description: 'Something went wrong',
          });
        }
      } catch (error) {
        // toast.show({
        //   title: 'Error',
        //   status: 'error',
        //   description: error.response?.data?.message || 'Something went wrong',
        // });
        setLoading(false);
        console.log(error.response?.data?.message);
      }
    };

    if(token != null || token != undefined) {
      fetchData();
    }

  }, [token, refreshTrigger]);

  const onUnregister = async (eventId) => {

    setLoading(true);
    let obj = {
      "userId": userData._id,
      "eventId": eventId
    }

    console.log(obj);

    try {

      console.log('Calling Unregister API');
      const baseURL = API.URL_UNREGISTER_EVENT;
      const response = await axios.put(baseURL, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (response.status === 200) {
          setLoading(false);
          toast.show({
            title: 'Success',
            status: 'success',
            description: 'You have successfully unregistered from the event.',
          });
          setRefreshTrigger(!refreshTrigger);
        } else {
          setLoading(false);
          toast.show({
            title: 'Error',
            status: 'error',
            description: 'Failed to unregister from the event.',
          });
        }
      } else {
        setLoading(false);
        toast.show({
          title: 'Error',
          status: 'error',
          description: 'Failed to unregister from the event.',
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data?.message || 'Something went wrong');
      toast.show({
        title: 'Error',
        status: 'error',
        description: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const EventCard = ({ item, onUnregister }) => {

    const daysLeft = Math.ceil((new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24));

    const handleUnregister = () => {
      Alert.alert(
        "Unregister Event",
        "Are you sure you want to unregister from this event?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => onUnregister(item._id) }
        ]
      );
    };

    return (
      <Box borderWidth={1} borderColor="coolGray.300" borderRadius="md" my={2} bgColor={Colors.lightPrimaryColor} p={4}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack flex={1} pr={4}>
            <Text fontWeight="bold" color={Colors.primaryColor} fontSize="lg">{item.eventName}</Text>
            <Text color={Colors.primaryTextColor} mt={1}>{item.description}</Text>
            <Text bold color={Colors.darkBlue} mt={3}>
              Date: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text bold color={Colors.darkBlue}>Time: {item.fromTime} - {item.toTime}</Text>
            <Text color={Colors.primaryTextColor} mt={2}>Tools Supply: {item.toolsSupply}</Text>
          </VStack>
          <Box justifyContent='center' alignItems='center'>
            <Text color={Colors.darkBlue} textAlign="center" mt={1} bold>Days left {daysLeft}</Text>
            <Image
              source={{ uri: item.images }}
              alt={item.eventName}
              size="70px"
              borderRadius="md"
              resizeMode="cover"
              mt={2}
            />
            <Button  colorScheme='danger' size='sm' mt={2} onPress={handleUnregister}>Unregister</Button>
          </Box>
        </HStack>
      </Box>
    );
  };

  return (
    <Box flex={3} mx={3}>
      <Loader loading={loading} />
      {events.length === 0 ? (
        <Box alignItems="center" mt={10}>
        <Text fontSize="lg" color="coolGray.500">
          No upcoming events found.
        </Text>
      </Box>
      ) : (
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventCard item={item} onUnregister={onUnregister} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}
        />
      )}
    </Box>
  )
}

export default RegisteredEvents