import axios from "axios";

const createBackendServer = baseURL => {


    const api = axios.create({
        baseURL,
        headers: {Accept: "application/json"},
        timeout: 60 * 1000
    });

    const getDisclaimer = async () => api.get(`/api/disclaimer`);
    const createDisclaimer = async (body) => api.post('/api/disclaimer', body);
    const getNews = (req) => api.get(`/api/news`);
    const createNews = async (body) => api.post('/api/news', body);

   
    return {
        createDisclaimer,
        getDisclaimer,
        createNews,
        getNews
    };

};

const apis = createBackendServer('http://localhost:5000');


export default apis;

//https://api.bscscan.com/api?module=block&action=getblockreward&blockno=2170000&apikey=11FZRCXWIQRUAP53Z8T2DBJ39M6FGZN2H5
