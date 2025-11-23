import { Hero } from "./components/landing/Hero/Hero";
import { NavBar } from "./components/landing/NavBar/NavBar";

export default function App() {
  return (
    <div className="bg-zinc-800">
      <NavBar/>
      <Hero/>
    </div>
  )
}