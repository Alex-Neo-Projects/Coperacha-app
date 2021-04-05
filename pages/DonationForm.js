import React, { useContext } from 'react'
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
import DataContext from '../components/DataContext';

function DonationForm(props) {
  const navigation = useNavigation();

  var title = props.route.params.title;
  
  const projectDataContext = useContext(DataContext);
  var projectId = props.route.params.projectId;
  var address = props.route.params.address; 
  

  var projectInstanceContract = projectDataContext[projectId].projectInstanceContract

  console.log("address: ", address);
  console.log("Project address: ", projectInstanceContract._address);
  
  const donate = async () => {
    const requestId = 'fund_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    const txObject = await projectInstanceContract.methods.contribute();
   
    requestTxSig(
      kit,
      [
        {
          from: address,
          value: 1000000000000000000, // 1 CELO 
          to: projectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
          tx: txObject,
          estimatedGas: 200000,
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

      {/* <Button title="Donate" onPress={() => navigation.navigate('DonationReceipt', {title: title})}></Button> */}
      <Button title="Donate" onPress={() => donate()}></Button>
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