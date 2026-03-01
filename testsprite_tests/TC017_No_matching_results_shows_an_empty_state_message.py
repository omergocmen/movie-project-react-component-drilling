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
        
        # -> Click the 'Gelişmiş Filtreler' (advanced filters) button to open the filter panel and expose the year filter input.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div/form/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type '1800' into the year filter input to trigger filtering, wait for the UI to update, then verify the 'no matching films' empty state text is visible and that the movie list element is still present.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/form/div[3]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1800')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # -> Assert that the empty-state text is present in the main container
        text_elem = frame.locator('xpath=/html/body/div/div/div[1]')
        content = await text_elem.inner_text()
        assert ("Film Bulunamadı" in content) or ("no matching films" in content) or ("Arama kriterlerinize uygun film yok" in content), f"Expected empty-state text not found in /html/body/div/div/div[1]. Content: {content!r}"
        # -> Verify the movie list element (main container) is visible
        movie_list = frame.locator('xpath=/html/body/div/div/div[1]')
        assert await movie_list.is_visible(), 'Movie list element (/html/body/div/div/div[1]) is not visible'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    