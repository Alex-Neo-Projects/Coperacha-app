import React, { useContext, useState } from 'react'
import { View, ActivityIndicator, Text, Alert, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
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
  var [approveDisabled, setApproveDisabled] = useState(false); 
  var [donationDisabled, setDonationDisabled] = useState(true);
  var [loading, setLoading] = useState(false);

  var title = props.route.params.title;
  
  const appContext = useContext(AppContext);  
  const loggedIn = appContext.loggedIn

  const projectDataContext = appContext.projectData; 

  var projectId = props.route.params.projectId;
  var address = appContext.address; 

  const creatorName = props.route.params.creatorName; 

  var projectInstanceContract = projectDataContext[projectId].projectInstanceContract;

  const approve = async() => {
    if(name.length == 0){
      Alert.alert(
        "Add a name!"
      );

      return;
    }

    if(donationAmount <= 0){
      Alert.alert(
        "Add a donation amount!"
      );
      
      return;
    }
    
    const requestId = 'approve_donation'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')
    
    const value = new BigNumber(donationAmount * 2e+18);
    
    const stableToken = await kit.contracts.getStableToken();
    const txObject = await stableToken.approve(projectInstanceContract._address, value).txo;
    
    requestTxSig(
      kit,
      [
        {
          from: address,
          to: stableToken.address, // send approve to stabletoken address
          tx: txObject, 
          estimatedGas: 300000,
          feeCurrency: FeeCurrency.cUSD
        }
      ],
      { requestId, dappName, callback }
    )
    
    // Get the response from the Celo wallet
    const dappkitResponse = await waitForSignedTxs(requestId)
    const tx = dappkitResponse.rawTxs[0]
    
    setLoading(true);
    setApproveDisabled(true);
    
    // Get the transaction result, once it has been included in the Celo blockchain
    let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

    console.log(`Approve donation transaction receipt: `, result);
    
    setDonationDisabled(false);
    setLoading(false);

    Alert.alert("Now you can click donate")
  }

  const donate = async () => {
    if(name.length == 0){
      Alert.alert(
        "Add a name!"
      );

      return;
    }

    if(donationAmount <= 0){
      Alert.alert(
        "Add a donation amount!"
      );
      
      return;
    }

    const requestId = 'fund_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')
    
    const value = new BigNumber(donationAmount * 1e+18);
    const txObject = await projectInstanceContract.methods.contribute(value);

    requestTxSig(
      kit,
      [
        {
          from: address,
          to: projectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
          tx: txObject,
          estimatedGas: 300000,
          feeCurrency: FeeCurrency.cUSD
        }
      ],
      { requestId, dappName, callback }
    )

    
    // Get the response from the Celo wallet
    const dappkitResponse = await waitForSignedTxs(requestId);
    const tx = dappkitResponse.rawTxs[0];

    setLoading(true);
    setDonationDisabled(true);

    // Get the transaction result, once it has been included in the Celo blockchain
    let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();
    
    console.log(`Donated to project transaction receipt: `, result);
    
    setLoading(false);

    navigation.replace('DonationReceipt', {title: title, creatorName, creatorName, nav: navigation});
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <ScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
            <View>
              <Text style={styles.headerInitial}>Your Donation ❤️</Text>
              <Text style={styles.titleInitial}>This is your donation to <Text style={styles.titleMidFollow}>{creatorName}</Text></Text>
              <Text style={styles.titleMid}>for <Text style={styles.titleMidFollow}>{title}</Text></Text>


              <Text style={styles.title}>What's your name?</Text>
              <TextInput onChangeText={onChangeName} value={name} placeholder="Kanye West" style={[styles.input, {borderColor: '#c0cbd3'}]}></TextInput>
              
              <Text style={styles.title}>Enter your donation amount </Text>
              <TextInput keyboardType="numeric" onChangeText={onChangeDonationAmount} value={donationAmount.toString()} placeholder="20" style={[styles.input, { borderColor: '#c0cbd3'}]} ></TextInput>
              
              <Button title={"Approve Donation"} 
              buttonStyle={styles.createFundraiserButton} 
              titleStyle={styles.fundraiserTextStyle} 
              type="solid"  
              disabled={approveDisabled}
              onPress={() => approve()}/>

              {loading && 
                <>
                  <Text  style={styles.title}>Transaction pending...{"\n"}</Text>
                  <ActivityIndicator size="large" />
                </>
              }

              <Button title={"Donate"} 
              buttonStyle={styles.createFundraiserButton} 
              titleStyle={styles.fundraiserTextStyle} 
              type="solid"  
              disabled={donationDisabled}
              onPress={() => donate()}/>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
    // bottom: 50
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