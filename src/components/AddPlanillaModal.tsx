import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useMemo, useState } from "react"
import type {
    AddPlanillaRequest,
    AddPlanillaResponse,
    Dirigente,
} from "@/lib/types"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./ui/command"
import { Checkbox } from "./ui/checkbox"

interface AddPlanillaModalProps {
    open: boolean
    onClose: () => void
    dirigentes: Dirigente[]
    onSubmit: (planilla: AddPlanillaRequest) => Promise<AddPlanillaResponse>
}

export function AddPlanillaModal({
    open,
    onClose,
    dirigentes,
    onSubmit,
}: AddPlanillaModalProps) {
    const { user } = useAuth()

    const [selectedDirigente, setSelectedDirigente] = useState("")
    const [votantesText, setVotantesText] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createNewDirigente, setCreateNewDirigente] = useState(false)
    const [newDirigenteNombre, setNewDirigenteNombre] = useState("")
    const [newDirigenteCedula, setNewDirigenteCedula] = useState("")

    const resetForm = () => {
        setSelectedDirigente("")
        setVotantesText("")
        setCreateNewDirigente(false)
        setNewDirigenteNombre("")
        setNewDirigenteCedula("")
        setError("")
        setSuccess(false)
        setIsSubmitting(false)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const parseCedulas = (text: string): string[] =>
        text
            .split(/[\n,;]+/)
            .map((c) => c.trim())
            .filter((c) => c.length > 0)

    const cedulas = useMemo(() => parseCedulas(votantesText), [votantesText])
    const cedulaCount = cedulas.length

    const selectedDirigenteData = useMemo(
        () => dirigentes.find((d) => d.cedula === selectedDirigente),
        [selectedDirigente, dirigentes]
    )

    const isFormValid = createNewDirigente
        ? newDirigenteNombre &&
        newDirigenteCedula &&
        votantesText.trim().length > 0
        : selectedDirigente && votantesText.trim().length > 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError("")
        setSuccess(false)

        if (!createNewDirigente && !selectedDirigente) {
            setError("Debe seleccionar un dirigente o crear uno nuevo.")
            return
        }

        if (createNewDirigente && (!newDirigenteNombre || !newDirigenteCedula)) {
            setError("Debe completar nombre y cédula del nuevo dirigente.")
            return
        }

        if (cedulas.length === 0) {
            setError("Debe ingresar al menos una cédula de votante.")
            return
        }

        setIsSubmitting(true)

        try {
            const planilla: AddPlanillaRequest = {
                cedulaDirigente: createNewDirigente
                    ? newDirigenteCedula
                    : selectedDirigente,
                nombreDirigente: createNewDirigente
                    ? newDirigenteNombre
                    : selectedDirigenteData?.nombre || "",
                cedulaPlanillero: user?.id || "",
                cedulasVotantes: cedulas.map((c) => Number(c)),
            }

            const result = await onSubmit(planilla)

            if (result.data.cedulasRepetidas.length > 0) {
                setError(
                    `Hay cédulas repetidas: ${result.data.cedulasRepetidas.join(", ")}`
                )
            } else {
                setSuccess(true)
            }

            handleClose()
        } catch (err) {
            console.error(err)
            setError("Error al crear la planilla")
            handleClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            setVotantesText(text)
        }
        reader.readAsText(file)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Agregar Planilla</DialogTitle>
                    <DialogDescription>
                        Seleccione un dirigente y agregue las cédulas de los votantes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2.5 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Planilla creada exitosamente.
                        </div>
                    )}

                    {/* 🔹 DIRIGENTE */}
                    <div className="flex flex-col gap-3">
                        <Label>Dirigente</Label>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={createNewDirigente}
                                onCheckedChange={(checked) => {
                                    setCreateNewDirigente(!!checked)
                                    setSelectedDirigente("")
                                }}
                            />
                            <span className="text-sm">Crear nuevo dirigente</span>
                        </div>

                        {createNewDirigente ? (
                            <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
                                <div className="flex flex-col gap-2">
                                    <Label>Nombre</Label>
                                    <input
                                        type="text"
                                        value={newDirigenteNombre}
                                        onChange={(e) =>
                                            setNewDirigenteNombre(e.target.value)
                                        }
                                        className="h-9 rounded-md border px-3 text-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Cédula</Label>
                                    <input
                                        type="number"
                                        value={newDirigenteCedula}
                                        onChange={(e) =>
                                            setNewDirigenteCedula(e.target.value)
                                        }
                                        className="h-9 rounded-md border px-3 text-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Command className="rounded-md border">
                                    <CommandInput placeholder="Buscar dirigente..." />
                                    <CommandEmpty>
                                        No se encontró dirigente.
                                    </CommandEmpty>
                                    <CommandGroup className="max-h-48 overflow-auto">
                                        {dirigentes.map((d) => (
                                            <CommandItem
                                                key={d.cedula}
                                                value={`${d.nombre} ${d.cedula}`}
                                                onSelect={() =>
                                                    setSelectedDirigente(d.cedula)
                                                }
                                                className={
                                                    selectedDirigente === d.cedula
                                                        ? "bg-primary/10 font-medium"
                                                        : ""
                                                }
                                            >
                                                {d.nombre} ({d.cedula})
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>

                                {selectedDirigenteData && (
                                    <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm">
                                        <span className="font-medium text-primary">
                                            {selectedDirigenteData.nombre} (
                                            {selectedDirigenteData.cedula})
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={() => setSelectedDirigente("")}
                                        >
                                            Cambiar
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* 🔹 CÉDULAS */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Cédulas de votantes</Label>
                            {cedulaCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {cedulaCount} cédula
                                    {cedulaCount !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        <Textarea
                            placeholder={`Ingrese cédulas separadas por comas`}
                            value={votantesText}
                            onChange={(e) => setVotantesText(e.target.value)}
                            rows={6}
                            className="font-mono text-sm"
                        />

                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="csv-upload"
                                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Cargar archivo CSV
                            </Label>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isFormValid}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar planilla"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
