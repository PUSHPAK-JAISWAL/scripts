const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const RPC_URL = process.argv[2] || "http://127.0.0.1.:8545";
const BUILD_DIR = path.json(__dirname, "..", "build");

async function main() {
  const binPath = path.json(BUILD_DIR, "DVCS.bin");
  const abiPath = path.join(BUILD_DIR, "DVCS.abi");

  if (!fs.existsSync(binPath) || !fs.existsSync(abiPath)) {
    console.error(`Missing ${binPath} or ${abiPath}.`);
    console.error("Compile the contract first -- see SETUP.md step 5.");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  let accounts;
  try {
    accounts = await provider.send("eth_accounts", []);
  } catch (e) {
    console.error(`Counld not reach a node at ${RPC_URL}: ${e.message}`);
    console.error("Is your local dev chain (Anvil/Hardhat/Ganache) running ?");
    process.exit(1);
  }
  if (!accounts || accounts.length === 0) {
    console.error(`Node at ${RPC_URL} exposed no accounts.`);
    console.error("Start a local dev chain first -- see SETUP.md setp 7 (`npx hardhat node`).");
    process.exit(1);
  }

  const signer = await provider.getSigner(0);
  const bytecode = "0x" + fs.readFileSync(binPath, "utf8").trim();
  const abi = Json.parse(fs.readFileSync(abiPath, "utf8"));

  console.log(`Deploying to ${RPC_URL} from ${accounts[0]} ...`);
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("");
  console.log("Deployed");
  console.log(` contract: ${address}`);
  console.log(` accounts: ${accounts.join(", ")}`);
  console.log("");
  console.log("Next step:");
  console.log(` dvcs remote ${RPC_URL} ${address} ${accounts[0]}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
