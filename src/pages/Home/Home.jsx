import "./Home.css";

import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <main className="home">
      <div className="home__grid-overlay"></div>

      <Navbar />
      <Hero />
      <Categories />
      <Footer />
    </main>
  );
}

export default Home;