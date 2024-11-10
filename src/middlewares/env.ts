import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import type { ZodError } from 'zod';
import { z } from 'zod';

/**
 *  Set up a Zod Object for all required ENVIRONMENT variables for this project.
 */
expand(config({ path: 'variables.env' }));

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default('DEV'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
}).superRefine((input, context) => {
  // throw a zod error if no DATABASE AUTH TOKEN  in production

  if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
    context.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: 'string',
      received: 'undefined',
      path: ['DATABASE_AUTH_TOKEN'],
      message: 'Must be set when NODE_ENV is `production`',
    });
  }
});

// get the type of of Environment schema.
export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env;

// if any missing ENV var, log it and exit the app.
try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.log('❌ Invalid ENV:');
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
