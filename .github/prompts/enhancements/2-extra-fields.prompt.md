---
mode: agent
---

# You are a senior Angular developer.
update database-structure instructions and add the following fields to the websites entity:
- sources
- author
these two fields will be a JSONB columns.
first the sources should be an array of one or more source, each source is an object that contain what's the source that i used to obtain this website and add it to list.
the source can be a socialmedia post/reel that's been scrapped using my propritary made scrapper. or just added manually by me. or it's been added as a suggestion from one of our followers. and any other type except for manual a link of this source must be provided and displayed on the website page.
as for the author. that only means who's the peron who added it to the database of websites. which will usually be me (the admin).
and the author will simply have  a display name and a url (could be a social media url or a website or any form of a url).

after updating the instructions, then follow up with updating the actual code base to accommodate these new instructions
