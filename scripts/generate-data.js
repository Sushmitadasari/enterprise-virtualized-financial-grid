import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT = path.join(__dirname, "../public/transactions.json");
const TOTAL = 1_000_000;

const merchants = ["TechCorp", "FinBank", "RetailHub", "GlobalMart", "CloudNine"];
const categories = ["Food", "Travel", "Shopping", "Utilities", "Finance"];
const statuses = ["Completed", "Pending", "Failed"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransaction(id) {
  return {
    id,
    date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    merchant: randomItem(merchants),
    category: randomItem(categories),
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: randomItem(statuses),
    description: `Transaction ${id} description`
  };
}

console.log("Generating 1,000,000 records...");

const stream = fs.createWriteStream(OUTPUT);
stream.write("[\n");

for (let i = 1; i <= TOTAL; i++) {
  const record = JSON.stringify(generateTransaction(i));
  stream.write(record + (i !== TOTAL ? ",\n" : "\n"));
}

stream.write("]");
stream.end();

console.log("Dataset generated at public/transactions.json");