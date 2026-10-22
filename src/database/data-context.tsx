import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

interface DataContextValue {
  revision: number;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: PropsWithChildren) {
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((current) => current + 1), []);
  const value = useMemo(() => ({ revision, refresh }), [revision, refresh]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataRevision(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataRevision debe usarse dentro de DataProvider");
  }
  return context;
}
