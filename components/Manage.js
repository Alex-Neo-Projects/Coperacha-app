import React, {useState} from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { kit } from '../root'
import {   
  requestAccountAddress,
  waitForAccountAuth,
} from '@celo/dappkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';

function Manage() {
  // Set the defaults for the state
  const [address, setAddress] = useState('Not logged in');
  const [balance, setBalance] = useState('Not logged in');
  const [loggedIn, setLoggedIn] = useState(false);

  const navigation = useNavigation();

  const login = async () => {
    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = 'login';
    
    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = 'Coperacha';
    
    // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
    const callback = Linking.makeUrl('/my/path');
  
    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName,
      callback,
    });
  
    // Wait for the Celo Wallet response
    const dappkitResponse = await waitForAccountAuth(requestId);

    // Set the default account to the account returned from the wallet
    kit.defaultAccount = dappkitResponse.address;

    // Get the stable token contract
    const stableToken = await kit.contracts.getStableToken();

    // Get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount);
    
    // Convert from a big number to a string
    let cUSDBalance = cUSDBalanceBig.toString();
    
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('@userAddress', dappkitResponse.address);
        await AsyncStorage.setItem('@userBalance', cUSDBalance);
        console.log("Saved address");
      } catch (e) {
        // saving error
      }
    }

    storeData();
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userAddress')
      const userBalance = await AsyncStorage.getItem('@userBalance')
      if(value !== null) {
        setLoggedIn(true);
        setAddress(value);
        setBalance(userBalance);
      }
      else {
        console.log('User not logged in');
      }
    } catch(e) {
      // error reading value
      console.log("Error: ", e);
    }
  }
  getData()


  return (
    <View style={styles.container}>
      {loggedIn ? ( 
        <View>
          <Text style={styles.bigText}>My Fundraisers{"\n"}</Text>

          <Text style={styles.title}>You have no active fundraisers</Text>
          <Text>Create a fundraiser below or browse existing fundraisers</Text>
          
          <Image style={styles.Image} source={require("../assets/nurture.png")}></Image>

          <Button title="New Fundraiser" onPress={() => navigation.navigate('Create')}></Button>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Login to view your fundraisers</Text>
          <Button title="Login" 
            onPress={()=> login()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 30, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
  Image: {
    flex: 1,
    width: 250,
    height: 250,
    marginLeft: 50,
    resizeMode: 'contain'
  },
});

export default Manage;