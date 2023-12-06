import { IContact } from "../types/contact";
import { IDeal } from "../types/deal";

export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

export const titleAccessor = (
  field: IDeal | IContact,
  objectName: "Deal" | "Contact"
) => {
  switch (objectName) {
    case "Deal":
      return (field as IDeal).TITLE.toString();

    case "Contact":
      return (field as IContact).NAME;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectValue = (obj: any, keyString: string) => {
  const keys = keyString.split(".");

  let value = obj;

  for (const key of keys) {
    value = value[key];

    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

export const makeFirstLetterUppercase = (str: string) => {
  if (!str) return str;

  if (typeof str === "object") return "-";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const substitutePlaceholders = (
  string: string,
  obj: Record<string, string>
) => {
  for (const [key, value] of Object.entries(obj)) {
    string = string.replace(`__${key}__`, value);
  }
  return string;
};
