import { Box, Button, Center, FormControl, Heading, Input, VStack,TextArea, Text, useToast } from 'native-base';
import { ScrollView } from 'react-native';
import Colors from '../utils/Colors';
import React, {useState,useEffect,useCallback} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../utils/API';
import Loader from '../components/Loader';

const JoinEvent = ({ navigation, route }) => {

    const { eventId, eventName, eventDate } = route.params;

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [additional, setAdditional] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const [token, setToken] = useState([null]);
    const [userData, setUserData] = useState([null]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const uData = await AsyncStorage.getItem('userData');
    
            if(token == null) {
              navigation.navigate('SignIn');
            }
    
            const parsedUserData = uData ? JSON.parse(uData) : null;
    
            setUserData(parsedUserData);
            setEmail(parsedUserData.email)
            setName(parsedUserData.name)
            setPhoneno(parsedUserData.phone_no)
            setToken(token);
        };
    
        fetchData();
    }, []);

    const handleJoinEvent = async () => {

        setLoading(true);
    
        const trimmedAdditional = additional.trim();
    
          let obj = {
            "userId": userData._id,
            "eventId": eventId,
            "additional_note" : trimmedAdditional,
          }
      
          try {
            console.log('Calling JOIN EVENT API');
            const response = await axios.post(API.URL_JOIN_EVENT, obj,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });

            console.log(response);
    
              // Show success message
              toast.show({
                title: 'Success',
                status: 'success',
                description: 'Joined Successfully',
              });
              
              setLoading(false);
      
              // Navigate to the Home screen after login
              navigation.navigate('Main');

          } catch (error) {
            setLoading(false);
            toast.show({
              title: 'Error',
              status: 'error',
              description: error.response?.data?.message || 'Invalid credentials',
            });
            console.log(error.response?.data?.message);
          } finally {
            setLoading(false);
          }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <Loader loading={loading} />
            <Center flex={1} px={4}>
                <Box safeArea p="2" w="90%" py="8">

                    <Heading size="lg" color={Colors.darkBlue} fontWeight="600" textAlign="center" mb={4}>
                        {eventName}
                    </Heading>
                    <Text color={Colors.darkBlue} fontWeight="600" textAlign="center">{eventDate.substring(0, 10)}</Text>

                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                                value={email}
                                onChangeText={text => setEmail(text)}
                                isDisabled
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Name</FormControl.Label>
                            <Input
                                value={name}
                                onChangeText={text => setName(text)}
                                isDisabled
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Phone No</FormControl.Label>
                            <Input
                                value={phoneno}
                                onChangeText={text => setPhoneno(text)}
                                isDisabled
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Additional Notes</FormControl.Label>
                            <TextArea
                                value={additional}
                                onChangeText={text => setAdditional(text)}
                                placeholder="Enter your notes here..."
                                h={100}
                                borderRadius={8}
                            />
                        </FormControl>

                        <Button mt="2" bgColor={Colors.primaryColor} onPress={handleJoinEvent} isLoading={loading}>
                            Join Event
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    )
}

export default JoinEvent