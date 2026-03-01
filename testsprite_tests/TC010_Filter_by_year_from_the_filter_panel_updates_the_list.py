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
        
        # -> Click the 'Gelişmiş Filtreler' button to open the filter panel so the year filter can be located.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div/form/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type '2010' into the 'Yapım Yılı' (year) input field to filter the movie list (use input element index 244).
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/form/div[3]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2010')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('xpath=/html/body/div/div/div/form/div[3]/div/div/input').first).to_be_visible(timeout=3000)
        await expect(frame.locator('xpath=//div[contains(@class,"movie-list") or contains(@class,"movies") or @id="movie-list"]').first).to_be_visible(timeout=3000)
        await expect(frame.locator('text=2010').first).to_be_visible(timeout=3000)
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    