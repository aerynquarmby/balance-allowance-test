const { ethers } = require('ethers');
const networks = require('./networks');

module.exports = async (req, res) => {
    const { ownerAddress, spenderAddress, tokenAddress, network } = req.query;

    if (!networks[network]) {
        return res.status(400).json({ error: 'Unsupported network' });
    }

    const provider = new ethers.providers.JsonRpcProvider(networks[network].rpcUrl);

    try {
        const tokenContract = new ethers.Contract(tokenAddress, [
            "function allowance(address owner, address spender) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ], provider);

        const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
        const decimals = await tokenContract.decimals();
        const formattedAllowance = ethers.utils.formatUnits(allowance, decimals);
        const roundedAllowance = Number(formattedAllowance).toFixed(2);

        res.status(200).json({ allowance: roundedAllowance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
