import type { Dirigente, DirigenteResponse, ProblemCardsResponse } from "@/lib/types";

export const mapDirigente = (d: DirigenteResponse): Dirigente => ({
  cedula: d.cedulaDirigente,
  nombre: d.nombreDirigente,
});

export const mapProblemCards = (d: ProblemCardsResponse): ProblemCardsResponse => ({
  cedulaDirigente: d.cedulaDirigente,
  nombreDirigente: d.nombreDirigente,
  totalPlanillas: d.totalPlanillas,
  totalEnviados: d.totalEnviados,
  totalNoEncontrados: d.totalNoEncontrados,
  votantesValidos: d.votantesValidos,
  planillas: d.planillas.map((p) => ({
    planillaId: p.planillaId,
    fechaCreacion: p.fechaCreacion,
    totalEnviados: p.totalEnviados,
    totalNoEncontrados: p.totalNoEncontrados,
  })),
});

