import React, { useState, useEffect } from 'react';
import { Box, Button, Center, FormControl, Heading, Input, VStack, useToast, HStack,Text, ScrollView } from 'native-base';
import Colors from '../utils/Colors';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import API from '../utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSignIn = async () => {

    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if(trimmedEmail == "" || trimmedPassword == ""){
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Fields Cannot Be Empty!',
      });
      setLoading(false);
    }else{
      
      let loginObj = {
        email : trimmedEmail,
        password : trimmedPassword
      }
  
      try {
        console.log('Calling Login API');
        const response = await axios.post(API.URL_USER_LOGIN, loginObj);
        
        if (response.data.token) {

          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data));

          // Show success message
          toast.show({
            title: 'Success',
            status: 'success',
            description: 'Logged In Successfully',
          });
  
          // Navigate to the Home screen after login
          navigation.navigate('Main');
        }
      } catch (error) {
        toast.show({
          title: 'Error',
          status: 'error',
          description: error.response?.data?.message || 'Invalid credentials',
        });
      } finally {
        setLoading(false);
      }
    }

    

    // toast.show({
    //   title: 'Success',
    //   status: 'success',
    //   description: 'Logged In Successfully',
    // });

    // // Navigate to the Home screen after login
    // navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Center flex={1} px={4}>

          <Box safeArea p="2" w="90%" maxW="290" py="8">
            
            <Box justifyContent="center" alignItems="center">
              <LottieView source={require('../../assets/animations/login-natura.json')} autoPlay loop style={{width:250, height:350}} />
            </Box>

            <Heading size="lg" color={Colors.primaryColor} fontWeight="600" textAlign="center">
              Welcome to NaturaEvent
            </Heading>
            <Heading mt="1" color="coolGray.600" size="xs" textAlign="center">
              Sign in to continue!
            </Heading>

            <VStack space={3} mt="5">
              <FormControl>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="Enter your email"
                  />
              </FormControl>

              <FormControl>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholder="Enter your password"
                    secureTextEntry
                  />
              </FormControl>

              <Button mt="2" bgColor={Colors.primaryColor} onPress={handleSignIn} isLoading={loading}>
                  Sign In
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color={Colors.primaryTextColor}>
                  I'm a new user.{" "}
                </Text>
                <Text onPress={() => navigation.navigate('SignUp')} color={Colors.primaryColor}>
                  Sign Up
                </Text>
              </HStack>
            </VStack>
          </Box>
      </Center>
    </ScrollView>
  );
};

export default SignIn;