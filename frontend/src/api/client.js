import axios from 'axios'

// Set VITE_API_BASE_URL in Vercel's environment variables to your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const client = axios.create({ baseURL: API_BASE_URL })

export const getAllSessions = () => client.get('/attendance/').then(r => r.data)
export const getSummary = () => client.get('/analytics/summary').then(r => r.data)
export const getMembers = () => client.get('/members/').then(r => r.data)

export default client
