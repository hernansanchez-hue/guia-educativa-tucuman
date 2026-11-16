// Transient field values only: never persisted or included in analytics events.
export function completedSearchGate(emit) {
  const values = new WeakMap();
  return input => {
    const value = input?.value?.trim();
    if (!value || values.get(input) === value) return false;
    values.set(input,value);
    emit();
    return true;
  };
}
