import { getExchangeRate } from "./utils/currency.js";

async function runTests() {
  console.log("=== Starting Currency Conversion Tests ===");

  // Test 1: Same currency
  console.log("\nTest 1: Converting same currency (USD -> USD)...");
  const usdToUsd = await getExchangeRate("USD", "USD");
  console.log(`USD -> USD rate: ${usdToUsd} (Expected: 1.0)`);
  if (usdToUsd === 1.0) {
    console.log("PASS");
  } else {
    console.log("FAIL");
  }

  // Test 2: Standard API rate fetch
  console.log("\nTest 2: Fetching live/fallback rate (USD -> EUR)...");
  const usdToEur = await getExchangeRate("USD", "EUR");
  console.log(`USD -> EUR rate: ${usdToEur}`);
  if (typeof usdToEur === "number" && usdToEur > 0) {
    console.log("PASS");
  } else {
    console.log("FAIL");
  }

  // Test 3: Caching check
  console.log("\nTest 3: Checking cache (USD -> EUR)...");
  const start = Date.now();
  const usdToEurCached = await getExchangeRate("USD", "EUR");
  const duration = Date.now() - start;
  console.log(`USD -> EUR cached rate: ${usdToEurCached} (took ${duration}ms)`);
  if (duration < 10) {
    console.log("PASS (Successfully retrieved from cache)");
  } else {
    console.log("FAIL (Cache did not hit or is slow)");
  }

  // Test 4: Cross-rate calculation fallback
  console.log("\nTest 4: Testing fallback/cross-rate estimation (EUR -> JPY)...");
  const eurToJpy = await getExchangeRate("EUR", "JPY");
  console.log(`EUR -> JPY cross-rate: ${eurToJpy}`);
  if (typeof eurToJpy === "number" && eurToJpy > 0) {
    console.log("PASS");
  } else {
    console.log("FAIL");
  }

  // Test 5: Unknown/Invalid currency code fallback
  console.log("\nTest 5: Testing invalid currency code fallback...");
  const invalidRate = await getExchangeRate("INVALID", "USD");
  console.log(`INVALID -> USD rate: ${invalidRate} (Expected fallback: 1.0)`);
  if (invalidRate === 1.0) {
    console.log("PASS");
  } else {
    console.log("FAIL");
  }

  console.log("\n=== Currency Conversion Tests Finished ===");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
});
