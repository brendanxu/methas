import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/South Pole/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // Test navigation menu
    await page.click('text=Contact')
    await expect(page).toHaveURL(/.*contact/)
    
    // Test back to home
    await page.click('text=Home')
    await expect(page).toHaveURL('/')
  })

  test('should have accessible elements', async ({ page }) => {
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for skip link
    await expect(page.locator('text=Skip to main content')).toBeHidden()
    
    // Test skip link becomes visible on focus
    await page.keyboard.press('Tab')
    await expect(page.locator('text=Skip to main content')).toBeVisible()
  })

  test('should load hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Climate Solutions')
    await expect(page.locator('text=Get Started')).toBeVisible()
  })

  test('should load services section', async ({ page }) => {
    await expect(page.locator('text=Our Services')).toBeVisible()
    await expect(page.locator('text=Carbon Footprint')).toBeVisible()
  })

  test('should have working language switcher', async ({ page }) => {
    // Test language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]')
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click()
      await page.click('text=中文')
      await expect(page.locator('text=气候解决方案')).toBeVisible({ timeout: 10000 })
    }
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('nav')).toBeVisible()
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('nav')).toBeVisible()
    
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('nav')).toBeVisible()
  })
})