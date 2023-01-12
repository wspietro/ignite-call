import axios from 'axios'

// criar instância do axios
export const api = axios.create({
  baseURL: '/api', // mesma url pois o back e front estão no mesmo projeto
})
