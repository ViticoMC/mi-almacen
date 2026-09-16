import type { ThemePalette } from "@/components/index/types";
import {
    getAdjustmentDocument,
    getManualMovementDocument,
    getPurchaseDocument,
    getSaleDocument,
    type AdjustmentDocument,
    type ManualMovementDocument,
    type MovementDocumentRef,
    type PurchaseDocument,
    type SaleDocument,
} from "@/database";
import { cn } from "@/utils/cn";
import {
    formatMoney,
    formatMovementDate,
    formatQuantity,
    getMovementLabel,
    getReferenceLabel,
} from "@/utils/movement-presentation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SQLiteDatabase } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type MovementDetailProps = {
    db: SQLiteDatabase;
    documentRef: MovementDocumentRef;
    palette: ThemePalette;
};

type LoadedDocument =
    | { kind: "PURCHASE"; doc: PurchaseDocument }
    | { kind: "SALE"; doc: SaleDocument }
    | { kind: "ADJUSTMENT"; doc: AdjustmentDocument }
    | { kind: "MANUAL"; doc: ManualMovementDocument };

/**
 * Ficha resumen de un documento de inventario (compra, venta, ajuste o
 * movimiento manual) con sus partidas desglosadas: producto, presentación,
 * cantidad, precio/costo y subtotal de cada línea.
 *
 * Contenido pensado para vivir dentro de una página con scroll propio
 * (como la ficha de producto).
 */
