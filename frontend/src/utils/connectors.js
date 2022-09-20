import { InjectedConnector } from "@web3-react/injected-connector";

const toHex = (num) => {
    return "0x" + num.toString(16);
  };

  
export const supportedChainIds = [
    
    //1, // Mainet
   
    4, // Rinkeby
    56, // BCS smart chain
    3, // Ropsten
    1337,
    // 5, // Goerli
    //42, // Kovan
]

export const injectedConnector = new InjectedConnector({
    supportedChainIds: supportedChainIds
})

export const chainData = {
    4 : {
        chainId: toHex(supportedChainIds[0]),
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
        }, // Rinkeby
    56 : {
        chainId: toHex(supportedChainIds[1]),
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
        }, // BCS smart chain
    3 : {
        chainId: toHex(supportedChainIds[2]),
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
        }, // Ropsten
}



