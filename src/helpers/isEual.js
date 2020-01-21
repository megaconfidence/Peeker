const isEqual = function(value, other) {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  const valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;
  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);

    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }
  return true;
};

export default isEqual;
