import type { ApiResponse } from "./apiResponse";
import axiosInstance from "./config/axiosInstance";
import { mapDirigente } from "./mappers/dirigente.mapper";
import type { Dirigente, GetDirigentesResponse, ProblemCardsResponse } from "@/lib/types";

export const getDirigentes = async (): Promise<Dirigente[]> => {
  try {
    const response = await axiosInstance.get<GetDirigentesResponse>("/dirigente");

    return response.data.data.map(mapDirigente);
  } catch (error) {
    console.error("Error al obtener los dirigentes:", error);
    return [];
  }
};


export const getProblemCards = async (): Promise<ProblemCardsResponse[]> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<ProblemCardsResponse[]>>(
        "/dirigente/obtenerEstadisticas"
      )

    console.log(response.data.data);

    return response.data.data.map((group) => ({
      cedulaDirigente: group.cedulaDirigente,
      nombreDirigente: group.nombreDirigente,
      totalPlanillas: Number(group.totalPlanillas),
      totalEnviados: Number(group.totalEnviados),
      totalNoEncontrados: Number(group.totalNoEncontrados),
      votantesValidos: Number(group.votantesValidos),

      planillas: group.planillas.map((p: any) => ({
        planillaId: p.planilla_id,
        fechaCreacion: p.fecha_creacion,
        totalEnviados: Number(p.total_enviados),
        totalNoEncontrados: Number(p.total_no_encontrados),
      })),
    }))
  } catch (error) {
    console.error("Error al obtener los problemas:", error)
    return []
  }
}