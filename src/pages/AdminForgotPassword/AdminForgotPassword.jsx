
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";

import { supabase } from "../../lib/supabase";

import "./AdminPassword.css";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const captchaRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !captchaToken) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/admin/nueva-contrasena`,
            captchaToken,
          }
        );

      if (error) throw error;

      // Respuesta genérica para no revelar
      // si una cuenta existe o no.
      setSent(true);
    } catch (error) {
      console.error("Error solicitando recuperación:", error);

      setErrorMessage(
        "No se pudo procesar la solicitud. " +
        "Inténtalo más tarde."
      );
    } finally {
      setCaptchaToken("");
      captchaRef.current?.reset();
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
          RECUPERACIÓN DE ACCESO
        </span>

        <h1>¿Olvidaste tu contraseña?</h1>

        {sent ? (
          <div className="admin-password-success" role="status">
            <h2>Revisa tu correo</h2>
            <p>
              Si existe una cuenta asociada a esa dirección,
              recibirás un enlace para recuperar el acceso.
            </p>
            <p>
              Comprueba también la carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            <p className="admin-password-description">
              Introduce el correo de tu cuenta
              administrativa para solicitar un enlace
              de recuperación.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="recovery-email">
                Correo electrónico
              </label>

              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Correo administrativo"
                required
              />

              <div className="admin-password-captcha">
                <Turnstile
                  ref={captchaRef}
                  siteKey={
                    import.meta.env.VITE_TURNSTILE_SITE_KEY
                  }
                  options={{
                    theme: "dark",
                    size: "flexible",
                  }}
                  onSuccess={(token) =>
                    setCaptchaToken(token)
                  }
                  onExpire={() =>
                    setCaptchaToken("")
                  }
                  onError={() =>
                    setCaptchaToken("")
                  }
                />
              </div>

              {errorMessage && (
                <p className="admin-password-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !captchaToken}
              >
                {loading
                  ? "ENVIANDO..."
                  : "ENVIAR ENLACE"}
              </button>
            </form>
          </>
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
