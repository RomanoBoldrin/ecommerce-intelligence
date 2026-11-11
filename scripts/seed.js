import process from "node:process";
import { seedAdmin } from "./seed-admin.js";

async function main() {
  await seedAdmin();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(`[seed] ${error.message}`);
    process.exit(1);
  });

