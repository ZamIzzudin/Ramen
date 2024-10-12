/** @format */

import Blockchain from "./Blockchain";
import PubSub from "./Pubsub";
// import Transaction from "./Transaction";
// import EC from "../utils/key";

export default (() => {
  const Chain = new Blockchain();
  const PS = new PubSub(Chain);
  //   const privateKeyA = process.env.PRIVATE_KEY_A || "";
  //   const privateKeyB = process.env.PRIVATE_KEY_B || "";

  //   const walletA = EC.keyFromPrivate(privateKeyA);
  //   const walletB = EC.keyFromPrivate(privateKeyB);

  //   const publicKeyA = walletA.getPublic("hex");
  //   const publicKeyB = walletB.getPublic("hex");

  //   //   console.log(publicKeyA);
  //   //   console.log(publicKeyB);

  //   const transaction_1 = new Transaction(publicKeyA, publicKeyB, {
  //     type: "transfer",
  //     value: 100,
  //   });
  //   const transaction_2 = new Transaction(publicKeyA, publicKeyB, {
  //     type: "transfer",
  //     value: 100,
  //   });
  //   const transaction_3 = new Transaction(publicKeyB, publicKeyA, {
  //     type: "transfer",
  //     value: 100,
  //   });

  //   transaction_1.signTransaction(walletA);
  //   transaction_2.signTransaction(walletA);
  //   transaction_3.signTransaction(walletB);

  //   Chain.initiateTransaction(transaction_1);
  //   Chain.initiateTransaction(transaction_2);
  //   Chain.initiateTransaction(transaction_3);

  //   Chain.minePendingBlock(publicKeyB);

  return {
    blockchainHandler: Chain,
    pubsubHandler: PS,
  };
})();
