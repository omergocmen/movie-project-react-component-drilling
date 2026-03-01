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
        
        # -> Click on the 'İsim' sıralama butonu to toggle sorting (first click).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'İsim' sort button a second time (index 62) to toggle to reversed sorting, then check for reversed indicator text ('Z→A' or an equivalent arrow state).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        btn = frame.locator('xpath=/html/body/div/div/div[2]/button[1]')
        assert await btn.is_visible(), 'İsim sıralama butonu görünür olmalı'
        btn_text = (await btn.text_content()) or ''
        if 'A→Z' not in btn_text:
            raise AssertionError("Sorting indicator 'A→Z' not found on the İsim button. The feature for showing 'A→Z' after first click appears to be missing. Task done.")
        # After the second click (already performed in the existing code) re-check the button text for reversed indicator
        btn_text_after = (await btn.text_content()) or ''
        if 'Z→A' not in btn_text_after:
            raise AssertionError("Sorting indicator 'Z→A' not found on the İsim button after second click. The reverse-sorting indicator appears to be missing. Task done.")
        # Verify element 'Film listesi' exists — this element/text is not present in the available elements list, report issue
        raise AssertionError("Element 'Film listesi' not found on the page. Cannot verify film list visibility. Task done.")
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    