import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  VStack,
  useToast,
  HStack,
  Text,
  ScrollView,
  Image
} from "native-base";
import Colors from "../utils/Colors";
import API from "../utils/API";
import axios from 'axios';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {

        setLoading(true);

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedPassword || !trimmedConfirmPassword) {
            toast.show({
                title: 'Error',
                status: 'error',
                description: 'Please fill all required fields.',
            });
            setLoading(false);
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            toast.show({
                title: 'Error',
                status: 'error',
                description: 'Passwords do not match. Please try again.',
            });
            setLoading(false);
            return;
        }

        let obj = {
            name: trimmedName,
            email: trimmedEmail,
            phone_no: trimmedPhone,
            password: trimmedPassword
        }
        try {
            console.log('Calling Register API');
            const response = await axios.post(API.URL_USER_CREATE, obj);

            if (response.data.token) {
      
                // Show success message
                toast.show({
                  title: 'Success',
                  status: 'success',
                  description: 'Account Created Successfully',
                });
        
                // Navigate to the Home screen after login
                navigation.navigate('SignIn');
            }
            
        } catch (error) {
            toast.show({
              title: 'Error',
              status: 'error',
              description: error.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <Center flex={1} px={4}>
                <Box safeArea p="2" w="90%" maxW="290" py="8">
                    <Image 
                        source={require('../../assets/images/natura-event-logo.png')}
                        alt={""} 
                        size="2xl"
                        flex={1}
                        mb={5}
                    />
                    <Heading
                        size="lg"
                        color={Colors.primaryColor}
                        fontWeight="600"
                        textAlign="center"
                    >
                        Create an Account
                    </Heading>
                    <Heading mt="1" color="coolGray.600" size="xs" textAlign="center">
                        Sign up to access exclusive features and benefits.
                    </Heading>

                    <VStack space={3} mt="5">

                        <FormControl>
                            <FormControl.Label isRequired>Name</FormControl.Label>
                            <Input
                                value={name}
                                onChangeText={(text) => setName(text)}
                                placeholder="Enter your name"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Email</FormControl.Label>
                            <Input
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                placeholder="Enter your email"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Phone</FormControl.Label>
                            <Input
                                value={phone}
                                onChangeText={(text) => setPhone(text)}
                                placeholder="Enter your phone no"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Password</FormControl.Label>
                            <Input
                                type="password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                placeholder="Enter your password"
                                secureTextEntry
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label isRequired>Confirm Password</FormControl.Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                placeholder="Re-Enter your password"
                                secureTextEntry
                            />
                        </FormControl>

                        <Button mt="5" bgColor={Colors.primaryColor} onPress={handleSignUp} isLoading={loading}>
                            Sign Up
                        </Button>

                        <HStack mt="6" justifyContent="center">
                            <Text fontSize="sm" color={Colors.primaryTextColor}>
                                Already have an account?{" "}
                            </Text>
                            <Text onPress={() => navigation.navigate('SignIn')} color={Colors.primaryColor}>
                                Sign In
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
};

export default SignUp;
