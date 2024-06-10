# Pipeline Testing Method

## Context and Problem Statement

Which test reveals more information?
Which one more comprehensively covers usage?

## Considered Options

* Puppeter/Jest End to End
* Jest Unit Testing
* Integration tests

## Decision Outcome

Chosen option: "Puppeter - End to End Testing" 

E2E test cover the most real world usage of our product, and due to the time constraint and management restrictions. We decided that the most important were E2E and unit testing and concluded that the pipline would benefit from the comprehensive in depth tests more than the confirmation of the end to end tests integrated into our github actions pipeline.