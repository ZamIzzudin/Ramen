/** @format */

import Blockchain from "./Blockchain";
import PubSub from "./Pubsub";

export default (() => {
  const Chain = new Blockchain();
  const PS = new PubSub(Chain);

  return {
    blockchainHandler: Chain,
    pubsubHandler: PS,
  };
})();
