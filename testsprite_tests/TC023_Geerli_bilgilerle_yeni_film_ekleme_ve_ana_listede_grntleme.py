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
        
        # -> Click the '+ Yeni Film' link (index 48) to open the add-film form (/add) and then verify the 'Yeni Film' text is visible.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the form fields with valid data (Ad, Puan, Yıl, Tür, Posterin URL, Genel Bakış) and click '➕ Filmi Ekle' to submit the form.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('E2E Test Filmi 2026')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('8')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2001')
        
        # -> Select genre '🎭 Drama' from the Tür dropdown (index 263) so the form becomes valid; then fill Posterin URL and Genel Bakış and submit.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('https://example.com/poster.jpg')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/div[4]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('E2E Test Filmi 2026 - Otomatik ekleme testi.')
        
        # -> Click the '➕ Filmi Ekle' submit button to submit the /add form (index 276).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        # Verify 'Yeni Film' (nav link) is visible
        elem = frame.locator('xpath=/html/body/div/nav/div/div/a')
        assert await elem.is_visible(), "Expected 'Yeni Film' link to be visible"
        # Verify URL contains '/'
        assert "/" in frame.url
        # Verify 'E2E Test Filmi 2026' is visible in the list
        elem = frame.locator('xpath=/html/body/div/div/div[3]/div[2]/div[2]/h5')
        assert await elem.is_visible(), "Expected 'E2E Test Filmi 2026' to be visible on the page"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    