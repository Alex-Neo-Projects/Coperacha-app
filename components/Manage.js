import React from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { kit } from '../root'
import {   
  requestAccountAddress,
  waitForAccountAuth,
} from '@celo/dappkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

class Manage extends React.Component {
  // Set the defaults for the state
  state = {
    address: 'Not logged in',
    balance: 'Not logged in',
    loggedIn: false,
  }

  login = async () => {
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

  render(){
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userAddress')
        const userBalance = await AsyncStorage.getItem('@userBalance')
        if(value !== null) {
          this.setState({address: value, balance: userBalance, loggedIn: true}); 
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

        {this.state.loggedIn ? ( 
          <View>
            <Text style={styles.bigText}>My Fundraisers{"\n"}</Text>

            <Text style={styles.title}>You have no fundraisers yet</Text>
            <Text>Create a fundraiser below or browse existing fundraisers</Text>
            
            <Image style={styles.Image} source={require("../assets/nurture.png")}></Image>

            <Button title="New Fundraiser"></Button>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Login</Text>
            <Button title="Login" 
              onPress={()=> this.login()} />
          </View>
        )}
      </View>
    );
  }
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