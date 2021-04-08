import React from 'react'
import Home from './pages/Home';
import { web3, kit } from './root'
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
import { Ionicons, Entypo } from '@expo/vector-icons';
import DonationReceipt from './pages/DonationReceipt';
import DonationForm from './pages/DonationForm'; 
import Settings from './pages/Settings';
import CreateReceipt from './pages/CreateReceipt';
import AppOnboarding from './pages/AppOnboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {   
  requestAccountAddress,
  waitForAccountAuth,
} from '@celo/dappkit';
import * as Linking from 'expo-linking';
import AppContext from './components/AppContext'; 

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home}
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
            handleLogIn={props.handleLogIn}
            address={props.address}
            celoCrowdfundContract={props.celoCrowdfundContract}
            />
          }
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="CreateReceipt"  
        component={CreateReceipt}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function ManageStackScreen(props) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Manage"
        children={()=>
          <Manage 
            handleLogIn={props.handleLogIn}
            />
          }
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="Settings"  
        children={()=>
          <Settings 
            handleLogOut={props.handleLogOut}
            handleLogIn={props.handleLogIn}
          />
        }
        options={{ headerShown: false }}
      />

    </HomeStack.Navigator>
  );
}

class App extends React.Component {
  constructor() {
    super(); 
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  state = {
    projectData: [],
    celoCrowdfundContract: '', 
    projectInstanceContract: '', 
    address: 'Not logged in', 
    balance: 'Not logged in', 
    loggedIn: false, 
    onboardingFinished: false, 
  }

  logOut() {
    this.setState({loggedIn: false});
    console.log("logging out");

    const removeLogInData = async () => {
      try {
        await AsyncStorage.removeItem('@userAddress');
        await AsyncStorage.removeItem('@userBalance');

        console.log("Removed user's login data from local storage");
      } catch (e) {
        // saving error
        console.log("Error removing user's login data from local storage in App.js: ", e);
      }
    }
    removeLogInData(); 
  }

  async logIn() {
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
    
    const balance = cUSDBalanceBig / 1E18

    // Convert from a big number to a string
    let cUSDBalance = balance.toString();
    
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('@userAddress', dappkitResponse.address)
        await AsyncStorage.setItem('@userBalance', cUSDBalance)
        
        console.log("Balance: ", cUSDBalance);

        this.setState({loggedIn: true})
        console.log("Saved login data to local storage");
      } catch (e) {
        // saving error
        console.log("Error saving login data to local storage in LogIn.js: ", e);
      }
    }
    storeData();
  }
  
  async getFeedData() {
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
        projectData.push({result: result, projectInstanceContract: projectInstanceContract});
      });
    }

    // Current sort: Most recently created first
    this.setState({ projectData : projectData.reverse() })
    this.setState({ celoCrowdfundContract: celoCrowdfundContract })

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userAddress')
        const userBalance = await AsyncStorage.getItem('@userBalance');
  
        if(value !== null) {
          this.setState({ address: value, balance: userBalance, loggedIn: true })
          console.log("user logged in");
          console.log("BALANCE in App.js: ", this.state.balance);
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
  componentDidMount = async () => {
    const onboard = await AsyncStorage.getItem('@onboardingFinished');
    // await AsyncStorage.setItem("@onboardingFinished", 'false');
    this.setState({ onboardingFinished: onboard })

    this.getFeedData();
  }

  render() {
    return (
      <AppContext.Provider value={{ 
        projectData: this.state.projectData, 
        loggedIn: this.state.loggedIn,
        address: this.state.address,
        balance: this.state.balance, 
        onboardingFinished: this.state.onboardingFinished}}>
        
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home';
                } else if (route.name === 'Create') {
                  iconName = focused 
                    ? 'plus'
                    : 'plus';
                }
                else if (route.name === 'Manage') {
                  iconName = focused 
                    ? 'dots-three-horizontal'
                    : 'dots-three-horizontal';
                }
    
                // You can return any component that you like here!
                return <Entypo name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#35D07F',
              inactiveTintColor: 'gray',
            }}
          > 
          {this.state.onboardingFinished === 'true' ? (
            <>
              <Tab.Screen name="Home"
                children={()=><HomeStackScreen />
                }
              />
              <Tab.Screen name="Create" 
                children={()=><CreateStackScreen 
                  celoCrowdfundContract={this.state.celoCrowdfundContract}
                  handleLogIn={this.logIn}
                  />
                }
              />
              <Tab.Screen name="Manage"
                children={()=><ManageStackScreen  
                  handleLogOut={this.logOut}
                  handleLogIn={this.logIn}
                  />
                }
              />
              </>
          ) : (
            <>
            <Tab.Screen name="Onboarding" component={AppOnboarding}/>
            </>
          )} 
          </Tab.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    );
  }
}

export default App;