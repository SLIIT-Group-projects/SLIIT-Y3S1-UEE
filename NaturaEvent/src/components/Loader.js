// Loader.js
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Box } from 'native-base';
import Colors from '../utils/Colors';

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box 
      position="absolute" 
      top={0} 
      left={0} 
      right={0} 
      bottom={0} 
      justifyContent="center" 
      alignItems="center" 
      bgColor="rgba(0,0,0,0.5)"
      zIndex='1000'
    >
      <ActivityIndicator size="large" color={Colors.lightPrimaryColor} />
    </Box>
  );
};

export default Loader;