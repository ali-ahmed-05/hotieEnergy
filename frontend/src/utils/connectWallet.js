import { injectedConnector , supportedChainIds , chainData} from "./connectors";
import {loadProvider} from './provider'
import { ethers } from "ethers";
import { getLibrary } from "./web3Library";

export const connectWallet = async(activate,errorMessageCallback)=>{
    
    await activate(injectedConnector, async (error) => {
        console.log({ error });
        changeNetwork()
        console.log("injectedConnector",supportedChainIds);
        errorMessageCallback(error.message);
    });
}

const toHex = (num) => {
    return "0x" + num.toString(16);
  };

const changeNetwork = async () => {
    try {
        let {provider} = await loadProvider()
        console.log("provider",await provider?._network?.chainId)
        console.log("provider",provider)
       
        if (provider._isProvider) {
            //ethers.utils.hexlify(ethers.utils.toUtf8Bytes(supportedChainIds[0].toString()))
            await provider.jsonRpcFetchFunc(
                'wallet_switchEthereumChain',
                [{ chainId: toHex(supportedChainIds[0])}]
              );
          } 
    } catch (error) {
        console.log("changeNetwork" , error)
        if (error.code === 4902) {
            addNetwork()
        }
    }
   
    }
    const addNetwork = async () => {
        try {
            let {provider} = await loadProvider()
            console.log("provider",await provider?._network?.chainId)
            console.log("provider",provider)
           
            if (provider._isProvider) {
                //ethers.utils.hexlify(ethers.utils.toUtf8Bytes(supportedChainIds[0].toString()))
                await provider.jsonRpcFetchFunc(
                    'wallet_addEthereumChain',
                    [chainData[supportedChainIds[0].toString()]]
                  );
              } 
        } catch (error) {
            console.log("changeNetwork" , error)
        }
       
        }

//method: 'wallet_addEthereumChain',
// params: [{
//     chainId: '0x38',
//     chainName: 'Binance Smart Chain',
//     nativeCurrency: {
//         name: 'Binance Coin',
//         symbol: 'BNB',
//         decimals: 18
//     },
//     rpcUrls: ['https://bsc-dataseed.binance.org/'],
//     blockExplorerUrls: ['https://bscscan.com']
//     }]
//     })