import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../../utils/Colors'
import { Box, Text, Image, Input, HStack, Button, Progress, useToast} from 'native-base'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../utils/API';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';

const Home = ({ navigation }) => {

  const toast = useToast();
  const [token, setToken] = useState([null]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if(token == null) {
          navigation.navigate('SignIn');
        }
        setToken(token);
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          console.log('Calling All Events API');

          const response = await axios.get(API.URL_GET_ALL_EVENTS,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if(response.status == 200){
            setEvents(response.data);
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
          toast.show({
            title: 'Error',
            status: 'error',
            description: error.response?.data?.message || 'Something went wrong',
          });
        }
      };

      if(token != null || token != undefined) {
        fetchData();
      }

    }, [token])
  );

  const nearbyEventsBtnClick = () => {
    navigation.navigate('NearByEvents')
  }

  const eventsCalenderBtnClick = () => {
    navigation.navigate('EventCalender')
  }

  const joinBtnPress = (event_id, event_name, date) => {
    navigation.navigate('JoinEvent', {
      eventId: event_id,
      eventName: event_name,
      eventDate: date,
    });
  }

  const donateBtnPress = (event_id, event_name, date) => {
    navigation.navigate('GiveDonate', {
      eventId: event_id,
      eventName: event_name,
      eventDate: date,
    });
  }

  const renderItem = ({ item }) => (
    <Box borderWidth={1} borderColor={Colors.secondaryColor} borderRadius="md" my={2} bgColor={Colors.lightPrimaryColor}>
      <Box bgColor="coolGray.200" height={200} borderTopRadius="md">
        <Image 
          source={{ uri: item.images }} 
          alt={item.eventName} 
          size="full" 
          height="full"
          resizeMode="cover" 
          borderTopRadius="md"
        />
      </Box>
      <Box p={4}>
        <Text fontWeight="bold" fontSize="lg" color={Colors.darkBlue}>{item.eventName}</Text>
        <Text fontSize="sm" color={Colors.primaryTextColor}>{item.description}</Text>
        <Text bold fontSize="sm" color={Colors.primaryTextColor}>{(item.date).substring(0, 10)}</Text>
        <Text fontSize="sm" color={Colors.primaryTextColor}>{item.fromTime} onwards at {item.location}</Text>
      </Box>
      <Box p={4}>
        <HStack
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          width="100%"
        >
          <Box flex={1}>
            <Progress colorScheme="red" value={((item.totalDonation/item.financialContribution) * 100)}/>
            <Text textAlign="right" mt={2}>Donations - {((item.totalDonation / item.financialContribution) * 100).toFixed(2)}% Completed</Text>
          </Box>
        </HStack>
      </Box>
      <Box p={4}>
        {item.totalDonation < item.financialContribution && (
          <Button size="sm" bgColor={Colors.darkBlue} onPress={() => donateBtnPress(item._id, item.eventName, item.date)}>
            <Text fontWeight="bold" fontSize="sm" color={Colors.secondaryTextColor}>Donate</Text>
          </Button>
        )}
        <Button size="sm" bgColor={Colors.primaryColor} mt={3}  onPress={() => joinBtnPress(item._id, item.eventName, item.date)}>
          <Text fontWeight="bold" fontSize="sm" color={Colors.secondaryTextColor}>Join Event</Text>
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box flex={1}>
      <Loader loading={loading} />
      <Box flex={1}>
        <Image 
          source={require('../../../assets/images/back-img-cover.png')}
          alt="Cover Image"
          width="100%"
          height="100%"
          resizeMode="cover"
        />
      </Box>
      <Box flex={3} mx={3}>
        {/* <Input size="md" bgColor={Colors.secondaryColor} borderColor={Colors.primaryTextColor} placeholder="Search by Event Name" my={4}/> */}
        <Text fontSize={24} bold color={Colors.primaryColor}>
          Upcoming Events
        </Text>
        <HStack
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          width="100%"
          mt={5}
          mb={3}
        >
          <Button rounded="md" py={3} mx={1} borderWidth={2} borderColor={Colors.primaryColor} bgColor={Colors.secondaryTextColor} flex={1} onPress={() => nearbyEventsBtnClick()}>
            <HStack space={2} alignItems="center">
              <Text fontWeight='bold' fontSize='md' color={Colors.primaryTextColor}>Nearby Events</Text>
              <Image 
                source={require('../../../assets/icons/marker-48.png')}
                alt="Nearby Events Icon"
                size={6}
                resizeMode="contain"
              />
            </HStack>
          </Button>
          <Button rounded="md" py={3} mx={1} borderWidth={2} borderColor={Colors.primaryColor} bgColor={Colors.secondaryTextColor} flex={1}  onPress={() => eventsCalenderBtnClick()}>
            <HStack space={2} alignItems="center">
              <Text fontWeight='bold' fontSize='md' color={Colors.primaryTextColor}>Event Calender</Text>
              <Image 
                source={require('../../../assets/icons/calender-85.png')}
                alt="Nearby Events Icon"
                size={6}
                resizeMode="contain"
              />
            </HStack>
          </Button>      
        </HStack>

        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}
        />

      </Box>
    </Box>
  )
}

export default Home