import { format } from "winston";

export default format((info) => {
  if (info instanceof Error) {
    (<any>Object).assign(info, { message: info.stack });
  }
  return info;
});
