import { expect, test } from "@playwright/test";

test("加载看板", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "看板工作室" })).toBeVisible();
  await expect(page.locator('[data-testid^="column-"]')).toHaveCount(5);
});

test("向列中添加卡片", async ({ page }) => {
  await page.goto("/");
  const firstColumn = page.locator('[data-testid^="column-"]').first();
  await firstColumn.getByRole("button", { name: /添加卡片/i }).click();
  await firstColumn.getByPlaceholder("卡片标题").fill("端到端卡片");
  await firstColumn.getByPlaceholder("详细说明").fill("通过端到端测试添加。");
  await firstColumn.getByRole("button", { name: /添加卡片/i }).click();
  await expect(firstColumn.getByText("端到端卡片")).toBeVisible();
});

test("在列之间移动卡片", async ({ page }) => {
  await page.goto("/");
  const card = page.getByTestId("card-card-1");
  const targetColumn = page.getByTestId("column-col-review");
  const cardBox = await card.boundingBox();
  const columnBox = await targetColumn.boundingBox();
  if (!cardBox || !columnBox) {
    throw new Error("无法解析拖拽坐标。");
  }

  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    columnBox.x + columnBox.width / 2,
    columnBox.y + 120,
    { steps: 12 }
  );
  await page.mouse.up();
  await expect(targetColumn.getByTestId("card-card-1")).toBeVisible();
});
