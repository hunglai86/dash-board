import axios from "axios";

export default axios.create({
    baseURL:
        // "http://localhost:8656/api/counting/v1",
    // process.env.REACT_APP_API_URL,
    "http://112.137.129.253:8656/api/counting/v1",
    headers: {
        "Content-type": "application/json"
    }
});
