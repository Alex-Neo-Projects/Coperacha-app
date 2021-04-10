import { Image, StyleSheet, Dimensions } from 'react-native';
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
              buttonStyle={styles.createFundraiserButton} 
              titleStyle={styles.fundraiserTextStyle} 
              onPress={() => {
                this.props.done();
              }}/>
        } 
      ]}
      ></Onboarding>
    );
  }
}

const styles = StyleSheet.create({
  createFundraiserButton: {
    marginTop: 40,
    height: 40,
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }
})

export default AppOnboarding; 
