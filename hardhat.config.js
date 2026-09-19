// minimal config -- this project doesn't use hardhast own compile / deploy 
// tooling (contracts/DVCS.sol will be compiled using scripts/compile-contract.sh)
// via solc directly, and deployed by scripts/deploy.js via plain ethers.js 
// against whatever RPC endpoint you point it at). This file exists only so 
// `npx hardhat node ` has a config to run against, giving a local 
// ethereum compatible dev chain with unlocked, pre-funded accounts. 
//
module.exports = {
  solidity: "0.8.24",
};
