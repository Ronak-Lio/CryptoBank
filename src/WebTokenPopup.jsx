import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import EthLogo from "./images/ethLogo.png";
import db from "./firebase";
import Web3 from "web3";
import { parse } from "url";

function WebTokenPopup({
  setOpenWebTokenPopup,
  Eth,
  account,
  CToken,
  webToken,
  webSwap,
}) {
  const [input, setInput] = useState("0");
  const [activeTab, setActiveTab] = useState("Supply");
  const [details, setDetails] = useState([]);
  const [withdrawBalance, setWithdrawBalance] = useState("0");

  useEffect(() => {
    if (account) {
      db.collection("users")
        .doc(account)
        .onSnapshot((snapshot) => {
          setDetails(snapshot.data());
        });
    }
  }, [account]);

  useEffect(() => {
    withDrawnBalance();
    checkBalance();
  }, [details]);

  const checkBalance = async () => {
    const balance = await webToken.methods.balanceOf(account).call();
    console.log("Balance is " + balance);
  };

  const supply = async () => {
    console.log("Methods are running");
    let tokenAmount = input.toString();
    tokenAmount = window.web3.utils.toWei(input, "Ether");

    const name = await webToken.methods.name().call();

    console.log("Name is " + name, input, webToken.methods);

    const tokens = parseInt(input) * 10;


    webToken.methods
      .transfer(webSwap._address, input)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("Successful :)");
      });


      var today = new Date();
        var time = today.getTime();

        webSwap.methods
          .earnCTokens(tokens)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            alert(`Earned ${tokens} CTokens`);
          });

        db.collection("users").doc(account).update({
          investedWebToken: input,
          investedWebTokenAt: time,
        });

        setOpenWebTokenPopup(false);
  };

  const withDrawnBalance = () => {
    if (details?.investedWebToken) {
      var today = new Date();
      var time = today.getTime();

      let x = (time - details.investedWebTokenAt) / (1000 * 60);

      let interest = details?.investedWebToken * x * 0.00001;

      console.log(
        "Interest amount: " + interest + " " + details?.investedWebToken
      );

      if (interest > 1) {
        let finalAmount =
          parseInt(details?.investedWebToken) + parseInt(interest);
        console.log("Integral amount: " + finalAmount);
        setWithdrawBalance(finalAmount);
      } else {
        let finalAmount = parseInt(details?.investedWebToken);
        setWithdrawBalance(finalAmount);
      }
    }
  };

  const withDraw = async () => {
    webSwap.methods
      .withDrawToken(withdrawBalance)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("Transaction successful");

        db.collection("users")
          .doc(account)
          .update({
            investedWebToken: "0",
            investedWebTokenAt: 0,
            collateralValue: {
              ether: details?.investEther,
              webToken: "0",
            },
          });

        setOpenWebTokenPopup(false);
      });
  };

  return (
    <Container>
      <div className="token_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              setOpenWebTokenPopup(false);
            }}
          />
        </div>

        <div className="second_header">
          <p onClick={() => setActiveTab("Supply")}>Supply</p>
          <p onClick={() => setActiveTab("Withdraw")}>WithDraw</p>
        </div>

        {activeTab === "Supply" && (
          <>
            <div className="value_div">
              <p>Enter the supply amount</p>
              <div className="input_box">
                <img
                  src="https://www.pngall.com/wp-content/uploads/4/W-PNG-Clipart.png"
                  alt=""
                  style={{
                    height: "30px",
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginRight: "5px",
                  }}
                />
                <input
                  type="text"
                  placeholder={input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
            <button onClick={supply}>Supply</button>
          </>
        )}

        {activeTab === "Withdraw" && (
          <>
            <div className="value_div">
              <p>Withdraw {withdrawBalance} WebTokens</p>
            </div>
            <button onClick={withDraw}>Withdraw</button>
          </>
        )}
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

export default WebTokenPopup;
