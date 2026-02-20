import { mapPlanilla } from "./mappers/planilla.mapper";
import type { Planilla, PlanillaFilters, PaginatedResponse, AddPlanillaRequest, AddPlanillaResponse, GetEstadisticasResponseDTO } from "@/lib/types";
import axiosInstance from "./config/axiosInstance";
import type { ApiResponse } from "./apiResponse";


export const getPlanillas = async (
  filters: PlanillaFilters
): Promise<PaginatedResponse<Planilla>> => {

  try {
    const response = await axiosInstance.get(
      `/planilla/obtenerPlanillas`,
      {
        params: filters,
      }
    );

    const data = response.data;

    return {
      content: data.content.map(mapPlanilla),
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
    };

  } catch (error) {
    console.error("Error al obtener las planillas:", error);
    throw error;
  }
};

export const addPlanilla = async (
  planilla: AddPlanillaRequest
): Promise<AddPlanillaResponse> => {

  try {

    console.log("Intentando crear planilla", planilla);
    const response = await axiosInstance.post(
      `/planilla/create`,
      planilla
    );

    return response.data;

  } catch (error: any) {
    if (error.response.data.message === "Hay cedulas repetidas") {
      return error.response.data;
    }
    throw error;
  }
};

export const getEstadisticas = async (): Promise<GetEstadisticasResponseDTO> => {
  try {
    const response = await axiosInstance.get<ApiResponse<GetEstadisticasResponseDTO>>(`/planilla/obtenerEstadisticas`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    throw error;
  }
};



