import { createGame } from "game.js";
import { connectWallet } from "wallet.js";

document.addEventListener('DOMContentLoaded', async () => {
    const { account } = await connectWallet();
    if (account) {
        console.log(`Player account: ${account}`);
        createGame('game-container');
    }
});
