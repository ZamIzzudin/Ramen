/** @format */

import Blockchain from "@/service/Blockchain.js";
import PubSub from "@/service/Pubsub.js";

export default (() => {
  const Chain = new Blockchain();
  const PS = new PubSub(Chain);

  return {
    blockchainHandler: Chain,
    pubsubHandler: PS,
  };
})();
