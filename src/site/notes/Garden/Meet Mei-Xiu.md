---
{"dg-publish":true,"permalink":"/garden/meet-mei-xiu/","tags":["python","embedded","microbit"],"created":"2024-03-01T17:37:09.032+00:00","updated":"2024-03-03T10:41:01.061+00:00"}
---

# Meet Mei-Xiu

Original publication date: Dec. 22, 2015

Sent to me by its previous host, Stewart Watkiss. Haven't flashed the device yet so it looks like the robot controlling hex is still loaded.

![2dbf0e73-f016-4cbe-9ecf-5aa7107cdf00.JPG.640x640_q85.jpg](/img/user/Files/2dbf0e73-f016-4cbe-9ecf-5aa7107cdf00.JPG.640x640_q85.jpg)

# Environment setup

Started using [`upyed`](https://github.com/ntoll/upyed) and Tom Viner's very convenient [`upyflashed`](https://github.com/tomviner/upyflashed). The tool was exiting with a trace in the event of no hex files being available, so I [opened a PR](https://github.com/tomviner/upyflashed/pull/1) to make this a bit better.

EDIT: Turns out my "fix" was skipping the `sleep` step which caused the loop cycles to be a bit too fast. Good thing Tom caught that 😉

# It's Xmas

The Micro:bit gets a warm Christmas welcome by some of the other flashing LEDs in our house.

![ho ho ho](http://i.giphy.com/26tP0oYwIJ184Kf4Y.gif)

