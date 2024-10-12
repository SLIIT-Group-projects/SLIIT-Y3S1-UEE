import { Box, Center, Text, Image, useToast } from 'native-base';
import React, {useState,useEffect,useCallback} from 'react'
import Colors from '../utils/Colors';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../utils/API';

const NearByEvents = () => {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const toast = useToast();
  const [token, setToken] = useState([null]);
  const [userData, setUserData] = useState([null]);
  const [eventData, setEventData] = useState([]);

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
        console.log('Calling Near By Events API');
        const baseURL = API.URL_GET_ALL_EVENTS;

        const response = await axios.get(baseURL,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status == 200){
          setEventData(response.data);
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    })();
  }, []);

  if (errorMsg) {
    return (
      <Center>
        <Text>{errorMsg}</Text>
      </Center>
    );
  }

  if (!location) {
    return (
      <Center>
        <Text>Loading Map...</Text>
      </Center>
    );
  }

  return (
    <Box>
      <MapView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        region={location}
        showsUserLocation={true}
      >
        {eventData.map(event => (
          <Marker
            key={event._id}
            coordinate={{
              latitude: parseFloat(event.latitude),
              longitude: parseFloat(event.longitude)
            }}
            pinColor="red"
          >
            <Callout>

              <Box width={200}>
                <Text bold>{event.eventName}</Text>
                <Text>{event.description}</Text>
                <Text>{event.fromTime} - {event.toTime}</Text>
                <Text>{(event.date).substring(0, 10)}</Text>
              </Box>
            </Callout>
          </Marker>
        ))}

      </MapView>
    </Box>
  )
}

export default NearByEvents