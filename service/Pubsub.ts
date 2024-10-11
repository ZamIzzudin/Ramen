/** @format */

import Redis from "ioredis";

export default class PubSub {
  channel: string;
  subscriber: Redis;
  publisher: Redis;

  constructor(channel: string) {
    this.channel = channel;
    this.subscriber = new Redis();
    this.publisher = new Redis();

    this.doSubscribe();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  doSubscribe() {
    this.subscriber.subscribe(this.channel);
  }

  handleMessage(channel: string, message: string) {
    console.log(`From "${channel}": Message received: ${message}`);
  }

  publishMessage(message: string) {
    this.publisher.publish(this.channel, message);
  }
}
