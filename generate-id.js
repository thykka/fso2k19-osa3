// https://jsperf.com/generateid-01/1

module.exports = function generateId(items) {
  return 1 + items.reduceRight(
    (max, item) => item.id < max ? max : item.id,
    -1
  );
}
