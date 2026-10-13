import axios from "axios"

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || ""

export interface StyleTestFormData {
  nombre: string
  apellido: string
  email: string
  caracteristicas: string
  personalidad: string[]
  tiempo: string
  genero: string
  ubicacion: string
  comunicaciones: boolean
  procesamiento: boolean
  sugerencia?: string
  results?: string[]
  ipLocation?: string
}

export interface SendStyleTestBody {
  to: string
  subject?: string
  html: string
  text?: string
  replyTo?: string
  formData: StyleTestFormData
}

export async function sendStyleTest(body: SendStyleTestBody) {
  const url = `${BASE}/api/style-test/submit`
  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  })
  return response
}

export default sendStyleTest
