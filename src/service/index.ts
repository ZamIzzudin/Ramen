/** @format */

import Blockchain from "./Blockchain.js";
import PubSub from "./Pubsub.js";

export default (() => {
  const Chain = new Blockchain();
  const PS = new PubSub(Chain);

  return {
    blockchainHandler: Chain,
    pubsubHandler: PS,
  };
})();
