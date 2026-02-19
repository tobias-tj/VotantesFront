import type { Planilla, PlanillaDetalle, PlanillaResponse } from "@/lib/types";
import { mapVotante } from "./votante.mapper";

export const mapPlanilla = (p: PlanillaResponse): Planilla => ({
  id: p.id,
  cedulaDirigente: p.cedulaDirigente,
  nombreDirigente: p.nombreDirigente,
  fechaCreacion: p.fechaCreacion,
  cedulaPlanillero: p.cedulaPlanillero,
  nombrePlanillero: p.nombrePlanillero,
  totalEnviados: p.totalEnviados,
  totalValidos: p.totalValidos,
  totalNoExistentes: p.totalNoExistentes,
  votantes: p.votantes.map(mapVotante),
});

export const mapPlanillaDetalle = (p: Planilla): PlanillaDetalle => ({
    planilla: {
        id: p.id,
        cedulaDirigente: p.cedulaDirigente,
        nombreDirigente: p.nombreDirigente,
        fechaCreacion: p.fechaCreacion,
        cedulaPlanillero: p.cedulaPlanillero,
        nombrePlanillero: p.nombrePlanillero,
        totalEnviados: p.totalEnviados,
        totalValidos: p.totalValidos,
        totalNoExistentes: p.totalNoExistentes,
        votantes: p.votantes,
    },
    dirigente: {
        cedula: p.cedulaDirigente,
        nombre_completo: p.nombreDirigente
    },
    planillero: {
        cedula: p.cedulaPlanillero,
        nombre_completo: p.nombrePlanillero
    },
});

