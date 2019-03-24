# Ron Swanson Says App

## Technologies 
React, Javascript, Express, Node, postgreSQL

## The Site
http://www.ron-swanson-says.us/

### Elixir
I made an attempt to learn Elixir. After studying it for a day, I decided to leave it, hoping to pick it up later- There were too many questions yet to answer. In tests I was able to produce a GenServer server call and response, but it did not include react or javascript.

## External API
In having to hit this API, and then my database for the ID and ratings, I discovered a new pattern.
Instead of setting state for each database call, I made all of the calls in one function, and set the state at the end. This pattern DRYed up my code (didn't clone state every call), but also prevented unneccesary re-renders.

## Reusable Components
The prompt didn't neccessarily say how many quotes to show at a time, but I get a kick out of building reusable components so I made a card for every quote. The stars are also made of a reusabile card, which had to be adjusted to deal with overall and user ratings. 

The brief is below with comments:

## Front End Stories
### Show Me Swanson Swag
#### As an internet user I should be able to get Ron Swanson quotes on demand.

+ It should allow me to click a button/image to get a Swanson word of wisdom

*Complete: Each time 'Get A Quote' is clicked, a quote shows up below. There is a Ron Swanson image as well for full effect.*

### Right Size Swanson
#### As an internet user I should be able get quotes that are a size that I requested.

+ It should allow me to determine if I want a small, medium or large quote

*Complete: Each of these three sizes shows up as a button, each is selectable (and visibly selected at the time), only one at a time is selectable.*

+ It should show me a quote that are 4 words or less if I choose small

*Complete: This option is available, I believe I know all of the small quotes by heart now.*

+ It should show me a quote that is 5 words to 12 words if I choose medium

*Complete: This option is available.*

+ It should show me a quote that is 13 words or larger if I choose large

*Complete: This option is available. For a man of few words, the number of large quotes he said is impressive.*

## Back End Stories
### Vote for Awesomeness
#### As an internet user I should be able to rate a Ron Swanson Quote.

+ It should let me give it rating of 1 to 5 on a quote

*Complete: I have provided nice little star images to click. With these, users can rate the quote, even change their mind, until the submit button is clicked.*

+ It should not let the same IP address / session rate more than 1 time

*Complete: Without having to register, the user can return to the site and see previous ratings (for up to two weeks or so).*

### Average Quote Rating
#### As an internet user I should be able to see the average rating for a Ron Swanson Quote.

+ It should show me the average rating for a quote when displaying the quote

*Complete: Overall ratings are given, and these cannot be changed by the user. '(Not Rated)' appears where a quote has not yet been rated, otherwise 1-5 stars shows up.*






