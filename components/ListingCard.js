import React from 'react'
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function ListingCard(props) {
  const navigation = useNavigation();

  console.log('yop');
  console.log(props.projectData);

  return (
    <Button
      title={`Go to fundraiser`}
      onPress={() => navigation.navigate('Fundraiser')}
    />
  );
}

export default ListingCard;