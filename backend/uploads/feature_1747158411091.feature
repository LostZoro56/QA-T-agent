Feature: Online Bookstore Functionality
As a user of the online bookstore,
I want to be able to perform various actions such as registration, login, searching for books, adding books to cart, checkout, viewing order history, and leaving book reviews,
So that I can have a seamless and user-friendly experience.

  Scenario: Successful User Registration
    Given I am a new user
    When I provide a valid email and password
    Then I should be able to create an account successfully
    And I should receive a confirmation email

  Scenario: Successful Book Search and Addition to Cart
    Given I am a user
    And I am logged into my account
    When I search for a book by title
    And I select a book from the search results
    Then I should be able to add the book to my shopping cart
    And the book should be displayed in my cart

  Scenario: Successful Checkout and Order Placement
    Given I am a user with books in my cart
    And I am logged into my account
    When I proceed to checkout
    And I provide valid payment details
    Then I should be able to complete my purchase successfully
    And I should receive an order confirmation email
    And my order should be displayed in my order history

  Scenario: Successful Leaving of Book Review
    Given I am a user who has purchased a book
    And I am logged into my account
    When I navigate to the book's details page
    And I leave a rating and review
    Then my review should be displayed on the book's details page
    And other users should be able to view my review

  Scenario: Successful Viewing of Order History
    Given I am a registered user
    And I am logged into my account
    When I navigate to my order history page
    Then I should be able to view my past orders
    And each order should display the order date, total cost, and books purchased

  Scenario: Successful User Login
    Given I am a registered user
    And I have a valid email and password
    When I enter my login credentials
    Then I should be able to log into my account successfully
    And I should be redirected to my account dashboard

  Scenario: Successful Search for Books by Author
    Given I am a visitor
    When I search for books by author
    Then I should be able to view a list of books written by the author
    And each book should display the title, author, and price

  Scenario: Successful Search for Books by Genre
    Given I am a visitor
    When I search for books by genre
    Then I should be able to view a list of books in the selected genre
    And each book should display the title, author, and price