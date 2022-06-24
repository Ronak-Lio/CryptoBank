import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import EthLogo from "./images/ethLogo.png";
import db from "./firebase";
import Web3 from "web3";

function WebBorrowPopup({
  setOpenWebBorrowPopup,
  Eth,
  account,
  webToken,
  webSwap,
  CToken
}) {
  const [input, setInput] = useState("0");
  const [activeTab, setActiveTab] = useState("Borrow");
  const [details, setDetails] = useState([]);
  const [repayBalance, setRepayBalance] = useState("0");

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
    repayedBalance();
    checkBalance();
  }, [details]);

  const checkBalance = async () => {
    const balance = await CToken.methods.balanceOf(webSwap._address).call();
    console.log("Balance is " + balance);
  };

  const borrow = async () => {

    let tokenAmount = parseInt(input);
     if(tokenAmount <= (0.7*details?.collateralValue[0].webToken)){

      let tokens = tokenAmount*10;

    webSwap.methods
      .borrowTokens(input, tokens)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("Transaction Successful");

        var today = new Date();
        var time = today.getTime();

        db.collection("users").doc(account).update({
          borrowedWebToken: input,
          borrowedWebTokenAt: time,
        });
      });
    }else{
      alert(`Please enter an amount below ${(0.7*details?.collateralValue[0].webToken)}`)
    }

    setOpenWebBorrowPopup(false);
  };

  const repayedBalance = () => {
    if (details?.borrowedWebToken) {
      var today = new Date();
      var time = today.getTime();

      let x = (time - details.borrowedWebTokenAt) / (1000 * 60);

      let interest = details?.borrowedWebToken * x * 0.001;

      console.log("interest" + interest + "  " + details?.borrowedWebToken);

      let finalAmount = parseInt(details?.borrowedWebToken) + parseInt(interest);

      console.log("FinalAmount " + finalAmount );


      let displayedAmount = finalAmount.toString();

      setRepayBalance(displayedAmount);
    }
  };

  const repay = async () => {

      webToken.methods
      .transfer(webSwap._address, repayBalance)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("Successful :)")

        db.collection("users").doc(account).update({
          borrowedWebToken: '0',
          borrowedWebTokenAt: 0
        });

     
      });

    setOpenWebBorrowPopup(false);
  };

  return (
    <Container>
      <div className="token_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              setOpenWebBorrowPopup(false);
            }}
          />
        </div>

        <div className="second_header">
          <p onClick={() => setActiveTab("Borrow")}>Borrow</p>
          <p onClick={() => setActiveTab("Repay")}>Repay</p>
        </div>

        {activeTab === "Borrow" && (
          <>
            <div className="value_div">
              <p>Enter the amount to be borrowed</p>
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
                <p
                  onClick={() => {
                    let x = (0.7 * details?.collateralValue[0].webToken)
                    let y = parseInt(x);
                    setInput(y);
                  }}
                >
                  Max
                </p>
              </div>
            </div>
            <button onClick={borrow}>Borrow</button>
          </>
        )}

        {activeTab === "Repay" && (
          <>
            <div className="value_div">
              <p>Repay {repayBalance} WebToken</p>
            </div>
            <button onClick={repay}>Repay</button>
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
        flex: 1;
      }

      p {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;

export default WebBorrowPopup;
