exports.ordenamientoDescendente = (a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }

  exports.ordenamientoAscendente = (a, b) => {
    if (b > a) {
      return 1;
    }
    if (b < a) {
      return -1;
    }
    return 0;
  }