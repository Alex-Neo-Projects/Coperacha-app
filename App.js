import React from 'react'
import Home from './components/Home';
import { web3 } from './root'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FundraiserListing from './components/FundraiserListing';
import CreateListing from './components/CreateListing'; 
import Manage from './components/Manage'; 
import CeloCrowdfundContract from './contracts/CeloCrowdfund.json';
import ProjectInstanceContract from './contracts/ProjectInstance.json';

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();


function HomeStackScreen(props) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" 
        children={()=><Home projectData={props.projectData}/>}
      />
      <HomeStack.Screen name="FundraiserListing"  component={FundraiserListing}
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

    this.setState({ projectData: projectData })
    this.setState({ celoCrowdfundContract: celoCrowdfundContract })
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
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