import type { Dirigente, DirigenteResponse } from "@/lib/types";

export const mapDirigente = (d: DirigenteResponse): Dirigente => ({
  cedula: d.cedulaDirigente,
  nombre: d.nombreDirigente,
});
