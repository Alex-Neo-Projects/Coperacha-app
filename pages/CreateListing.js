import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, Image, Alert } from 'react-native';
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
import AppContext from '../components/AppContext';
import { Button } from 'react-native-elements';

function CreateListing(props) {
  const navigation = useNavigation();
  
  // Get context variables
  const context = useContext(AppContext);
  const address = context.address; 
  const loggedIn = context.loggedIn; 

  // Paload info
  const [title, onChangeTitle] = useState('');
  const [description, onChangeDescription] = useState('');
  const [amount, onChangeAmount] = useState(0);
  const [deadline, onChangeDeadline] = useState(0);
  const [image, imageResponse] = useState(null);
  const [imageState, setImageState] = useState('No Image Selected'); 
  const [imageDownloadUrl, setImageDownloadUrl] = useState('');

  // ui
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  var currentDate = new Date();
  console.log(currentDate);

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
      onChangeDeadline(0);
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
      setImageState('Image Uploading');
    }, (error) => {
        setImageState(null);
    }, () => {
        uploadImage.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL);
            setImageDownloadUrl(downloadURL);
            setImageState('Image Uploaded');
        });
    });
  }
  
  const write = async () => {
    //problem with image upload
    if(imageState == null){
      Alert.alert(
        "Reupload image!"
      ); 

      return;
    }

    if(title.length == 0){
      Alert.alert(
        "Add a title!"
      );

      return;
    }

    if(description.length == 0){
      Alert.alert(
        "Add a description!"
      );

      return;
    }

    // if fundraising amount is 0 then alert 
    if(amount <= 0){
      Alert.alert(
        "Fundraising amount must be greater than 0 cUSD!"
      ); 

      return;
    }

    if(deadline == 0){
      Alert.alert(
        "Add a deadline!"
      );

      return;
    }

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
  
    console.log(`Project created contract update transaction receipt: `, result);

    // User can't go back
    navigation.replace('CreateReceipt');
  }


  
  return (
    <View style={styles.entireThing}>
      {loggedIn ? ( 
        <ScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
              <View>
                <Text style={styles.headerInitial}> Create <Text style={styles.header}>Fundraiser </Text> </Text>
                  <View > 
                  
                    {/* Image Picker */}
                    <View style={styles.imagePickerView}> 
                      <Icon style={styles.image} raised name='photo-camera' size={18} onPress={pickImage} />
                      <Text style={styles.imageStateText}> {imageState} </Text>
                      {image && <Image source={{ uri: image, cache: 'only-if-cached' }} style={styles.imagePreview} />}

                    </View> 
                    
                    {/* Title  */}
                    <Text style={styles.headers}>Title</Text>
                    <TextInput style={styles.textbox} onChangeText={onChangeTitle} onSubmitEditing={Keyboard.dismiss} placeholder='Title' maxLength={50} value={title}/>

                    {/* Description */}
                    <Text style={styles.headers}>Description</Text>
                    <TextInput multiline={true} numberOfLines={10} style={styles.textboxDescription} onChangeText={onChangeDescription} placeholder='Description' maxLength={300} value={description}/>
                    
                    {/* Amount to raise (cUSD) */}
                    <Text style={styles.headers}>Fundraising amount (cUSD)</Text>
                    <TextInput style={styles.textbox} keyboardType='numeric' onChangeText={onChangeAmount} placeholder='Amount' value={amount}/>
          
                    {/* Deadline */}
                    <Button title="Pick a deadline" buttonStyle={styles.deadlineButton} titleStyle={styles.deadlineTextStyle} onPress={showDatePicker} raised={true}  type="outline"/>
                    <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} onChange={handleChange}/>
                    
                    <Text style={styles.deadlineText}> {deadline} days from now </Text>

                    <Button style={styles.createFundraiserButton} buttonStyle={styles.fundraiserButtonStyle} titleStyle={styles.fundraiserTextStyle} raised={true}  type="outline" title = "Create Fundraiser" onPress={()=>{
                      write();
                    }} />
                  
                  </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
      ) : (
        <View style={styles.centerLogin}>
          <LogIn reason={"to create a fundraiser"} handleLogIn={context.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entireThing: {
    height: '100%',
  },
  container: {
    marginLeft: 10,
    alignItems : 'flex-start',
    justifyContent : 'flex-start',
  },
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',

    marginTop: 60,
    marginLeft: 10,
  },
  headers:{
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginLeft: 4,
    marginRight: 10,
    marginBottom: 6
  },
  imagePickerView: {
    flexDirection: "row",
    marginTop: 10, 
    marginBottom: 10,
  },
  imageStateText: {
    marginTop: 18
  }, 
  imagePreview: {
    marginLeft: 140, 
    width: 50, 
    height: 50
  },
  textbox: {
    minHeight: 40,
    width: Dimensions.get('window').width - 20,
    marginLeft: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    borderWidth: 1.3,
    borderRadius: 10,
    borderColor: '#ABADAF'
  }, 
  textboxDescription: {
    minHeight: 100,
    width: Dimensions.get('window').width - 20,
    marginLeft: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    borderWidth: 1.3,
    borderRadius: 10,
    borderColor: '#ABADAF'
  },
  deadlineText: {
    fontFamily: 'proxima',
    color: '#2E3338',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 50
  },
  deadlineButton: {
    borderColor: '#DDDDDD'
  }, 
  deadlineTextStyle: {
    fontFamily: 'proxima',
    fontSize: 18, 
    color: '#2E3338'
  },
  createFundraiserButton: {
    borderColor: '#DDDDDD',
    width: Dimensions.get('window').width - 20,
  }, 
  centerLogin: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  fundraiserButtonStyle: {
    borderColor: '#DDDDDD'
  },
  fundraiserTextStyle: {
    fontFamily: 'proxima',
    fontSize: 18, 
    color: '#2E3338'
  }
});

export default CreateListing;