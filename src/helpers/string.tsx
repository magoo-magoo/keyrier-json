export const customToString = (obj: any): string => {
  if (Array.isArray(obj)) {
    const array: any[] = obj;
    return array.map(e => customToString(e)).join(",");
  }
  if (typeof obj === "object") {
    return JSON.stringify(obj);
  }

  return obj;
};
