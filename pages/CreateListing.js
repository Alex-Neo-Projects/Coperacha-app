import React, { useState } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { kit } from '../root';
import { useNavigation } from '@react-navigation/native';
import {   
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CreateListing(props) {
  const navigation = useNavigation();

  const [address, setAddress] = useState('Not logged in');
  const [balance, setBalance] = useState('Not logged in');
  const [loggedIn, setLoggedIn] = useState(false);


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
    
    setAddress(dappkitResponse.address);

  }
  const write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    // Create a transaction object to update the contract

    /* 
    Solidity function: 

      function startProject(
        string calldata title,
        string calldata description,
        string calldata imageLink, 
        uint durationInDays, 
        uint amountToRaise
      )
    */

    const txObject = await props.celoCrowdfundContract.methods.startProject('Building a new road', 'We need a new road to connect the two sides of town. We are asking for $900 cUSD in order to build this road. ', 'https://i.imgur.com/elTnbFf.png', 5, 900);
    
    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: address,
          to: props.celoCrowdfundContract._address, // interact w/ address of CeloCrowdfund contract
          tx: txObject,
          feeCurrency: FeeCurrency.cUSD
        }
      ],
      { requestId, dappName, callback }
    )

    // Get the response from the Celo wallet
    const dappkitResponse = await waitForSignedTxs(requestId)
    const tx = dappkitResponse.rawTxs[0]
    
    // Get the transaction result, once it has been included in the Celo blockchain
    let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

    console.log(`Project created contract update transaction receipt: `, result)  
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userAddress')
      const userBalance = await AsyncStorage.getItem('@userBalance');

      if(value !== null) {
        setAddress(value);
        setBalance(userBalance);
        setLoggedIn(true);
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
          <Text style={styles.title}>Create new Project</Text>
          <Button style={{padding: 30}} title="Create Project" 
            onPress={()=> write()} />

          <Button title = "Submit" onPress={()=> navigation.navigate('CreateReceipt')} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Login to create a fundraiser</Text>
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
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default CreateListing;