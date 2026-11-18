import "./Admin.css";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { products } from "../../data/products";

export default function Admin() {
    const navigate = useNavigate();

    const [checkingAuth, setCheckingAuth] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [prices, setPrices] =
        useState({});

    const [availability, setAvailability] = useState({});

    const [savingAvailabilitySlug, setSavingAvailabilitySlug] =
        useState(null);


    const [savingSlug, setSavingSlug] =
        useState(null);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                navigate("/admin/login");
                return;
            }

            const {
                data: isAdmin,
                error: adminError,
            } = await supabase.rpc("is_admin");

            if (adminError) {
                console.error(
                    "Error verificando administrador:",
                    adminError
                );

                await supabase.auth.signOut();

                navigate("/admin/login");
                return;
            }

            if (!isAdmin) {
                await supabase.auth.signOut();

                navigate("/admin/login");
                return;
            }

            await Promise.all([
                loadPrices(),
                loadAvailability(),
            ]);

            setCheckingAuth(false);
        };

        checkUser();
    }, [navigate]);

    const loadPrices = async () => {
        const { data, error } =
            await supabase
                .from("product_prices")
                .select(
                    "product_slug, price"
                );

        if (error) {
            console.error(
                "Error cargando precios:",
                error
            );

            return;
        }

        const priceMap = {};

        data.forEach((item) => {
            priceMap[item.product_slug] =
                item.price ?? "";
        });

        setPrices(priceMap);
    };

    const loadAvailability = async () => {
        const { data, error } = await supabase
            .from("product_availability")
            .select("product_slug, status");

        if (error) {
            console.error(
                "Error cargando disponibilidad:",
                error
            );
            return;
        }

        const availabilityMap = {};

        (data ?? []).forEach((item) => {
            availabilityMap[item.product_slug] = item.status;
        });

        setAvailability(availabilityMap);
    };


    const filteredProducts =
        useMemo(() => {
            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return products;
            }

            return products.filter(
                (product) => {
                    const name =
                        product.name
                            ?.toLowerCase() || "";

                    const brand =
                        product.brand
                            ?.toLowerCase() || "";

                    const category =
                        product.categoryName
                            ?.toLowerCase() || "";

                    return (
                        name.includes(term) ||
                        brand.includes(term) ||
                        category.includes(term)
                    );
                }
            );
        }, [search]);

    const handlePriceChange = (
        slug,
        value
    ) => {
        const onlyNumbers =
            value.replace(/\D/g, "");

        setPrices((current) => ({
            ...current,
            [slug]: onlyNumbers,
        }));
    };

    const savePrice = async (
        product
    ) => {
        const value =
            prices[product.slug];

        if (
            value === "" ||
            value === undefined
        ) {
            setMessage(
                "Ingresa un precio válido."
            );

            return;
        }

        const numericPrice =
            Number(value);

        if (
            Number.isNaN(numericPrice) ||
            numericPrice < 0
        ) {
            setMessage(
                "El precio ingresado no es válido."
            );

            return;
        }

        setSavingSlug(
            product.slug
        );

        setMessage("");

        const { error } =
            await supabase
                .from("product_prices")
                .upsert(
                    {
                        product_slug:
                            product.slug,

                        price:
                            numericPrice,
                    },
                    {
                        onConflict:
                            "product_slug",
                    }
                );

        if (error) {
            console.error(
                "Error guardando precio:",
                error
            );

            setMessage(
                "No fue posible guardar el precio."
            );
        } else {
            setMessage(
                `${product.name}: precio actualizado correctamente.`
            );
        }

        setSavingSlug(null);
    };

    const saveAvailability = async (product) => {
        const status =
            availability[product.slug] ?? "coming_soon";

        setSavingAvailabilitySlug(product.slug);
        setMessage("");

        const { error } = await supabase
            .from("product_availability")
            .upsert(
                {
                    product_slug: product.slug,
                    status,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "product_slug",
                }
            );

        if (error) {
            console.error(
                "Error guardando disponibilidad:",
                error
            );

            setMessage(
                "No fue posible guardar la disponibilidad."
            );
        } else {
            setMessage(
                `${product.name}: disponibilidad actualizada correctamente.`
            );
        }

        setSavingAvailabilitySlug(null);
    };



    const logout = async () => {
        const { error } = await supabase.auth.signOut({
            scope: "local",
        });

        if (error) {
            console.error("Error cerrando sesión:", error);
            setMessage("No fue posible cerrar la sesión.");
            return;
        }

        navigate("/admin/login", {
            replace: true,
        });
    };


    const formatPrice = (value) => {
        if (
            value === "" ||
            value === undefined ||
            value === null
        ) {
            return "Sin definir";
        }

        return new Intl.NumberFormat(
            "es-CO",
            {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
            }
        ).format(Number(value));
    };

    if (checkingAuth) {
        return (
            <main className="admin-loading">
                Verificando acceso...
            </main>
        );
    }

    return (
        <main className="admin-page">

            <header className="admin-header">
                <div>
                    <span>
                        <p>
                            Administra los precios y la disponibilidad
                            de los productos de Forte Supps.
                        </p>
                    </span>

                    <h1>
                        Gestión de prodcutos
                    </h1>

                    <p>
                        Modifica únicamente el precio
                        público de cada producto.
                    </p>
                </div>

                <div className="admin-header__actions">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/historial")}
                        className="admin-header__history"
                    >
                        VER HISTORIAL
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/productos")}
                        className="admin-header__back"
                    >
                        ← VOLVER A PRODUCTOS
                    </button>

                    <button
                        type="button"
                        onClick={logout}
                        className="admin-header__logout"
                    >
                        CERRAR SESIÓN
                    </button>
                </div>
            </header>

            <section className="admin-content">

                <div className="admin-toolbar">
                    <div>
                        <span>
                            CATÁLOGO
                        </span>

                        <strong>
                            {products.length} productos
                        </strong>
                    </div>

                    <input
                        type="search"
                        placeholder="Buscar producto, marca o categoría..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

                {message && (
                    <div className="admin-message">
                        {message}
                    </div>
                )}

                <div className="admin-products">

                    {filteredProducts.map(
                        (product) => (
                            <article
                                key={product.slug}
                                className="admin-product"
                            >

                                <div className="admin-product__image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>

                                <div className="admin-product__info">

                                    <span>
                                        {product.brand}
                                    </span>

                                    <h2>
                                        {product.name}
                                    </h2>

                                    <p>
                                        {product.categoryName}
                                        {product.presentation
                                            ? ` · ${product.presentation}`
                                            : ""}
                                    </p>

                                    <small>
                                        Precio actual:{" "}
                                        {formatPrice(
                                            prices[
                                            product.slug
                                            ]
                                        )}
                                    </small>

                                </div>

                                <div className="admin-product__price">

                                    <label>
                                        Precio COP

                                        <div className="admin-product__input">

                                            <span>
                                                $
                                            </span>

                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={
                                                    prices[
                                                    product.slug
                                                    ] ?? ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handlePriceChange(
                                                        product.slug,
                                                        event.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Sin definir"
                                            />

                                        </div>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            savePrice(
                                                product
                                            )
                                        }
                                        disabled={
                                            savingSlug ===
                                            product.slug
                                        }
                                    >
                                        {savingSlug ===
                                            product.slug
                                            ? "GUARDANDO..."
                                            : "GUARDAR PRECIO"}
                                    </button>

                                </div>

                                <div className="admin-product__availability">

                                    <label htmlFor={`availability-${product.slug}`}>
                                        Disponibilidad
                                    </label>

                                    <select
                                        id={`availability-${product.slug}`}
                                        value={
                                            availability[product.slug] ?? "coming_soon"
                                        }
                                        onChange={(event) =>
                                            setAvailability((current) => ({
                                                ...current,
                                                [product.slug]: event.target.value,
                                            }))
                                        }
                                    >
                                        <option value="available">
                                            Disponible
                                        </option>

                                        <option value="sold_out">
                                            Agotado
                                        </option>

                                        <option value="coming_soon">
                                            Próximamente
                                        </option>
                                    </select>

                                    <button
                                        type="button"
                                        disabled={
                                            savingAvailabilitySlug === product.slug
                                        }
                                        onClick={() => saveAvailability(product)}
                                    >
                                        {savingAvailabilitySlug === product.slug
                                            ? "GUARDANDO..."
                                            : "GUARDAR ESTADO"}
                                    </button>

                                </div>


                            </article>
                        )
                    )}

                </div>

            </section>

        </main>
    );
}