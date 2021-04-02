import React from 'react'
import Home from './components/Home';
import { web3 } from './root'
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FundraiserListing from './components/FundraiserListing';
import CreateListing from './components/CreateListing'; 
import Manage from './components/Manage'; 
import CeloCrowdfundContract from './contracts/CeloCrowdfund.json';
import ProjectInstanceContract from './contracts/ProjectInstance.json';
import { Ionicons } from '@expo/vector-icons';
import DonationReceipt from './components/DonationReceipt';
import DonationForm from './components/DonationForm'; 

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
class App extends React.Component {
  state = {
    projectData: [],
    celoCrowdfundContract: '', 
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
              // } else if (route.name === 'Settings') {
              //   iconName = focused ? 'ios-list-box' : 'ios-list';
              // }
  
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
            children={()=><HomeStackScreen projectData={this.state.projectData} />}
          />
          <Tab.Screen name="Create" 
            children={()=><CreateListing celoCrowdfundContract={this.state.celoCrowdfundContract} />}
          />
          <Tab.Screen name="Manage" component={Manage} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;