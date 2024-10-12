import React, {useEffect, useState} from 'react';
import { Box, Image, Text, Button, VStack, Center, Divider, ScrollView } from 'native-base';
import Colors from '../../utils/Colors';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import { Alert } from 'react-native';

const Profile = ({navigation}) => {

  const [token, setToken] = useState(null);
  const [userid, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const userDataString = await  AsyncStorage.getItem('userData');

        if(token == null) {
          navigation.navigate('SignIn');
        }

        setLoading(true);
        const userData = userDataString ? JSON.parse(userDataString) : null;

        if (userData) {
          setToken(token);
          setUserId(userData._id);
          setUserEmail(userData.email);
          setUserName(userData.name);
          setUserPhone(userData.phone_no);
        }
        setLoading(false);
    };

    fetchData();
  }, []);

  const registeredEventsBtnClick = () => {
    navigation.navigate('RegisteredEvents')
  }

  const pastEventsBtnClick = () => {
    navigation.navigate('PastEvents')
  }

  const eventRequestBtnClick = () => {
    console.log("Event Request Pressed");
  }

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            try {
              // Clear session data from AsyncStorage
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
  
              navigation.navigate('SignIn');
            } catch (error) {
              console.error('Error clearing session data: ', error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Loader loading={loading} />
      <Box flex={1} padding={4} alignItems="center" justifyContent="center">
      
        <Box borderWidth={1} borderColor={Colors.darkBlue} borderRadius={100} overflow="hidden" width={200} height={200} mb={4} justifyContent="center" alignItems="center">
          <LottieView source={require('../../../assets/animations/user.json')} autoPlay loop style={{width:150, height:150}} />
        </Box>

        <Text fontSize="lg" bold>{userName == null ? 'N/A' : userName}</Text>
        <Text>{userEmail == null ? 'N/A' : userEmail}</Text>
        <Text>{userPhone == null ? 'N/A' : userPhone}</Text>

        <Divider my="4" bg={Colors.primaryTextColor} />

        <VStack space={4} width="100%" alignItems="center">
          <Button width="60%" borderWidth={2} borderColor={Colors.primaryColor} bgColor={Colors.secondaryTextColor} onPress={() => registeredEventsBtnClick()}>
            <Text bold color={Colors.primaryColor}>Registered Events</Text>
          </Button>
          <Button width="60%" borderWidth={2} borderColor={Colors.primaryColor} bgColor={Colors.secondaryTextColor} onPress={() => pastEventsBtnClick()}>
            <Text bold color={Colors.primaryColor}>Past Events</Text>
          </Button>
          <Button width="60%" borderWidth={2} borderColor={Colors.primaryColor} bgColor={Colors.secondaryTextColor} onPress={() => eventRequestBtnClick()}>
            <Text bold color={Colors.primaryColor}>Event Request</Text>
          </Button>
        </VStack>

        <Divider my="4" bg={Colors.primaryTextColor} />

        <VStack space={4} width="100%" alignItems="center" mt={3}>
          <Button width="40%" bgColor={Colors.primaryColor} onPress={() => handleLogout()}>Logout</Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default Profile