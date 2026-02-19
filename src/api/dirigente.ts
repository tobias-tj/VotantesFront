import axiosInstance from "./config/axiosInstance";
import { mapDirigente } from "./mappers/dirigente.mapper";
import type { Dirigente, GetDirigentesResponse } from "@/lib/types";

export const getDirigentes = async (): Promise<Dirigente[]> => {
  try {
    const response = await axiosInstance.get<GetDirigentesResponse>("/dirigente");

    return response.data.data.map(mapDirigente);
  } catch (error) {
    console.error("Error al obtener los dirigentes:", error);
    return [];
  }
};
