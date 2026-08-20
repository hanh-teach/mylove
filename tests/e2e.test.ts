import { test, expect } from '@playwright/test';

test.describe('LoveNote E2E Tests', () => {
  test('should change theme and persist', async ({ page }) => {
    await page.goto('/');
    
    // Go to Settings (via URL or Nav)
    // Use ID for maximum reliability
    await page.click('#nav-settings'); 
    await page.click('button:visible:has-text("Tổng quan")');
    
    // Click Dark theme
    await page.click('button:visible:has-text("Tối")');
    
    // Check if html has class 'dark'
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Reload and check again
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should show validation error for AI write without text', async ({ request }) => {
    const response = await request.post('/api/ai/write', {
      data: { action: 'rewrite' }
    });
    expect(response.status()).toBe(400);
  });

  test('should show delete confirmation modal', async ({ page }) => {
    await page.goto('/');
    await page.click('#nav-settings');
    await page.click('button:visible:has-text("Bảo mật")');
    
    // Click delete button
    await page.click('button:visible:has-text("XÓA TOÀN BỘ DỮ LIỆU DỰ ÁN")');
    
    // Check if modal is visible
    await expect(page.locator('text=Xác nhận xóa dữ liệu?')).toBeVisible();
    await expect(page.locator('button:has-text("Hủy bỏ")')).toBeVisible();
    
    // Verify confirm button is disabled
    const confirmBtn = page.locator('button:has-text("Xác nhận xóa")');
    await expect(confirmBtn).toBeDisabled();
    
    // Type XOA and verify enabled
    await page.fill('input[placeholder="XOA"]', 'XOA');
    await expect(confirmBtn).toBeEnabled();
  });
});
