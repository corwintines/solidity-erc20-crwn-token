// Libraries
import React, { Component } from "react";

// Contracts
import Token from './build/contracts/Token.json'

// Styles
import "./App.css";

// Utils
import getWeb3 from './getWeb3'

class App extends Component {
  state = {
    web3: null,
    account: null,
    contract: null,
    balance: null,
    sendAmount: '',
    sendAddress: '',
  }

  componentDidMount = async () => {
    // Get web3 instance
    const web3 = await getWeb3();
    
    // Use web3 to get access to users account
    const account = await web3.eth.getAccounts();

    // Get Token contract
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Token.networks[networkId];
    const contract = new web3.eth.Contract(
      Token.abi,
      deployedNetwork && deployedNetwork.address,
    );

    this.setState({web3, account: account[0], contract}, this.getUserBalance)
  };

  getUserBalance = async () => {
    // Get balance in wei
    const balanceInWei = await this.state.contract.methods.balanceOf(this.state.account).call()
    const balance = await this.state.web3.utils.fromWei(balanceInWei)
    this.setState({balance})
  }

  sendTransaction = async () => {
    const weiAmount = await this.state.web3.utils.toWei(this.state.sendAmount)
    await this.state.contract.methods.transfer(this.state.sendAddress, weiAmount).send({from: this.state.account})
    this.getUserBalance()
  }

  render() {
    return (
      <div className="Container">
        <div className="App">
          <h1>CRWN Trade</h1>
          <p>Balance: {this.state.balance} CRWN</p>
          <div className="Input">
            <label for="sendAmount">Send Amount: </label>
            <input id="sendAmount" name="sendAmount" type="number" onChange={(e) => this.setState({sendAmount: e.target.value})} />
          </div>
          <div className="Input">
            <label for="sendAddress">Send Address:</label>
            <input id="sendAddress" name="sendAddress" onChange={(e) => this.setState({sendAddress: e.target.value})} />
          </div>
          <button className="Button" onClick={this.sendTransaction}>Send CRWN</button>
        </div>
      </div>
    );
  }
}

export default App;
