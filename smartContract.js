const Web3 = require("web3");

const Abi = require("./abi.json");
const poolAbi = require("./poolAbi.json");
const tokenAbi = require("./tokenAbi.json");
const Abi2 = require("./abi2.json");
const Abi3 = require("./abi3.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(address, contract) {
  const Instance = new web3.eth.Contract(Abi, contract);

  let LPtokensReceived = await Instance.methods.balanceOf(address).call();
  let LPtotalSupply = await Instance.methods.totalSupply().call();
  let rewards = await Instance.methods.earned(address).call();
  let pool = await Instance.methods.stakingToken().call();
  LPtokensReceived = LPtokensReceived / 1.1;

  const poolInstance = new web3.eth.Contract(poolAbi, pool);

  let tokenReserve = await poolInstance.methods.getReserves().call();
  var token0 = await poolInstance.methods.token0().call();
  var token1 = await poolInstance.methods.token1().call();

  //////////////for first token/////////////////////
  const token0contract = new web3.eth.Contract(tokenAbi, token0);
  var Symbol0 = await token0contract.methods.symbol().call();
  var Decimal0 = await token0contract.methods.decimals().call();
  LPtotalSupply = LPtotalSupply / 10 ** Decimal0;
  var token0Reserve = tokenReserve[0];
  token0Reserve = token0Reserve / 10 ** Decimal0;
  LPtokensReceived = LPtokensReceived / 10 ** Decimal0;
  var token0amount = (LPtokensReceived / LPtotalSupply) * token0Reserve;
  token0amount = token0amount.toFixed(2);

  /////////////// for second token//////////////////////////////////////////////
  const token1contract = new web3.eth.Contract(tokenAbi, token1);
  var Symbol1 = await token1contract.methods.symbol().call();
  var Decimal1 = await token1contract.methods.decimals().call();
  var totalSupplytoken1 = LPtotalSupply / 10 ** Decimal1;
  var token1Reserve = tokenReserve[1] / 10 ** Decimal1;
  var LPtokensReceivedtoken1 = LPtokensReceived / 10 ** Decimal1;
  var token1amount =
    (LPtokensReceivedtoken1 / totalSupplytoken1) * token1Reserve;
  token1amount = token1amount.toFixed(2);
  if ((token0amount != 0, token1amount != 0)) {
    console.log(Symbol0, "+", Symbol1, token0amount, "+", token1amount);
    console.log("rewards:", (rewards / 10 ** Decimal1).toFixed(2));
  }
}

async function getData2(userAddress) {
  const contract = "0x40d203332b0A262F1a371ae9dA1788fe6825A6F6";

  const Instance = new web3.eth.Contract(Abi2, contract);

  let balance = await Instance.methods.balanceOf(userAddress).call();
  let rewards = await Instance.methods.earned(userAddress).call();

  balance = (balance / 10 ** 21 / 1.22).toFixed(2);
  rewards = (rewards / 10 ** 18).toFixed(2);

  if (balance != 0) {
    console.log("balance:", balance, "ETH");
    console.log("rewards:", rewards, "GOVI");
  }
}

async function getData3(userAddress) {
  const contract = "0x5005e8Dc0033E78AF80cfc8d10f5163f2FcF0E79";

  const Instance = new web3.eth.Contract(Abi2, contract);

  let balance = await Instance.methods.balanceOf(userAddress).call();

  balance = (balance / 10 ** 21 / 1.22).toFixed(2);

  if (balance != 0) {
    console.log("balance:", balance);
  }
}

async function getData4(userAddress) {
  const contract = "0xDb3130952eD9b5fa7108deDAAA921ae8f59beaCb";

  const Instance = new web3.eth.Contract(Abi3, contract);

  let tokens = await Instance.methods.getClaimableTokens().call();
  for (let i = 0; i < tokens.length; i++) {
    let balance = await Instance.methods.profitOf(userAddress,tokens[i]).call();

    if (balance != 0) {
      if(i==0)
      console.log("balance:", (balance/10**8).toFixed(2),"WETH");
      else if(i==1)
      console.log("balance:", (balance/10**17).toFixed(2),'USDC');
      else if(i==2)
      console.log("balance:", (balance/10**6).toFixed(2),'USDT');
    }
  }
}

let address = "0x4371219225bf02fe7d9a5d5247982ba6b4bf42e9";
let pools = [
  "0x936Dd3112a9D39Af39aDdA798503D9E7E7975Fb7",
  "0xe6e5220291CF78b6D93bd1d08D746ABbC115C64b",
];
for (let i = 0; i < 2; i++) getBalance(address, pools[i]);

getData2(address);
getData3(address);
getData4(address);
