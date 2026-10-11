import { test, expect } from '@playwright/test';

test.describe('Public Website End-to-End Tests', () => {

  test('1. Home Page loads with brand, hero, and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check page title / header
    await expect(page).toHaveTitle(/Elysian Grand|Marquee/i);

    // Verify Brand Name in Navbar
    const brandName = page.locator('header').getByText(/Elysian Grand|Marquee/i);
    await expect(brandName.first()).toBeVisible();

    // Verify Navigation Links
    await expect(page.locator('header').getByRole('link', { name: /Calculator/i }).first()).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: /Catering|Packages/i }).first()).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: /Gallery/i }).first()).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: /Contact/i }).first()).toBeVisible();

    // Verify Halls link click scrolls to #halls
    const hallsLink = page.locator('header').getByRole('link', { name: /Halls/i }).first();
    await expect(hallsLink).toBeVisible();
    await hallsLink.click();
    await expect(page.locator('#halls')).toBeVisible();

    // Verify Hero CTA buttons
    const heroCalcBtn = page.getByRole('link', { name: /Estimate|Calculate/i }).first();
    await expect(heroCalcBtn).toBeVisible();
  });

  test('2. Packages & Catering Page (/packages)', async ({ page }) => {
    await page.goto('/packages');
    
    // Check main heading or package cards
    await expect(page.getByText(/Culinary Packages|Catering/i).first()).toBeVisible();

    // Verify packages exist
    const packageCards = page.locator('.rounded-3xl, .border');
    await expect(packageCards.first()).toBeVisible();

    // Check presence of pricing / currency
    await expect(page.getByText(/Rs\.|PKR|\$/i).first()).toBeVisible();
  });

  test('3. Pricing Calculator Page (/calculator)', async ({ page }) => {
    await page.goto('/calculator');
    
    // Verify calculator header
    await expect(page.getByText(/Quotation Calculator|Estimate/i).first()).toBeVisible();

    // Check Event Type buttons (e.g. Barat, Walima, Mehendi)
    const baratBtn = page.getByRole('button', { name: /Barat/i }).first();
    await expect(baratBtn).toBeVisible();
    await baratBtn.click();

    // Check Booking & Pricing Model options
    const sirfHallBtn = page.getByRole('button', { name: /Sirf Hall Booking/i }).first();
    await expect(sirfHallBtn).toBeVisible();
    await sirfHallBtn.click();
    // In Hall Only mode, bottom bar must show Catering: Self-Arranged (Rs. 0)
    await expect(page.getByText(/Catering: Self-Arranged \(Rs. 0\)/i)).toBeVisible();

    // Now select Per-Person model (Rs. 500/head with FREE Hall Rent)
    const perPersonBtn = page.getByRole('button', { name: /Per-Person Rate/i }).first();
    await expect(perPersonBtn).toBeVisible();
    await perPersonBtn.click();

    // Verify quick preset button for Rs. 500 is visible
    const rate500Btn = page.getByRole('button', { name: /500/i }).first();
    await expect(rate500Btn).toBeVisible();
    await rate500Btn.click();

    // Verify bottom bar displays Hall Rent: FREE (Rs. 0)
    await expect(page.getByText(/Hall Rent: FREE/i).first()).toBeVisible();

    // Check Next wizard step button
    const nextBtn = page.getByRole('button', { name: /Next:/i }).first();
    await expect(nextBtn).toBeVisible();
  });

  test('4. Booking Request Form Page (/booking-request)', async ({ page }) => {
    await page.goto('/booking-request');
    
    // Verify booking form title
    await expect(page.getByText(/Reservation Request|Booking Request/i).first()).toBeVisible();

    // Check customer name input
    const nameInput = page.locator('input[name="customerName"], input[placeholder*="Name" i]').first();
    await expect(nameInput).toBeVisible();

    // Check phone input
    const phoneInput = page.locator('input[name="customerPhone"], input[placeholder*="Phone" i]').first();
    await expect(phoneInput).toBeVisible();

    // Check email input
    const emailInput = page.locator('input[name="customerEmail"], input[type="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test('5. Photo Gallery Page (/gallery)', async ({ page }) => {
    await page.goto('/gallery');
    
    // Verify Gallery header
    await expect(page.getByText(/Gallery|Visual Journey|Exquisite/i).first()).toBeVisible();

    // Check image elements
    const images = page.locator('img');
    await expect(images.first()).toBeVisible();
  });

  test('6. Contact & Location Page (/contact)', async ({ page }) => {
    await page.goto('/contact');
    
    // Verify Contact header
    await expect(page.getByText(/Contact|Coordinates|Get in Touch/i).first()).toBeVisible();

    // Verify contact coordinates (Phone, Email, Address)
    await expect(page.getByText(/Gulberg|Lahore|Boulevard/i).first()).toBeVisible();
  });

});
