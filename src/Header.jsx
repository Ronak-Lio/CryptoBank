import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Web3 from "web3";
import db from "./firebase";

function Header({ account }) {
  const [details, setDetails] = useState([]);
  const [supplyBalance, setSupplyBalance] = useState(0);
  const [borrowBalance, setBorrowBalance] = useState(0);

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
    setInterval(function () {
      suppliedBalance();
      borrowedBalance();
    }, 2000);
  }, [details]);

  
  const suppliedBalance = () => {
    if (details?.investEther) {
      var today = new Date();
      var time = today.getTime();

      let x = (time - details.investedEtherAt) / (1000 * 60);

      let interest = details?.investEther * x * 0.00000001;

      let finalAmount1 =
        (details?.investEther / 1000000000000000000) * 1979.84 +
        (interest / 1000000000000000000) * 1979.84;

      let y = (time - details.investedWebTokenAt) / (1000 * 60);

      let interest2 = details?.investedWebToken * y * 0.00001;

      let finalAmount2 = details?.investedWebToken * 10 + interest2 * 10;

      let z = (time - details.investedBlockTokenAt) / (1000 * 60);

      let interest3 = details?.investedBlockToken * z * 0.00003;

      let finalAmount3 = details?.investedBlockToken * 20 + interest3 * 20;

      let finalAmount = finalAmount3 + finalAmount2 + finalAmount1;

      let displayedAmount = finalAmount.toString().slice(0, 10);

      setSupplyBalance(displayedAmount);
    }
  };

  const borrowedBalance = () => {
    if (details?.borrowedEther) {
      var today = new Date();
      var time = today.getTime();

      let x = (time - details.borrowedEtherAt) / (1000 * 60);

      let interest = details?.borrowedEther * x * 0.000001;

      let finalAmount1 =
        (details?.borrowedEther / 1000000000000000000) * 1979.84 +
        (interest / 1000000000000000000) * 1979.84;

      let y = (time - details.borrowedWebTokenAt) / (1000 * 60);

      let interest2 = details?.borrowedWebToken * y * 0.001;

      let finalAmount2 = details?.borrowedWebToken * 10 + interest2 * 10;

      let z = (time - details.borrowedBlockTokenAt) / (1000 * 60);

      let interest3 = details?.borrowedBlockToken * z * 0.002;

      let finalAmount3 = details?.borrowedBlockToken * 20 + interest3 * 20;

      let finalAmount = finalAmount3 + finalAmount2 + finalAmount1;

      let displayedAmount = finalAmount.toString().slice(0, 10);

      setBorrowBalance(displayedAmount);
    }
  };

  // const connectWallet = async() => {
  //     if (typeof window.ethereum !== 'undefined') {
  //         try {
  //             if (!window.ethereum) throw new Error("No crypto wallet found");
  //             await window.ethereum.request({
  //               method: "wallet_addEthereumChain",
  //               params: [
  //                {
  //                 chainId: `0x${Number(137).toString(16)}`,
  //                 chainName: "Polygon Mainnet",
  //                 nativeCurrency: {
  //                   name: "MATIC",
  //                   symbol: "MATIC",
  //                   decimals: 18
  //                 },
  //                 rpcUrls: ["http://localhost:7545"],
  //                 blockExplorerUrls: []
  //                }
  //               ]
  //             });
  //           } catch (err) {
  //             console.error(err);
  //           }
  //       }

  //   }

  return (
    <Container>
      <div className="top">
        <p>Compound</p>
        <button>
          {account ? account.slice(0, 10) + "..." : "Connect Wallet"}
        </button>
      </div>
      <div className="bottom">
        <div className="left">
          <p className="title">Supply balance</p>
          <p>{supplyBalance}$</p>
        </div>
        <div className="middle">
          <p>Net Apy</p>
          <p>1%</p>
        </div>
        <div className="right">
          <p className="title">Borrow balance</p>
          <p>{borrowBalance > 0 ? borrowBalance : 0}$</p>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 40vh;
  background-color: #070a0e;
  padding-top: 20px;

  .top {
    display: flex;
    justify-content: space-between;
    width: 80vw;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;

    p {
      color: white;
      margin-top: 0;
      font-size: 20px;
      font-weight: 600;
    }

    button {
      background-color: transparent;
      border: 2px solid rgb(0, 211, 149);
      color: rgb(0, 211, 149);
      border-radius: 5px;
      height: 35px;
      width: 120px;
      font-weight: 600;
      overflow-x: hidden;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .bottom {
    display: flex;
    width: 60vw;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-around;

    .left {
      margin-top: 35px;
      .title {
        color: rgb(0, 211, 149) !important;
      }

      p {
        color: white;
        margin-top: 0;
        margin-bottom: 5px;
      }
    }

    .right {
      margin-top: 35px;
      .title {
        color: rgb(0, 211, 149) !important;
      }

      p {
        color: white;
        margin-top: 0;
        margin-bottom: 5px;
      }
    }

    .middle {
      color: #cdcccc;
      border: 2px solid rgb(0, 211, 149);
      border-radius: 50%;
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        margin-top: 0;
        margin-bottom: 5px;
      }
    }
  }
`;

export default Header;
