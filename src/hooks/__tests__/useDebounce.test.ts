import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce (Hook Unit Test)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debe retornar el valor inicial inmediatamente", () => {
    const { result } = renderHook(() => useDebounce("inicial", 400));
    expect(result.current).toBe("inicial");
  });

  it("no debe actualizar el valor antes de que transcurra el tiempo de delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "primer texto", delay: 400 } }
    );

    // Cambiamos el valor
    rerender({ value: "segundo texto", delay: 400 });

    // Avanzamos el reloj solo 200ms (menos que el delay de 400ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // El valor debounced todavía debe ser el anterior
    expect(result.current).toBe("primer texto");
  });

  it("debe actualizar el valor debounced una vez transcurrido el tiempo estipulado", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "primer texto", delay: 400 } }
    );

    rerender({ value: "segundo texto", delay: 400 });

    // Avanzamos el reloj los 400ms completos
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Ahora sí debe tener el nuevo valor
    expect(result.current).toBe("segundo texto");
  });
});
