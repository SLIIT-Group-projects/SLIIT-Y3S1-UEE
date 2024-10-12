import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../utils/Colors'
import { Box, Text, Image, VStack, HStack, Button, AspectRatio, useToast, Divider, Badge} from 'native-base'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../utils/API';
import axios from 'axios';

const PastEvents = ({ navigation }) => {

  const toast = useToast();
  const [token, setToken] = useState([null]);
  const [userData, setUserData] = useState([null]);
  const [events, setEvents] = useState([]);


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
          const pastEvents = response.data.filter(event => new Date(event.date) < currentDate);
          setEvents(pastEvents);
        }else{
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
        console.log(error.response?.data?.message);
      }
    };

    if(token != null || token != undefined) {
      fetchData();
    }

  }, [token])

  const EventCard = ({ item }) => {

    // Determine the badge color based on the status
    const badgeColor = item.status === 1 ? 'success' : 'danger';
  
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
          </VStack>
          <Box position="relative">
            <Image
              source={{ uri: item.images }}
              alt={item.eventName}
              size="120px"
              borderRadius="md"
              resizeMode="cover"
            />
            <Badge
              colorScheme={badgeColor}
              variant="solid"
              position="absolute"
              top={2}
              right={2}
              rounded='md'
            >
              {item.status === 1 ? 'Completed' : 'Cancelled'}
            </Badge>
          </Box>
        </HStack>
      </Box>
    );
  };

  return (
    <Box flex={3} mx={3}>
      {events.length === 0 ? (
        <Box alignItems="center" mt={10}>
          <Text fontSize="lg" color="coolGray.500">
            No past events available.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={events}
          renderItem={EventCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}
        />
      )}
    </Box>
  )
}

export default PastEvents