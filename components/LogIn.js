import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';

function LogIn(prop) {
  const [address, setAddress] = useState('not logged in');

  const login = async () => {
    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = 'login';
    
    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = 'Coperacha';
    
    // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
    const callback = Linking.makeUrl('/my/path');
  
    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName,
      callback,
    });
  
    // Wait for the Celo Wallet response
    const dappkitResponse = await waitForAccountAuth(requestId);

    // Set the default account to the account returned from the wallet
    kit.defaultAccount = dappkitResponse.address;

    // Get the stable token contract
    const stableToken = await kit.contracts.getStableToken();

    // Get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount);
    
    // Convert from a big number to a string
    let cUSDBalance = cUSDBalanceBig.toString();
    
    setAddress(dappkitResponse.address);

  }
  return(
    <View>
      <Text style={styles.title}>Login {prop.reason}</Text>
      <Button title="Login" 
        onPress={()=> login()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default LogIn;
