Feature: User Login
As a user
I want to be able to log in to the application
So that I can access the features and functionality of the application

  Scenario: Successful Login
    Given I am on the login page
    When I enter a valid username and password
    Then I should be logged in and redirected to the dashboard

  Scenario: Invalid Username
    Given I am on the login page
    When I enter an invalid username and a valid password
    Then I should see an error message indicating that the username is incorrect

  Scenario: Invalid Password
    Given I am on the login page
    When I enter a valid username and an invalid password
    Then I should see an error message indicating that the password is incorrect

  Scenario: Empty Credentials
    Given I am on the login page
    When I enter no username and no password
    Then I should see an error message indicating that both username and password are required

  Scenario Outline: Login with different credentials
    Given I am on the login page
    When I enter <username> and <password>
    Then I should see <result>

    Examples:
      | username | password | result                  |
      | user1    | pass1    | logged in and redirected to the dashboard |
      | user2    | wrongpass| error message indicating that the password is incorrect |
      | wronguser| pass1    | error message indicating that the username is incorrect |