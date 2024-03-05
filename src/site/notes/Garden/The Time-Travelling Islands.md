---
{"dg-publish":true,"permalink":"/garden/the-time-travelling-islands/","created":"2024-03-05T13:10:29.532+01:00","updated":"2024-03-05T13:21:51.470+01:00"}
---

# The Time-Travelling Islands

Original publication date: May 11, 2019

Writing about your experience on time handling  in software as a developer seems to be the "write your own blog-engine" of blogging. So here goes 😀

### Intro

One of features I've worked on in a previous project, involved producing personalised  aggregations for things like sports performance and other personal data (ex. running, cycling, sleep patterns...). The particularity of this type of data was that it introduced a model of time ranges that don't only occur at a fixed point in time (at the User's time zone), but must always remain "relative" to our Users, wherever they might be.

To better describe this with an example: Say one morning you wake up and you go for a run, while in London. If the next month you move to New York, then your run should still be categorised as a "morning" run, since you did it between 6am-11am local time, even if, by New York standards, it would have been an "late night" run.

Similarly, if you cared about your sleep patterns, taking a log that says "you slept between 10pm and 6am" and converting it to another timezone, essentially makes it useless to you as a User.  If we moved it to another timezone, then it could suddenly appear as if you were sleeping in the middle of the day. So the range is only relevant when paired with the timezone in which it occurred, without converting it to the current timezone.

### Time for Motivation 🏃‍♀️

One of the applications for these aggregations was to run friendly competitions between users (this was a health-related platform, where maintaining motivation was a key target).

The competitions would typically have a daily, weekly or monthly duration, and included users world-wide 🌍

To take the example of a daily competition, we needed to observe the data of competitors on a single date, ex. 30/12/2011.

One immediate challenge we faced was that **a "day" on its own, without a specific time associated with it, cannot have a single timezone**. Sounds familiar? It's the same problem as describing what "morning" is! "Day", "morning", "month"... these time-ranges are always relative to our location.

As we wanted to handle data for a specific "day", before breaking the date down into time ranges for individual time zones, we first needed to answer another, more basic question:

_When does a day start and end, world-wide?_

So, what are the earliest and latest points that a date occurs, in UTC time?

### Pacific Rim

One way to do that would be to find the earliest and latest timezone offsets, and use those as references. And we did exactly that. After a brief lookup, we found `Pacific/Kiritimati` (Kiribati, Line Islands 🇰🇮) as the earliest offset, with `UTC+14` year-round, and `Pacific/Apia` (Apia, Samoa 🇼🇸), as the latest with a `UTC-11` offset.

And it worked! In fact things worked quite smoothly for us for a while...

### Happy New Year!

...until we came back from Christmas holidays, on 2nd Jan 2012.

Users were also back from holidays, and reporting issues on our support channels (what a great way to start you year 😭)!

When we checked some of our logs and databases we realised that some of our aggregate data had not been generated for the last 3 days!

After hours of tracking the problem, we realised that our date duration calculation was returning a wrong value. A day, it turns out, had now a duration of **zero** hours. How was that even possible?

### Back to the Future

Most people don't usually read [Time Zone News](https://web.archive.org/web/20220703115843/https://www.timeanddate.com/news/time/). If we had, we would have noticed the following headline:

> Samoa jumps forward in time

> Samoa will switch time zones by redrawing the international dateline. The change will occur at midnight on December 29, 2011, taking the Pacific island nation straight into December 31, 2011.

Turns out Samoa didn't want to be stuck in a timezone that's inconvenient for itself and its neighbours, so it decided to pull a Back To the Future manoeuvre, changing its timezone from `UTC-11` to `UTC+14`  and **literally skipping an entire day 🍻**

### Take aways

After quite a lot of digging and many "wtf" exclamations, we finally figured where the problem was coming from, quickly deployed a fix and no Time Lords needed to come and save us.

![saving daylight postcard](https://blog-assets.eleni.co/media/saving_daylight.jpg)

What could we have done better?

- We could have had an automated regular task checking for updates on our time zone library (in our case that would have been [pytz](https://web.archive.org/web/20220703115843/https://pypi.org/project/pytz/)). Time zone changes are rarely decided and implemented in short notice (though [that's not always true](https://web.archive.org/web/20220703115843/https://codeofmatt.com/on-the-timing-of-time-zone-changes/)). Staying up to date definitely makes you safer.
- Consider if your problem requires a time zone by its local name (ex. `Europe/London`), or if an explicit UTC offset (ex. `UTC+1`) is enough/appropriate. Most of the time you **will** need to account for things like DST, so the offset will not be enough and can change, so the general advice is to use and store time zone names. But in **some** cases, like ours, we could have hard-coded `UTC+14` and `UTC-11` without losing any information / risking breaking our product.
- Read the news (not just Hacker News)! Our work as product makers doesn't exist in a separate bubble from the rest of the world, as much as we like to limit the scope of what we do for simplicity's sake. Many large news sources [like the BBC](https://web.archive.org/web/20220703115843/https://www.bbc.co.uk/news/world-asia-16351377) had also reported on the change.

### Reading

1. [Full article on Samoa's timezone change](https://web.archive.org/web/20220703115843/https://www.timeanddate.com/news/time/samoa-dateline.html)
2. If you haven't read this yet: [UTC is enough for everyone, right?](https://web.archive.org/web/20220703115843/https://zachholman.com/talk/utc-is-enough-for-everyone-right)