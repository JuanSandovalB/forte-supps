
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const verifyAccess = async () => {
      if (active) setStatus("checking");

      try {
        // Validación de identidad con Supabase Auth
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (active) setStatus("denied");
          return;
        }

        // Comprobación de permisos administrativos
        const {
          data: isAdmin,
          error: adminError,
        } = await supabase.rpc("is_admin");

        if (adminError || isAdmin !== true) {
          if (active) setStatus("denied");
          return;
        }

        if (active) setStatus("allowed");
      } catch (error) {
        console.error("Error verificando acceso:", error);

        if (active) setStatus("denied");
      }
    };

    verifyAccess();

    // Revalidar al cambiar el estado de autenticación.
    // No interrumpir cada actualización del token.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (active) setStatus("denied");
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        verifyAccess();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="admin-loading" role="status">
        Verificando acceso administrativo...
      </main>
    );
  }

  if (status !== "allowed") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}
