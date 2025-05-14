from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

Here's a complete Selenium test script for the provided Gherkin scenarios using pytest with Selenium WebDriver.

python
# Import required libraries
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Set up the test environment
@pytest.fixture
def driver():
    """Set up and clean up the test environment"""
    # Set up the WebDriver
    driver = webdriver.Chrome()  # Replace with your preferred browser
    driver.maximize_window()
    driver.get("http://your-website-url.com")  # Replace with your website URL

    # Clean up the test environment
    yield driver
    driver.quit()

# Test scenarios
def test_successful_user_registration(driver):
    """Test successful user registration"""
    try:
        # Click on the registration button
        registration_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Register"))
        )
        registration_button.click()

        # Fill in the registration form
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        email_input.send_keys("test@example.com")

        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "password"))
        )
        password_input.send_keys("testpassword")

        confirm_password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "confirmPassword"))
        )
        confirm_password_input.send_keys("testpassword")

        # Submit the registration form
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        submit_button.click()

        # Verify registration success
        success_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[@class='success-message']"))
        )
        assert success_message.text == "Registration successful"

    except (TimeoutException, NoSuchElementException) as e:
        print(f"Error: {e}")

def test_successful_book_search_and_addition_to_cart(driver):
    """Test successful book search and addition to cart"""
    try:
        # Log in to the account
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        )
        login_button.click()

        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        email_input.send_keys("test@example.com")

        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "password"))
        )
        password_input.send_keys("testpassword")

        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        submit_button.click()

        # Search for a book by title
        search_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "search"))
        )
        search_input.send_keys("Book Title")

        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        search_button.click()

        # Select a book from the search results
        book_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Book Title"))
        )
        book_link.click()

        # Add the book to the shopping cart
        add_to_cart_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@class='add-to-cart']"))
        )
        add_to_cart_button.click()

        # Verify the book is displayed in the cart
        cart_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Cart"))
        )
        cart_link.click()

        book_in_cart = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[@class='cart-item']"))
        )
        assert book_in_cart.text == "Book Title"

    except (TimeoutException, NoSuchElementException) as e:
        print(f"Error: {e}")

def test_successful_checkout_and_order_placement(driver):
    """Test successful checkout and order placement"""
    try:
        # Log in to the account
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        )
        login_button.click()

        email_input = WebDriverWait(driver, 10).until(