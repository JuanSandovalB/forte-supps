
import "./Goals.css";

import ganarMusculo from "../../assets/images/goals/ganar-musculo.png";
import masEnergia from "../../assets/images/goals/mas-energia.png";
import recuperacion from "../../assets/images/goals/recuperacion.png";
import saludBienestar from "../../assets/images/goals/salud-bienestar.png";
import definicion from "../../assets/images/goals/definicion.png";

const goals = [
  {
    number: "01",
    title: "GANAR MÚSCULO",
    description: "Proteína + creatina",
    accent: "pink",
    image: ganarMusculo,
  },
  {
    number: "02",
    title: "MÁS ENERGÍA",
    description: "Pre-entrenos + hidratación",
    accent: "blue",
    image: masEnergia,
  },
  {
    number: "03",
    title: "RECUPERACIÓN",
    description: "Aminoácidos + descanso",
    accent: "cyan",
    image: recuperacion,
  },
  {
    number: "04",
    title: "SALUD Y BIENESTAR",
    description: "Vitaminas + esenciales",
    accent: "purple",
    image: saludBienestar,
  },
  {
    number: "05",
    title: "DEFINICIÓN",
    description: "Nutrición + rendimiento",
    accent: "rose",
    image: definicion,
  },
];

export default function Goals() {
  return (
    <section id="objetivos" className="section goals">
      <p className="eyebrow">
        COMPRA POR OBJETIVO
      </p>

      <h2 className="section-title">
        ¿QUÉ QUIERES LOGRAR?
      </h2>

      <p className="section-copy">
        No necesitas saber de suplementos.
        Empieza por tu objetivo y nosotros te guiamos.
      </p>

      <div className="goals__grid">
        {goals.map((goal) => (
          <article
            className={`goal goal--${goal.accent}`}
            key={goal.number}
          >
            <span>{goal.number}</span>

            <div className="goal__image">
              <img
                src={goal.image}
                alt=""
                loading="lazy"
              />
            </div>

            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
