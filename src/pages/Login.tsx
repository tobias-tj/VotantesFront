import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Lock, User, Vote } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  cedula: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  password: z.string().min(1, "Contraseña es requerida"),
});


type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: authLogin } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await login(data.cedula, data.password);

      authLogin(user, token);
      navigate("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo + Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-md">
            <Vote className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sistema de Planillas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestión de votantes y planillas electorales
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="border-border/60 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* ALERT ERROR */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* CEDULA */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="cedula">Cédula / Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cedula"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Ej: 1234567 (solo números, sin puntos ni guiones)"
                    className="pl-10"
                    autoComplete="username"
                    {...register("cedula", {
                      setValueAs: (value) => Number(value),
                    })}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                    }}
                  />

                </div>
                {errors.cedula && (
                  <span className="text-xs text-destructive">
                    {errors.cedula.message}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    {...register("password")}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-destructive">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Iniciar sesión"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Solo usuarios autorizados pueden acceder al sistema.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer Credit */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sistema de Planillas ·
          <span className="ml-1 font-medium text-foreground">
            Design By Yvagacore
          </span>
        </div>

      </div>
    </div>
  );
}
