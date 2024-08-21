import { stringToBytes } from "@taquito/utils";

export const messageToHexExpr = (message: string) => {
  const bytes = stringToBytes(message);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  const hexExpr = "05" + "01" + paddedBytesLength + bytes;

  return hexExpr;
};
