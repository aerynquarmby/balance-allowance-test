const express = require('express');
const { ThirdwebSDK } = require('@thirdweb-dev/sdk');
require('dotenv').config();


const app = express();
app.use(express.json());

let sdk;
try {
  sdk = new ThirdwebSDK('https://polygon.llamarpc.com', {
    // Use the environment variable here
    apiKey: process.env.THIRDWEB_SECRET_KEY
  });
} catch (error) {
  console.error('Error initializing Thirdweb SDK:', error);
}

  

// Define the balance checking endpoint
app.get('/balance/:address/:tokenAddress', async (req, res) => {
    try {
        const { address, tokenAddress } = req.params;
        const balance = await sdk.getTokenBalance(tokenAddress, address);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define the allowance checking endpoint
app.get('/allowance/:ownerAddress/:spenderAddress/:tokenAddress', async (req, res) => {
    try {
        const { ownerAddress, spenderAddress, tokenAddress } = req.params;
        const allowance = await sdk.getTokenAllowance(tokenAddress, ownerAddress, spenderAddress);
        res.json({ allowance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
