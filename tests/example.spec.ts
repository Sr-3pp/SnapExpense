import { expect, test } from '@nuxt/test-utils/playwright'

test('renders the expense workspace shell', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByText('Registered Expenses')).toBeVisible()
})
