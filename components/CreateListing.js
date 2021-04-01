import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { kit } from '../root'
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

class CreateListing extends React.Component {

  state = {
    address: 'Not logged in',
    balance: 'Not logged in',
    contractName: '',
    loggedIn: false
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
    
    // Update state
    this.setState({ cUSDBalance, 
                    isLoadingBalance: false,
                    address: dappkitResponse.address})
  }
  write = async () => {
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

    const txObject = await this.props.celoCrowdfundContract.methods.startProject('Building a new road', 'We need a new road to connect the two sides of town. We are asking for $900 cUSD in order to build this road. ', 'https://i.imgur.com/elTnbFf.png', 5, 900);
    
    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: this.state.address,
          to: this.props.celoCrowdfundContract._address, // interact w/ address of CeloCrowdfund contract
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

  render() {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userAddress')
        const userBalance = await AsyncStorage.getItem('@userBalance');

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
            <Text style={styles.title}>You're logged in! {"\n\n\n"}</Text>
            <Text style={styles.title}>Create new Project</Text>
            <Button style={{padding: 30}} title="Create Project" 
              onPress={()=> this.write()} />
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
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default CreateListing;