const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('https://polygon.llamarpc.com');

module.exports = async (req, res) => {
    const { address, tokenAddress } = req.query; // Parameters are passed in the query string

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
