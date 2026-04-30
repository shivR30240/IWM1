let _counter = 0;

export function generateTicketId(): string {
  _counter++;
  return `IVC-2024-${String(_counter).padStart(5, "0")}`;
}

export function resetCounter() {
  _counter = 0;
}

export function generateUserId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, "0")}`;
}
