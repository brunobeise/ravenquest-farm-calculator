import { getImage } from "../helpers/getImage";
import { Farm } from "./farms";

type Props = {
  farm: Farm;
  price: number;
  landSize: "small" | "medium" | "large";
};

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

export default function SelectedFarmDetail({ farm, price, landSize }: Props) {
  const avgYield = (farm.minYield + farm.maxYield) / 2;

  // Verifica se é uma árvore
  const isTree = farm.isTree ?? false; // Assuming isTree is a boolean added in the farm data
  const totalPlots = isTree
    ? treeLandCapacities[landSize] // Para árvores, utiliza a capacidade específica
    : landCapacities[landSize]; // Para plantas normais, utiliza a capacidade normal

  // Para árvores, o yield é multiplicado por 3
  const baseYield = isTree ? avgYield * 3 : avgYield; // 3x para árvores

  // Cálculos de custo
  const totalEffort = farm.effort * totalPlots; // Calculando o total de effort
  const costPerPlant = farm.cost; // Custo de plantio
  const totalPlantingCost = costPerPlant * totalPlots; // Custo total de plantação

  // Cálculos de receita
  const grossRevenuePerPlant = baseYield * price; // Receita bruta por plantação
  const grossRevenueTotal = grossRevenuePerPlant * totalPlots; // Receita bruta total

  // Taxa do market de 4%
  const marketFee = grossRevenueTotal * 0.04;

  // Cálculo da receita líquida
  const netProfitTotal = grossRevenueTotal - totalPlantingCost - marketFee;
  const netProfitPerPlant = netProfitTotal / totalPlots;

  // Ajustando o tempo de colheita para árvores (3x o tempo normal)
  const harvestTime = isTree
    ? farm.harvestTimeHours * 3
    : farm.harvestTimeHours;

  // Cálculos de lucro por hora e XP por hora
  const profitPerHour = netProfitTotal / harvestTime;
  const xpPerHour = (farm.xp * totalPlots * (isTree ? 3 : 1)) / harvestTime;

  // Cálculo do retorno sobre investimento
  const returnOnInvestment = (netProfitTotal / totalPlantingCost) * 100;

  return (
    <div className="p-6 mb-8 border rounded-xl shadow max-w-6xl mx-auto bg-black/10 dark:bg-white/5 text-left">
      <div className="flex items-start gap-8">
        {/* Imagem da plantação */}
        <img
          src={getImage("farm", farm.image)}
          alt={farm.name}
          className="w-32 h-32 object-contain"
        />

        {/* Coluna da esquerda: informações básicas */}
        <div className="flex-1 space-y-1 text-sm">
          <h2 className="text-2xl font-bold mb-2">{farm.name}</h2>
          <p>
            Nível necessário: <strong>{farm.level}</strong>
          </p>
          <p>
            Produção por plantação: {farm.minYield} ~ {farm.maxYield} unidades
            (média <strong>{avgYield.toFixed(2)}</strong>)
          </p>
          <p>
            Effort por unidade: <strong>{farm.effort}</strong>
          </p>
          <p>
            XP por plantação: <strong>{farm.xp}</strong>
          </p>
          <p>
            Tempo de colheita: <strong>{harvestTime} horas</strong>
          </p>
          <p>
            Plantios na land <strong>{landSize}</strong>:{" "}
            <strong>{totalPlots}</strong>
          </p>
        </div>

        {/* Coluna da direita: cálculos detalhados */}
        <div className="flex-1 space-y-1 text-sm">
          <p>
            Custo por unidade (preço de plantio):{" "}
            <strong className="text-red-600">{costPerPlant.toFixed(2)}</strong>
          </p>
          <p>
            Custo total de plantio:{" "}
            <strong className="text-red-600">
              {totalPlantingCost.toFixed(2)}
            </strong>
          </p>
          <p>
            Effort total: <strong>{totalEffort}</strong>
          </p>

          <hr className="my-2 opacity-20" />

          <p>
            Receita bruta por plantação:{" "}
            <strong>{grossRevenuePerPlant.toFixed(2)}</strong>
          </p>
          <p>
            Receita bruta total ({totalPlots} plantações):{" "}
            <strong>{grossRevenueTotal.toFixed(2)}</strong>
          </p>

          <p>
            Taxa do market (4%):{" "}
            <strong className="text-red-600">{marketFee.toFixed(2)}</strong>
          </p>

          <hr className="my-2 opacity-20" />

          <p>
            Receita líquida por plantação (lucro real):{" "}
            <strong className="text-green-600">
              {netProfitPerPlant.toFixed(2)}
            </strong>
          </p>
          <p>
            Receita líquida total:{" "}
            <strong className="text-green-600">
              {netProfitTotal.toFixed(2)}
            </strong>
          </p>
          <p>
            Retorno sobre o investimento:{" "}
            <strong className="text-green-600">
              {returnOnInvestment.toFixed(2)}%
            </strong>
          </p>
        </div>
      </div>

      <hr className="my-4 opacity-30" />

      <div className="flex flex-col sm:flex-row gap-8 text-sm font-semibold justify-evenly">
        <p className="text-green-600 text-lg">
          Lucro por hora: <strong>{profitPerHour.toFixed(2)}</strong>
        </p>
        <p className="text-green-600 text-lg">
          XP por hora: <strong>{xpPerHour.toFixed(1)}</strong>
        </p>
        <p className="text-green-600 text-lg">
          Lucro total por leva: <strong>{netProfitTotal.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
}
