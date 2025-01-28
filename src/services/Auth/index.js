import httpClient from '../../plugins/axios'
import { AUTH_TOKEN } from '../../constants'

async function login({ username, password }) {
  try {
    const response = await httpClient.post(`/auth/login`, {
      user_name: username,
      password: password,
    });
    
    // Extraer el JSON de la respuesta si viene con HTML
    let jsonData;
    if (typeof response.data === 'string') {
      try {
        // Buscar el JSON en la respuesta
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No se encontró JSON válido en la respuesta');
        }
      } catch (parseError) {
        console.error('Error parseando respuesta:', parseError);
        throw new Error('Error en formato de respuesta');
      }
    } else {
      jsonData = response.data;
    }
    
    if (jsonData && jsonData.access_token) {
      const token = jsonData.access_token;
      localStorage.setItem(AUTH_TOKEN, token);
      
      const savedToken = localStorage.getItem(AUTH_TOKEN);
      
      httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { ...response, data: jsonData };
    } else {
      throw new Error('No se recibió el token de acceso');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

export default {
  login,
}
