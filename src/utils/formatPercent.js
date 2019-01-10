// the 24h percentage change over 100 mean it's not stable
// dont recommended to trade on those
export default value => {
  const percent = Math.round(value * 10000) / 100;
  if (Math.abs(percent) >= 100) return '-';
  return percent;
};
