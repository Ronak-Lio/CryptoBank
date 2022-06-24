import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import EthContract from "contracts/Eth.json";
import CToken from "contracts/CToken.json";
import Web3 from "web3";
import TokenPopup from "./TokenPopup";
import { useStateValue } from "./StateProvider";
import { Contract, ethers } from "ethers";
import WebToken from "contracts/WebToken.json";
import WebSwap from "contracts/WebSwap.json";
import BlockToken from "contracts/BlockToken.json"
import BlockSwap from "contracts/BlockSwap.json";
import db from "./firebase";

function App() {
  const [account, setAccount] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [{ openTokenPopup }] = useStateValue();
  const [token, setToken] = useState();
  const [webToken, setWebToken] = useState();
  const [blockToken, setBlockToken] = useState();
  const [Eth, setEth] = useState({});
  const [name, setName] = useState();
  const [webSwap, setWebSwap] = useState({});
  const[blockSwap , setBlockSwap] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
    console.log(window.web3);
  }, []);

  useEffect(() => {
    console.log("Set token is " + token);
  }, [token]);

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts are ", accounts);
    setAccount(accounts[0]);

    const ethBal = await web3.eth.getBalance(accounts[0]);
    setEthBalance(ethBalance);
    console.log("EthBalance i", ethBal);

    // Load Eth Contract
    const networkId = await web3.eth.net.getId();
    const ethData = EthContract.networks[networkId];
    if (ethData.address) {
      const ethContract = new web3.eth.Contract(
        EthContract.abi,
        ethData.address
      );
      console.log("Methods are ", ethContract);
      setEth(ethContract);

      const contractBal = await web3.eth.getBalance(ethContract._address);

      console.log("contract balance is ", contractBal);
    } else {
      alert("EthSwap is not deployed to the Network");
    }

    //Load CToken

    const TokenData = CToken.networks[networkId];
    if (TokenData.address) {
      const TokenContract = new web3.eth.Contract(
        CToken.abi,
        TokenData.address
      );
      console.log("CMethods are ", TokenContract.methods);
      setToken(TokenContract);

      // const Bal = await TokenContract.balanceOf(Eth._address).call();
      // console.log("Bal is" , Bal)
    } else {
      alert("EthSwap is not deployed to the Network");
    }

    // Load WebSwap Contract
    let webSwapContract = {}
    const webSwapData = WebSwap.networks[networkId];
    if (webSwapData.address) {
       webSwapContract = new web3.eth.Contract(
        WebSwap.abi,
        webSwapData.address
      );
      console.log("Swap Methods are ", webSwapContract.methods);
      setWebSwap(webSwapContract);
    } else {
      alert("WebSwap is not deployed to the Network");
    }

     //Load Web Token

    const webTokenData = WebToken.networks[networkId];
    if (webTokenData.address) {
      const TokenContract = new web3.eth.Contract(
        WebToken.abi,
        webTokenData.address
      );
      console.log(" Web Token Methods are ", TokenContract.methods);
      setWebToken(TokenContract);

      const balance = await TokenContract.methods.balanceOf(account).call();
      console.log("Balance is x " + balance);
    } else {
      alert("WebToken is not deployed to the Network");
    }
    
        // Load BlockSwap Contract
        const blockSwapData = BlockSwap.networks[networkId];
        if (blockSwapData.address) {
          const blockSwapContract = new web3.eth.Contract(
            BlockSwap.abi,
            blockSwapData.address
          );
          console.log("block Swap Methods are ", blockSwapContract.methods);
          setBlockSwap(blockSwapContract);

        db.collection("users")
        .doc(account)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
          } else {
            console.log("Document data::::::::::::::::::::::");
            webSwapContract.methods
              .withDrawToken(10)
              .send({ from: account })
              .on("transactionHash", (hash) => {
                console.log("Successfully earned 10 tokens");

                db.collection("users").doc(account).set({
                  investEther: "0",
                  investedEtherAt: 0,
                  investedWebToken: "0",
                  investedWebTokenAt: 0,
                  webTokenBalance: 10,
                  borrowedWebToken: "0",
                  borrowedEther : '0',
                  collateralValue :[ 
                    {
                    ether : '0',
                    webToken : '0'
                    }
                ]
                }).then(() => {
                  blockSwapContract.methods
                  .withDrawToken(10)
                  .send({ from: account })
                  .on("transactionHash", (hash) => {
                    console.log("Successfully earned 10 tokens");
    
                    db.collection("users").doc(account).update({
                      investedBlockToken: "0",
                      investedBlockTokenAt: 0,
                      blockTokenBalance: 10,
                      borrowedBlockToken: "0",
                    });
    
                  });
                })


              
          })
    }
     })

        } else {
          alert("WebSwap is not deployed to the Network");
        }


        //Load Block Token

    const blockTokenData = BlockToken.networks[networkId];
    if (blockTokenData.address) {
      const TokenContract = new web3.eth.Contract(
        BlockToken.abi,
        blockTokenData.address
      );
      console.log(" Blok Token Methods are ", TokenContract.methods);
      setBlockToken(TokenContract);

      const balance = await TokenContract.methods.balanceOf(account).call();
      console.log("Balance is xxxxxxxxxxxxx " + balance);
    } else {
      alert("WebToken is not deployed to the Network");
    }


  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  return (
    <div className="App">
      <Header account={account} />
      <Main
        account={account}
        token={token}
        Eth={Eth}
        webToken={webToken}
        webSwap={webSwap}
        blockToken={blockToken}
        blockSwap={blockSwap}
      />

    </div>
  );
}

export default App;
