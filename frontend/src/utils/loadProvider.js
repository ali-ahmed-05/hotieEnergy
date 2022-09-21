import Web3Modal from "web3modal";
import {ethers} from "ethers";

const loadProvider = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        return provider.getSigner();
    } catch (e) {
        console.log("loadProvider: ", e)
    }
}

export default loadProvider