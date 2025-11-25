import { About } from "./components/landing/About/About";
import { ComoIniciar } from "./components/landing/ComoIniciar/ComoIniciar";
import { Funcionalidades } from "./components/landing/Funcionalidades/Funcionalidades";
import { Hero } from "./components/landing/Hero/Hero";
import { NavBar } from "./components/landing/NavBar/NavBar";
import { Objetivo } from "./components/landing/Objetivo/Objetivo";

export default function App() {
  return (
    <div className="bg-zinc-800">
      <NavBar/>
      <Hero/>
      <About/>
      <Objetivo/>
      <Funcionalidades/>
      <ComoIniciar/>
    </div>
  )
}