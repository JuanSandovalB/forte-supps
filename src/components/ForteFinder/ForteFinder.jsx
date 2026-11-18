
import { useState } from "react";
import "./ForteFinder.css";

const exampleQuestions = [
    "Quiero ganar masa muscular",
    "Estoy empezando en el gimnasio",
    "Busco una proteína sin lactosa",
    "Quiero mejorar mi recuperación",
];

export default function ForteFinder() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "¡Hola! Soy Forte AI. Cuéntame qué quieres lograr y te ayudaré a encontrar los suplementos que mejor se adapten a tus necesidades.",
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExample = (example) => {
        setQuestion(example);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const text = question.trim();

        if (!text || loading) return;

        // La conexión con Supabase Edge Functions
        // se implementará en el siguiente paso.
        // Por ahora no enviamos consultas a una IA.

        setError(
            "Estamos preparando la conexión con Forte AI. La interfaz ya está lista, pero el asesor todavía no está activo."
        );
    };

    return (
        <section
            id="finder"
            className="section finder forte-ai"
        >
            <div className="finder__quiz">
                <span className="finder__pill">
                    FORTE AI
                </span>

                <h2>
                    Tu objetivo primero.
                    <br />
                    La recomendación inteligente después.
                </h2>

                <p>
                    Cuéntanos qué necesitas y encuentra
                    suplementos acordes con tus objetivos.
                </p>

                <div
                    className="forte-ai__conversation"
                    aria-live="polite"
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`forte-ai__message forte-ai__message--${message.role}`}
                        >
                            <span>
                                {message.role === "assistant"
                                    ? "FORTE AI"
                                    : "TÚ"}
                            </span>

                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>

                <div className="forte-ai__examples">
                    <span>PUEDES PREGUNTAR:</span>

                    <div className="forte-ai__suggestions">
                        {exampleQuestions.map((example) => (
                            <button
                                key={example}
                                type="button"
                                onClick={() => handleExample(example)}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>

                <form
                    className="forte-ai__form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="forte-ai-question">
                        CUÉNTANOS QUÉ ESTÁS BUSCANDO
                    </label>

                    <textarea
                        id="forte-ai-question"
                        value={question}
                        onChange={(event) =>
                            setQuestion(event.target.value)
                        }
                        placeholder="Ejemplo: Entreno cuatro veces a la semana, quiero ganar músculo y busco una proteína económica..."
                        maxLength={1000}
                        rows={4}
                    />

                    <div className="forte-ai__form-footer">
                        <small>
                            {question.length}/1000 caracteres
                        </small>


                        <button
                            type="submit"
                            disabled
                        >
                            FORTE AI · PRÓXIMAMENTE
                        </button>

                    </div>

                    {error && (
                        <p
                            className="forte-ai__error"
                            role="status"
                        >
                            {error}
                        </p>
                    )}
                </form>
            </div>

            <aside className="finder__preview">
                <span>ASESORÍA INTELIGENTE</span>

                <h3>
                    Encuentra lo que realmente necesitas.
                </h3>

                <p>
                    Forte AI te ayudará a explorar productos
                    según tus objetivos y preferencias.
                </p>

                <ul>
                    <li>Proteínas para tus objetivos</li>
                    <li>Creatinas y rendimiento</li>
                    <li>Nutrición y recuperación</li>
                    <li>Opciones según tu presupuesto</li>
                </ul>

                <div className="finder__note">
                    La orientación no reemplaza la
                    asesoría médica o nutricional.
                </div>
            </aside>
        </section>
    );
}
