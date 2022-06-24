var Eth = artifacts.require("./Eth.sol");
var CToken = artifacts.require("./CToken.sol");

contract("Eth", function (accounts) {
  var EthInstance;
  var tokenInstance;
  var admin = accounts[0];
  var investor = accounts[1];
  var tokenPrice = 1000000000000000;
  var numberOfTokens;
  var tokensAvaiable = 750000;

  it("initializes the contract with the correct values", function () {
    return Eth.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "has the correct address");
        return tokenSaleInstance.tokenContract();
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "has the correct address");
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, 1000000000000000, "token price");
      });
  });

  it("investEther", function () {
    return CToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return Eth.deployed();
      })
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenInstance.transfer(tokenSaleInstance.address , tokensAvaiable)
      }).then(function (receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.investEther(numberOfTokens, {
            from: investor,
            value: '10',
          });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(receipt.logs[0].event, "Invest", "should be withdraw event");
        assert.equal(
          receipt.logs[0].args._investor,
          investor,
          "logs the account who purchased the tokens"
        );
        assert.equal(receipt.logs[0].args._amount, numberOfTokens, "amount");
        return tokenSaleInstance.tokensSold();
      })
      .then(function (amount) {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increment number Of tokens sold"
        );
        return tokenInstance.balanceOf(buyer);
      }).then(function (balance) {
        assert.equal(balance.toNumber(), numberOfTokens)
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      }).then(function (balance) {
        assert.equal(balance.toNumber(), tokensAvaiable - numberOfTokens)
        return tokenSaleInstance.investEther(numberOfTokens, {
          from: investor,
          value: 1,
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert.equal(
          error.message.indexOf("revert") >= 0,
          "msg.value must be equal to number of Tokens"
        );
        return tokenSaleInstance.investEther(800000, {
            from: investor,
            value: tokenPrice* numberOfTokens,
          });
      }).then(assert.fail).catch(function (error){
        assert.equal(
            error.message.indexOf("revert") >= 0,
            "value must be less than balance OF TokenSale Instance"
          );
      })
  });
});

it('withdraw ether', function(){
    return CToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return Eth.deployed();
      })
      .then(function (instance) {
        tokenSaleInstance = instance;
    //     return tokenSaleInstance.endSale({from : buyer});
    //   }).then(assert.fail).catch(function(error) {
    //      assert(error.message.indexOf("revert") >= 0, "endSale must be from admin")
         return tokenSaleInstance.withDrawEther({from : tokenSaleInstance.address , value : '100'});
      }).then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(receipt.logs[0].event, "Withdraw", "should be withdraw event");
        assert.equal(
          receipt.logs[0].args._investor,
          investor,
          "logs the account who withdrew the ether"
        );
      })
})
