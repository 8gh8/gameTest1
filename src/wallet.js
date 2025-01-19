import { ethers } from "ethers";

export async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            console.log('Connected wallet:', accounts[0]);
            return { account: accounts[0], signer };
        } catch (error) {
            console.error('Connection error:', error);
        }
    } else {
        alert('Please install Metamask!');
    }
}
