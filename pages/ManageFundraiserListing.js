import React, { useState, useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Alert, TouchableWithoutFeedback} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import CachedImage from 'react-native-expo-cached-image';
import { Button } from 'react-native-elements';
import { kit } from '../root';
import {   
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import AppContext from '../components/AppContext';
import { useNavigation } from '@react-navigation/core';
import normalize from 'react-native-normalize';

function ManageFundraiserListing(props) {
  var navigation = useNavigation(); 

  var [loading, setLoading] = useState(false);
  
  const appContext = useContext(AppContext);  
  const projectDataContext = appContext.projectData; 
  
  var projectId = props.route.params.projectId;
  var projectInstanceContract = projectDataContext[projectId].projectInstanceContract;
  
  var loggedIn = props.route.params.loggedIn; 
  var address = appContext.address; 
  
  var data = props.route.params.projectData;

  var currentState = '';
  
  if (data['currentState'] === '0') {
    currentState = "Fundraising"; 
  }
  else if (data['currentState'] === '1') {
    currentState = "Expired"; 
  }
  else {
    currentState = "Successful"; 
  }

  var title = data['projectTitle'];
  var creatorName = data['projectCreatorName'];
  var image = data['projectImageLink'];
  var goal = data['projectGoalAmount'];
  var description = data['projectDescription'];
  var totalRaised = data['projectTotalRaised'] / 1E18;
  var currentAmount = data['currentAmount'] / 1E18; // Gotta convert from bigNumber to regular integer
  var fundRaisingDeadline = data['fundRaisingDeadline'];
  
  var progress = totalRaised / goal;
  let imageURL ={ uri: image};
  
  const alertUser = () => {
    Alert.alert(
      "This will end the fundraiser",
      "Are you sure you want to withdraw funds?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => payOut() }
      ]
    );
  }
  const payOut = async () => {  
    console.log("PAY OUT!");
    const requestId = 'pay_out_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    /* 
    Solidity function: 
    
    function startProject(string calldata title, string calldata description, 
      string calldata imageLink, uint durationInDays, uint amountToRaise)
    */    

    const stableToken = await kit.contracts.getStableToken();

    // Create a transaction object to update the contract
    const payOut = await projectInstanceContract.methods.payOut();
    
    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: address,
          to: projectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
          tx: payOut,
          feeCurrency: FeeCurrency.cUSD
        }
      ],
      { requestId, dappName, callback }
    )

    // Get the response from the Celo wallet
    const dappkitResponse = await waitForSignedTxs(requestId)
    const tx = dappkitResponse.rawTxs[0]
    
    setLoading(true); 

    try {
      let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();

      setLoading(false); 
      // Get the transaction result, once it has been included in the Celo blockchain
      console.log(`Project payOut transaction receipt: `, result);

      Alert.alert("Sent cUSD back to your wallet");
      navigation.popToTop()
    }
    catch (e) {
      var exception = e.toString(); 

      Alert.alert("A transaction error occurred. Please try again");
      setLoading(false); 
      
      console.log("Error caught:", exception);
    }
  }

  return (
    <ScrollView style={styles.sview}>
      <View style={styles.fill}>
        <CachedImage source={imageURL} style={styles.image} />
      </View>

      <View style={styles.viewStyle}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.creatorInitialText}>⭐️ Created by <Text style={styles.creatorText}>{creatorName}</Text> </Text>
        <Text style={styles.creatorInitialText}>❓ Status: <Text style={styles.creatorText}>{currentState} </Text> </Text>


        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>


        <Text style={styles.amountRaisedText}>${totalRaised.toString()} raised of ${goal} goal</Text>
        <ProgressBar progress={progress} color='#35D07F' width={350} height={8} style={styles.progress}/>
        
        {loading && 
          <>
            <ActivityIndicator color="#999999" size="large" />
          </>
        }

        {currentState === "Fundraising" ? (
          <Button title={"Pay Out"}
            TouchableComponent={TouchableWithoutFeedback}
            buttonStyle={styles.createFundraiserButton} 
            titleStyle={styles.fundraiserTextStyle} 
            type="solid"  
            disabled={loading}
            onPress={() => alertUser()}/>
        ) : (
          <Text style={styles.fundraisingEnded}>This fundraiser has ended. The funds been sent to your wallet.</Text>
        )}
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sview:{
    backgroundColor: '#FFFFFF',
   },
  image:{
    height: normalize(250), 
    // borderRadius : 15,
    borderColor: '#DDDDDD',
    resizeMode : 'cover', 
    marginBottom: normalize(5)
  },
  divider:{
    borderBottomColor: '#ABADAF',
    borderBottomWidth: normalize(1),
  },
  creatorInitialText: {
    fontFamily: 'proxima',
    fontSize: 16, 
    color: '#2E3338',
    marginTop: normalize(5)
  }, 
  creatorText: {
    fontFamily: 'proximanova_bold',
    fontSize: normalize(16),
    color: '#2E3338',
  },
  viewStyle: {
    marginLeft: normalize(10),
    marginTop: normalize(5),
  },
  title: {
    fontFamily: 'proximanova_bold',
    fontSize: 30, 
    color: '#2E3338', 
    marginTop: normalize(5)
  },
  descriptionTitle:{
    fontFamily: 'proximanova_bold',
    fontSize: 19,
    color: '#2E3338',
    marginTop: normalize(30)
  },
  amountRaisedText:{
    fontFamily: 'proximanova_bold',
    fontSize: 18,
    color: '#2E3338',
    marginBottom: normalize(5)
  },
  description: {
    fontFamily: 'proxima',
    fontSize: 19,
    color: '#2E3338',
    marginTop: normalize(5),
    marginRight: normalize(10),
    marginBottom: normalize(30)
  },
  createFundraiserButton: {
    marginTop: normalize(40),
    height: normalize(40),
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }, 
  fundraisingEnded: {
    marginTop: normalize(30),
    fontFamily: 'proxima',
    fontSize: 18, 
    marginRight: normalize(10)
  }
});

export default ManageFundraiserListing;