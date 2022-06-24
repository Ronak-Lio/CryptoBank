pragma solidity 0.5.16;
import "./CToken.sol";


contract Eth {
    address payable admin;
    CToken public tokenContract;
    uint256 public tokensSold;

    event Invest(address _buyer , uint256 _amount);
    
    event Borrow(address _buyer);

    event withDraw(address _buyer);

    event Repay(address _buyer);

    event Collateral(address _buyer);




    constructor (CToken _tokenContract) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
   }

   function multiply(uint x , uint y) internal pure returns( uint z) {
      require(y == 0 || (z = x*y)/y == x);
   }

   function investEther(uint256 _numberOfTokens) public payable{

     tokenContract.transfer(msg.sender,_numberOfTokens);

     emit Invest(msg.sender, _numberOfTokens);
   }

   function borrowEther(uint amount , uint256 _numberOfTokens) public{
      msg.sender.transfer(amount);

      tokenContract.transfer(msg.sender,_numberOfTokens);

      emit Borrow(msg.sender);
   }

   
    function withDrawEther(uint amount) public{
      msg.sender.transfer(amount);
      emit withDraw(msg.sender);
   }

   function repayEther() public payable{
      emit Repay(msg.sender);
   }


   function signCollateral() public{
      emit Collateral(msg.sender);
   }


   

   
}