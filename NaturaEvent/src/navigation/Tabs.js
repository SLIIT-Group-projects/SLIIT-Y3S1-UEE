import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/TabScreens/Home';
import ProfileScreen from '../screens/TabScreens/Profile';
import DonationScreen from '../screens/TabScreens/Donations';
import { StyleSheet } from 'react-native';
import { Box, Image, NativeBaseProvider, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../utils/Colors';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation}) => {
    return(
        <NativeBaseProvider>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: [{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                        backgroundColor: Colors.primaryTextColor,
                        borderRadius: 0,
                        height: 70,
                        ...styles.shadow
                    }]
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} navigation={navigation} options={{
                    tabBarIcon: ({focused}) => (
                        <Box style={{alignItems:'center', justifyContent:'center', top: 0}}>
                            <Image
                                source={require('../../assets/icons/home-24.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? Colors.primaryColor : Colors.secondaryTextColor,
                                }}
                                alt=''
                            />
                            <Text fontSize="sm" style={{color: focused ? Colors.primaryColor : Colors.secondaryTextColor, fontWeight: 'bold'}}>
                                Home
                            </Text>
                        </Box>
                    ),
                    headerShown: true,
                    headerTitle: 'NATURA EVENT',
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTitleStyle: {
                        color: Colors.secondaryTextColor
                    },
                }}/>

                <Tab.Screen name="Donations" component={DonationScreen} navigation={navigation} options={{
                    tabBarIcon: ({focused}) => (
                        <Box style={{alignItems:'center', justifyContent:'center', top: 0}}>
                            <Image
                                source={require('../../assets/icons/donation-50.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? Colors.primaryColor : Colors.secondaryTextColor,
                                }}
                                alt=''
                            />
                            <Text fontSize="sm" style={{color: focused ? Colors.primaryColor : Colors.secondaryTextColor, fontWeight: 'bold'}}>
                                Donations
                            </Text>
                        </Box>
                    ),
                    headerShown: true,
                    headerTitle: 'NATURA EVENT',
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTitleStyle: {
                        color: Colors.secondaryTextColor
                    },
                }}/>

                <Tab.Screen name="Profile" component={ProfileScreen} navigation={navigation} options={{
                    tabBarIcon: ({focused}) => (
                        <Box style={{alignItems:'center', justifyContent:'center', top: 0}}>
                            <Image
                                source={require('../../assets/icons/user-50.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? Colors.primaryColor : Colors.secondaryTextColor,
                                }}
                                alt=''
                            />
                            <Text fontSize="sm" style={{color: focused ? Colors.primaryColor : Colors.secondaryTextColor, fontWeight: 'bold'}}>
                                Profile
                            </Text>
                        </Box>
                    ),
                    headerShown: true,
                    headerTitle: 'NATURA EVENT',
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTitleStyle: {
                        color: Colors.secondaryTextColor
                    },
                }}/>    
                
            </Tab.Navigator>
        </NativeBaseProvider>
    )
}

export default Tabs;

const styles = StyleSheet.create({
    shadow:{
        shadowColor: Colors.primaryTextColor,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.5,
        elevation: 6
    }
});