import axios from "axios";

const DEV_URL = "http://localhost:8088/";


export default axios.create({ baseURL: DEV_URL });

const DEV_BASE_PATH = "http://localhost:8088";

export const BASE_PATH = DEV_BASE_PATH;
