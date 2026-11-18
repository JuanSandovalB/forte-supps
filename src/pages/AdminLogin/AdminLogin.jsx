import "./AdminLogin.css";

import { useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import forteLogo from "../../assets/images/forte-logo.jpeg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!userError && user) {
          const {
            data: isAdmin,
            error: adminError,
          } = await supabase.rpc("is_admin");

          if (!adminError && isAdmin === true) {
            navigate("/admin", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");


    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
        options: {
          captchaToken,
        },
      });
    setCaptchaToken("");
    captchaRef.current?.reset();

    if (error) {
      console.error(
        "SUPABASE LOGIN ERROR:",
        error
      );

      setErrorMessage(
        "Correo o contraseña incorrectos."
      );

      setLoading(false);
      return;
    }

    const {
      data: isAdmin,
      error: adminError,
    } = await supabase.rpc("is_admin");

    if (adminError || !isAdmin) {
      await supabase.auth.signOut();

      setErrorMessage(
        "Este usuario no tiene permisos de administrador."
      );

      setLoading(false);
      return;
    }

    navigate("/admin", { replace: true });
  };

  if (checkingSession) {
    return (
      <main className="admin-login-page">
        <div className="admin-login__loading">
          Verificando sesión...
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login">

        <div className="admin-login__brand">
          <img
            src={forteLogo}
            alt="Forte Supps"
            className="admin-login__logo"
          />

          <div>
            <strong>
              FORTE
            </strong>

            <span>
              SUPPS
            </span>
          </div>
        </div>

        <div className="admin-login__heading">
          <span>
            ACCESO PRIVADO
          </span>

          <h1>
            Panel administrativo
          </h1>

          <p>
            Ingresa con la cuenta autorizada para
            gestionar los precios de Forte Supps.
          </p>
        </div>

        <form
          className="admin-login__form"
          onSubmit={handleSubmit}
        >
          <label>
            Correo electrónico

            <input
              type="email"
              placeholder="correo@fortesupps.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage && (
            <div className="admin-login__error">
              {errorMessage}
            </div>
          )}

          <Turnstile
            ref={captchaRef}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            options={{
              theme: "dark",
              size: "flexible",
            }}
            onSuccess={(token) => {
              setCaptchaToken(token);
            }}
            onExpire={() => {
              setCaptchaToken("");
            }}
            onError={() => {
              setCaptchaToken("");
            }}
          />

          <button
            type="submit"
            className="admin-login__button"
            disabled={loading || !captchaToken}
          >
            {loading
              ? "INGRESANDO..."
              : "INICIAR SESIÓN"}
          </button>

          <Link
            to="/admin/recuperar"
            className="admin-login__forgot"
          >
            ¿Olvidaste tu contraseña?
          </Link>


          <Link
            to="/productos"
            className="admin-login__back"
          >
            ← VOLVER A LA TIENDA
          </Link>
        </form>

      </section>
    </main>
  );
}