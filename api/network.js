// networks.js
const networks = {
    avalanche: {
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        chainId: 43114
    },
    linea: {
        rpcUrl: 'https://rpc.linea.build',
        chainId: 59144
    },
    bnbChain: {
        rpcUrl: 'https://bsc-dataseed.bnbchain.org',
        chainId: 56
    },
    polygon: {
        rpcUrl: 'https://polygon.llamarpc.com',
        chainId: 137 
    }
};

module.exports = networks;
