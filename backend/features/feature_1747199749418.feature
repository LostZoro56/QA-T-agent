Feature: Online Bookstore Functionality
As a user of the online bookstore,
I want to be able to register, log in, search for books, add books to cart, checkout, view order history, and leave book reviews,
so that I can have a seamless and enjoyable shopping experience.

  Scenario: Successful User Registration
    Given I am on the registration page
    When I enter a valid email and password
    Then I should be registered successfully and logged into my account

  Scenario: Successful Book Search and Addition to Cart
    Given I am logged into my account
    When I search for a book by title
    And I click on the "Add to Cart" button for the searched book
    Then the book should be added to my cart

  Scenario: Successful Checkout and Order Placement
    Given I have books in my cart
    When I proceed to checkout
    And I enter valid payment details
    Then I should be able to complete the purchase and view my order history

  Scenario: Successful Leave Book Review
    Given I have purchased a book
    When I navigate to the book's details page
    And I enter a rating and review
    Then my review should be posted and visible to others

  Scenario: Successful View Order History
    Given I am logged into my account
    When I navigate to the order history page
    Then I should be able to view my past orders

  Scenario: Successful User Login
    Given I am on the login page
    When I enter valid login credentials
    Then I should be logged into my account successfully

  Scenario: Unsuccessful User Registration with Invalid Email
    Given I am on the registration page
    When I enter an invalid email and password
    Then I should see an error message indicating that the email is invalid

  Scenario: Unsuccessful Book Search with Invalid Title
    Given I am logged into my account
    When I search for a book with an invalid title
    Then I should see a message indicating that no books were found

  Scenario: Unsuccessful Checkout with Invalid Payment Details
    Given I have books in my cart
    When I proceed to checkout
    And I enter invalid payment details
    Then I should see an error message indicating that the payment details are invalid