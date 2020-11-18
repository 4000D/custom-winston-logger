import { format } from "winston";

const isEmptyObject = (obj: Object) => !Object.keys(obj).length;

export default format.printf(
  ({ label, level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${label}] ${level}: ${message} `;

    if (!isEmptyObject(metadata)) {
      msg += JSON.stringify(metadata);
    }

    return msg;
  }
);
