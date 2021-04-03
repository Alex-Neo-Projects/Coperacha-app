import React, { useState } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { kit } from '../root';
import { useNavigation } from '@react-navigation/native';
import {   
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import LogIn from '../components/LogIn';

function CreateListing(props) {
  const navigation = useNavigation();

  const [address, setAddress] = useState(props.address);

  const write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    /* 
    Solidity function: 
    
    function startProject(string calldata title, string calldata description, 
      string calldata imageLink, uint durationInDays, uint amountToRaise)
    */
     
     // Create a transaction object to update the contract
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

  console.log(props.handleLogIn);
  return (
    <View style={styles.container}>
      {props.loggedIn ? ( 
        <View>
          <Text style={styles.bigText}>Create a Fundraiser</Text>
          <Button style={{padding: 30}} title="Create Fundraiser" 
            onPress={()=> write()} />

          <Button title = "Submit" onPress={()=> navigation.navigate('CreateReceipt')} />
        </View>
      ) : (
        <View>
          <LogIn reason={"to create a fundraiser"} handleLogIn={props.handleLogIn}/>
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
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
});

export default CreateListing;