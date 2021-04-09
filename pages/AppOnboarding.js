import { Image } from 'react-native';
import React from 'react'; 
import Onboarding from 'react-native-onboarding-swiper';
import { Button } from 'react-native';

class AppOnboarding extends React.Component {
  render(){
    return (
      <Onboarding
      skipLabel=''
      showPagination={true}
      showDone={false}
      pages={[
        {
          backgroundColor: '#F8F6F0',
          image: <Image style={{height:300, width: 300}} source={require('../assets/icon-white.png')}/>,
          title: 'In Mexico, "hacer coperacha" means to raise money for a shared goal',
          subtitle: '',
        },
        {
          backgroundColor: '#F8F6F0',
          image: <Image style={{height:300, width: 300}} source={require('../assets/valora-pic.png')} />,
          title: 'The Coperacha app is fundraising for you and your community',
          subtitle: ''
        },
        {
          backgroundColor: '#F8F6F0',
          image: <Image style={{height:300, width: 300}} source={require('../assets/table.png')}/>,
          title: 'To use Coperacha you will need a Celo test wallet installed',
          subtitle: 
            <Button
              title={'Get Started with Coperacha'}
              onPress={() => {
                this.props.done();
              }}/>
        } 
      ]}
      ></Onboarding>
    );
  }
}

export default AppOnboarding; 
