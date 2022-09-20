import axios from "axios";

const createBackendServer = baseURL => {


    const api = axios.create({
        baseURL,
        headers: {Accept: "application/json"},
        timeout: 60 * 1000
    });

    /***********    GET REQUESTS    **********/
    const getNews = () => api.get(`/api/news`);
    const getDisclaimer = async () => api.get(`/api/disclaimer`);
    const getAllPoolAddresses = async () => await api.get('/api/poolAddress')

    /***********    POST REQUESTS    **********/
    const createNews = async (body) => api.post('/api/news', body);
    const createDisclaimer = async (body) => api.post('/api/disclaimer', body);
    const createPoolAddress = async (body) => api.post('/api/poolAddress', body)
    const getPoolAddressByIdNumber = async (body = {id: 0, number: 0}) => api.post('/api/poolAddress/addresses', body)


    return {
        getNews,
        createNews,
        getDisclaimer,
        createDisclaimer,
        createPoolAddress,
        getAllPoolAddresses,
        getPoolAddressByIdNumber
    };

};

const apis = createBackendServer('http://localhost:5000');


export default apis;

//https://api.bscscan.com/api?module=block&action=getblockreward&blockno=2170000&apikey=11FZRCXWIQRUAP53Z8T2DBJ39M6FGZN2H5
