# @assessment-ai/config

Centralized, Zod-validated environment configuration for the Assessment AI monorepo.

## Usage

Never use process.env.X directly in apps. Instead:

```ts
import { apiEnv } from '@assessment-ai/config';

console.log(apiEnv.PORT);
```

The app will fail fast at startup if environment variables are missing or invalid.
