import { createContext } from 'react';

const AppContext = createContext({
  projectData: '',
  loggedIn: false,
  address: 'NOT LOGGED IN',
  balance: 'NOT LOGGED IN'
})

export default AppContext; 
