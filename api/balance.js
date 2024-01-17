const { ethers } = require('ethers');
const networks = require('./networks');

module.exports = async (req, res) => {
    const { address, tokenAddress, network } = req.query;

    if (!networks[network]) {
        return res.status(400).json({ error: 'Unsupported network' });
    }

    const provider = new ethers.providers.JsonRpcProvider(networks[network].rpcUrl);

    try {
        const tokenContract = new ethers.Contract(tokenAddress, [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ], provider);

        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        
        res.status(200).json({ balance: roundedBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
