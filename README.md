# Custom WInstom Logger

## Install

```bash
$ npm install custom-winston-logger
```

## Usage

```javascript
const { default: logger, setup } = require("custom-winston-logger");
setup({ some option...})

const log = logger('some-label');
log.info('...')
```

```typescript
import logger, { setup } from 'custom-winston-logger';
setup({ some option...})
const log = logger('some-label');
log.info('...')
```

### Options

```typescript
export interface OptionsInterface {
  consoleColor: boolean; // whether use color in console log output or not
  disableFile: boolean; // whether disable file log or nto
  level: "debug" | "info"; // combined log default log level
  errorLogFileName: string; // error log file name
  combinedLogFileName: string; // combined log file name
  dailyRotateFileOptions: {
    dirname: string; // log directory
    datePattern: string;
    zippedArchive: boolean;
    maxSize: string;
    maxFiles: string;
  };
}

const options: OptionsInterface = {
  consoleColor: true,
  disableFile: false,
  level: "debug",
  errorLogFileName: "error-%DATE%.log",
  combinedLogFileName: "combined-%DATE%.log",
  dailyRotateFileOptions: {
    dirname: join(process.cwd(), "logs"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  },
};
```
