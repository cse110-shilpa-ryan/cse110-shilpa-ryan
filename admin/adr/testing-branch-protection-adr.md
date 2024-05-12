# Unit Tests Automation & Branch Protection

## Context and Problem Statement

In our software development process, maintaining code quality and consistency is paramount, particularly with a large team collaborating on projects. To achieve this, we aim to integrate automatic unit testing into our workflow while ensuring branch protection for the main branch to prevent any awry code to be merged. 

## Considered Options

* Jest
  * Built-in test runner and assertion library, making it easy to write and execute tests.
  * Supports snapshot testing for easily capturing and comparing component outputs.
  * Provides powerful mocking capabilities for isolating code under test.
  * Team is most familiar with this framework
* Mocha
  * Highly flexible and customizable, allowing you to choose your own assertion library, mock library, and other tools.
  * Extensible through plugins, allowing you to add additional functionality as needed.
  * Can run tests in both Node.js and the browser, making it suitable for testing a wide range of applications.
* AVA
  * Emphasizes parallel test execution, resulting in faster test runs, especially for large test suites.
  * Isolates tests by running each test file in its own process, reducing interference between tests.
  * Provides a concise and easy-to-read syntax for writing tests, with support for both synchronous and asynchronous code.

## Decision Outcome

For our team, Jest is the strongest contender with the main selling point being familiarity thanks to the labs, but also due to its lower skill floor due to the easy to access built-in test runner and assertion library.