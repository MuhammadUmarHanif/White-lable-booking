import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard End-to-End Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Pre-authenticate admin in localStorage so tests can navigate freely across admin pages
    await page.addInitScript(() => {
      localStorage.setItem(
        'marquee_admin_user',
        JSON.stringify({
          uid: 'demo-admin-uid-001',
          email: 'admin@marquee.com',
          displayName: 'Marquee Director (Super Admin)',
          role: 'owner',
        })
      );
    });
  });

  test('1. Admin Login Page flow (/admin/login)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('marquee_admin_user');
    });

    await page.goto('/admin/login');
    await expect(page.getByText(/Management & Banquet Concierge Portal|Admin/i).first()).toBeVisible();

    // Test 1-click Sign In as Admin
    const oneClickBtn = page.getByRole('button', { name: /1-Click Sign In as Admin|Sign In to Dashboard/i }).first();
    await expect(oneClickBtn).toBeVisible();
    await oneClickBtn.click();

    // Verify redirected to dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.getByText(/Executive Overview & Analytics/i).first()).toBeVisible();
  });

  test('2. Admin Dashboard Overview (/admin/dashboard)', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Check KPI cards
    await expect(page.getByText(/Payments Collected/i).first()).toBeVisible();
    await expect(page.getByText(/Confirmed Bookings/i).first()).toBeVisible();
    await expect(page.getByText(/Pending Enquiries/i).first()).toBeVisible();

    // Check live Refresh button
    const refreshBtn = page.getByRole('button', { name: /Refresh/i }).first();
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Check Recent Inquiries list
    await expect(page.getByText(/Recent Booking Submissions/i).first()).toBeVisible();
  });

  test('3. Admin Bookings Management (/admin/bookings)', async ({ page }) => {
    await page.goto('/admin/bookings');

    // Verify Bookings title
    await expect(page.getByText(/Bookings & Quotation Enquiries/i).first()).toBeVisible();

    // Verify bookings list / table is present
    await expect(page.locator('table, .divide-y, div:has-text("MRQ-")').first()).toBeVisible();

    // Test Search input
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Chaudhry');

    // Test Export CSV button
    const exportBtn = page.getByRole('button', { name: /Export CSV/i }).first();
    await expect(exportBtn).toBeVisible();
  });

  test('4. Admin Calendar Page (/admin/calendar)', async ({ page }) => {
    await page.goto('/admin/calendar');

    // Verify Calendar title
    await expect(page.getByText(/Banquet Event Calendar & Availability/i).first()).toBeVisible();

    // Check Today button
    await expect(page.getByRole('button', { name: /Today/i })).toBeVisible();

    // Check calendar grid headers
    await expect(page.getByText('Sun')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
  });

  test('5. Admin Venues & Spaces Page (/admin/venues)', async ({ page }) => {
    await page.goto('/admin/venues');

    // Verify tabs
    const stickyTab = page.getByRole('button', { name: /Homepage Sticky Cards/i }).first();
    const hallsTab = page.getByRole('button', { name: /Booking Calculator Halls/i }).first();
    await expect(stickyTab).toBeVisible();
    await expect(hallsTab).toBeVisible();

    // Test Edit Card Modal opens and closes properly
    const editBtn = page.getByRole('button', { name: /Edit Card/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      const saveBtn = page.getByRole('button', { name: /Save Card Changes/i }).first();
      await expect(saveBtn).toBeVisible();
      await saveBtn.click();
      await expect(page.getByText(/updated successfully|live on the website/i).first()).toBeVisible();
    }
  });

  test('6. Admin Menus & Dishes Page (/admin/menus)', async ({ page }) => {
    await page.goto('/admin/menus');

    // Check Catering & Menus title
    await expect(page.getByText(/Bespoke Catering Packages|Menu/i).first()).toBeVisible();

    // Verify tabs: Packages & Dishes
    await expect(page.getByRole('button', { name: /Packages/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Individual Dishes|A La Carte/i }).first()).toBeVisible();
  });

  test('7. Admin Decor & Services Page (/admin/decor)', async ({ page }) => {
    await page.goto('/admin/decor');

    // Verify title
    await expect(page.getByText(/Stage Décor & Optional Services/i).first()).toBeVisible();

    // Check Decor and Services tabs
    await expect(page.getByRole('button', { name: /Stage & Floral Décor/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Services & Power Backup/i }).first()).toBeVisible();
  });

  test('8. Admin Pricing Settings Page (/admin/pricing)', async ({ page }) => {
    await page.goto('/admin/pricing');

    // Verify Pricing Rules title
    await expect(page.getByText(/Pricing, Taxes & Seasonal Rules/i).first()).toBeVisible();

    // Check Save button exists
    const saveBtn = page.getByRole('button', { name: /Save Pricing Settings/i });
    await expect(saveBtn).toBeVisible();
  });

  test('9. Admin Branding & Customization Page (/admin/customization)', async ({ page }) => {
    await page.goto('/admin/customization');

    // Verify Customization title
    await expect(page.getByText(/Website Branding & Customization/i).first()).toBeVisible();

    // Check Business Name input field
    const nameInput = page.locator('input').first();
    await expect(nameInput).toBeVisible();

    // Check Update Venue Branding button
    const updateBtn = page.getByRole('button', { name: /Update Venue Branding/i });
    await expect(updateBtn).toBeVisible();
  });

  test('10. Admin Settings & Backups Page (/admin/settings)', async ({ page }) => {
    await page.goto('/admin/settings');

    // Verify Settings title
    await expect(page.getByText(/Settings, Security & Data Management/i).first()).toBeVisible();

    // Check Export CSV & Export JSON buttons
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export Raw JSON/i })).toBeVisible();

    // Check Reset Demo Data button
    await expect(page.getByRole('button', { name: /Reset System Demo Data/i })).toBeVisible();
  });

});
