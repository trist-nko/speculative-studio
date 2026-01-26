# GEMINI.md

## Project Context

Status: This is Experimental in nature, but working towards a finalized and working website.

Core Value
Interactive Simplicity: The code must prioritize a seamless "selection" experience where users can pick clothing items and see their choices reflected instantly without the page reloading or the layout breaking.

Technical Rules
Code Style:

Use Template Literals (backticks ` `) for creating HTML elements in JavaScript to keep the code readable.

Favor Arrow Functions const handleSelect = () => {} for consistency.

Keep functions small and focused on one task (e.g., one function to filter items, one function to update the display).

Naming:

Files: Use kebab-case.html (e.g., style-studio.html).

Variables: Use camelCase for JavaScript variables (e.g., selectedTop).

CSS Classes: Use kebab-case for classes (e.g., .catalog-item-active).

State Management:

Centralized Object: Store the user's current selections in a single JavaScript object (e.g., const userStyle = { top: '', bottom: '' }).

DOM as Output Only: Never use the HTML text to determine what is selected; always check the JavaScript object first.

Error Handling:

Use console.log for debugging during development, but include basic "Fallback" logic (e.g., if an image is missing, display a placeholder text instead of a broken icon).

Directory Strategy for Beginners
Because you mentioned this should be easy for a beginner to understand, I recommend a Data-Driven approach for your catalog. Instead of writing 50 separate HTML cards, you should keep your data in an array of objects.

Tech Stack & Architecture
Language/Runtime: HTML, CSS, JavaScript

Frameworks: None

## Directory Overview

This directory contains a static website for a PhD Comprehensive Exam project called "Speculative Style Studio". The website is built with HTML and CSS and vanilla JavaScript. The goal of the project/website is to be able to have an interactive website where users can pick and choose the clothes they want based on the available categories. The website should feel intuitive and easy to use. Nothing too complicated since it only uses basic HTML, CSS, and vanilla JavaScript. The project files and directory should be made for a beginner to coding to understand and access.

## Key Files

- `index.html`: The main entry point of the website. It sets up the main structure, including a header, navigation bar, and content windows. It links to other pages like `catalog.html` and `readme.html`. It is the main page of website and it is the one people will land on. It is where most of the interactivity of the website will occur.
- `style.css`: This file contains all the styling for the website. It defines a color palette, fonts, and layout rules for the different components of the site, giving it a distinct, retro-inspired aesthetic.
- `script.js`: This file is currently empty, indicating that the website is static and does not have any dynamic or interactive features implemented with JavaScript.
- `catalog.html`: This file likely displays a catalog of items, as suggested by the name and the CSS classes related to a "catalog-table". This page should store all display all of the `catalog-img` folder images with their associated descritptions.
- `readme.html`: Th
  is is likely a more stylized version of the project's README, presented as a webpage.
- `assets/`: This directory contains all the images used throughout the website, primarily for the catalog.

## Usage

This is a static website. To view it, you can open the `index.html` file in a web browser. There are no build steps or server-side components required. The website should flow naturally and be easy to use - it should also only include relatively simple components that a beginner to JavaScript would be able to put together.
