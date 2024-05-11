# Code Quality via Tool Selection

## Context and Problem Statement

In order to faciliate code quality review as a part of our pipeline as we develop PRs and conitrbutions towards the development of our development journal application, we need to research potential tools that can assist with this. 

## Considered Options

* CodeClimate
  * Clear and quantifiable measure of code status with a single grade
  * Identifies hotspots of complexity and potential trouble areas in code base
  * Automated review for maintainability and test coverage analysis
* Codacy
  * Insights into code quality, security patterns, and style consistency 
  * Seamless GitHub integration 
  * Very configurable to allow teams to adapt rules for coding standards
* SonarCloud
  * Integrates with GitHub through automated pull request analysis
  * Provides a dashboard to trach technical debt and code quality over time
  * Detailed reports of code smells, bugs, and security vulnerabilities
* DeepSource
  * Static code analysis to detect bug risks, anti-patterns, performance issues, and security vulnerabilities
  * Can automatically fix some of the detected issues via pull requests
  * Multiple language support and straightforward GitHub integration process

## Decision Outcome

The best option for code quality via tool for our team's current needs would be CodeClimate. CodeClimate integrates very well with GitHub pull request actions and our focus with this tool generally helping with maintainability and test coverage. It provides clear feedback on code quality and enforces good coding and security standards (important for journal data).

