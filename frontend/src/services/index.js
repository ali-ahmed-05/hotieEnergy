import axios from "axios";

const createBackendServer = baseURL => {

    const apikey = process.env.REACT_APP_Bscscan_Api_Key_Token

    const api = axios.create({
        baseURL,
        headers: {'Accept': 'application/json'},
        timeout: 60 * 1000
    });

    const getBlock = (blockno = '', module = 'block', action = 'getblockreward', ) => api.get(`/api?blockno=${blockno}&module=${module}&action=${action}&apikey=${apikey}`)
   
   
   
    return {
        getBlock
    };

};

const apis = createBackendServer(process.env.REACT_APP_BSE_API_URL);


export default apis;

//https://api.bscscan.com/api?module=block&action=getblockreward&blockno=2170000&apikey=11FZRCXWIQRUAP53Z8T2DBJ39M6FGZN2H5