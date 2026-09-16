/**
 * Runs a task when the JS thread is idle (or on the next tick as fallback).
 * Use it to keep tab transitions and first paint free of storage
 * queries and large state updates.
 *
 * Replaces the deprecated InteractionManager.runAfterInteractions.
 */
export function deferUntilInteractions(task: () => void): () => void {
    let cancelled = false;

    const globalScope = globalThis as unknown as {
        requestIdleCallback?: (
            callback: () => void,
            options?: { timeout?: number },
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof globalScope.requestIdleCallback === "function") {
        const idleId = globalScope.requestIdleCallback(() => {
            if (!cancelled) {
                task();
            }
        });

        return () => {
            cancelled = true;
            globalScope.cancelIdleCallback?.(idleId);
        };
    }

    const timeoutId = setTimeout(() => {
        if (!cancelled) {
            task();
        }
    }, 0);

    return () => {
        cancelled = true;
        clearTimeout(timeoutId);
    };
}
