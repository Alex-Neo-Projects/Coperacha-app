import React, { useContext, useState } from 'react'
import { View, Text, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
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
import { useNavigation } from '@react-navigation/core';
import { Button } from 'react-native-elements';

function DonationForm(props) {
  const navigation = useNavigation();

  var [name, onChangeName] = useState('');
  var [donationAmount, onChangeDonationAmount] = useState(0);

  var title = props.route.params.title;
  
  const appContext = useContext(AppContext);  
  const loggedIn = appContext.loggedIn

  const projectDataContext = appContext.projectData; 

  var projectId = props.route.params.projectId;
  var address = appContext.address; 

  const creatorAddy = props.route.params.creatorAddress;

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
    
    navigation.replace('DonationReceipt', {title: title, creatorAddy: creatorAddy, nav: navigation});
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
          <View>
            <Text style={styles.headerInitial}>Your Donation ❤️</Text>
            <Text style={styles.titleInitial}>This is your donation to</Text>
            <Text style={styles.titleFollow}>{creatorAddy}...</Text>
            <Text style={styles.titleMid}>for <Text style={styles.titleMidFollow}>{title}</Text></Text>


            <Text style={styles.title}>What's your name?</Text>
            <TextInput onChangeText={onChangeName} value={name} placeholder="Kanye West" style={[styles.input, {borderColor: '#c0cbd3'}]}></TextInput>
            
            <Text style={styles.title}>Enter your donation amount </Text>
            <TextInput keyboardType="numeric" onChangeText={onChangeDonationAmount} value={donationAmount.toString()} placeholder="20" style={[styles.input, { borderColor: '#c0cbd3'}]} ></TextInput>
            
            <Button title={"Donate Now"} 
            buttonStyle={styles.createFundraiserButton} 
            titleStyle={styles.fundraiserTextStyle} 
            type="solid"  
            onPress={() => donate()}/>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.centerLogin}>
          <LogIn reason="😱 Uh oh, Login to donate!"></LogIn>
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
    bottom: 50
  },
  headerInitial:{
    fontSize: 30,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginTop: 60,
    marginBottom: 30,
  },
  titleInitial:{
    fontFamily: 'proxima',
    fontSize: 18, 
    color: '#2E3338',
    marginBottom: 5
  },
  titleFollow:{
    fontFamily: 'proximanova_bold',
    fontSize: 20, 
    color: '#35D07F',  
  },
  titleMid:{
    fontFamily: 'proxima',
    fontSize: 17, 
    color: '#2E3338',
    marginTop: 6,
    marginBottom: 5
  },
  titleMidFollow:{
    fontFamily: 'proximanova_bold',
    fontSize: 17, 
    color: '#2E3338',
  },
  centerLogin: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'proximanova_bold',
    fontSize: 20, 
    color: '#2E3338',
    marginTop: 30,
    marginBottom: 20
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
  createFundraiserButton: {
    marginTop: 40,
    height: 40,
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }
});

export default DonationForm; 