export const customToString = (obj: {}): string => {
  if (Array.isArray(obj)) {
    const array: any[] = obj;
    return array.map(e => customToString(e)).join(",");
  }
  if (typeof obj === "object") {
    return JSON.stringify(obj);
  }
  if (typeof obj === "undefined") {
    return "";
  }
  if (obj !== null && obj !== undefined) {
    return obj.toString();
  }

  return "";
};

export const containsIgnoreCase = (str: string, part: string) => {
  if (!str || !part) {
    return false;
  }
  if (str.toLocaleLowerCase().includes(part.toLocaleLowerCase())) {
    return true;
  }


  return false;
};
