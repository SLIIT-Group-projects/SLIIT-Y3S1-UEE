import { Box, Button, Center, FormControl, Heading, Input, VStack,TextArea, Text, useToast } from 'native-base';
import { ScrollView } from 'react-native';
import Colors from '../utils/Colors';
import React, {useState,useEffect,useCallback} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../utils/API';
import Loader from '../components/Loader';

const GiveDonate = ({ navigation, route }) => {

    const { eventId, eventName, eventDate } = route.params;

    const [name, setName] = useState('');
    const [bankName, setBankName] = useState('');
    const [amount, setAmount] = useState('');
    const [refCode, setRefCode] = useState('');
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
            setName(parsedUserData.name)
            setToken(token);
        };
    
        fetchData();
    }, []);

    const handleSubmit = async () => {

        setLoading(true);
    
        const trimmedName = name.trim();
        const trimmedBankName = bankName.trim();
        const trimmedAmount = amount.trim();
        const trimmedRefCode = refCode.trim();
    
        let obj = {
            "userId": userData._id,
            "eventId": eventId,
            "name": trimmedName,
            "bank_name": trimmedBankName,
            "amount" : trimmedAmount,
            "ref_code" : trimmedRefCode,
        }

        console.log(obj);
      
        try {
            console.log('Calling DONATE EVENT API');
            const response = await axios.post(API.URL_DONATE_EVENT, obj,{
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
                            <FormControl.Label>Event Name</FormControl.Label>
                            <Input
                                value={eventName}
                                isDisabled
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Name</FormControl.Label>
                            <Input
                                value={name}
                                onChangeText={text => setName(text)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Bank Name</FormControl.Label>
                            <Input
                                value={bankName}
                                onChangeText={text => setBankName(text)}
                                placeholder="Enter your bank name here..."
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Amount</FormControl.Label>
                            <Input
                                inputMode='numeric'
                                value={amount}
                                onChangeText={text => setAmount(text)}
                                placeholder="Enter your amount here..."
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Reference Code</FormControl.Label>
                            <Input
                                value={refCode}
                                onChangeText={text => setRefCode(text)}
                                placeholder="Enter your reference here..."
                            />
                        </FormControl>

                        <Button mt="2" bgColor={Colors.primaryColor} onPress={handleSubmit} isLoading={loading}>
                            Submit
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    )
}

export default GiveDonate