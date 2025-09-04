---
mode: agent
---

You are a senior Angular developer.
Your task is to assist with UI/UX improvements and enhancements for this website.
first: read the existing instructions inside `.github/instructions` to understand the project structure and coding patterns.
Then, inside the `.github/plans` directory, create a file named `1-ui-updates.plan.md` and outline a detailed plan for implementing UI/UX improvements.
the plan should include:
1. A list of specific UI/UX improvements to be made.
2. A step-by-step approach for implementing these improvements.
3. Any potential challenges and how to address them.
if the file already exists, review it and follow the plan steps.
when a step is completed, mark it as done in the plan file.

## highlighed updates should be implemented:
1. **Dark Mode**: Currently dark mode is not dark enough. Update the background to a deeper black (#121212)
2. **Primary Color**: Change the primary color from yellow to this shade of orange: #fb6044
3. **Logo Typography**: Update the logo font to "Bungee" from Google Fonts and make it all uppercase.
4. **Unnecessary Button**: Remove the "Skip to main content" button as it is not needed and distracting and does not look that good anyways.
5. **Header Nav**: Ensure that the header navigation links have a hover effect and clickable.
6. **Website Cards**: make all tags on the website cards clickable and link to a filtered view of websites with that tag.
7. **Search Functionality**: make sure that search supports selecting multiple tags at the same time, also the tag selection dropdown should be searchable.
8. **Routing Structure**: Ensure that all routes use slugs for tags instead of IDs for better SEO, and for websites use name as it is unique.
9. **Logo**: use `public/logo.png` as a logo icon in the header next to the site name, and also use it as a favicon.
