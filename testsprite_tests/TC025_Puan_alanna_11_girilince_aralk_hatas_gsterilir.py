import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # -> '+ Yeni Film' düğmesine tıklayarak ekleme formunu açmak (index 48).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Ad alanına 'Puan Hata Testi' yazmak (index 235), sonra Puan'a '11' (index 242), Yıl'a '2000' (index 249) yazmak ve ardından '➕ Filmi Ekle' butonuna (index 276) tıklamak.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Puan Hata Testi')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('11')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2000')
        
        # -> Click the '➕ Filmi Ekle' submit button (index 276) to trigger validation, then check the page for the exact error message 'Puan 0-10 aralığında olmalıdır' and verify the URL still contains '/add'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # Verify the validation message 'Puan 0-10 aralığında olmalıdır' is present among known page elements (report if feature missing)
        xpaths = [
            '/html/body/div/nav/div/a',
            '/html/body/div/nav/div/div/button',
            '/html/body/div/nav/div/div/a',
            '/html/body/div/div/div/div/div/a',
            '/html/body/div/div/div/div/form/div[1]/div[1]/input',
            '/html/body/div/div/div/div/form/div[1]/div[2]/input',
            '/html/body/div/div/div/div/form/div[1]/div[3]/input',
            '/html/body/div/div/div/div/form/div[2]/select',
            '/html/body/div/div/div/div/form/div[3]/input',
            '/html/body/div/div/div/div/form/div[4]/textarea',
            '/html/body/div/div/div/div/form/button',
        ]
        errors = []
        found = False
        for xp in xpaths:
            loc = frame.locator(f'xpath={xp}')
            text = ''
            # Try to get visible text
            try:
                text = (await loc.inner_text()) or ''
            except Exception:
                text = ''
            # If no inner_text, try value attribute (for inputs)
            if not text:
                try:
                    val = await loc.get_attribute('value')
                    if val:
                        text = val
                except Exception:
                    pass
            if 'Puan 0-10 aralığında olmalıdır' in text:
                found = True
                break
        if not found:
            errors.append("Feature missing: expected validation message 'Puan 0-10 aralığında olmalıdır' is not present on the page.")
        # Verify URL still contains /add
        if '/add' not in frame.url:
            errors.append(f"URL assertion failed: '/add' not in current URL: {frame.url}")
        if errors:
            raise AssertionError('\n'.join(errors))
        # If no errors, the validation message exists and URL is correct (test passed)
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    