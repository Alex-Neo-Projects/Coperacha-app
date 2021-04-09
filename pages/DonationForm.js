import React, { useContext, useState } from 'react'
import { View, Text, Alert, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { kit } from '../root';
import {   
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import AppContext from '../components/AppContext';
import BigNumber from "bignumber.js";
import LogIn from '../components/LogIn';

function DonationForm(props) {
  const navigation = useNavigation();

  [name, onChangeName] = useState('');
  [donationAmount, onChangeDonationAmount] = useState(0);

  var title = props.route.params.title;
  
  const appContext = useContext(AppContext);  
  const loggedIn = appContext.loggedIn

  const projectDataContext = appContext.projectData; 

  var projectId = props.route.params.projectId;
  var address = appContext.address; 

  var projectInstanceContract = projectDataContext[projectId].projectInstanceContract;

  const donate = async () => {
    if(name.length == 0){
      Alert.alert(
        "Add a name!"
      );

      return;
    }

    if(donationAmount == 0){
      Alert.alert(
        "Add a donation amount!"
      );
      
      return;
    }

    const requestId = 'fund_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')
    
    const txObject = await projectInstanceContract.methods.contribute();
    
    const value = new BigNumber(donationAmount * 1e+18);

    // const stableToken = await kit.contracts.getStableToken();
    // // get access to the data 
    // let cUSDtx = await stableToken.transfer(projectInstanceContract._address, value).txo;

    requestTxSig(
      kit,
      [
        {
          from: address,
          to: projectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
          tx: txObject,
          value: value, 
          estimatedGas: 300000,
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

    console.log(`Donated to project transaction receipt: `, result);
    
    navigation.replace('DonationReceipt', {title: title});
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
          <View>
            <Text style={styles.bigText}>Donation</Text>
            <Text style={styles.small}>For: "{title}"</Text>

            <Text style={styles.title}>Name:</Text>
            <TextInput onChangeText={onChangeName} value={name} placeholder="Kanye West" style={[styles.input, { borderColor: '#c0cbd3'}]}></TextInput>
            <Text style={styles.title}>Donation amount: </Text>
            <TextInput keyboardType="numeric" onChangeText={onChangeDonationAmount} value={donationAmount} placeholder="20" style={[styles.input, { borderColor: '#c0cbd3'}]} ></TextInput>
            <Text>{"\n\n\n"}</Text>

            <Button title="Donate" onPress={() => donate()}></Button>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.centerLogin}>
          <LogIn reason="to donate"></LogIn>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:15,
    height:'100%',
  },
  centerLogin: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
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