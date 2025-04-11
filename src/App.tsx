import { useEffect, useState } from "react";
import "./App.css";
import Farm from "./farm/Farm";
import Clarity from "@microsoft/clarity";
import { defaultPrices } from "./farm/farms";

function App() {
  const [pricesInitialized, setPricesInitialized] = useState(false); // Estado para controle de inicialização dos preços

  useEffect(() => {
    // Inicializa o Clarity
    Clarity.init("r2j8it6gwk");

    // Verifica se é o primeiro acesso, ou seja, se os preços ainda não estão no localStorage
    const isFirstAccess = Object.keys(defaultPrices).some(
      (key) => !localStorage.getItem(`farm_price_${key}`)
    );

    if (isFirstAccess) {
      // Se for o primeiro acesso, define os preços no localStorage
      Object.entries(defaultPrices).forEach(([farmName, price]) => {
        localStorage.setItem(`farm_price_${farmName}`, String(price));
      });
      console.log("Preços definidos no localStorage.");
    } else {
      console.log("Preços já estão no localStorage.");
    }

    // Atualiza o estado para forçar a re-renderização
    setPricesInitialized(true); // Aqui definimos o estado para true, o que fará com que o componente seja re-renderizado
  }, []);

  if (!pricesInitialized) {
    return <div>Carregando...</div>; // Pode mostrar um carregando até que os preços sejam inicializados
  }

  return (
    <>
      <Farm />
    </>
  );
}

export default App;