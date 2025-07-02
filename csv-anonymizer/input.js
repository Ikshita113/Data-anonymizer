import fs from "node:fs";
import path from "node:path";

const inputPath = path.join("csv-anonymizer/info.csv");
const originalJSONPath = path.join("csv-anonymizer/originalData.json");
const anonymizedJSONPath = path.join("csv-anonymizer/anonymizedData.json");


const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join(" ");
const maskEmail = (email) => {
  const [u, d] = email.split("@");
  return (
    u
      .split(".")
      .map((p) => p[0])
      .join(".") +
    "@" +
    d
  );
};
const maskPhone = (phone) => "x".repeat(phone.length - 2) + phone.slice(-2);

fs.readFile(inputPath, "utf8", (err, data) => {
  if (err) return console.error("Read error:", err);

  const [headerLine, ...rows] = data.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.trim());

  const original = [],
    anonymized = [];

  rows.forEach((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));

    original.push(row);
    anonymized.push({
      ...row,
      FullName: getInitials(row.FullName || ""),
      Email: maskEmail(row.Email || ""),
      PhoneNumber: maskPhone(row.PhoneNumber || ""),
    });
  });

  fs.writeFileSync(originalJSONPath, JSON.stringify(original, null, 2));
  fs.writeFileSync(anonymizedJSONPath, JSON.stringify(anonymized, null, 2));
  console.log(" Both JSON files written successfully.");
});
