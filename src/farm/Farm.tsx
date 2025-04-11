import { useEffect, useState } from "react";
import FarmCard from "./FarmCard";
import SelectedFarmDetail from "./SelectedFarmDetail";
import { farms} from "./farms";
import { getImage } from "../helpers/getImage";
import { Farm } from "./farms";

export default function FarmList() {
  const [totalEffort, setTotalEffort] = useState(() => {
    const saved = localStorage.getItem("totalEffort");
    return saved ? Number(saved) : 5000;
  });

  const [landSize, setLandSize] = useState<"small" | "medium" | "large">(
    (localStorage.getItem("landSize") as "small" | "medium" | "large") ||
      "medium"
  ); 

  const [level, setLevel] = useState(
    Number(localStorage.getItem("farmlevel")) || 50
  );

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    farms.forEach((farm) => {
      const saved = localStorage.getItem(`farm_price_${farm.name}`);
      initial[farm.name] = saved ? Number(saved) : 0;
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("totalEffort", String(totalEffort));
  }, [totalEffort]);

  useEffect(() => {
    localStorage.setItem("landSize", landSize);
  }, [landSize]);

  useEffect(() => {
    localStorage.setItem("farmLevel", level.toString());
  }, [level]);

  const updatePrice = (name: string, value: number) => {
    setPrices((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem(`farm_price_${name}`, String(value));
      return updated;
    });
  };

  // Capacidades de plantio para cada tipo de terra
  const landCapacities = {
    small: 28,
    medium: 79,
    large: 151,
  };

  const treeLandCapacities = {
    small: 10,
    medium: 26,
    large: 48,
  };

  // Calcular o lucro por hora e XP por hora considerando a land size
  const calculateFarmStats = (
    farm: Farm,
    landSize: "small" | "medium" | "large"
  ) => {
    const calcProfit = (yieldAmount: number, price: number) =>
      yieldAmount * price * 0.96;

    // Verifica se a plantação é uma árvore
    const isTree = farm.isTree ?? false;

    // Calculando a quantidade de plantações na land
    const totalPlots = isTree
      ? treeLandCapacities[landSize]
      : landCapacities[landSize];

    // Média de produção por planta
    const avgYield = (farm.minYield + farm.maxYield) / 2;

    // Aplica o fator 3x para árvores
    const baseYield = isTree ? avgYield * 3 : avgYield;

    // Calculando o tempo de colheita
    // Se for árvore, o tempo é 3x maior, pois colhe 3 vezes
    const effectiveHarvestTime = isTree
      ? farm.harvestTimeHours * 3
      : farm.harvestTimeHours;

    // Calculando o lucro por hora
    const profitPerHour =
      (calcProfit(baseYield, prices[farm.name]) * totalPlots) /
      effectiveHarvestTime;

    // Calculando o XP por hora
    const xpPerHour =
      (farm.xp * totalPlots * (isTree ? 3 : 1)) / effectiveHarvestTime;

    return { profitPerHour, xpPerHour, totalPlots, farm };
  };

  // Ordenar as plantações por lucro por hora (decrescente) e por level e effort
  const sortedFarms = [...farms].sort((a, b) => {
    const statsA = calculateFarmStats(a, landSize);
    const statsB = calculateFarmStats(b, landSize);

    // Verificar se a plantação tem level suficiente e effort suficiente
    const aCanPlant =
      a.level <= level && statsA.totalPlots * a.effort <= totalEffort;
    const bCanPlant =
      b.level <= level && statsB.totalPlots * b.effort <= totalEffort;

    // Se o farm A não pode ser plantado, coloca ele mais para baixo
    if (!aCanPlant && bCanPlant) return 1;
    if (aCanPlant && !bCanPlant) return -1;

    // Se ambos têm o mesmo critério de disponibilidade, ordena por lucro por hora
    return statsB.profitPerHour - statsA.profitPerHour;
  });

  return (
    <div className="flex px-6 py-8 gap-6 max-w-full overflow-x-auto">
      {/* Cards principais */}
      <div className="flex-1">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-primary">
            Calculadora de Plantações 🌱
          </h1>
          <h2 className="text-xl mb-5 text-primary">
            by{" "}
            <a
              href="https://discord.com/users/b_beise" // Substitua pelo seu link do Discord
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              brunobeise
            </a>
          </h2>

          <p className="text-gray-600 text-sm">
            Veja o lucro estimado de cada plantação e planeje sua produção de
            forma mais eficiente.
          </p>

          {/* Inputs principais */}
          <div className="mt-4 flex justify-center gap-10 flex-wrap items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Effort disponível:</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-20 text-center"
                value={totalEffort}
                onChange={(e) => setTotalEffort(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Level de Farm:</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-20 text-center"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tamanho da land:</label>
              <select
                className="border rounded px-2 py-1 bg-transparent text-inherit dark:bg-[#242424] dark:text-white"
                value={landSize}
                onChange={(e) =>
                  setLandSize(e.target.value as "small" | "medium" | "large")
                }
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </header>

        {/* Card grande de detalhe */}
        {selectedFarm && (
          <SelectedFarmDetail
            farm={selectedFarm}
            price={prices[selectedFarm.name]}
            landSize={landSize as "small" | "medium" | "large"}
          />
        )}

        <div className="flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFarms.map((farm) => {
              const { profitPerHour, xpPerHour } = calculateFarmStats(
                farm,
                landSize
              );
              return (
                <FarmCard
                  level={level}
                  totalEffort={totalEffort}
                  landSize={landSize}
                  key={farm.name}
                  farm={farm}
                  price={prices[farm.name]}
                  profitPerHour={profitPerHour}
                  xpPerHour={xpPerHour}
                  onClick={() => setSelectedFarm(farm)}
                />
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="w-80 pl-10 top-0">
            <h2 className="text-lg font-bold mb-4 text-center">💰 Preços</h2>
            <ul className="space-y-3">
              {farms.map((farm) => (
                <li key={farm.name} className="flex items-center gap-2">
                  <img
                    src={getImage("farm", farm.image)}
                    alt={farm.name}
                    className="w-8 h-8 object-contain rounded"
                  />
                  <span className="flex-1 text-sm">{farm.name}</span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20 text-sm text-center"
                    value={prices[farm.name]}
                    onChange={(e) =>
                      updatePrice(farm.name, Number(e.target.value))
                    }
                  />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
