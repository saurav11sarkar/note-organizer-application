const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
) => {
  const filter: Partial<T> = {};
  for (const key of keys) {
    if (obj[key]) {
      filter[key] = obj[key];
    }
  }
  return filter;
};

export default pick;
