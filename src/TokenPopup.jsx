import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import EthLogo from "./images/ethLogo.png";
import db from "./firebase";
import Web3 from "web3";

function TokenPopup({ setOpenTokenPopup, Eth, account , CToken }) {
  const [input, setInput] = useState("0");
  const [activeTab, setActiveTab] = useState("Supply");
  const[details , setDetails] = useState([]);
  const[withdrawBalance , setWithdrawBalance] = useState('0');

  useEffect(() => {
    if(account){
     db.collection('users').doc(account).onSnapshot((snapshot) => {
         setDetails(snapshot.data())
     })
    }
 } , [account]);

 useEffect(() => {
  withDrawnBalance();
  checkBalance();
 } , [details]);

 const checkBalance = async() => {
   const balance =  await CToken.methods.balanceOf(account);
   console.log("Balance is " + CToken);
 }

  const supply = async () => {
    console.log("Methods are ", Eth.methods);
    let etherAmount;

    let tokens =  (parseInt(input))*10
    etherAmount = input.toString();
    etherAmount = window.web3.utils.toWei(etherAmount, "Ether");

    console.log("Amount is " + tokens);

    Eth.methods
      .investEther(tokens)
      .send({ value: etherAmount, from: account })
      .on("transactionHash", (hash) => {
        
        alert(`Earned ${tokens} CTokens`);

        var today = new Date();
        var time = today.getTime();

        db.collection("users").doc(account).update({
          investEther: etherAmount,
          investedEtherAt: time,
        });
      });

    setOpenTokenPopup(false);
  };

  const withDrawnBalance = () => {
    if(details?.investEther){
        var today = new Date();
        var time = today.getTime();


        let x = (time - details.investedEtherAt)/(1000*60);

    

        let interest = details?.investEther*x*0.00000001;


        let finalAmount = (details?.investEther/(1000000000000000000)) + (interest/(1000000000000000000));

        let finalStringAmount = finalAmount.toString();

        

        let displayedAmount = window.web3.utils.toWei(finalStringAmount, "Ether")

        setWithdrawBalance(finalStringAmount);

       }
}


const withDraw = async () => {
  console.log("Methods are ", Eth.methods);
  let etherAmount;
  etherAmount = withdrawBalance
  etherAmount = window.web3.utils.toWei(etherAmount, "Ether");

  Eth.methods
    .withDrawEther(etherAmount)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      console.log("Transaction Successful");

      db.collection("users").doc(account).update({
        investEther: '0',
        investedEtherAt: 0
      });
    });

  setOpenTokenPopup(false);
};

  return (
    <Container>
      <div className="token_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              setOpenTokenPopup(false);
            }}
          />
        </div>

        <div className="second_header">
          <p onClick={() => setActiveTab('Supply')}>Supply</p>
          <p  onClick={() => setActiveTab('Withdraw')}>WithDraw</p>
        </div>

        {activeTab === 'Supply' && (<>
          <div className="value_div">
            <p>Enter the supply amount</p>
            <div className="input_box">
              <img src={EthLogo} alt="" />
              <input
                type="text"
                placeholder={input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
          <button onClick={supply}>Supply</button>
        </>)}

        {activeTab === 'Withdraw' && (<>
          <div className="value_div">
            <p>Withdraw {withdrawBalance} Ether</p>
          </div>
          <button onClick={withDraw}>Withdraw</button>
        </>)}
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: #858484cc;
  display: flex;
  justify-content: center;
  animation: fadeIn 0.7s;
  align-items: center;

  .token_Popup {
    background-color: #fff;
    width: 400px;
    height: fit-content;
    margin: auto;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.24);
    padding: 10px;

    button {
      margin-top: 20px;
      width: 100%;
      padding: 10px 0 10px 0;
      background-color: rgb(0, 211, 149);
      border: 0;
      border-radius: 5px;
      color: white;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .popup_header {
    display: flex;
    justify-content: flex-end;
  }

  .second_header {
    display: flex;
    justify-content: space-between;
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    font-weight: 500;

    p {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .close_icon {
    margin-right: 5px;
    &:hover {
      color: #6d6969;
      cursor: pointer;
    }
  }

  .value_div {
    margin-top: 20px;
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: left;
      margin-left: 5px;
    }

    .input_box {
      display: flex;
      border: 1px solid lightgray;
      border-radius: 5px;

      img {
        height: 40px;
        object-fit: contain;
      }

      input {
        border: 0;
        outline: none;
        margin-left: 0px;
        font-size: 17px;
      }
    }
  }
`;

export default TokenPopup;
