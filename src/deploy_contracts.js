//Import the compiled contract from the HelloHedera.json file
const { Client, ContractCreateTransaction, FileCreateTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
require("dotenv").config();
let helloHedera = require("../contracts/example.json");
const bytecode = helloHedera.data.bytecode.object;

async function main() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;
  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction()
    //Set the bytecode of the contract
    .setContents(bytecode);

  //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  //Log the file ID
  console.log("The smart contract byte code file ID is " + bytecodeFileId);

  // Instantiate the contract instance
  const contractTx = await new ContractCreateTransaction()
    //Set the file ID of the Hedera file storing the bytecode
    .setBytecodeFileId(bytecodeFileId)
    //Set the gas to instantiate the contract
    .setGas(100000)
    //Provide the constructor parameters for the contract
    .setConstructorParameters(
      new ContractFunctionParameters().addString("Hello from Hedera!")
    );

  //Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  //Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  //Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  //Log the smart contract ID
  console.log("The smart contract ID is " + newContractId);

  //v2 JavaScript SDK
}

main();
