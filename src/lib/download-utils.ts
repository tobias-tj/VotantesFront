import type { Planilla, PlanillaDetalle } from "./types"

export function downloadCSV(data: Planilla[], filename: string = "planillas") {
  const headers = [
    "Planilla ID",
    "Cedula Dirigente",
    "Nombre Dirigente",
    "Cedula Planillero",
    "Total Enviados",
    "Total Validos",
    "Total No Existentes",
    "Fecha Creacion",
  ]

  const rows = data.map((p) => [
    p.id,
    p.cedulaDirigente,
    p.nombreDirigente,
    p.cedulaPlanillero,
    p.totalEnviados,
    p.totalValidos,
    p.totalNoExistentes,
    p.fechaCreacion,
  ])

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadPDF(data: Planilla[], filename: string = "planillas") {
  // Simple HTML-to-print PDF approach
  const tableRows = data
    .map(
      (p) => `
    <tr>
      <td style="border:1px solid #ddd;padding:6px">${p.id}</td>
      <td style="border:1px solid #ddd;padding:6px">${p.cedulaDirigente}</td>
      <td style="border:1px solid #ddd;padding:6px">${p.nombreDirigente}</td>
      <td style="border:1px solid #ddd;padding:6px">${p.cedulaPlanillero}</td>
      <td style="border:1px solid #ddd;padding:6px;text-align:right">${p.totalEnviados}</td>
      <td style="border:1px solid #ddd;padding:6px;text-align:right">${p.totalValidos}</td>
      <td style="border:1px solid #ddd;padding:6px;text-align:right">${p.totalNoExistentes}</td>
      <td style="border:1px solid #ddd;padding:6px">${p.fechaCreacion}</td>
    </tr>
  `
    )
    .join("")

  const html = `
    <html>
    <head><title>${filename}</title></head>
    <body style="font-family:Arial,sans-serif;padding:20px">
      <h1 style="color:#1a365d">Reporte de Planillas</h1>
      <p style="color:#666">Generado: ${new Date().toLocaleDateString("es-DO")}</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#1a365d;color:white">
            <th style="border:1px solid #ddd;padding:8px">ID</th>
            <th style="border:1px solid #ddd;padding:8px">Cedula Dirigente</th>
            <th style="border:1px solid #ddd;padding:8px">Nombre Dirigente</th>
            <th style="border:1px solid #ddd;padding:8px">Cedula Planillero</th>
            <th style="border:1px solid #ddd;padding:8px">Enviados</th>
            <th style="border:1px solid #ddd;padding:8px">Validos</th>
            <th style="border:1px solid #ddd;padding:8px">No Existentes</th>
            <th style="border:1px solid #ddd;padding:8px">Fecha</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }
}

export function downloadDetalleCSV(detalle: PlanillaDetalle) {
  const headers = [
    "Cedula", "Nombre", "Apellido", "Fecha Nacimiento", "Fecha Inscripcion",
    "Tipo", "Direccion", "Voto PLRA", "Voto ANR", "Voto Generales",
    "Afiliaciones", "Afiliado PLRA 2025", "Departamento", "Distrito",
    "Zona", "Comite", "Local Generales", "Local Interna",
  ]

  const rows = detalle.planilla.votantes.map((v) => [
    v.cedula, v.nombre, v.apellido, v.fechaNacimiento, v.fechaInscripcion,
    v.tipo, `"${v.direccion}"`, v.votoPlra, v.votoAnr, v.votoGenerales,
    v.afiliaciones, v.afiliadoPlra2025, v.departamento, v.distrito,
    v.zona, v.comite, v.localGenerales, v.localInterna,
  ])

  const meta = [
    `Planilla,${detalle.planilla.id}`,
    `Dirigente,${detalle.dirigente.nombre_completo}`,
    `Cedula Dirigente,${detalle.dirigente.cedula}`,
    `Planillero,${detalle.planillero.nombre_completo}`,
    `Cedula Planillero,${detalle.planillero.cedula}`,
    `Fecha,${detalle.planilla.fechaCreacion}`,
    "",
  ]

  const csvContent = [...meta, headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `planilla_${detalle.planilla.id}_detalle.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadDetallePDF(detalle: PlanillaDetalle) {
  const votanteRows = detalle.planilla.votantes
    .map(
      (v) => `
    <tr>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.cedula}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.nombre}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.apellido}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.fechaNacimiento}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.fechaInscripcion}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.tipo}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.direccion}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.votoPlra}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.votoAnr}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.votoGenerales}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.afiliaciones}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.afiliadoPlra2025}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.departamento}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.distrito}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.zona}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.comite}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.localGenerales}</td>
      <td style="border:1px solid #ddd;padding:4px;font-size:10px">${v.localInterna}</td>
    </tr>
  `
    )
    .join("")

  const thStyle = "border:1px solid #ddd;padding:5px;font-size:9px;white-space:nowrap"

  const html = `
    <html>
    <head><title>Planilla ${detalle.planilla.id}</title></head>
    <body style="font-family:Arial,sans-serif;padding:20px">
      <h1 style="color:#1a365d;margin-bottom:4px">Detalle de Planilla ${detalle.planilla.id}</h1>
      <p style="color:#666;margin-bottom:2px">Generado: ${new Date().toLocaleDateString("es-PY")}</p>
      <div style="margin:16px 0;padding:12px;background:#f0f4f8;border-radius:6px">
        <p style="margin:4px 0"><strong>Dirigente:</strong> ${detalle.dirigente.nombre_completo} (${detalle.dirigente.cedula})</p>
        <p style="margin:4px 0"><strong>Planillero:</strong> ${detalle.planillero.nombre_completo} (${detalle.planillero.cedula})</p>
        <p style="margin:4px 0"><strong>Fecha:</strong> ${detalle.planilla.fechaCreacion} &nbsp; <strong>Enviados:</strong> ${detalle.planilla.totalEnviados} &nbsp; <strong>Validos:</strong> ${detalle.planilla.totalValidos} &nbsp; <strong>No Existentes:</strong> ${detalle.planilla.totalNoExistentes}</p>
      </div>
      <h2 style="color:#1a365d;font-size:14px">Listado de Votantes</h2>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#1a365d;color:white">
            <th style="${thStyle}">Cedula</th>
            <th style="${thStyle}">Nombre</th>
            <th style="${thStyle}">Apellido</th>
            <th style="${thStyle}">F. Nacimiento</th>
            <th style="${thStyle}">F. Inscripcion</th>
            <th style="${thStyle}">Tipo</th>
            <th style="${thStyle}">Direccion</th>
            <th style="${thStyle}">Voto PLRA</th>
            <th style="${thStyle}">Voto ANR</th>
            <th style="${thStyle}">V. Generales</th>
            <th style="${thStyle}">Afiliaciones</th>
            <th style="${thStyle}">Afil. PLRA 2025</th>
            <th style="${thStyle}">Departamento</th>
            <th style="${thStyle}">Distrito</th>
            <th style="${thStyle}">Zona</th>
            <th style="${thStyle}">Comite</th>
            <th style="${thStyle}">L. Generales</th>
            <th style="${thStyle}">L. Interna</th>
          </tr>
        </thead>
        <tbody>${votanteRows}</tbody>
      </table>
      <div style="margin-top:20px;padding:12px;background:#f0f4f8;border-radius:6px;font-size:12px">
        <p style="margin:2px 0"><strong>Planillero:</strong> ${detalle.planillero.nombre_completo} &mdash; Cedula: ${detalle.planillero.cedula}</p>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }
}
