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

export const deletePlanilla = async (
  id: number,
  deleteDirigente: boolean
) => {
  try {
    const response = await axiosInstance.delete(
      `/planilla/borrar/${id}?deleteDirigente=${deleteDirigente}`
    );

    return response.data; // { success, message }
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error inesperado al eliminar la planilla",
    };
  }
};



