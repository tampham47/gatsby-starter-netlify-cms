import numeral from 'numeral';

export default value => {
  if (!value) return 0;
  const n = numeral(value);
  return n.format('0,0.00000000');
};
