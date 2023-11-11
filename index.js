const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(express.json());

// Set up Ether.js provider
const provider = new ethers.providers.JsonRpcProvider('https://polygon.llamarpc.com');

// Define the balance checking endpoint
app.get('/balance/:address/:tokenAddress', async (req, res) => {
    try {
        const { address, tokenAddress } = req.params;
        const tokenContract = new ethers.Contract(tokenAddress, [
            // Minimal ABI to get ERC20 Token balance and decimals
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ], provider);
        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();

        // Convert balance to a human-readable format
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);

        // Round to 2 decimal places
        const roundedBalance = Number(formattedBalance).toFixed(2);
        
        res.json({ balance: roundedBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Define the allowance checking endpoint
app.get('/allowance/:ownerAddress/:spenderAddress/:tokenAddress', async (req, res) => {
    try {
        const { ownerAddress, spenderAddress, tokenAddress } = req.params;
        const tokenContract = new ethers.Contract(tokenAddress, [
            // Minimal ABI to get ERC20 Token allowance and decimals
            "function allowance(address owner, address spender) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ], provider);
        const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
        const decimals = await tokenContract.decimals();

        // Convert allowance to a human-readable format
        const formattedAllowance = ethers.utils.formatUnits(allowance, decimals);

        // Round to 2 decimal places
        const roundedAllowance = Number(formattedAllowance).toFixed(2);
        
        res.json({ allowance: roundedAllowance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
