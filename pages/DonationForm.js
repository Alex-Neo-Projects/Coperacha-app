import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DonationForm(props) {
  const navigation = useNavigation();

  // TODO: Get address, project instance contract for below to work!
  // write = async () => {
  //   const requestId = 'fund_projects'
  //   const dappName = 'Coperacha'
  //   const callback = Linking.makeUrl('/my/path')

  //   const txObject = await props.ProjectInstanceContract.methods.contribute().send({
  //     from: props.account, 
  //     value: web3.utils.toWei(this.projectData[index].fundAmount, 'ether'), TODO
  //   });
    
  //   // Send a request to the Celo wallet
  //   requestTxSig(
  //     kit,
  //     [
  //       {
  //         from: props.address,
  //         to: this.props.ProjectInstanceContract._address, // interact w/ address of CeloCrowdfund contract
  //         tx: txObject,
  //         feeCurrency: FeeCurrency.cUSD
  //       }
  //     ],
  //     { requestId, dappName, callback }
  //   )

  //   // Get the response from the Celo wallet
  //   const dappkitResponse = await waitForSignedTxs(requestId)
  //   const tx = dappkitResponse.rawTxs[0]
    
  //   // Get the transaction result, once it has been included in the Celo blockchain
  //   let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

  //   console.log(`Donated to project transaction receipt: `, result)  
  // }

  return (
    <View>
      <Text style={styles.bigText}>Donating to: "Building a new road"</Text>

      <Text style={styles.title}>Name {"\n\n"}</Text>
      <Text style={styles.title}>Donation amount: {"\n\n"}</Text>
      
      <Button title="Donate" onPress={() => navigation.navigate('DonationReceipt')}></Button>
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
    marginVertical: 30, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
});

export default DonationForm; 