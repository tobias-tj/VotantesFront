import type { User } from "@/context/AuthContext";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL;


export interface LoginResponse{
    user: User;
    token: string;
}


export const login = async (cedulaPlanillero: number, password: string): Promise<LoginResponse> => {
    try{
        const response = await axios.post(`${BASE_URL}/access/login`, { cedulaPlanillero, password });
        const { result, token } = response.data.data;
        const user: User = {
            id: result.cedulaPlanillero,
            nombre: result.nombreCompleto,
            isAdmin: result.isAdmin
        };
        return { user, token };
        
     } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error("Error al iniciar sesión");
    }
}