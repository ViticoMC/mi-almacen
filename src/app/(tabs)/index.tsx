import { View } from "react-native";
import {
  AppText,
  Badge,
  Card,
  EmptyState,
  MoneyText,
  Screen,
} from "@/components/ui";

export default function HomeScreen() {
  return (
    <Screen>
      <View className="gap-1">
        <AppText variant="eyebrow" className="text-accent">
          Resumen
        </AppText>
        <AppText variant="hero">Tu almacén</AppText>
        <AppText variant="muted">Todo se guarda en este dispositivo.</AppText>
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <AppText variant="caption">Valor a costo</AppText>
          <MoneyText value={0} variant="title" />
        </Card>
        <Card className="flex-1 gap-1">
          <AppText variant="caption">Valor a venta</AppText>
          <MoneyText value={0} variant="title" />
        </Card>
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <AppText variant="caption">Unidades</AppText>
          <AppText variant="title">0</AppText>
        </Card>
        <Card className="flex-1 gap-1">
          <AppText variant="caption">Ganancia potencial</AppText>
          <MoneyText value={0} variant="title" className="text-success" />
        </Card>
      </View>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <AppText variant="title">Stock bajo</AppText>
          <Badge tone="success" label="Sin alertas" />
        </View>
        <AppText variant="muted">
          Configura un stock mínimo por producto para ver aquí los que se están agotando.
        </AppText>
      </Card>

      <EmptyState
        icon="package-variant"
        title="Aún no hay productos"
        description="En el próximo módulo podrás crear tu catálogo y empezar a registrar movimientos."
      />
    </Screen>
  );
}
