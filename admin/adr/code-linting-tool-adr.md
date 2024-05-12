# Code Linting via Tool Selection

## Context and Problem Statement

We want to integrate an automatic linting tool to ensure we do not have programmatic and styling errors. This will help our code's readability and consistency, especially since we have a large team working together.

There are plethora of language-specific editors available online or as plug-ins. For our pipeline, we are looking for one that can be integrated automatically.

## Considered Options
* CodeClimate
  * can sync with your GitHub
  * once environment is configured, can easily integrate the appropriate linting tool
  * correspondingly, can customize the plug-ins/actions in a .yml file.
* ESLint
  * one of the most popular plug-ins for JavaScript/typescript
  * can be installed as a package, so the stylistic enforcement happens directly in the code editor
  * requires each programmer to locally install and configure
* Standard JS
  * extremely easy to use; just install package then run command
  * can be automated with other tests by adding command to package.json
  * very widely used by major companies (e.g. GitHub, Atom, mongoDB)

## Decision Outcome
For our team, CodeClimate is the best option for a all-in-one linting tool. This is partially because it the most convenient since we are using for code quality as well. It is also appropriate since it attaches to GitHub Organizations quite easily. It can actually integrate ESLint, in addition to a variety of other checkers.