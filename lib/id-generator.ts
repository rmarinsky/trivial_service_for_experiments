const ID_SUFFIX_LENGTH = 9;
const ID_RADIX = 36;

export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(ID_RADIX).slice(2, 2 + ID_SUFFIX_LENGTH);
  return `${prefix}-${timestamp}-${random}`;
}
