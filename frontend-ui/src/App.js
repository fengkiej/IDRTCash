import React, { Component } from 'react';
import { Flex, Box } from 'rimble-ui';
import { MetaMaskButton } from 'rimble-ui';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Flex>
          <Box width={1} height={3} bg={'primary'} m={2} />
          <Box width={1} height={3} bg={'primary'} m={2}>
            <MetaMaskButton.Outline right>Connect with MetaMask</MetaMaskButton.Outline>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default App;
