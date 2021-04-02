import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';

function LogOut() {
  const [address, setAddress] = useState('not logged in');

  const logOut = async () => {

  }
  return(
    <View>
      <Text style={styles.title}>Log out</Text>
      <Button title="Log Out" 
        onPress={()=> logOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center'
  }
});

export default LogOut;
