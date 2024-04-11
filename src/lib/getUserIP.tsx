import axios from 'axios';

async function getUserIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const { ip } = response.data;
        return ip;
    } catch (error) {
        console.error('Error fetching user IP:', error);
        return null;
    }
}

export default getUserIP;