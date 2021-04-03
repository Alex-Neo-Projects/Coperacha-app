import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { web3, kit } from '../root';
import {   
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';

function DonationForm(props) {
  const navigation = useNavigation();

  var title = props.route.params.title;
  var projectInstanceContract = props.route.params.projectInstanceContract;
  var address = props.route.params.address; 

  console.log(address);
  const write = async () => {
    const requestId = 'fund_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    const txObject = await projectInstanceContract.methods.contribute().send({
      from: address, 
      value: 1, // TODO
    });

    
    // Send a request to the Celo wallet
    requestTxSig(
      kit,
      [
        {
          from: address,
          to: projectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
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

    console.log(`Donated to project transaction receipt: `, result)  
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Donation</Text>
      <Text style={styles.small}>For: "{title}"</Text>

      <Text style={styles.title}>Name:</Text>
      <TextInput style={[styles.input, { borderColor: '#c0cbd3'}]}></TextInput>
      <Text style={styles.title}>Donation amount: </Text>
      <TextInput keyboardType="numeric" style={[styles.input, { borderColor: '#c0cbd3'}]} ></TextInput>
      <Text>{"\n\n\n"}</Text>

      {/* <Button title="Donate" onPress={() => navigation.navigate('DonationReceipt')}></Button> */}
      <Button title="Donate" onPress={() => write()}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:15,
    justifyContent: 'center',
  },
  title: {
    marginVertical: 30, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 30,
    fontSize: 35, 
    fontWeight: 'bold'
  },
  small: { 
    paddingTop: 30,
    fontSize: 15, 

  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 40,
    color: '#000000',
  },
});

export default DonationForm; 