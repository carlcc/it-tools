export function convertBase({ value, fromBase, toBase }: { value: string; fromBase: number; toBase: number }) {
  const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  const fromRange = range.slice(0, fromBase);
  const toRange = range.slice(0, toBase);
  let negate = false;
  while (value.length > 0 && value[0] === '-') {
    value = value.slice(1);
    negate = !negate;
  }
  let decValue = value
    .split('')
    .reverse()
    .reduce((carry: bigint, digit: string, index: number) => {
      if (!fromRange.includes(digit)) {
        throw new Error(`Invalid digit "${digit}" for base ${fromBase}.`);
      }
      return (carry += BigInt(fromRange.indexOf(digit)) * BigInt(fromBase) ** BigInt(index));
    }, 0n);
  let newValue = '';
  while (decValue > 0) {
    newValue = toRange[Number(decValue % BigInt(toBase))] + newValue;
    decValue = (decValue - (decValue % BigInt(toBase))) / BigInt(toBase);
  }
  if (negate) {
    newValue = `-${newValue}`;
  }
  return newValue || '0';
}

// Byte conversion functions for 2's complement representation
export function convertToBytes({
  value,
  fromBase,
  byteSize,
}: {
  value: string;
  fromBase: number;
  byteSize: number;
}): string {
  const nu = Number.parseInt(value, fromBase);
  if (nu >= 0) {
    return nu.toString(16).toUpperCase().padStart(byteSize * 2, '0');
  } else {
    const n = BigInt(nu);
    let result = '';
    for (let i = 0; i < byteSize; ++i) {
      const byte = (n >> BigInt(i * 8)) & 0xFFn;
      result = byte.toString(16).toUpperCase().padStart(2, '0') + result;
    }
    return result;
  }
}

export function convertToBytes2({
  value,
  fromBase,
  byteSize,
}: {
  value: string;
  fromBase: number;
  byteSize: number;
}): string {
  const nu = Number.parseInt(value, fromBase);
  const n = BigInt(nu);
  let result = '';
  for (let i = 0; i < byteSize; ++i) {
    const byte = (n >> BigInt(i * 8)) & 0xFFn;
    const byte1s = byte.toString(2).toUpperCase().padStart(8, '0');
    const tmp = `${byte1s.substring(0, 4)}'${byte1s.substring(4, 8)}`;
    if (i > 0) {
      result = `${tmp}'${result}`;
    } else {
      result = tmp;
    }
  }
  return result;
}
