export const jsonBeautify = (str: string) => {
  if (!str || str.trim() === "") {
    return "";
  }
  try {
    const ret = JSON.stringify(jsonParseSafe(str), null, 2);
    return ret;
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("jsonBeautify", error.message, str);
  }
  return "";
};

export const jsonParseSafe = (str: string) => {
  if (!str || str.trim() === "") {
    return "";
  }
  try {
    const ret = JSON.parse(
      str
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        .replace(/[\u0000-\u0019]+/g, "")
    );
    return ret;
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("jsonParseSafe", error.message, str);
  }

  return "";
};
