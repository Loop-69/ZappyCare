import { test, expect } from '@playwright/test';

test.describe('Pharmacy Modal Form Fields', () => {
  test('All inputs render in Add Pharmacy dialog', async ({ page }) => {
    // 1. Navigate & open modal
    await page.goto('http://localhost:3000/pharmacies');
    await page.click('button:has-text("Add Pharmacy")');
    await page.waitForSelector('form');

    // 2. List your schema's field names here:
    const expectedFields = [
      'pharmacyName',
      'pharmacyType',
      'contactName',
      'contactEmail',
      'contactPhone',
      'statesServed',
      'status',
    ];

    // 3. Check each one by querying the DOM
    const missing: string[] = [];
    for (const name of expectedFields) {
      const el = await page.$(`form [name="${name}"]`);
      if (!el) missing.push(name);
    }

    // 4. Report results
    if (missing.length) {
      console.error('❌ Missing form fields:', missing);
    } else {
      console.log('✅ All expected fields are present!');
    }
    expect(missing.length, `Missing fields: ${missing.join(', ')}`).toBe(0);
  });
});
