import { getImage } from "../helpers/getImage";
import { Farm, landCapacities, treeLandCapacities } from "./farms";

type Props = {
  farm: Farm;
  price: number;
  onClick: () => void;
  landSize: "small" | "medium" | "large"; // Passando landSize como props
  profitPerHour: number; // Recebendo o lucro por hora calculado em FarmList
  xpPerHour: number; // Recebendo o XP por hora calculado em FarmList
  level: number; // Recebendo o level do usuário
  totalEffort: number; // Recebendo o effort total disponível
};

export default function FarmCard({
  farm,
  onClick,
  profitPerHour,
  xpPerHour,
  landSize,
  level,
  totalEffort,
}: Props) {
  // Calculando o tempo de colheita ajustado (x3 se for árvore)
  const harvestTime = farm.isTree
    ? farm.harvestTimeHours * 3
    : farm.harvestTimeHours;

  // Cálculo do total de effort
  const totalPlots = farm.isTree
    ? treeLandCapacities[landSize]
    : landCapacities[landSize];
  const totalEffortRequired = farm.effort * totalPlots;

  // Verifica se o level e o effort são suficientes
  const isLevelSufficient = farm.level <= level;
  const isEffortSufficient = totalEffortRequired <= totalEffort;

  // Definindo a classe para o card e o tooltip
  const cardClass =
    !isLevelSufficient || !isEffortSufficient
      ? "opacity-50 cursor-not-allowed"
      : "";
  const tooltip = !isLevelSufficient
    ? "Nível necessário não alcançado"
    : !isEffortSufficient
    ? "Effort insuficiente"
    : "";

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow-md p-4 flex flex-col gap-3 border text-left cursor-pointer hover:bg-[#2d2d2d] ${cardClass}`}
      title={tooltip} // Exibindo o tooltip
    >
      <img
        src={getImage("farm", farm.image)}
        alt={farm.name}
        className="w-16 h-16 object-contain self-center"
      />
      <h3 className="font-semibold text-lg text-center">{farm.name}</h3>

      {/* Display of profit per planting */}
      <div className="text-sm">
        Lucro por hora:{" "}
        <span className="text-green-600 font-bold">
          {profitPerHour.toFixed(2)}
        </span>
      </div>

      <div className="text-sm">XP por hora: {xpPerHour.toFixed(1)}</div>

      {/* Informações adicionais na parte de baixo */}
      <div className="flex gap-4 mt-4 text-sm text-nowrap justify-center w-full px-4">
        {/* Tempo de colheita */}
        <div className="flex items-center gap-1">
          <span role="img" aria-label="Level">
            📈
          </span>
          <span>{farm.level}</span>
        </div>
        <div className="flex items-center gap-1">
          <span role="img" aria-label="Clock">
            🕒
          </span>
          <span>{harvestTime} h</span>
        </div>

        {/* Effort total necessário */}
        <div className="flex items-center gap-1">
          <span role="img" aria-label="Effort">
            💪
          </span>
          <span>{totalEffortRequired}</span>
        </div>
      </div>
    </div>
  );
}
