"""
Responsive testing script for Underdog AI pages.
Tests each page at mobile, tablet, and desktop viewport sizes.
"""
from playwright.sync_api import sync_playwright
import os
import json

# Test viewports
VIEWPORTS = {
    'mobile': {'width': 375, 'height': 812},    # iPhone X
    'tablet': {'width': 768, 'height': 1024},   # iPad
    'desktop': {'width': 1440, 'height': 900},  # Standard desktop
}

# Pages to test
PAGES = [
    ('/', 'home'),
    ('/login', 'login'),
    ('/signup', 'signup'),
    ('/roleplay', 'roleplay'),
    ('/curriculum', 'curriculum'),
    ('/curriculum/1', 'curriculum_module'),
    ('/analytics', 'analytics'),
    ('/recordings', 'recordings'),
    ('/objections', 'objections'),
    ('/settings', 'settings'),
    ('/admin', 'admin'),
]

BASE_URL = 'http://localhost:3005'
OUTPUT_DIR = './responsive_screenshots'

def test_responsive():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    issues = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for viewport_name, viewport in VIEWPORTS.items():
            print(f"\n=== Testing {viewport_name} ({viewport['width']}x{viewport['height']}) ===")

            context = browser.new_context(
                viewport=viewport,
                device_scale_factor=2
            )
            page = context.new_page()

            for path, name in PAGES:
                url = f"{BASE_URL}{path}"
                screenshot_path = f"{OUTPUT_DIR}/{name}_{viewport_name}.png"

                try:
                    print(f"  Testing {name}...")
                    page.goto(url, wait_until='networkidle', timeout=30000)
                    page.wait_for_timeout(500)  # Let animations settle

                    # Check for horizontal overflow
                    overflow = page.evaluate('''() => {
                        const body = document.body;
                        const html = document.documentElement;
                        const pageWidth = Math.max(body.scrollWidth, html.scrollWidth);
                        const viewportWidth = window.innerWidth;
                        return {
                            hasOverflow: pageWidth > viewportWidth,
                            pageWidth: pageWidth,
                            viewportWidth: viewportWidth
                        };
                    }''')

                    if overflow['hasOverflow']:
                        issue = f"[{viewport_name}] {name}: Horizontal overflow detected ({overflow['pageWidth']}px vs {overflow['viewportWidth']}px viewport)"
                        issues.append(issue)
                        print(f"    WARNING: {issue}")

                    # Check for text truncation issues
                    truncated = page.evaluate('''() => {
                        const elements = document.querySelectorAll('*');
                        const truncatedElements = [];
                        elements.forEach(el => {
                            const style = window.getComputedStyle(el);
                            if (style.overflow === 'hidden' && el.scrollWidth > el.clientWidth) {
                                if (el.textContent && el.textContent.trim().length > 0) {
                                    truncatedElements.push({
                                        tag: el.tagName,
                                        class: el.className,
                                        text: el.textContent.slice(0, 50)
                                    });
                                }
                            }
                        });
                        return truncatedElements.slice(0, 5);  // Limit to first 5
                    }''')

                    if truncated:
                        for t in truncated:
                            if t['text'].strip():  # Only report non-empty
                                print(f"    Note: Truncated text in {t['tag']}.{t['class'][:30]}")

                    # Take screenshot
                    page.screenshot(path=screenshot_path, full_page=True)
                    print(f"    Screenshot saved: {screenshot_path}")

                except Exception as e:
                    issue = f"[{viewport_name}] {name}: Error loading page - {str(e)[:100]}"
                    issues.append(issue)
                    print(f"    ERROR: {issue}")

            context.close()

        browser.close()

    # Print summary
    print("\n" + "="*60)
    print("RESPONSIVE TESTING SUMMARY")
    print("="*60)

    if issues:
        print(f"\nFound {len(issues)} potential issues:\n")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("\nNo major responsive issues detected!")

    print(f"\nScreenshots saved to: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Total screenshots: {len(PAGES) * len(VIEWPORTS)}")

    return issues

if __name__ == '__main__':
    test_responsive()
