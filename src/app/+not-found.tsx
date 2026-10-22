import { Link } from "expo-router";
import { AppText, Button, Screen } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <Screen scroll={false} className="items-center justify-center gap-4">
      <AppText variant="hero">Pantalla no encontrada</AppText>
      <Link href="/" asChild>
        <Button label="Ir a Inicio" />
      </Link>
    </Screen>
  );
}
