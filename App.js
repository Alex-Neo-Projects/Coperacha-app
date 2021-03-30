import React from 'react'
import './global'
import { web3, kit } from './root'
import { Image, StyleSheet, Text, TextInput, Button, View, YellowBox } from 'react-native'
import {   
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import CeloCrowdfundContract from './contracts/CeloCrowdfund.json'
import ProjectInstanceContract from './contracts/ProjectInstance.json'

YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])

export default class App extends React.Component {

  // Set the defaults for the state
  state = {
    address: 'Not logged in',
    phoneNumber: 'Not logged in',
    cUSDBalance: 'Not logged in',
    celoCrowdfundContract: {},
    contractName: '',
    textInput: ''
  }

  // This function is called when the page successfully renders
  componentDidMount = async () => {
    
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();
    console.log("NETWORK ID: ", networkId);

    // Get the deployed celo crowdfund contract info for the appropriate network ID
    const deployedNetwork = CeloCrowdfundContract.networks[networkId];
    console.log("Deployed network: ", deployedNetwork);

    // Create a new contract instance with the Project contract info
    const celoCrowdFundinstance = new web3.eth.Contract(
      CeloCrowdfundContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    // CeloCrowdfundContract.options.address = '0x7cAD46456Bd119D28124dfaFA2477bf65f114eEF';
    // Save the contract instance
    this.setState({ celoCrowdfundContract: celoCrowdFundinstance })
  }

  login = async () => {
    
    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = 'login'
    
    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = 'Celo Crowdfunding'
    
    // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
    const callback = Linking.makeUrl('/my/path')
  
    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName,
      callback,
    })
  
    // Wait for the Celo Wallet response
    const dappkitResponse = await waitForAccountAuth(requestId)

    // Set the default account to the account returned from the wallet
    kit.defaultAccount = dappkitResponse.address

    // Get the stable token contract
    const stableToken = await kit.contracts.getStableToken()

    // Get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount)
    
    // Convert from a big number to a string
    let cUSDBalance = cUSDBalanceBig.toString()
    
    // Update state
    this.setState({ cUSDBalance, 
                    isLoadingBalance: false,
                    address: dappkitResponse.address, 
                    phoneNumber: dappkitResponse.phoneNumber })
  }

  read = async () => {
    var projectData = []; 

    await this.state.celoCrowdfundContract.methods.returnProjects().call().then((projects) => {
      projects.forEach((projectAddress) => {
        // const projectInst = crowdfundProject(projectAddress);

        // projectInst.methods.getDetails().call().then((projectData) => {
        //   const projectInfo = projectData;
        //   projectInfo.isLoading = false;
        //   projectInfo.contract = projectInst;
        //   this.projectData.push(projectInfo);
        // });
        projectData.push(projectAddress);
      });
    });

    console.log("Projects: ", projectData);

    var arrLen = "Number of projects created: " + projectData.length;

    // Update state
    this.setState({ contractName: arrLen})
  }

  write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Celo Crowdfunding'
    const callback = Linking.makeUrl('/my/path')

    // Create a transaction object to update the contract

    /* 
      function startProject(
        string calldata title,
        string calldata description,
        string calldata imageLink, 
        uint durationInDays, 
        uint amountToRaise
      )
    */

    const txObject = await this.state.celoCrowdfundContract.methods.startProject('test title', 'hello, this is the first ever project', 'https://images.pexels.com/photos/708392/pexels-photo-708392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 5, 3);
    
    console.log(txObject);

    const networkId = await web3.eth.net.getId();
    console.log("Project address: ", CeloCrowdfundContract.networks[networkId].address);

    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: this.state.address,
          to: '0xF39eF069687c160700D5B2aCa336FE2C3711A48b',
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

    console.log(`Hello World contract update transaction receipt: `, result)  
  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

  render(){

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Button title="Login" 
          onPress={()=> this.login()} />

        <Text style={styles.title}>Account Info:</Text>

        <Text>Current Account Address:</Text>
        <Text>{this.state.address}</Text>
        <Text>Phone number: {this.state.phoneNumber}</Text>
        <Text>cUSD Balance: {this.state.cUSDBalance}</Text>


        <Text style={styles.title}>Read Project List</Text>
        <Button title="Read" 
          onPress={()=> this.read()} />
        <Text>{this.state.contractName}</Text>
        
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
    backgroundColor: '#35d07f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});
