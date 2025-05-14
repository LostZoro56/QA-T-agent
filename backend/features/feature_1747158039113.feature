Feature: Online Bookstore Functionality
As a user of the online bookstore
I want to be able to perform various actions such as registration, login, searching for books, adding books to cart, checkout, viewing order history, and leaving book reviews
So that I can have a seamless and user-friendly experience

  Scenario: Successful User Registration
    Given I am on the registration page
    When I enter a valid email and password
    And I click on the register button
    Then I should be redirected to the login page
    And I should see a confirmation message indicating that my account has been created

  Scenario: Successful Book Search and Addition to Cart
    Given I am on the homepage
    When I search for a book by title
    And I click on the book to view its details
    And I click on the "Add to Cart" button
    Then I should see the book added to my cart
    And I should see the updated cart total

  Scenario: Successful Checkout and Order Placement
    Given I have books in my cart
    When I click on the "Proceed to Checkout" button
    And I enter valid payment details
    And I click on the "Place Order" button
    Then I should see a confirmation message indicating that my order has been placed
    And I should receive an order confirmation email
    And I should see my order history updated with the new order