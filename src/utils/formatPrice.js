import numeral from 'numeral';

export default value => {
  if (!value) return 0;
  const n = numeral(value);
  if (value >= 1000) return n.format('0,0.00');
  if (value >= 100) return n.format('0,0.0000');
  return n.format('0,0.00000000');
};
