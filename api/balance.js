const { ethers } = require('ethers');

module.exports = async (req, res) => {
    let { address, tokenName, network } = req.query;

    // Convert to lowercase
    tokenName = tokenName.toLowerCase();
    network = network.toLowerCase();

    const tokenAddresses = {
        avalanche: { wavax: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' },
        linea: { weth: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f' },
        bnb: { wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' },
        polygon: { wmatic: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' }
    };

    let rpcUrl;
    switch (network) {
        case 'avalanche':
            rpcUrl = 'https://api.avax.network/ext/bc/C/rpc';
            break;
        case 'linea':
            rpcUrl = 'https://rpc.linea.build';
            break;
        case 'bnb':
            rpcUrl = 'https://bsc-dataseed.bnbchain.org';
            break;
        case 'polygon':
            rpcUrl = 'https://polygon.llamarpc.com';
            break;
        default:
            return res.status(400).json({ error: 'Unsupported network' });
    }

    const tokenAddress = tokenAddresses[network][tokenName];
    if (!tokenAddress) {
        return res.status(400).json({ error: 'Unsupported token name or network' });
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    try {
        const tokenContract = new ethers.Contract(tokenAddress, [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ], provider);

        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        const roundedBalance = Number(formattedBalance).toFixed(4);
        
        res.status(200).json({ balance: roundedBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
