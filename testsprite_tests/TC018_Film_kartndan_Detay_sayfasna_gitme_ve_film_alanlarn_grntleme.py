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
        # -> Navigate to http://localhost:3001
        await page.goto("http://localhost:3001", wait_until="commit", timeout=10000)
        
        # -> Click the 'Detay' link on the first visible movie card to open its detail page, then verify the URL contains '/movie/' and that the detail page shows title, summary, genre, year, and score badge.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div[3]/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # Assert that we navigated to a movie detail page by URL
        assert "/movie/" in frame.url, f"Expected '/movie/' in URL, got: {frame.url}"
        
        # Verify a detail-page-specific element from the available list is visible (back link)
        assert await frame.locator('xpath=/html/body/div/div/div/div[1]/a').is_visible(), 'Expected back link (← Geri Dön) to be visible on the movie detail page'
        
        # The following required detail elements (title, summary, genre, year, score badge) are not present in the provided available elements list, so report them as missing
        expected_elements = {
            'Film başlığı': None,
            'Özet': None,
            'Tür': None,
            'Yıl': None,
            'Puan rozeti': None,
        }
        missing = []
        for name, xpath in expected_elements.items():
            if not xpath:
                # No xpath available in the provided elements list for this feature
                missing.append(name)
            else:
                try:
                    if not await frame.locator(f'xpath={xpath}').is_visible():
                        missing.append(name)
                except Exception as e:
                    missing.append(f"{name} (error: {e})")
        
        if missing:
            raise AssertionError('Missing elements on detail page: ' + ', '.join(missing))
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    