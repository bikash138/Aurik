import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

/*This connection string is typically used during development or when running scripts
 directly from this package. In production, the DATABASE_URL will be pulled from 
 the environment of the application that imports this package.
*/
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
export {
  ClientType,
  VerificationTokenType,
  Gender,
} from "./generated/prisma/enums.js";
