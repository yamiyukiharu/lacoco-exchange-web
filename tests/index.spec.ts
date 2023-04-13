import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

test.beforeEach(async ({ page }) => {
  await page.route(API_URL + "tokens", async (route) => {
    const json = {
      BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        decimals: 6,
        icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
      },
      ETH: {
        symbol: "ETH",
        name: "Ethereum",
        decimals: 6,
        icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      },
      DFI: {
        symbol: "DFI",
        name: "DeFiChain",
        decimals: 6,
        icon: "https://assets.coingecko.com/coins/images/11757/small/symbol-defi-blockchain_200.png?1597306538",
      },
    };
    await route.fulfill({ json });
  });

  await page.route(API_URL + "tokens/prices", async (route) => {
    const json = {
      BTC: 20000,
      ETH: 1000,
      DFI: 0.5,
    };
    await route.fulfill({ json });
  });
});

test("has basic components", async ({ page }) => {
  await page.route(API_URL + "tokens", async (route) => {
    new Promise((resolve) => setTimeout(resolve, 1000));
  });

  await page.route(API_URL + "tokens/prices", async (route) => {
    new Promise((resolve) => setTimeout(resolve, 1000));
  });
  await page.goto("/");

  await expect(page).toHaveTitle("La Coco");
  await expect(page.getByText("La Coco Crypto Exchange")).toBeVisible();
  await expect(page.getByTestId("clock")).toBeVisible();

  await expect(page.getByTestId("widget-skeleton")).toBeVisible();
});

test("can display widget", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("widget")).toBeVisible();
});

test("price is displayed", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("widget")).toBeVisible();

  await expect(page.getByTestId("price")).toHaveText("Price: 1 ETH = 0.05 BTC");
});

test("to amount changes when from amount changes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("widget")).toBeVisible();

  const fromInput = page.getByTestId("widget-input").filter({ hasText: "From" }).getByPlaceholder("0.0");
  const toInput = page.getByTestId("widget-input").filter({ hasText: "To" }).getByPlaceholder("0.0");

  await fromInput.fill("1");
  await expect(toInput).toHaveValue("0.05");
});

test("from amount changes when to amount changes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("widget")).toBeVisible();

  const fromInput = page.getByTestId("widget-input").filter({ hasText: "From" }).getByPlaceholder("0.0");
  const toInput = page.getByTestId("widget-input").filter({ hasText: "To" }).getByPlaceholder("0.0");

  await toInput.fill("1");
  await expect(fromInput).toHaveValue("20");
});

test("token dropdown has the right contents", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("widget")).toBeVisible();

  // click from token selector
  await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-selector").click();

  const fromDropdown = await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-dropdown");
  await expect(fromDropdown).toBeVisible();
  await expect(fromDropdown).not.toHaveText("ETH");

  // click to token selector
  await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-selector").click();

  const toDropdown = await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-dropdown");
  await expect(toDropdown).toBeVisible();
  await expect(toDropdown).not.toHaveText("BTC");
});

test("can select token at from dropdown", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("widget")).toBeVisible();

  // fill in from amount
  const fromInput = page.getByTestId("widget-input").filter({ hasText: "From" }).getByPlaceholder("0.0");
  await fromInput.fill("1");

  // select DFI in from dropdown
  await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-selector").click();
  const fromDropdown = await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-dropdown");
  await expect(fromDropdown).not.toHaveText("BTC");
  await fromDropdown.getByText("DFI").click();
  await expect(fromDropdown).not.toBeVisible();
  await expect(page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-selector")).toHaveText(
    "DFI"
  );

  // check that to amounts are updated
  const toInput = page.getByTestId("widget-input").filter({ hasText: "To" }).getByPlaceholder("0.0");
  await expect(toInput).toHaveValue("0.000025");

  // check that price is updated
  await expect(page.getByTestId("price")).toHaveText("Price: 1 DFI = 0.000025 BTC");
});

test("can select token at to dropdown", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("widget")).toBeVisible();

  // fill in from amount
  const fromInput = page.getByTestId("widget-input").filter({ hasText: "From" }).getByPlaceholder("0.0");
  await fromInput.fill("1");

  // select ETH in to dropdown
  await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-selector").click();
  const toDropdown = await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-dropdown");
  await expect(toDropdown).not.toHaveText("ETH");
  await toDropdown.getByText("DFI").first().click();
  await expect(toDropdown).not.toBeVisible();
  await expect(page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-selector")).toHaveText(
    "DFI"
  );

  // check that to amounts are updated
  const toInput = page.getByTestId("widget-input").filter({ hasText: "To" }).getByPlaceholder("0.0");
  await expect(toInput).toHaveValue("2000");

  // check that price is updated
  await expect(page.getByTestId("price")).toHaveText("Price: 1 ETH = 2000 DFI");
});

test("can swap from and to tokens", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("widget")).toBeVisible();

  const swapButton = await page.getByTestId("swap-button");

  let fromSelect = await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-selector");
  let toSelect = await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-selector");

  await expect(fromSelect).toHaveText("ETH");
  await expect(toSelect).toHaveText("BTC");

  const fromInput = await page.getByTestId("widget-input").filter({ hasText: "From" }).getByPlaceholder("0.0");
  const toInput = await page.getByTestId("widget-input").filter({ hasText: "To" }).getByPlaceholder("0.0");

  await fromInput.fill("1");
  await expect(toInput).toHaveValue("0.05");

  // check that amounts are updated
  await swapButton.click();

  await expect(fromInput).toHaveValue("1");
  await expect(toInput).toHaveValue("20");

  // check that token selections are updated
  fromSelect = await page.getByTestId("widget-input").filter({ hasText: "From" }).getByTestId("token-selector");
  toSelect = await page.getByTestId("widget-input").filter({ hasText: "To" }).getByTestId("token-selector");

  await expect(fromSelect).toHaveText("BTC");
  await expect(toSelect).toHaveText("ETH");

  // check that price is updated
  await expect(page.getByTestId("price")).toHaveText("Price: 1 BTC = 20 ETH");
});
