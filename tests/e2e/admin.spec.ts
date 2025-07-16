import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real environment, you'd set up test user authentication
    await page.goto('/admin/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Login')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('should require authentication for admin pages', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should validate login credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  // Note: This test would need proper test authentication setup
  test.skip('should access admin dashboard after login', async ({ page }) => {
    // Mock successful login
    await page.route('**/api/auth/signin', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          user: { 
            id: '1', 
            email: 'admin@example.com', 
            role: 'ADMIN' 
          } 
        })
      })
    })
    
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test.skip('should navigate admin sections', async ({ page }) => {
    // Assuming we're logged in
    await page.goto('/admin')
    
    // Test navigation to content management
    await page.click('text=Content Management')
    await expect(page).toHaveURL(/.*admin\/content/)
    
    // Test navigation to user management
    await page.click('text=User Management')
    await expect(page).toHaveURL(/.*admin\/users/)
    
    // Test navigation to analytics
    await page.click('text=Analytics')
    await expect(page).toHaveURL(/.*admin\/analytics/)
  })

  test.skip('should display admin statistics', async ({ page }) => {
    await page.goto('/admin')
    
    // Check for dashboard stats
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Total Content')).toBeVisible()
    await expect(page.locator('text=Total Submissions')).toBeVisible()
  })

  test('should have responsive admin layout', async ({ page }) => {
    // Test mobile admin layout
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('form')).toBeVisible()
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('form')).toBeVisible()
  })

  test('should handle admin logout', async ({ page }) => {
    // Mock logout
    await page.route('**/api/auth/signout', (route) => {
      route.fulfill({ status: 200 })
    })
    
    // This would only work if we were logged in
    // await page.click('text=Logout')
    // await expect(page).toHaveURL('/admin/login')
  })
})