import axios from 'axios';

axios.defaults.baseURL =  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3000/';
axios.defaults.withCredentials = true;

const interceptorEnv = {
    refresh: false
};

axios.interceptors.response.use(
    onFulfilled => onFulfilled,
    async onRejected => {
        if (onRejected.response.status === 401 && !interceptorEnv.refresh) {
            interceptorEnv.refresh = true;
            const { status } = await axios.post('/auth/refresh', {});

            if(status === 200){
                return axios(onRejected.config)
            }
        }

        interceptorEnv.refresh = true;
        return onRejected;
    }
);
