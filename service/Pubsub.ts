/** @format */

import Redis from "ioredis";
import Blockchain from "./Blockchain";

const Channels = {
  testnet: "testnet",
  blockchain: "blockhain",
};

export default class PubSub {
  channels: string[];
  subscriber: Redis;
  publisher: Redis;
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.channels = Object.keys(Channels);
    this.subscriber = new Redis();
    this.publisher = new Redis();
    this.blockchain = blockchain;

    this.doSubscribe();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  private doSubscribe() {
    this.channels.forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  private handleMessage(channel: string, message: string) {
    console.log(`Message received, From "${channel}":`);

    if (channel === Channels.blockchain) {
      const parsedChain = JSON.parse(message);

      this.blockchain.updateChain(parsedChain);
    }
  }

  publishMessage(channel: string, message: string) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message);
      this.subscriber.subscribe(channel);
    });
  }

  broadcastChain() {
    this.publishMessage(
      Channels.blockchain,
      JSON.stringify(this.blockchain.chain)
    );
  }
}
