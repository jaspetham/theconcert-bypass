import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import requests

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

def setup_driver():
    """Set up minimal Selenium WebDriver."""
    chrome_options = Options()
    # Uncomment for headless mode
    # chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    return webdriver.Chrome(options=chrome_options)

def send_post_request():
    """Send POST request matching the curl command."""
    url = "https://api.theconcert.com/carts"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en",
        "authorization": "bearer eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NjAyNDYzNiwiZXhwIjoxNzQ4NzE0NjM2fQ.RbU2MBwjpisEV1dLG5G3B0mHr8Zki_anRmDyuSFgPiWSlNnjw_4WO_igRlSk7pVv",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "origin": "https://www.theconcert.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.theconcert.com/",
        "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "x-csrf-token": "",
        "x-currency": "THB",
        "x-requested-with": "XMLHttpRequest"
    }
    payload = {
        "cart_id": 2244543,
        "products": [
            {
                "id": 4077,
                "variant_id": 37991,
                "quantity": 1,
                "sku": "ST (Standard)",
                "price": "฿349",
                "gate_open": "2025-05-16 06:00:00",
                "gate_close": "2025-05-16 23:59:00"
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logging.info(f"POST successful: Status {response.status_code}")
        return response
    except requests.RequestException as e:
        logging.error(f"POST failed: {e}")
        return None

def track_next_redirect(driver, timeout=10):
    """Track the next redirect URL."""
    initial_url = driver.current_url
    try:
        WebDriverWait(driver, timeout).until(EC.url_changes(initial_url))
        redirect_url = driver.current_url
        logging.info(f"Next redirect URL: {redirect_url}")
        return redirect_url
    except TimeoutException:
        logging.info("No redirect detected")
        return None

def main():
    """Send POST and track next redirect."""
    driver = setup_driver()
    try:
        # Navigate to a blank page to initialize browser context
        driver.get("about:blank")
        # Send POST request
        response = send_post_request()
        if response:
            # Track redirect
            redirect_url = track_next_redirect(driver)
            if not redirect_url:
                logging.info("No redirect. Try triggering checkout action.")
    except Exception as e:
        logging.error(f"Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()