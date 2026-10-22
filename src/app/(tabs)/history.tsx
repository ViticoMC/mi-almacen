import { EmptyState, Screen } from "@/components/ui";

export default function HistoryScreen() {
  return (
    <Screen>
      <EmptyState
        icon="history"
        title="Sin historial"
        description="Cada compra, venta y ajuste quedará guardado con los precios del momento."
      />
    </Screen>
  );
}
