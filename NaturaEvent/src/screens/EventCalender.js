import { Box, FlatList, Image, Text, HStack, VStack, Center, Heading, Divider, Pressable, ScrollView, useToast } from 'native-base';
import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../utils/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import API from '../utils/API';
import Loader from '../components/Loader';

const EventCalender = () => {

  const toast = useToast();
  const [token, setToken] = useState([null]);
  const [userData, setUserData] = useState([null]);
  const [data, setData] = useState([]);
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
      setLoading(true);
      try {
        console.log('Calling Calender Events API');
        const baseURL = API.URL_GET_EVENTS_CURRENT_MONTH;
        const userId = userData?._id;
        const fullURL = `${baseURL}${userId}/current-month`;
        console.log(fullURL);

        const response = await axios.get(fullURL,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status == 200){
          setData(response.data);
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
        setLoading(false);
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

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 - January to 11 - December
  const currentYear = currentDate.getFullYear();

  const createCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay(); // Day of the week (0 - Sunday)
    
    const calendar = [];
    let week = [];

    // Fill empty slots before the first day of the month
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    // Fill the calendar with days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 3) {
        calendar.push(week);
        week = []; // Reset for next week
      }
    }

    // Push the last week if it has days
    if (week.length > 0) {
      calendar.push(week);
    }

    return calendar;
  };

  const calendar = createCalendar();

  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    if (day === null) return [];
    return data.filter(event => new Date(event.date).getDate() === day);
  };

  const renderDayCard = (day) => {
    const eventsForDay = getEventsForDay(day);
    const hasEvent = eventsForDay.length > 0;

    return (
      <Pressable
        p={6}
        m={1}
        borderRadius={8}
        bg={hasEvent ? "blueGray.400" : "gray.200"}
        onPress={() => {
          if (hasEvent) {
            console.log(`Events on ${day}:`, eventsForDay[0].eventName);
          }
        }}
      >
        <VStack alignItems="center" justifyContent="center">
          {hasEvent ? (
            <Text color={Colors.secondaryTextColor} fontSize="2xl" fontWeight="bold">{day}</Text>
          ) : (
            <Text color={Colors.primaryColor} fontSize="2xl" fontWeight="bold">{day}</Text>
          )}
          {hasEvent ? (
            <Text textAlign='center' color={Colors.primaryTextColor} fontSize="sm">{eventsForDay[0].eventName}</Text>
          ) : (
            <Text color={Colors.primaryTextColor} fontSize="sm">No Events</Text>
          )}
        </VStack>
      </Pressable>
    );
  };

  return (
    
      <Box p={4}>
        <Loader loading={loading} />
        <Center bgColor={Colors.darkBlue} rounded="md" py={3}>
          <Text fontSize="xl" fontWeight="bold" color={Colors.secondaryTextColor}>
            {`${currentDate.toLocaleString('default', { month: 'long' })} ${currentYear}`}
          </Text>
        </Center>
        <ScrollView mt={5} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60, marginTop: 10 }} keyboardShouldPersistTaps="handled">
          <HStack flexWrap="wrap" justifyContent="space-between">
            {calendar.map((week, weekIndex) => (
              <HStack key={weekIndex} width="100%" justifyContent="space-between">
                {week.map((day, dayIndex) => (
                  <Box key={dayIndex} width="30%">
                    {day !== null ? renderDayCard(day) : <Box p={4} /> }
                  </Box>
                ))}
              </HStack>
            ))}
          </HStack>
        </ScrollView>
      </Box>
  )
}

export default EventCalender