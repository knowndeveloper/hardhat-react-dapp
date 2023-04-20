import './App.css';
import { useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import MyContract from './artifacts/contracts/MyContract.sol/MyContract.json';

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const lockAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const mycontractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

function App() {
  console.log("Greeter ABI: ", Greeter.abi);
  console.log("Lock ABI: ", Lock.abi);
  console.log("MyContract ABI: ", MyContract.abi);

  // store greeting in local state
  const [greeting, setGreetingValue] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
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

  // call the smart contract, read the current greeting value
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

  // call the smart contract, read the current greeting value
  async function fetchGetValue() {
    if (typeof window.ethereum !== 'undefined') {
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // const contract = new ethers.Contract(mycontractAddress, MyContract.abi, provider)
      // try {
      //   const data = await contract.add()
      //   console.log('data: ', Number(data))
      // } catch (err) {
      //   console.log("Error: ", err)
      // }

      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(mycontractAddress, MyContract.abi, signer)
      const s1 = 44;
      const s2 = 33;
      const transaction = await contract.setValue(Number(s1), Number(s2))
      await transaction.wait()
    }
  }

  // call the smart contract, send an update
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

  // call the smart contract, send an update
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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <hr />
        <button onClick={fetchLock}>Fetch owner</button>
        <button onClick={lockWithdraw}>WithDraw</button>
        <hr />
        <button onClick={fetchGetValue}>Fetch getValue</button>
      </header>
    </div>
  );
}

export default App;
