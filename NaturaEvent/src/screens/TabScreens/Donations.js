import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../../utils/Colors'
import { Box, Text, Image, VStack, HStack, Button, AspectRatio, useToast, Divider, Badge} from 'native-base'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../utils/API';
import axios from 'axios';

const Donations = ({ navigation }) => {

    const toast = useToast();
    const [token, setToken] = useState([null]);
    const [userData, setUserData] = useState([null]);
    const [donations, setDonations] = useState([]);

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
          console.log('Calling All for User Donations API');
          const baseURL = API.URL_DONATIONS_USER;
          const userId = userData?._id;
          const fullURL = `${baseURL}${userId}`;
          console.log(fullURL);
  
          const response = await axios.get(fullURL,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if(response.status == 200){
            setDonations(response.data);
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

    const renderItem = ({ item }) => (
      <Box borderWidth={1} borderColor="coolGray.300" borderRadius="md" my={2} p={4} bgColor={Colors.lightPrimaryColor}>
        <Text fontWeight="bold" color={Colors.primaryColor} fontSize="lg">{item.event.eventName}</Text>
        <Text color={Colors.primaryTextColor} mt={1}>{item.event.description}</Text>
        <Divider my={2} />
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text bold color={Colors.darkBlue}>Ref Code: {item.ref}</Text>
            <Text bold color={Colors.darkBlue}>Bank: {item.bank}</Text>
            <Text bold color={Colors.darkBlue}>Amount: {item.amount}</Text>
            <Text fontSize="sm" color="coolGray.500">Created At: {new Date(item.createdAt).toLocaleString()}</Text>
          </VStack>
          <Text fontWeight="bold" fontSize="lg">Rs. {item.amount}</Text>
        </HStack>
      </Box>
    );

    return (
      <Box flex={3} mx={3}>
        {donations.length === 0 ? (
          <Box alignItems="center" mt={10}>
            <Text fontSize="lg" color="coolGray.500">
              No donations available for user.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={donations}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </Box>
    )
}

export default Donations