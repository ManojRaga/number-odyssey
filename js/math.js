export const ROMAN_VALUES = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
export function roman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) throw new RangeError('Use an integer from 1 to 3999.');
  let result = '';
  for (const [symbol,value] of ROMAN_VALUES) while (n >= value) { result += symbol; n -= value; }
  return result;
}
export function parseRoman(text) {
  text = String(text).trim().toUpperCase();
  if (!/^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(text)) return null;
  let value = 0;
  for (const [symbol,n] of ROMAN_VALUES) while (text.startsWith(symbol)) { value += n; text = text.slice(symbol.length); }
  return value;
}
export function placeValues(base, length) {
  if (!Number.isInteger(base) || base < 2 || base > 60) throw new RangeError('Invalid base.');
  return Array.from({length}, (_,i) => base ** (length-i-1));
}
export function digitsFor(n, weights) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Use a non-negative whole number.');
  return weights.map(weight => { const digit = Math.floor(n/weight); n %= weight; return digit; });
}
export function valueOf(digits, weights) { return digits.reduce((total,digit,i) => total + digit * weights[i],0); }
export const MAYA_WEIGHTS = [7200,360,20,1];
export function mayaDigits(n) { return digitsFor(n,MAYA_WEIGHTS); }
export function starScore(firstTry,total) { return firstTry/total >= .85 ? 3 : firstTry/total >= .55 ? 2 : 1; }
export function canExchange(counts,index,base) { return index > 0 && counts[index] >= base; }
export function exchange(counts,index,base) {
  const next = [...counts];
  if (canExchange(next,index,base)) { next[index] -= base; next[index-1]++; }
  return next;
}
export function normalized(counts,base) { return counts.slice(1).every(n => n >= 0 && n < base); }
