export default (value) => {
  return `${Math.round(value * 10000) / 100}`;
}