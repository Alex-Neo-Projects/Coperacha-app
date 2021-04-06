import React, { useEffect, useState } from 'react'
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
import firebaseStorageRef from '../components/Firebase';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


function CreateListing(props) {
  const navigation = useNavigation();
  const [address, setAddress] = useState(props.address);
  
  // Paload info
  const [title, onChangeTitle] = useState('');
  const [description, onChangeDescription] = useState('');
  const [amount, onChangeAmount] = useState(0);
  const [deadline, onChangeDeadline] = useState(0);
  const [image, imageResponse] = useState(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState('');

  // ui
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleChange = (date) => {
    //date is a Date object, convert to unix timestamp
    var currentDate = new Date();
    currentDate = Math.floor(currentDate.getTime()/1000);
    var userDefinedDate = Math.floor(date.getTime()/1000);
    
    var differenceDateTime = Math.ceil((userDefinedDate-currentDate)/3600)/24;
    console.log(differenceDateTime);

    if(differenceDateTime < 0){
      console.log("ERRRRORRRR");

    }else{
      onChangeDeadline(differenceDateTime);
    }
  }

  const handleConfirm = (_) => {   
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
      console.log('IMAGE SELECTED');
      imageResponse(selectedImage.uri);
      firestorePost(selectedImage.uri);
    }
  }

  const firestorePost = async (localImageUrl) => {
    // Transform to blob
    const fetchResponse = await fetch(localImageUrl);
    const blob = await fetchResponse.blob();

    // Change filename
    const storageFileName = localImageUrl.substring(localImageUrl.lastIndexOf('/')+1);
    console.log('storageFileName: ' + storageFileName);

    var uploadImage = firebaseStorageRef.ref('fundraiserImages').child(storageFileName).put(blob);

    uploadImage.on('state_changed', (snapshot) => {
        console.log('Uploading');
    }, (error) => {
        console.log(error);
    }, () => {
        uploadImage.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL);
            setImageDownloadUrl(downloadURL);
        });
    });
  }
  
  const write = async () => {
    const requestId = 'update_projects'
    const dappName = 'Coperacha'
    const callback = Linking.makeUrl('/my/path')

    /* 
    Solidity function: 
    
    function startProject(string calldata title, string calldata description, 
      string calldata imageLink, uint durationInDays, uint amountToRaise)
    */    

    console.log('Days till deadline: ', deadline);
    // Create a transaction object to update the contract
    const txObject = await props.celoCrowdfundContract.methods.startProject(title, description, imageDownloadUrl, deadline, amount);
    console.log('DA ADDY: ' + address);
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
    
    console.log(`Project created contract update transaction receipt: `, result)  
  }
  
  return (
    <View style={styles.container}>
      {props.loggedIn ? ( 
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
            <View >
              <Text style={styles.bigText}>Create Fundraiser</Text>

              {/* Image Picker */}
              <Icon style={styles.image} raised name='photo-camera' onPress={pickImage} />
              {image && <Image source={{ uri: image, cache: 'only-if-cached' }} style={{ width: 200, height: 200 }} />}

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
              <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} onChange={handleChange}/>
              
              {/* Testinggg */}
              <Text style={styles.headers}> {deadline} </Text>
              
              {/* <Button style={{padding: 30}} title="Create Project" onPress={()=> write()} /> */}

              <Button title = "Create Fundraiser" onPress={()=>{
                write();

                // User can't go back
                navigation.replace('CreateReceipt');
              }} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      ) : (
        <View >
          <LogIn reason={"to create a fundraiser"} handleLogIn={props.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30, 
    marginVertical: 40,
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