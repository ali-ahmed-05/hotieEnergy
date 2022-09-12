import axios from "axios";

const createBackendServer = baseURL => {

    const api = axios.create({
        baseURL,
        headers: {'Accept': 'application/json'},
        timeout: 60 * 1000
    });

    const getAllProposals = () => api.get('/api/proposals');

    return {
        addProposal
    };

};

const apis = createBackendServer(process.env.REACT_APP_BSE_API_URL);


export default apis;