import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import EthLogo from "./images/ethLogo.png";
import db from "./firebase";
import Web3 from "web3";

function BlockBorrowPopup({
  setOpenBlockBorrowPopup,
  Eth,
  account,
  blockToken,
  blockSwap,
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
    const balance = await CToken.methods.balanceOf(blockSwap._address).call();
    console.log("Balance is " + balance);
  };

  const borrow = async () => {

    let tokenAmount = parseInt(input);
     if(tokenAmount <= (0.7*details?.collateralValue[0].blockToken)){

      let tokens = tokenAmount*10;

    blockSwap.methods
      .borrowTokens(input, tokens)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        alert(`Earned ${tokens} CTokens`);

        var today = new Date();
        var time = today.getTime();

        db.collection("users").doc(account).update({
          borrowedBlockToken: input,
          borrowedBlockTokenAt: time,
        });
      });
    }else{
      alert(`Please enter an amount below ${(0.7*details?.collateralValue[0].blockToken)}`)
    }

    setOpenBlockBorrowPopup(false);
  };

  const repayedBalance = () => {
    if (details?.borrowedBlockToken) {
      var today = new Date();
      var time = today.getTime();

      let x = (time - details.borrowedBlockTokenAt) / (1000 * 60);

      let interest = details?.borrowedBlockToken * x * 0.002;

      console.log("interest" + interest + "  " + details?.borrowedBlockToken);

      let finalAmount = parseInt(details?.borrowedBlockToken) + parseInt(interest);

      console.log("FinalAmount " + finalAmount );


      let displayedAmount = finalAmount.toString();

      setRepayBalance(displayedAmount);
    }
  };

  const repay = async () => {

      blockToken.methods
      .transfer(blockSwap._address, repayBalance)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("Successful :)")

        db.collection("users").doc(account).update({
          borrowedBlockToken: '0',
          borrowedBlockTokenAt: 0
        });

     
      });

    setOpenBlockBorrowPopup(false);
  };

  return (
    <Container>
      <div className="token_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              setOpenBlockBorrowPopup(false);
            }}
          />
        </div>

        <div className="second_header">
          <p onClick={() => setActiveTab("Borrow")}>Borrow</p>
          <p onClick={() => {
            if(repayBalance > 0){
              setActiveTab("Repay")
            }
          }}>Repay</p>
        </div>

        {activeTab === "Borrow" && (
          <>
            <div className="value_div">
              <p>Enter the amount to be borrowed</p>
              <div className="input_box">
              <img
                src="data:image/png;base64,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"
                alt=""
                style={{
                  height: "30px",
                  margin : "5px"
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
                    let x = (0.7 * details?.collateralValue[0].blockToken)
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
              <p>Repay {repayBalance} BlockToken</p>
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

export default BlockBorrowPopup;
