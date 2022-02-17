import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://driver-info-provider-default-rtdb.firebaseio.com/'
})

export default instance;