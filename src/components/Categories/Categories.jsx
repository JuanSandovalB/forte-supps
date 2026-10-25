import "./Categories.css";

function Categories() {
  const categories = [
    "Proteínas",
    "Creatinas",
    "Pre-entrenos",
    "Vitaminas",
    "Accesorios",
  ];

  return (
    <section className="categories" id="categorias">
      {categories.map((category) => (
        <span
          key={category}
          className="categories__item"
        >
          {category}
        </span>
      ))}
    </section>
  );
}

export default Categories;