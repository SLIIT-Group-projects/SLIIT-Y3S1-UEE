import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Tabs from './Tabs';
import NearByEvents from '../screens/NearByEvents';
import EventCalender from '../screens/EventCalender';
import JoinEvent from '../screens/JoinEvent';
import RegisteredEvents from '../screens/RegisteredEvents';
import PastEvents from '../screens/PastEvents';
import GiveDonate from '../screens/GiveDonate';
import Colors from '../utils/Colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen 
          name="SignIn"
          component={SignIn}
          options={
            { headerShown: false }
          } 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={
            { headerShown: false }
          } 
        />
        <Stack.Screen 
          name='Main' 
          component={Tabs} 
          options={
            { headerShown : false}
          } 
        />
        <Stack.Screen 
          name='NearByEvents' 
          component={NearByEvents}
          options={
            { headerShown : true,
              headerTitle: 'Near By Events',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
        <Stack.Screen 
          name='EventCalender' 
          component={EventCalender}
          options={
            { headerShown : true,
              headerTitle: 'Event Calender',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
        <Stack.Screen 
          name='JoinEvent' 
          component={JoinEvent}
          options={
            { headerShown : true,
              headerTitle: 'Join For Event',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
        <Stack.Screen 
          name='GiveDonate' 
          component={GiveDonate}
          options={
            { headerShown : true,
              headerTitle: 'Donate For Event',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
        <Stack.Screen 
          name='RegisteredEvents' 
          component={RegisteredEvents}
          options={
            { headerShown : true,
              headerTitle: 'Registered Upcoming Events',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
        <Stack.Screen 
          name='PastEvents' 
          component={PastEvents}
          options={
            { headerShown : true,
              headerTitle: 'Past Registered Events',
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTitleStyle: {
                color: Colors.secondaryTextColor
              },
            }
          } 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;