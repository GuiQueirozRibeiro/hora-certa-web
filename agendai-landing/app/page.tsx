import { NavBar } from "@/src/components/NavBar/NavBar";
import { Hero } from "@/src/components/Hero/Hero";
import { About } from "@/src/components/About/About";
import { Funcionalidades } from "@/src/components/Funcionalidades/Funcionalidades";
import { ComoIniciar } from "@/src/components/ComoIniciar/ComoIniciar";
import { Objetivo } from "@/src/components/Objetivo/Objetivo";
import { Precos } from "@/src/components/Precos/Precos";
import { FAQ } from "@/src/components/FAQ/FAQ";
import { CTA } from "@/src/components/CTA/CTA";
import { Footer } from "@/src/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="sobre">
          <About />
        </section>
        <section id="funcoes">
          <Funcionalidades />
        </section>
        <Objetivo />
        <section id="cadastro">
        <ComoIniciar />
        </section>
        <CTA />
        <section id="precos">
          <Precos />
        </section>
        <section id="faq">
        <FAQ />
        </section>
      </main>
      <Footer />
    </>
  );
}
