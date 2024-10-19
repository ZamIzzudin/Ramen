/** @format */

// import Redis from "ioredis";
import { default as Publisher } from "pusher";
import { default as Subscriber } from "pusher-js";

import Blockchain from "./Blockchain";
import Redis from "ioredis";

const Channels = {
  testnet: "testnet",
  blockchain: "blockhain",
  transaction: "transaction",
};

const PusherConfig = {
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "",
  useTLS: true,
};

export default class PubSub {
  channels: string[];
  subscriber: Subscriber;
  publisher: Publisher;
  // subscriber: Redis;
  // publisher: Redis;
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.channels = Object.keys(Channels);
    // this.subscriber = new Redis();
    // this.publisher = new Redis();

    this.subscriber = new Subscriber(PusherConfig.key, {
      cluster: PusherConfig.cluster,
    });
    this.publisher = new Publisher(PusherConfig);
    this.blockchain = blockchain;

    this.doSubscribe();

    this.subscriber.bind("message", (channel: string, message: string) =>
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
    } else if (channel === Channels.transaction) {
      const parsedTransactionPool = JSON.parse(message);

      this.blockchain.updatePool(parsedTransactionPool);
    }
  }

  publishMessage(channel: string, message: string) {
    this.publisher.trigger(channel, "message", message);
  }

  broadcastChain() {
    this.publishMessage(
      Channels.blockchain,
      JSON.stringify(this.blockchain.chain)
    );
  }

  broadcastTransaction() {
    this.publishMessage(
      Channels.transaction,
      JSON.stringify(this.blockchain.transactionPool)
    );
  }
}
