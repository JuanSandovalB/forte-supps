
import "./AdminHistory.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { products } from "../../data/products";

const statusLabels = {
    available: "Disponible",
    sold_out: "Agotado",
    coming_soon: "Próximamente",
};


const formatPrice = (value) => {
    if (value === null || value === undefined) {
        return "Sin definir";
    }

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Number(value));
};

const formatDate = (value) => {
    return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

export default function AdminHistory() {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const productNames = useMemo(() => {
        return Object.fromEntries(
            products.map((product) => [
                product.slug,
                product.name,
            ])
        );
    }, []);

    useEffect(() => {
        let active = true;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    navigate("/admin/login", { replace: true });
                    return;
                }

                const { data: isAdmin, error: adminError } =
                    await supabase.rpc("is_admin");

                if (adminError || isAdmin !== true) {
                    navigate("/admin/login", { replace: true });
                    return;
                }

                const { data, error } = await supabase
                    .from("admin_product_history")
                    .select(
                        "id, product_slug, change_type, movement, " +
                        "previous_price, new_price, " +
                        "previous_status, new_status, changed_at"
                    )
                    .order("changed_at", { ascending: false })
                    .order("id", { ascending: false })
                    .limit(200);

                if (error) throw error;

                if (active) {
                    setHistory(data ?? []);
                }
            } catch (error) {
                console.error("Error consultando historial:", error);

                if (active) {
                    setErrorMessage(
                        "No fue posible consultar el historial. " +
                        "Verifica los permisos en Supabase."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadHistory();

        return () => {
            active = false;
        };
    }, [navigate]);

    const filteredHistory = useMemo(() => {
        const term = search.trim().toLowerCase();

        return history.filter((item) => {
            const productName =
                productNames[item.product_slug] ??
                item.product_slug;

            const matchesSearch =
                productName.toLowerCase().includes(term) ||
                item.product_slug.toLowerCase().includes(term);

            let matchesFilter = true;

            if (filter === "price") {
                matchesFilter = item.change_type === "price";
            } else if (filter === "availability") {
                matchesFilter = item.change_type === "availability";
            } else if (filter === "increase") {
                matchesFilter =
                    item.change_type === "price" &&
                    item.movement === "increase";
            } else if (filter === "decrease") {
                matchesFilter =
                    item.change_type === "price" &&
                    item.movement === "decrease";
            }

            return matchesSearch && matchesFilter;
        });
    }, [history, search, filter, productNames]);

    const getMovementText = (item) => {
        if (item.change_type === "availability") {
            return "Cambio de disponibilidad";
        }

        if (item.movement === "increase") {
            return "Aumento de precio";
        }

        if (item.movement === "decrease") {
            return "Disminución de precio";
        }

        if (item.movement === "removed") {
            return "Precio eliminado";
        }

        return "Precio registrado";
    };

    const getMovementClass = (item) => {
        if (item.movement === "increase") return "increase";
        if (item.movement === "decrease") return "decrease";

        return "neutral";
    };

    const deleteMovement = async (item) => {
        const confirmed = window.confirm(
            "¿Eliminar este movimiento del historial?\n\n" +
            "Esta acción es permanente y no modifica " +
            "el precio ni la disponibilidad actual."
        );

        if (!confirmed) return;

        setDeletingId(item.id);
        setErrorMessage("");

        try {
            const { data, error } = await supabase.rpc(
                "delete_product_history_entry",
                { p_history_id: item.id }
            );

            if (error) throw error;

            if (data !== true) {
                throw new Error("Movimiento no encontrado.");
            }

            setHistory((current) =>
                current.filter(
                    (movement) => movement.id !== item.id
                )
            );
        } catch (error) {
            console.error("Error eliminando movimiento:", error);

            window.alert(
                "No fue posible eliminar el movimiento."
            );
        } finally {
            setDeletingId(null);
        }
    };


    return (
        <main className="admin-history">
            <div className="admin-history__container">

                <header className="admin-history__header">
                    <div>
                        <span className="admin-history__eyebrow">
                            FORTE SUPPS · ADMINISTRACIÓN
                        </span>

                        <h1>Historial de movimientos</h1>

                        <p>
                            Consulta los cambios de precios y
                            disponibilidad de tus productos.
                        </p>
                    </div>

                    <Link
                        to="/admin"
                        className="admin-history__back"
                    >
                        ← VOLVER AL ADMINISTRADOR
                    </Link>
                </header>

                <section className="admin-history__toolbar">
                    <input
                        type="search"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        aria-label="Buscar productos en el historial"
                    />

                    <select
                        value={filter}
                        onChange={(event) =>
                            setFilter(event.target.value)
                        }
                        aria-label="Filtrar movimientos"
                    >
                        <option value="all">
                            Todos los movimientos
                        </option>

                        <option value="price">
                            Cambios de precio
                        </option>

                        <option value="increase">
                            Aumentos
                        </option>

                        <option value="decrease">
                            Disminuciones
                        </option>

                        <option value="availability">
                            Disponibilidad
                        </option>
                    </select>
                </section>

                {loading ? (
                    <div className="admin-history__message" role="status">
                        Cargando historial...
                    </div>
                ) : errorMessage ? (
                    <div
                        className="admin-history__message admin-history__message--error"
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                ) : (
                    <>
                        <div className="admin-history__counter">
                            {filteredHistory.length} movimientos encontrados
                        </div>

                        {filteredHistory.length === 0 ? (
                            <div className="admin-history__message">
                                No se encontraron movimientos.
                            </div>
                        ) : (
                            <div className="admin-history__list">
                                {filteredHistory.map((item) => {
                                    const productName =
                                        productNames[item.product_slug] ??
                                        item.product_slug;

                                    const isPrice =
                                        item.change_type === "price";

                                    const difference =
                                        item.previous_price !== null &&
                                            item.new_price !== null
                                            ? Number(item.new_price) -
                                            Number(item.previous_price)
                                            : null;

                                    return (
                                        <article
                                            key={item.id}
                                            className="admin-history__card"
                                        >
                                            <div className="admin-history__card-top">
                                                <div>
                                                    <span className="admin-history__category">
                                                        {isPrice
                                                            ? "PRECIO"
                                                            : "DISPONIBILIDAD"}
                                                    </span>

                                                    <h2>{productName}</h2>

                                                    <p>{item.product_slug}</p>
                                                </div>


                                                <div className="admin-history__card-actions">
                                                    <time dateTime={item.changed_at}>
                                                        {formatDate(item.changed_at)}
                                                    </time>

                                                    <button
                                                        type="button"
                                                        className="admin-history__delete"
                                                        disabled={deletingId !== null}
                                                        onClick={() => deleteMovement(item)}
                                                        aria-label={`Eliminar movimiento de ${productName}`}
                                                    >
                                                        {deletingId === item.id
                                                            ? "ELIMINANDO..."
                                                            : "ELIMINAR REGISTRO"}
                                                    </button>
                                                </div>

                                            </div>

                                            <div className="admin-history__movement">
                                                <span
                                                    className={`admin-history__movement-label admin-history__movement-label--${getMovementClass(item)}`}
                                                >
                                                    {getMovementText(item)}
                                                </span>

                                                {isPrice ? (
                                                    <>
                                                        <div className="admin-history__values">
                                                            <span>
                                                                {formatPrice(item.previous_price)}
                                                            </span>

                                                            <strong>→</strong>

                                                            <span>
                                                                {formatPrice(item.new_price)}
                                                            </span>
                                                        </div>

                                                        {difference !== null &&
                                                            difference !== 0 && (
                                                                <strong
                                                                    className={`admin-history__difference ${difference > 0
                                                                            ? "admin-history__difference--up"
                                                                            : "admin-history__difference--down"
                                                                        }`}
                                                                >
                                                                    {difference > 0 ? "↑ " : "↓ "}
                                                                    {formatPrice(Math.abs(difference))}
                                                                </strong>
                                                            )}
                                                    </>
                                                ) : (
                                                    <div className="admin-history__values">
                                                        <span>
                                                            {statusLabels[item.previous_status] ??
                                                                "Sin estado anterior"}
                                                        </span>

                                                        <strong>→</strong>

                                                        <span>
                                                            {statusLabels[item.new_status] ??
                                                                "Sin definir"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

            </div>
        </main>
    );
}
