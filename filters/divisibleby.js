function divisibleBy(num, divisor) {
  return num && num % divisor === 0;
}
module.exports = function() {
  return divisibleBy;
};