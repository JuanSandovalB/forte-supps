
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import "./AdminPassword.css";

export default function AdminResetPassword() {
  const navigate = useNavigate();

  const [recoveryVerified, setRecoveryVerified] =
    useState(false);

  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const hash = new URLSearchParams(
      window.location.hash.slice(1)
    );

    const query = new URLSearchParams(
      window.location.search
    );

    if (hash.get("error") || query.get("error")) {
      setErrorMessage(
        "El enlace no es válido o ha vencido. " +
        "Solicita uno nuevo."
      );
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY") {
          setRecoveryVerified(true);
          setChecking(false);
        }

        if (event === "SIGNED_OUT") {
          setRecoveryVerified(false);
        }
      }
    );

    // Dar tiempo a Supabase para procesar
    // el enlace recibido desde el correo.
    const timer = setTimeout(() => {
      if (active) {
        setChecking(false);
      }
    }, 3500);

    return () => {
      active = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recoveryVerified || loading) return;

    if (password.length < 12) {
      setErrorMessage(
        "La contraseña debe tener al menos 12 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setPassword("");
      setConfirmPassword("");
      setRecoveryVerified(false);

      // Después de cambiar la contraseña,
      // exigimos iniciar sesión nuevamente.
      const { error: signOutError } =
        await supabase.auth.signOut({
          scope: "local",
        });

      if (signOutError) throw signOutError;

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);

      setErrorMessage(
        "No fue posible actualizar la contraseña. " +
        "Solicita un nuevo enlace si es necesario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-password-page">
      <section className="admin-password-card">

        <div className="admin-password-brand">
          FORTE <span>SUPPS</span>
        </div>

        <span className="admin-password-eyebrow">
          SEGURIDAD ADMINISTRATIVA
        </span>

        <h1>Crear nueva contraseña</h1>

        {checking ? (
          <p className="admin-password-description" role="status">
            Verificando enlace de recuperación...
          </p>
        ) : !recoveryVerified ? (
          <div>
            <p className="admin-password-error" role="alert">
              {errorMessage ||
                "No se pudo verificar el enlace de recuperación."}
            </p>

            <Link
              to="/admin/recuperar"
              className="admin-password-back"
            >
              SOLICITAR OTRO ENLACE
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <p className="admin-password-description">
              Crea una contraseña nueva de al menos
              12 caracteres.
            </p>

            <label htmlFor="new-password">
              Nueva contraseña
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={12}
              required
            />

            <label htmlFor="confirm-password">
              Confirmar contraseña
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={12}
              required
            />

            {errorMessage && (
              <p className="admin-password-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                password.length < 12 ||
                password !== confirmPassword
              }
            >
              {loading
                ? "ACTUALIZANDO..."
                : "GUARDAR NUEVA CONTRASEÑA"}
            </button>

          </form>
        )}

        <Link
          to="/admin/login"
          className="admin-password-back"
        >
          ← VOLVER AL INICIO DE SESIÓN
        </Link>

      </section>
    </main>
  );
}
