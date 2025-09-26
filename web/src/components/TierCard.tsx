type Props = {
  name: string;
  price: string;
  note?: string;
  disabled?: boolean;
};

export default function TierCard({ name, price, note, disabled }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07] transition">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-medium">{name}</h3>
        <div className="text-2xl">
          {price}
          <span className="text-xs opacity-60"> /mo</span>
        </div>
      </div>
      {note && <p className="mt-2 text-sm opacity-70">{note}</p>}
      <button
        disabled={disabled}
        className={`mt-5 w-full rounded-xl px-4 py-2 ${
          disabled ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-black'
        }`}
      >
        {disabled ? 'Coming soon' : 'Get started'}
      </button>
    </div>
  );
}
