To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

To refresh DB.

1. Delete the Migrations folder and delete dev.db
2. run command

```sh
bun drizzle-kit generate
```

To update schema in Database run:

```sh
bun drizzle-kit push
```

To spin up Drizzle Kit studio run:

```sh
bun drizzle-kit studio
```
