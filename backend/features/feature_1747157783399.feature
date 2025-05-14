Feature: Online Bookstore Functionality
As a user, I want to be able to register, login, search for books, add books to cart, checkout, view order history, and leave book reviews
So that I can have a seamless online shopping experience

  Scenario: Successful User Registration
    Given I am on the registration page
    When I enter a valid email and password
    Then I should be redirected to the login page with a success message

  Scenario: Successful Book Search and Addition to Cart
    Given I am on the homepage
    When I search for a book by title
    And I click on the book to view its details
    And I click the "Add to Cart" button
    Then The book should be added to my cart

  Scenario: Successful Checkout and Order Placement
    Given I have books in my cart
    When I proceed to checkout
    And I enter valid payment details
    Then I should receive an order confirmation with my order details
    And The order should be visible in my order history

  Scenario: Successful Book Review Submission
    Given I have purchased a book
    When I navigate to the book's details page
    And I click on the "Leave a Review" button
    And I enter a valid rating and review
    Then The review should be visible on the book's details page

  Scenario: Successful Order History Viewing
    Given I am logged in
    When I navigate to my account page
    And I click on the "Order History" tab
    Then I should see a list of my past orders with their details

  Scenario: Unsuccessful Login Attempt
    Given I am on the login page
    When I enter an invalid email or password
    Then I should see an error message indicating that my credentials are incorrect

  Scenario: Unsuccessful Book Search
    Given I am on the homepage
    When I search for a book that does not exist
    Then I should see a message indicating that no results were found

  Scenario: Successful Logout
    Given I am logged in
    When I click on the "Logout" button
    Then I should be redirected to the login page and no longer be logged in