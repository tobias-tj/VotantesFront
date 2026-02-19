import type { Votante, VotanteResponse } from "@/lib/types";

export const mapVotante = (v: VotanteResponse): Votante => ({
  cedula: v.cedula_votante,
  nombre: v.nombre,
  apellido: v.apellido,
  sexo: v.sexo,
  fechaNacimiento: v.fecha_nacimiento,
  fechaInscripcion: v.fecha_inscripcion,
  tipo: v.tipo,
  direccion: v.direccion,
  votoPlra: v.voto_plra,
  votoAnr: v.voto_anr,
  votoGenerales: v.voto_generales,
  afiliaciones: v.afiliaciones,
  afiliadoPlra2025: v.afiliado_plra_2025,
  departamento: v.departamento_nombre,
  distrito: v.distrito_nombre,
  zona: v.zona_nombre,
  comite: v.comite_nombre,
  localGenerales: v.local_generales,
  localInterna: v.local_interna,
});
