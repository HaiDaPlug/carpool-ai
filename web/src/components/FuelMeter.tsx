type Props = { personal:number; reserve:number; poolBonus?:number };
export default function FuelMeter({ personal, reserve, poolBonus = 0 }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-sm opacity-70">Personal: {personal.toLocaleString()} tok</div>
      <div className="text-sm opacity-70">Reserve: {reserve.toLocaleString()} tok</div>
      {poolBonus > 0 && <div className="text-xs opacity-60">Next pool bonus: +{poolBonus.toLocaleString()} tok</div>}
    </div>
  );
}
