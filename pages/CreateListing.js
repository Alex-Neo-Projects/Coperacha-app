import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Button, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { kit } from '../root';
import { useNavigation } from '@react-navigation/native';
import {   
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency
} from '@celo/dappkit';
import { toTxResult } from "@celo/connect";
import * as Linking from 'expo-linking';
import LogIn from '../components/LogIn';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


function CreateListing(props) {
  const navigation = useNavigation();
  const [address, setAddress] = useState(props.address);
  
  const [title, onChangeTitle] = useState('');
  const [description, onChangeDescription] = useState('');
  const [amount, onChangeAmount] = useState('');
  const [deadline, onChangeDeadline] = useState('');
  const [image, imageResponse] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    //date is a Date object
    onChangeDeadline(date);
    hideDatePicker();
  };


  const pickImage = async () => {
    let selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    });
    
    console.log(selectedImage);

    if(!selectedImage.cancelled){
      imageResponse(selectedImage.uri);
    }
  }

  console.log("Create: ", props.logIn);
  console.log('Address: ', address);
  
  const write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    /* 
    Solidity function: 
    
    function startProject(string calldata title, string calldata description, 
      string calldata imageLink, uint durationInDays, uint amountToRaise)
    */
     
     // Create a transaction object to update the contract
    const txObject = await props.celoCrowdfundContract.methods.startProject('Building a new road', 'We need a new road to connect the two sides of town. We are asking for $900 cUSD in order to build this road. ', 'https://i.imgur.com/elTnbFf.png', 5, 900);
    
    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: address,
          to: props.celoCrowdfundContract._address, // interact w/ address of CeloCrowdfund contract
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
    console.log('here')
    console.log(`Project created contract update transaction receipt: `, result)  
  }

  const submit = async () => {
    const payload = {
      'title': title, 
      'description': description, 
      'amount': amount,
      'deadline': deadline, 
      'img': null
    };

    console.log(payload);
  };
  
  return (
    <View>
      {props.loggedIn ? ( 
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
          <View>
            <Text style={styles.title}>Create your fundraiser</Text>
        <View>
          <Text style={styles.bigText}>Create a Fundraiser{"\n\n\n\n\n"}</Text>
          <Button style={{padding: 30}} title="Create Fundraiser" 
            onPress={()=> write()} />

            {/* Image Picker */}
            <Icon style={styles.image} raised name='photo-camera' onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

            {/* Title  */}
            <Text style={styles.headers}>Title</Text>
            <TextInput style={styles.textbox} onChangeText={onChangeTitle} onSubmitEditing={Keyboard.dismiss} placeholder='Title' value={title}/>

            {/* Description */}
            <Text style={styles.headers}>Description</Text>
            <TextInput multiline={true} numberOfLines={10} style={styles.textboxDescription} onChangeText={onChangeDescription} placeholder='Description' value={description}/>
            
            {/* Amount to raise (cUSD) */}
            <Text style={styles.headers}>Fundraising amount (cUSD)</Text>
            <TextInput style={styles.textbox} keyboardType='numeric' onChangeText={onChangeAmount} placeholder='Amount' value={amount}/>
  
            {/* Deadline */}
            <Button title="Pick a deadline" onPress={showDatePicker} />
            <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker}/>
            
            {/* Testinggg */}
            <Text style={styles.headers}> {Date(deadline)} </Text>
            
            <Button style={{padding: 30}} title="Create Project" onPress={()=> write()} />

            <Button title = "Submit" onPress={submit} />
            {/* <Button title = "Submit" onPress={()=> navigation.navigate('CreateReceipt')} /> */}

          </View>
        </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.container}>
          <LogIn reason={"to create a fundraiser"} handleLogIn={props.handleLogIn}/>
        </View>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30, 
    marginBottom: 20,
    fontWeight: 'bold'
  }, 
  headers: {
    fontSize: 20, 
    fontWeight: 'bold'
  },
  image: {
    marginBottom: 10
  },
  textbox: {
    minHeight: 40,
    width: Dimensions.get('window').width - 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    borderWidth: 1.3,
    borderRadius: 10
  }, 
  textboxDescription: {
    minHeight: 100,
    width: Dimensions.get('window').width - 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    borderWidth: 1.3,
    borderRadius: 10
  }
});

export default CreateListing;