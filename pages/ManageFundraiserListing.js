import React, { useState, useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Alert} from 'react-native';
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

function ManageFundraiserListing(props) {
  var [loading, setLoading] = useState(false);
  
  const appContext = useContext(AppContext);  
  const projectDataContext = appContext.projectData; 
  
  var projectId = props.route.params.projectId;
  var projectInstanceContract = projectDataContext[projectId].projectInstanceContract;
  
  var loggedIn = props.route.params.loggedIn; 
  var address = appContext.address; 
  
  var data = props.route.params.projectData;
  var title = data['projectTitle'];
  var creatorName = data['projectCreatorName'];
  var image = data['projectImageLink'];
  var goal = data['projectGoalAmount'];
  var description = data['projectDescription'];
  var currentAmount = data['currentAmount'] / 1E18; // Gotta convert from bigNumber to regular integer
  var fundRaisingDeadline = data['fundRaisingDeadline'];
  
  var progress = currentAmount / goal;
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
          to: stableToken.address, // interact w/ address of CeloCrowdfund contract
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

      Alert.alert("Sent cUSD back to your wallet")
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


        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>


        <Text style={styles.amountRaisedText}>${currentAmount.toString()} raised of ${goal} goal.</Text>
        <ProgressBar progress={progress} color='#35D07F' width={350} height={8} style={styles.progress}/>
        
        {loading && 
          <>
            <ActivityIndicator color="#999999" size="large" />
          </>
        }

        <Button title={"Pay Out"} 
          buttonStyle={styles.createFundraiserButton} 
          titleStyle={styles.fundraiserTextStyle} 
          type="solid"  
          disabled={loading}
          onPress={() => alertUser()}/>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sview:{
    backgroundColor: '#FFFFFF',
  },
  image:{
    height: 250, 
    // borderRadius : 15,
    borderColor: '#DDDDDD',
    resizeMode : 'cover', 
    marginBottom: 5
  },
  divider:{
    borderBottomColor: '#ABADAF',
    borderBottomWidth: 1,
  },
  creatorInitialText: {
    fontFamily: 'proxima',
    fontSize: 16, 
    color: '#2E3338',
    marginTop: 5
  }, 
  creatorText: {
    fontFamily: 'proximanova_bold',
    fontSize: 16,
    color: '#2E3338',
  },
  viewStyle: {
    marginLeft: 10,
    marginTop: 5,
  },
  title: {
    fontFamily: 'proximanova_bold',
    fontSize: 30, 
    color: '#2E3338', 
    marginTop: 5
  },
  descriptionTitle:{
    fontFamily: 'proximanova_bold',
    fontSize: 19,
    color: '#2E3338',
    marginTop: 30
  },
  amountRaisedText:{
    fontFamily: 'proximanova_bold',
    fontSize: 18,
    color: '#2E3338',
    marginBottom: 5
  },
  description: {
    fontFamily: 'proxima',
    fontSize: 19,
    color: '#2E3338',
    marginTop: 5,
    marginRight: 10,
    marginBottom: 30
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

export default ManageFundraiserListing;