import type { InventoryMovementDetailedRow } from "@/database";
import type { ThemePalette } from "@/components/index/types";

export type MovementIconName = "tray-arrow-down" | "tray-arrow-up";

export type MovementView = {
    id: string;
    productName: string;
    typeLabel: string;
    referenceLabel: string;
    dateLabel: string;
    amountText: string;
    costText: string;
    notes: string | null;
    isOutgoing: boolean;
    icon: MovementIconName;
    iconColor: string;
};

export type TodayMovementSummary = {
    total: number;
    entries: number;
    exits: number;
    adjustments: number;
};

const quantityFormatter = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
});

const moneyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
});

const INCOMING_ICON_COLOR_FALLBACK = "#16A34A";
const OUTGOING_ICON_COLOR = "#F59E0B";

function startOfDayTimestamp(now: Date): number {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function getMovementLabel(movementType: string): string {
    if (movementType === "IN") {
        return "Entrada";
    }

    if (movementType === "OUT") {
        return "Salida";
    }

    if (movementType === "ADJUSTMENT_IN") {
        return "Ajuste +";
    }

    if (movementType === "ADJUSTMENT_OUT") {
        return "Ajuste -";
    }

    return "Movimiento";
}

export function getReferenceLabel(referenceType: string): string {
    if (referenceType === "PURCHASE") {
        return "Compra";
    }

    if (referenceType === "SALE") {
        return "Venta";
    }

    if (referenceType === "ADJUSTMENT") {
        return "Ajuste";
    }

    if (referenceType === "MANUAL") {
        return "Manual";
    }

    return "Sistema";
}

export function formatMovementDate(value: string): string {
    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) {
        return "Fecha no disponible";
    }

    return new Date(timestamp).toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Converts database rows into render-ready view models in one pass.
 *
 * Doing date parsing, labels, colors, and the daily summary here avoids
 * repeating expensive work for every row on every render, which matters on
 * low-end devices when the list grows.
 */
export function buildMovementViews(
    rows: InventoryMovementDetailedRow[],
    palette: ThemePalette,
    now: Date = new Date(),
): { views: MovementView[]; summary: TodayMovementSummary } {
    const dayStart = startOfDayTimestamp(now);
    const nextDayStart = dayStart + 24 * 60 * 60 * 1000;
    const summary: TodayMovementSummary = { total: 0, entries: 0, exits: 0, adjustments: 0 };

    const views = rows.map((movement) => {
        const isOutgoing = movement.movement_type === "OUT" || movement.movement_type === "ADJUSTMENT_OUT";
        const isAdjustment =
            movement.movement_type === "ADJUSTMENT_IN" || movement.movement_type === "ADJUSTMENT_OUT";
        const timestamp = Date.parse(movement.movement_date);
        const icon: MovementIconName = isOutgoing ? "tray-arrow-up" : "tray-arrow-down";

        if (Number.isFinite(timestamp) && timestamp >= dayStart && timestamp < nextDayStart) {
            const quantity = Number(movement.quantity || 0);
            summary.total += 1;

            if (movement.movement_type === "IN" || movement.movement_type === "ADJUSTMENT_IN") {
                summary.entries += quantity;
            }

            if (isOutgoing) {
                summary.exits += quantity;
            }

            if (isAdjustment) {
                summary.adjustments += 1;
            }
        }

        return {
            id: movement.id,
            productName: movement.product_name,
            typeLabel: getMovementLabel(movement.movement_type),
            referenceLabel: getReferenceLabel(movement.reference_type),
            dateLabel: formatMovementDate(movement.movement_date),
            amountText: `${isOutgoing ? "-" : "+"}${quantityFormatter.format(Number(movement.quantity || 0))}`,
            costText:
                movement.unit_cost === null
                    ? "Sin costo"
                    : moneyFormatter.format(Number(movement.unit_cost || 0)),
            notes: movement.notes,
            isOutgoing,
            icon,
            iconColor: isOutgoing ? OUTGOING_ICON_COLOR : (palette.accent ?? INCOMING_ICON_COLOR_FALLBACK),
        };
    });

    return { views, summary };
}
