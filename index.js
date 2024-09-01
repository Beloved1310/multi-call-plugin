import { Web3 } from "web3";
import { MulticallPlugin } from '@rudra-xyz/web3-plugin-multicall';

import { ERC20_ABI } from "./abis/erc20.js";

const main = async () => {
    const web3 = new Web3("https://eth.public-rpc.com");
    web3.registerPlugin(new MulticallPlugin());

    const erc20 = new web3.eth.Contract(
        ERC20_ABI,
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI Token on Ethereum mainnet
    );

    const calls = [
        {
            target: web3.multicall.contractAddress,
            callData: web3.multicall.getLastBlockHash().encodeABI(),
        },
        {
            target: erc20.options.address ?? "",
            callData: erc20.methods.totalSupply().encodeABI(),
        },
    ];

    const results = await web3.multicall.aggregate(calls).call();

    console.log(results.returnData)
    /*
      [
        '0x6471e50c10d51e141a41fdaebe5e3a4ec76deac3534009ab7d009b0eab6dcfba',
        '0x0000000000000000000000000000000000000000033b2e3c9fd0803ce8000000'
      ]
    */
};

main();