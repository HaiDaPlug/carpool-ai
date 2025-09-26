import { useState, useCallback } from 'react';

export type Ledger = { personal: number; reserve: number; poolBonus: number };

export function useLedger() {
  const [ledger, setLedger] = useState<Ledger>({ personal: 120_000, reserve: 60_000, poolBonus: 0 });

  const spend = useCallback((tokens: number) => {
    setLedger(prev => {
      let { personal, reserve } = prev;
      let remaining = tokens;
      const fromPersonal = Math.min(personal, remaining); personal -= fromPersonal; remaining -= fromPersonal;
      const fromReserve  = Math.min(reserve,  remaining); reserve  -= fromReserve;  remaining -= fromReserve;
      return { ...prev, personal, reserve };
    });
  }, []);

  return { ledger, spend };
}
