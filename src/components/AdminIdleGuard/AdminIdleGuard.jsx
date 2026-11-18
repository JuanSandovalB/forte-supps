
import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

const INACTIVITY_MINUTES = 20;
const INACTIVITY_MS = INACTIVITY_MINUTES * 60 * 1000;

export default function AdminIdleGuard() {
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const closingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const closeSession = async () => {
      if (closingRef.current) return;

      closingRef.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      try {
        await supabase.auth.signOut({
          scope: "global",
        });
      } catch (error) {
        console.error(
          "No fue posible cerrar la sesión:",
          error
        );
      } finally {
        if (mounted) {
          navigate("/admin/login", {
            replace: true,
            state: {
              reason: "inactivity",
            },
          });
        }
      }
    };

    const checkInactivity = () => {
      if (closingRef.current) return;

      const inactiveFor =
        Date.now() - lastActivityRef.current;

      if (inactiveFor >= INACTIVITY_MS) {
        closeSession();
        return;
      }

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(
        checkInactivity,
        INACTIVITY_MS - inactiveFor
      );
    };

    const registerActivity = () => {
      if (closingRef.current) return;

      // Actividad dentro del administrador.
      lastActivityRef.current = Date.now();
      checkInactivity();
    };

    const checkOnReturn = () => {
      if (document.visibilityState === "visible") {
        checkInactivity();
      }
    };

    const events = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((eventName) => {
      window.addEventListener(
        eventName,
        registerActivity,
        { passive: true }
      );
    });

    window.addEventListener(
      "focus",
      checkInactivity
    );

    document.addEventListener(
      "visibilitychange",
      checkOnReturn
    );

    checkInactivity();

    return () => {
      mounted = false;
      clearTimeout(timerRef.current);

      events.forEach((eventName) => {
        window.removeEventListener(
          eventName,
          registerActivity
        );
      });

      window.removeEventListener(
        "focus",
        checkInactivity
      );

      document.removeEventListener(
        "visibilitychange",
        checkOnReturn
      );
    };
  }, [navigate]);

  return <Outlet />;
}
