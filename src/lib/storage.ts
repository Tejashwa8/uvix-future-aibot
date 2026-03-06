export const LS = {
  get: <T>(k: string, def: T): T => {
    try {
      const v = localStorage.getItem(k);
      return v !== null ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: (k: string, v: any) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
