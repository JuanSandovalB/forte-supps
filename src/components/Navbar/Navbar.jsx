
import "./Navbar.css";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useStack } from "../../context/StackContext";
import StackDrawer from "../StackDrawer/StackDrawer";

import forteLogo from "../../assets/images/forte-logo.jpeg";

export default function Navbar() {
  const { stackCount } = useStack();
  const location = useLocation();

  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cerrar el menú al cambiar de ruta.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Bloquear el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  // Cerrar con Escape.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const openStack = () => {
    closeMenu();
    setIsStackOpen(true);
  };

  const closeStack = () => setIsStackOpen(false);

  const links = [
    { label: "Inicio", to: "/" },
    { label: "Productos", to: "/productos" },
    { label: "Objetivos", to: "/#objetivos" },
    { label: "Forte Lab", to: "/#finder" },
  ];

  return (
    <>
      <header className="navbar">
        {/* LOGO */}
        <Link
          className="brand"
          to="/"
          onClick={closeMenu}
          aria-label="Forte Supps - Inicio"
        >
          <img
            src={forteLogo}
            alt="Forte Supps"
            className="brand__logo"
          />

          <span className="brand__text">
            <b>FORTE</b>
            <small>SUPPS</small>
          </span>
        </Link>

        {/* NAVEGACIÓN DE ESCRITORIO */}
        <nav
          className="navbar__desktop-nav"
          aria-label="Navegación principal"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACCIONES */}
        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__stack"
            onClick={openStack}
            aria-label={`Abrir Stack, ${stackCount} productos`}
          >
            CARRITO

            {stackCount > 0 && (
              <span className="navbar__stack-count">
                {stackCount}
              </span>
            )}
          </button>

          <Link
            className="navbar__cta"
            to="/#contacto"
          >
            Contáctanos
          </Link>

          {/* BOTÓN HAMBURGUESA */}
          <button
            type="button"
            className={`navbar__menu-toggle ${
              isMenuOpen
                ? "navbar__menu-toggle--open"
                : ""
            }`}
            onClick={() =>
              setIsMenuOpen((current) => !current)
            }
            aria-expanded={isMenuOpen}
            aria-controls="forte-mobile-menu"
            aria-label={
              isMenuOpen
                ? "Cerrar menú"
                : "Abrir menú"
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* FONDO OSCURO DEL MENÚ MÓVIL */}
      <div
        className={`navbar__mobile-overlay ${
          isMenuOpen
            ? "navbar__mobile-overlay--open"
            : ""
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* MENÚ MÓVIL */}
      <nav
        id="forte-mobile-menu"
        className={`navbar__mobile-menu ${
          isMenuOpen
            ? "navbar__mobile-menu--open"
            : ""
        }`}
        aria-label="Navegación móvil"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <span className="navbar__mobile-eyebrow">
          EXPLORA FORTE
        </span>

        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

        <Link
          to="/#contacto"
          className="navbar__mobile-contact"
          onClick={closeMenu}
        >
          CONTÁCTANOS
        </Link>
      </nav>

      {/* PANEL LATERAL DEL STACK */}
      <StackDrawer
        isOpen={isStackOpen}
        onClose={closeStack}
      />
    </>
  );
}
