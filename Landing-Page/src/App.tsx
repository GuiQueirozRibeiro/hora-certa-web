import { About } from "./components/landing/About/About";
import { ComoIniciar } from "./components/landing/ComoIniciar/ComoIniciar";
import { CTA } from "./components/landing/CTA/CTA";
import { FAQ } from "./components/landing/FAQ/FAQ";
import { Funcionalidades } from "./components/landing/Funcionalidades/Funcionalidades";
import { Hero } from "./components/landing/Hero/Hero";
import { NavBar } from "./components/landing/NavBar/NavBar";
import { Objetivo } from "./components/landing/Objetivo/Objetivo";
import { Precos } from "./components/landing/Precos/Precos";

export default function App() {
  return (
    <div className="bg-zinc-800">
      <NavBar/>
      <Hero/>
      <About/>
      <Objetivo/>
      <Funcionalidades/>
      <ComoIniciar/>
      <Precos/>
      <CTA/>
      <FAQ/>
    </div>
  )
}