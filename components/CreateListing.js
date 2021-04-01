import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { web3, kit } from '../root'
import {   
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import CeloCrowdfundContract from '../contracts/CeloCrowdfund.json';
import ProjectInstanceContract from '../contracts/ProjectInstance.json';

class CreateListing extends React.Component {

  write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Celo Crowdfunding'
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

    const txObject = await this.state.celoCrowdfundContract.methods.startProject('Building a new road', 'We need a new road to connect the two sides of town. We are asking for $900 cUSD in order to build this road. ', 'https://i.imgur.com/elTnbFf.png', 5, 900);
    
    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: this.state.address,
          to: this.state.celoCrowdfundContract._address, // interact w/ address of CeloCrowdfund contract
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
    return (
      <View style={styles.container}>
  
        <Text style={styles.title}>Create new Project</Text>
          <Button style={{padding: 30}} title="Create Project" 
            onPress={()=> this.write()} />
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