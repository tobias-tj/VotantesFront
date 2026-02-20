export interface Dirigente {
  cedula: string
  nombre: string
}

export interface Planilla {
  id: number;
  cedulaDirigente: string;
  nombreDirigente: string;
  fechaCreacion: string;
  cedulaPlanillero: string;
  nombrePlanillero: string;
  totalEnviados: number;
  totalValidos: number;
  totalNoExistentes: number;
  votantes: Votante[];
}


export interface Votante {
  cedula: number;
  nombre: string;
  apellido: string;
  sexo: string;
  fechaNacimiento: string;
  fechaInscripcion: string;
  tipo: string;
  direccion: string;
  votoPlra: string;
  votoAnr: string;
  votoGenerales: string;
  afiliaciones: string;
  afiliadoPlra2025: string;
  departamento: string;
  distrito: string;
  zona: string;
  comite: string;
  localGenerales: string;
  localInterna: string;
}


export interface PlanillaDetalle {
  planilla: Planilla
  dirigente: { cedula: string; nombre_completo: string }
  planillero: { cedula: string; nombre_completo: string }
}

export interface PlanillaFilters {
  filterText: string
  dateFrom: string
  dateTo: string
  filterSize: number
  filterPage: number
}


export interface DirigenteResponse {
  cedulaDirigente: string;
  nombreDirigente: string;
}

export interface GetDirigentesResponse {
  status: string;
  data: DirigenteResponse[];
  message: string;
}


export interface VotanteResponse {
  cedula_votante: number;
  nombre: string;
  apellido: string;
  sexo: string;
  fecha_nacimiento: string;
  fecha_inscripcion: string;
  tipo: string;
  direccion: string;
  voto_plra: string;
  voto_anr: string;
  voto_generales: string;
  afiliaciones: string;
  afiliado_plra_2025: string;
  departamento_nombre: string;
  distrito_nombre: string;
  zona_nombre: string;
  comite_nombre: string;
  local_generales: string;
  local_interna: string;
}


export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PlanillaResponse {
  id: number;
  cedulaDirigente: string;
  nombreDirigente: string;
  fechaCreacion: string;
  cedulaPlanillero: string;
  nombrePlanillero: string;
  totalEnviados: number;
  totalValidos: number;
  totalNoExistentes: number;
  votantes: VotanteResponse[];
}


export interface AddPlanillaRequest {
  cedulaDirigente: string;
  nombreDirigente: string;
  cedulaPlanillero: string;
  cedulasVotantes: number[];
}

export interface AddPlanillaResponse{
  success: boolean;
  data: {
    planillaId: number;
    cedulasRepetidas: number[];
    totalInsertados: number;
  };
  message: string;
}

export type AlertType = "success" | "error" | "warning";

export interface AlertState {
  type: AlertType;
  title: string;
  description: string;
}

export interface ProblemCard {
  planillaId: number;
  fechaCreacion: string;
  totalEnviados: number;
  totalNoEncontrados: number;
}

export interface ProblemCardsResponse {
  cedulaDirigente: number;
  nombreDirigente: string;
  totalPlanillas: number;
  totalEnviados: number;
  totalNoEncontrados: number;
  votantesValidos: number;
  planillas: ProblemCard[];
}

export interface GetEstadisticasResponseDTO {
    totalPlanillas: number;
    totalEnviados: number;
    totalValidos: number;
    totalNoEncontrados: number;
}

