/** @format */

import service from "@/service/index.js";

const { blockchainHandler } = service;

export default async function syncNode(default_node_url: string) {
  const url = `${default_node_url}/api/bc/blocks`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    blockchainHandler.updateChain(data);

    console.log("Chain has been forked from NODE");
  } catch (error: any) {
    console.error(error.message);
  }
}
