import { getImage } from "../helpers/getImage";
import { Farm } from "./farms";

type Props = {
  farm: Farm;
  price: number;
  onClick: () => void;
  landSize: "small" | "medium" | "large"; // Passando landSize como props
  profitPerHour: number; // Recebendo o lucro por hora calculado em FarmList
  xpPerHour: number; // Recebendo o XP por hora calculado em FarmList
};

export default function FarmCard({
  farm,
  onClick,
  profitPerHour,
  xpPerHour,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl shadow-md p-4 flex flex-col gap-3 border text-left cursor-pointer hover:bg-[#2d2d2d]"
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
        <span className="text-green-600 font-bold">{profitPerHour.toFixed(2)}</span>
      </div>

      <div className="text-sm">XP por hora: {xpPerHour.toFixed(1)}</div>
    </div>
  );
}
