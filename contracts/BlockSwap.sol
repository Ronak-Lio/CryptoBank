pragma solidity 0.5.16;

import "./BlockToken.sol";
import "./CToken.sol";


contract BlockSwap {
    string public name = "Block Token Swap";
    BlockToken public token;
    CToken public tokenContract;
    uint256 public rate = 10;

    event TokensBorrowed(address _account, address _token, uint256 _amount);

    event WithDraw(address _account, address _token, uint256 _amount);

    event GetTokens(address _account, address _token, uint256 _amount);

    event Collateral(address _account);

    constructor(BlockToken _token , CToken _tokenContract) public {
        token = _token;
        tokenContract = _tokenContract;
    }

    function borrowTokens(uint256 tokenAmount , uint256 _numberOfTokens) public payable {
        //Calculate no.of tokens to buytokens

        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        tokenContract.transfer(msg.sender,_numberOfTokens);

        emit TokensBorrowed(msg.sender, address(token), tokenAmount);
    }

    function withDrawToken(uint256 tokenAmount) public {
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        emit WithDraw(msg.sender, address(token), tokenAmount);
    }

    function signCollateral() public {
        emit Collateral(msg.sender);
    }

    function getBlockTokens(uint256 tokenAmount) public {
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        emit GetTokens(msg.sender, address(token), tokenAmount);
    }

    function earnCTokens(uint256 _numberOfTokens) public {
         tokenContract.transfer(msg.sender,_numberOfTokens);
    }
}