export default function MovementDetail({ db, documentRef, palette }: MovementDetailProps) {
    const [document, setDocument] = useState<LoadedDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        // El modal se monta de nuevo en cada apertura, así que el estado
        // inicial (cargando) ya cubre el reinicio entre documentos.
        void (async () => {
            try {
                const { referenceType, referenceId } = documentRef;
                let loaded: LoadedDocument | null = null;

                if (referenceType === "PURCHASE") {
                    const doc = await getPurchaseDocument(db, referenceId);
                    loaded = doc ? { kind: "PURCHASE", doc } : null;
                } else if (referenceType === "SALE") {
                    const doc = await getSaleDocument(db, referenceId);
                    loaded = doc ? { kind: "SALE", doc } : null;
                } else if (referenceType === "ADJUSTMENT") {
                    const doc = await getAdjustmentDocument(db, referenceId);
                    loaded = doc ? { kind: "ADJUSTMENT", doc } : null;
                } else {
                    const doc = await getManualMovementDocument(db, referenceId);
                    loaded = doc ? { kind: "MANUAL", doc } : null;
                }

                if (!isActive) {
                    return;
                }

                if (!loaded) {
                    setError("No se encontró el documento.");
                } else {
                    setDocument(loaded);
                }
            } catch (err) {
                if (isActive) {
                    setError(err instanceof Error ? err.message : "No se pudo cargar el detalle.");
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [db, documentRef]);

    return (
        <>
            {loading ? (
                <View className="rounded-[22px] border p-6 items-center gap-3 bg-surface border-border">
                    <ActivityIndicator color={palette.accent} />
                    <Text className="text-body-muted text-content-muted">Cargando detalle...</Text>
                </View>
            ) : error || !document ? (
                <View className="rounded-[22px] border p-6 items-center gap-2 bg-surface border-border">
                    <MaterialCommunityIcons name="alert-octagon-outline" size={26} color="#DC2626" />
                    <Text className="text-button-label text-content text-center">
                        {error ?? "No se encontró el documento."}
                    </Text>
                </View>
            ) : (
                <DocumentBody document={document} />
            )}
        </>
    );
}

function DocumentBody({ document }: { document: LoadedDocument }) {
    if (document.kind === "PURCHASE") {
        return <PurchaseBody doc={document.doc} />;
    }

    if (document.kind === "SALE") {
        return <SaleBody doc={document.doc} />;
    }

    if (document.kind === "ADJUSTMENT") {
        return <AdjustmentBody doc={document.doc} />;
    }

    return <ManualBody doc={document.doc} />;
}

function TypeBadge({ label, tone }: { label: string; tone: "accent" | "warning" | "neutral" }) {
    return (
        <View
            className={cn(
                "rounded-full px-3 py-1.5 self-start",
                tone === "accent" && "bg-accent-soft",
                tone === "warning" && "bg-warning/15",
                tone === "neutral" && "bg-content-muted/12",
            )}
        >
            <Text
                className={cn(
                    "text-chip uppercase",
                    tone === "accent" && "text-accent",
                    tone === "warning" && "text-warning",
                    tone === "neutral" && "text-content-muted",
                )}
            >
                {label}
            </Text>
        </View>
    );
}

function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row items-start justify-between gap-3">
            <Text className="text-body-muted text-content-muted">{label}</Text>
            <Text className="text-button-label text-content text-right flex-1">{value}</Text>
        </View>
    );
}

function SummaryRow({ label, value, highlighted }: { label: string; value: string; highlighted?: boolean }) {
    return (
        <View className="flex-row items-center justify-between gap-3">
            <Text className={highlighted ? "text-button-label text-content" : "text-body-muted text-content-muted"}>
                {label}
            </Text>
            <Text className={highlighted ? "text-[20px] font-extrabold text-accent" : "text-button-label text-content"}>
                {value}
            </Text>
        </View>
    );
}

function PurchaseBody({ doc }: { doc: PurchaseDocument }) {
    const totalUnits = doc.items.reduce((sum, item) => sum + Number(item.inventory_quantity || 0), 0);

    return (
        <View className="gap-4">
            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <TypeBadge label="Compra" tone="accent" />
                <View className="gap-2">
                    <MetaRow label="Fecha" value={formatMovementDate(doc.purchase_date)} />
                    <MetaRow label="Folio" value={doc.invoice_number ?? "Sin folio"} />
                    <MetaRow label="Proveedor" value={doc.supplier_name ?? "Sin proveedor"} />
                    {doc.notes ? <MetaRow label="Notas" value={doc.notes} /> : null}
                </View>
            </View>

            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <Text className="text-button-label text-content">
                    Productos ({doc.items.length})
                </Text>
                {doc.items.length === 0 ? (
                    <Text className="text-body-muted text-content-muted">Sin partidas registradas.</Text>
                ) : (
                    doc.items.map((item, index) => (
                        <View
                            key={item.id}
                            className={cn(
                                "gap-1",
                                index < doc.items.length - 1 && "pb-3 border-b border-content-muted/12",
                            )}
                        >
                            <View className="flex-row items-start justify-between gap-3">
                                <Text className="text-button-label text-content flex-1">
                                    {item.product_name}
                                </Text>
                                <Text className="text-button-label text-content">
                                    {formatMoney(item.total)}
                                </Text>
                            </View>
                            <Text className="text-body-muted text-content-muted">
                                {formatQuantity(item.quantity)} {item.unit_name} × {formatMoney(item.unit_cost)} c/u
                                {Number(item.factor) > 1
                                    ? ` · ${formatQuantity(item.inventory_quantity)} u.`
                                    : ""}
                            </Text>
                        </View>
                    ))
                )}
            </View>

            <View className="rounded-[22px] border p-4 gap-2 bg-surface border-border">
                <SummaryRow label="Unidades totales" value={`${formatQuantity(totalUnits)} u.`} />
                <SummaryRow label="Total" value={formatMoney(doc.total)} highlighted />
            </View>
        </View>
    );
}

function SaleBody({ doc }: { doc: SaleDocument }) {
    const totalUnits = doc.items.reduce((sum, item) => sum + Number(item.inventory_quantity || 0), 0);

    return (
        <View className="gap-4">
            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <TypeBadge label="Venta" tone="warning" />
                <View className="gap-2">
                    <MetaRow label="Fecha" value={formatMovementDate(doc.sale_date)} />
                    {doc.notes ? <MetaRow label="Notas" value={doc.notes} /> : null}
                </View>
            </View>

            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <Text className="text-button-label text-content">
                    Productos ({doc.items.length})
                </Text>
                {doc.items.length === 0 ? (
                    <Text className="text-body-muted text-content-muted">Sin partidas registradas.</Text>
                ) : (
                    doc.items.map((item, index) => (
                        <View
                            key={item.id}
                            className={cn(
                                "gap-1",
                                index < doc.items.length - 1 && "pb-3 border-b border-content-muted/12",
                            )}
                        >
                            <View className="flex-row items-start justify-between gap-3">
                                <Text className="text-button-label text-content flex-1">
                                    {item.product_name}
                                </Text>
                                <Text className="text-button-label text-content">
                                    {formatMoney(item.total)}
                                </Text>
                            </View>
                            <Text className="text-body-muted text-content-muted">
                                {formatQuantity(item.quantity)} {item.unit_name} × {formatMoney(item.unit_price)} c/u
                                {Number(item.factor) > 1
                                    ? ` · ${formatQuantity(item.inventory_quantity)} u.`
                                    : ""}
                            </Text>
                            <Text className="text-body-muted text-content-muted">
                                Costo: {formatMoney(item.cost_at_sale)} c/u
                            </Text>
                        </View>
                    ))
                )}
            </View>

            <View className="rounded-[22px] border p-4 gap-2 bg-surface border-border">
                <SummaryRow label="Unidades totales" value={`${formatQuantity(totalUnits)} u.`} />
                <SummaryRow label="Total" value={formatMoney(doc.total)} highlighted />
            </View>
        </View>
    );
}

function AdjustmentBody({ doc }: { doc: AdjustmentDocument }) {
    const totalDifference = doc.items.reduce(
        (sum, item) => sum + Number(item.difference_quantity || 0),
        0,
    );

    return (
        <View className="gap-4">
            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <TypeBadge label="Ajuste" tone="neutral" />
                <View className="gap-2">
                    <MetaRow label="Fecha" value={formatMovementDate(doc.adjustment_date)} />
                    <MetaRow label="Motivo" value={doc.reason ?? "Sin motivo"} />
                </View>
            </View>

            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <Text className="text-button-label text-content">
                    Productos ({doc.items.length})
                </Text>
                {doc.items.length === 0 ? (
                    <Text className="text-body-muted text-content-muted">Sin partidas registradas.</Text>
                ) : (
                    doc.items.map((item, index) => {
                        const difference = Number(item.difference_quantity || 0);

                        return (
                            <View
                                key={item.id}
                                className={cn(
                                    "gap-1",
                                    index < doc.items.length - 1 && "pb-3 border-b border-content-muted/12",
                                )}
                            >
                                <View className="flex-row items-start justify-between gap-3">
                                    <Text className="text-button-label text-content flex-1">
                                        {item.product_name}
                                    </Text>
                                    <Text
                                        className={cn(
                                            "text-button-label",
                                            difference < 0 ? "text-danger" : "text-accent",
                                        )}
                                    >
                                        {difference > 0 ? "+" : ""}{formatQuantity(difference)} u.
                                    </Text>
                                </View>
                                <Text className="text-body-muted text-content-muted">
                                    Esperado {formatQuantity(item.expected_quantity)} → Real{" "}
                                    {formatQuantity(item.actual_quantity)}
                                </Text>
                            </View>
                        );
                    })
                )}
            </View>

            <View className="rounded-[22px] border p-4 gap-2 bg-surface border-border">
                <SummaryRow label="Productos" value={String(doc.items.length)} />
                <SummaryRow
                    label="Diferencia total"
                    value={`${totalDifference > 0 ? "+" : ""}${formatQuantity(totalDifference)} u.`}
                    highlighted
                />
            </View>
        </View>
    );
}

function ManualBody({ doc }: { doc: ManualMovementDocument }) {
    const quantity = Number(doc.quantity || 0);
    const isOutgoing = doc.movement_type === "OUT";
    const hasTotal =
        doc.unit_cost !== null &&
        doc.unit_cost !== undefined &&
        Number.isFinite(Number(doc.unit_cost));

    return (
        <View className="gap-4">
            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <TypeBadge label={getReferenceLabel(doc.reference_type)} tone="accent" />
                <View className="gap-2">
                    <MetaRow label="Tipo" value={getMovementLabel(doc.movement_type)} />
                    <MetaRow label="Fecha" value={formatMovementDate(doc.movement_date)} />
                    {doc.notes ? <MetaRow label="Notas" value={doc.notes} /> : null}
                </View>
            </View>

            <View className="rounded-[22px] border p-4 gap-3 bg-surface border-border">
                <View className="flex-row items-start justify-between gap-3">
                    <Text className="text-button-label text-content flex-1">{doc.product_name}</Text>
                    <Text
                        className={cn(
                            "text-button-label",
                            isOutgoing ? "text-warning" : "text-accent",
                        )}
                    >
                        {isOutgoing ? "-" : "+"}{formatQuantity(quantity)} u.
                    </Text>
                </View>
                <View className="gap-2">
                    <MetaRow label="Presentación" value={doc.unit_name} />
                    <MetaRow label="Cantidad" value={`${formatQuantity(quantity)} u.`} />
                    <MetaRow label="Costo c/u" value={formatMoney(doc.unit_cost)} />
                </View>
            </View>

            <View className="rounded-[22px] border p-4 gap-2 bg-surface border-border">
                <SummaryRow
                    label="Total"
                    value={hasTotal ? formatMoney(quantity * Number(doc.unit_cost || 0)) : "—"}
                    highlighted
                />
            </View>
        </View>
    );
}
