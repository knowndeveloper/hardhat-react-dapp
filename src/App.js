import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';

import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
// import MyContract from './artifacts/contracts/IMyContract.sol/IMyContract.json';
import MyContract from './artifacts/contracts/MyContract.sol/MyContract.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const lockAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const mycontractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  console.log("Lock ABI: ", Lock.abi);
  console.log("Greeter ABI: ", Greeter.abi);
  console.log("MyContract ABI: ", MyContract.abi);
  console.log("Token ABI: ", Token.abi);

  const [greeting, setGreetingValue] = useState();
  const [mycontractAmount, setMyContractAmount] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchLock() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider)
      try {
        const data1 = await contract.unlockTime();
        const data2 = await contract.owner();
        const date = new Date(Number(data1) * 1000);
        const dateFormat = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ", " + date.toDateString();
        console.log('data-unlockTime: ', Number(data1), ' > ', dateFormat);
        console.log('data-owner: ', data2);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function lockWithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer)
      const transaction = await contract.withdraw()
      await transaction.wait()
    }
  }
  
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function fetchGetValue() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(mycontractAddress, MyContract.abi, provider)
      try {
        const data = await contract.add()
        const data2 = await contract.getStr()
        const data3 = await contract.num2()
        console.log('data-add(): ', Number(data))
        console.log('data-getStr(): ', data2)
        console.log('data-num2(): ', Number(data3))
      } catch (err) {
        console.log("Error: ", err)
      }

      // await requestAccount()
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner()
      // const contract = new ethers.Contract(mycontractAddress, MyContract.abi, signer)
      // const transaction = await contract.setValue(15, 11)
      // await transaction.wait()
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchLock}>Fetch owner</button>
        <button onClick={lockWithdraw}>WithDraw</button>
        <hr />
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <hr />
        <button onClick={fetchGetValue}>Fetch getValue</button>
        <input onChange={e => setMyContractAmount(e.target.value)} placeholder="MyContract Amount" />
        <hr />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Coin Amount" />
      </header>
    </div>
  );
}

export default App;
