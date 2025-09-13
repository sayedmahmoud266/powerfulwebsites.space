---
mode: agent
---

For better website visit tracking without much hassle, add a new route `/visit/:website` it's sole purpose is to redirect to the actual website url. and it'll do that by using cloudflare's website analytics to track the visits, without actually needing to add any tracking scripts.

- this route should be implemented in the frontend, and it should accept the website name as a parameter.
- it should fetch the website details from supabase (and display a loading state while fetching).
- if the website is found, it should redirect to the actual website url.
- if the website is not found, it should display a 404 error message.
- all the existing links to the websites in the app should be updated to point to this new route instead of the actual website url.
- all the new links should open this new route in a new tab in order to trigger the cloudflare analytics.
- ensure that the redirection is done in a way that preserves the referrer information for accurate analytics.
- ensure that the new route is SEO-friendly and does not negatively impact the app's performance.
