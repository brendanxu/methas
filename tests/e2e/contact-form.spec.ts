import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contact')
    await expect(page.locator('form')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check for validation messages
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Please enter a valid email')).toBeVisible()
  })

  test('should submit form successfully', async ({ page }) => {
    // Fill out form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="company"]', 'Test Company')
    await page.fill('input[name="message"]', 'Test message')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 10000 })
  })

  test('should have accessible form labels', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const messageInput = page.locator('textarea[name="message"]')
    
    await expect(nameInput).toHaveAttribute('aria-label')
    await expect(emailInput).toHaveAttribute('aria-label')
    await expect(messageInput).toHaveAttribute('aria-label')
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Name field
    await expect(page.locator('input[name="name"]')).toBeFocused()
    
    await page.keyboard.press('Tab') // Email field
    await expect(page.locator('input[name="email"]')).toBeFocused()
    
    await page.keyboard.press('Tab') // Company field
    await expect(page.locator('input[name="company"]')).toBeFocused()
  })

  test('should show loading state during submission', async ({ page }) => {
    // Fill out form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="message"]', 'Test message')
    
    // Submit form and check loading state
    await page.click('button[type="submit"]')
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('text=Sending')).toBeVisible()
  })

  test('should handle form errors gracefully', async ({ page }) => {
    // Mock a server error
    await page.route('**/api/forms/contact', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    // Fill and submit form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="message"]', 'Test message')
    await page.click('button[type="submit"]')
    
    // Check for error message
    await expect(page.locator('text=Failed to send')).toBeVisible({ timeout: 10000 })
  })
})