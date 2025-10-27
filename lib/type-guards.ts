/**
 * A type guard to validate if an unknown object is a valid Transaction.
 * * interface Transaction {
 * name: string;
 * description: string;
 * amount: number;
 * transactionDate: Date | string;
 * type: { id: string | number };
 * user: { id: string | number };
 * }
 */
export function validateTransaction(tx: unknown): tx is Transaction {
  // 1. Must be a non-null object
  if (typeof tx !== "object" || tx === null) {
    return false;
  }

  // 2. Cast to a generic object to safely check properties
  const obj = tx as Record<string, unknown>;

  // 3. Perform specific type and value checks
  return (
    // Check strings
    typeof obj.name === "string" &&
    obj.name.trim().length > 0 &&
    typeof obj.description === "string" &&
    obj.description.trim().length > 0 &&
    // Check amount: must be a number (this correctly allows 0)
    typeof obj.amount === "number" &&
    // Check date: must exist
    Boolean(obj.transactionDate) &&
    // Check nested objects and their IDs
    // --- THIS IS THE FIX ---
    // We check that 'type' is an object, not null, AND has an 'id' property.
    // Then we check the type of that 'id' property.
    typeof obj.type === "object" &&
    obj.type !== null &&
    "id" in obj.type &&
    (typeof obj.type.id === "string" || typeof obj.type.id === "number") &&
    // Do the same for 'user'
    typeof obj.user === "object" &&
    obj.user !== null &&
    "id" in obj.user &&
    (typeof obj.user.id === "string" || typeof obj.user.id === "number")
  );
}
