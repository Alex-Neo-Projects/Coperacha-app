import React from 'react'
import Home from './pages/Home';
import { web3 } from './root'
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FundraiserListing from './pages/FundraiserListing';
import CreateListing from './pages/CreateListing'; 
import Manage from './pages/Manage'; 
import CeloCrowdfundContract from './contracts/CeloCrowdfund.json';
import ProjectInstanceContract from './contracts/ProjectInstance.json';
import { Ionicons } from '@expo/vector-icons';
import DonationReceipt from './pages/DonationReceipt';
import DonationForm from './pages/DonationForm'; 
import CreateReceipt from './pages/CreateReceipt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen(props) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" 
        children={()=><Home projectData={props.projectData}/>}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="FundraiserListing"  
        component={FundraiserListing}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="DonationReceipt"  
        component={DonationReceipt}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="DonationForm"  
        component={DonationForm}
        options={{ headerShown: false }}
      />
  
    </HomeStack.Navigator>
  );
}

function CreateStackScreen(props) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Create"
        children={()=>
          <CreateListing 
            loggedIn={props.loggedIn}
            address={props.address}
            celoCrowdfundContract={props.celoCrowdfundContract}
            options={{ headerShown: false }}/>}
      />
      <HomeStack.Screen name="CreateReceipt"  
        component={CreateReceipt}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}
class App extends React.Component {
  state = {
    projectData: [],
    celoCrowdfundContract: '', 
    address: 'Not logged in', 
    balance: 'Not logged in', 
    loggedIn: false
  }

  componentDidMount = async () => {
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();
    console.log("NETWORK ID: ", networkId);

    // Get the deployed celo crowdfund contract info for the appropriate network ID
    const deployedNetwork = CeloCrowdfundContract.networks[networkId];
    console.log("Deployed network: ", deployedNetwork);

    // Create a new contract instance with the Project contract info
    const celoCrowdfundContract = new web3.eth.Contract(
      CeloCrowdfundContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    var projectData = []; 
 
    // Return results inside each individual project
    var result = await celoCrowdfundContract.methods.returnProjects().call();
  
    /* Note: For some reason using forEach is asynchronous, but for...of  
       maintains the synchronous results of using await. 
    */
    for (const projectAddress of result) {  
      const projectInstanceContract = new web3.eth.Contract(
        ProjectInstanceContract.abi,
        deployedNetwork && projectAddress
      );
  
      await projectInstanceContract.methods.getDetails().call().then((result) => {
        projectData.push(result);
      });
    }

    // Current sort: Most recently created first
    this.setState({ projectData: projectData.reverse() })
    this.setState({ celoCrowdfundContract: celoCrowdfundContract })

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userAddress')
        const userBalance = await AsyncStorage.getItem('@userBalance');
  
        if(value !== null) {
          this.setState({ address: value, balance: userBalance, loggedIn: true })
          console.log("user logged in");
        }
        else {
          console.log('User not logged in');
        }
      } catch(e) {
        // error reading value
        console.log("Error: ", e);
      }
    }
    getData()
  }

  render() {
    return (
      <NavigationContainer>
        <StatusBar  barStyle="dark-content" />

        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'Create') {
                iconName = focused 
                  ? 'add-circle'
                  : 'add-circle-outline';
              }
              else if (route.name === 'Manage') {
                iconName = focused 
                  ? 'cog-outline'
                  : 'cog-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#35D07F',
            inactiveTintColor: 'gray',
          }}
        > 
          <Tab.Screen name="Home"
            children={()=><HomeStackScreen 
              projectData={this.state.projectData} 
              loggedIn={this.state.loggedIn}/>}
          />
          <Tab.Screen name="Create" 
            children={()=><CreateStackScreen 
              loggedIn={this.state.loggedIn}
              address={this.state.address}
              celoCrowdfundContract={this.state.celoCrowdfundContract}
            />}
          />
          <Tab.Screen name="Manage"
            children={()=><Manage  
              projectData={this.state.projectData} 
              loggedIn={this.state.loggedIn}/>}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;