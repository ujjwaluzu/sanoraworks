import test from "node:test";
import assert from "node:assert/strict";
import {
  validateEnquiry,
  formatProjectBrief,
  projectTypes,
} from "../src/lib/enquiry.ts";

const valid = {
  name: "Alex Morgan",
  email: "alex@example.com",
  company: "",
  projectType: projectTypes[0],
  budget: "",
  description: "We want to build a useful internal application for our team.",
  website: "",
};

test("accepts a valid enquiry without optional information", () => {
  const result = validateEnquiry(valid);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.company, "");
});

test("normalises whitespace and excludes unknown fields", () => {
  const result = validateEnquiry({
    ...valid,
    name: "  Alex Morgan  ",
    secret: "not part of the enquiry",
  });
  assert.ok(result.success);
  assert.equal(result.data.name, "Alex Morgan");
  assert.equal("secret" in result.data, false);
});

test("reports all required field errors together", () => {
  const result = validateEnquiry({});
  assert.equal(result.success, false);
  if (!result.success)
    assert.deepEqual(Object.keys(result.errors).sort(), [
      "description",
      "email",
      "name",
      "projectType",
    ]);
});

test("rejects malformed input and non-string values without throwing", () => {
  for (const input of [
    null,
    [],
    "invalid",
    42,
    { ...valid, email: { text: valid.email } },
  ])
    assert.equal(validateEnquiry(input).success, false);
});

test("rejects invalid email addresses", () => {
  for (const email of [
    "invalid",
    "a@",
    "a b@example.com",
    "a@example",
    "a".repeat(255) + "@example.com",
  ])
    assert.equal(validateEnquiry({ ...valid, email }).success, false);
});

test("enforces description boundaries after trimming", () => {
  assert.equal(
    validateEnquiry({ ...valid, description: " ".repeat(50) }).success,
    false,
  );
  assert.equal(
    validateEnquiry({ ...valid, description: "a".repeat(29) }).success,
    false,
  );
  assert.equal(
    validateEnquiry({ ...valid, description: "a".repeat(30) }).success,
    true,
  );
  assert.equal(
    validateEnquiry({ ...valid, description: "a".repeat(5000) }).success,
    true,
  );
  assert.equal(
    validateEnquiry({ ...valid, description: "a".repeat(5001) }).success,
    false,
  );
});

test("rejects forged project types and budget values", () => {
  assert.equal(
    validateEnquiry({ ...valid, projectType: "unlisted" }).success,
    false,
  );
  assert.equal(
    validateEnquiry({ ...valid, budget: "unlisted" }).success,
    false,
  );
});

test("rejects a populated honeypot", () =>
  assert.equal(
    validateEnquiry({ ...valid, website: "https://spam.example" }).success,
    false,
  ));

test("enforces name and company length limits", () => {
  assert.equal(validateEnquiry({ ...valid, name: "A" }).success, false);
  assert.equal(
    validateEnquiry({ ...valid, name: "A".repeat(101) }).success,
    false,
  );
  assert.equal(
    validateEnquiry({ ...valid, company: "A".repeat(161) }).success,
    false,
  );
});

test("downloaded briefs explicitly say they have not been sent", () => {
  const brief = formatProjectBrief(valid);
  assert.match(brief, /This brief has not been sent/);
  assert.match(brief, /Company: Not provided/);
  assert.match(brief, /Name: Alex Morgan/);
  assert.ok(brief.includes(valid.description));
});
