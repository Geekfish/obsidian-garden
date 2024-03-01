---
{"dg-publish":true,"permalink":"/garden/microbit-project-3-plants-have-feelings-too/","tags":["python","embedded","plants","microbit"],"created":"2024-03-01T18:51:48.504+01:00","updated":"2024-03-01T18:55:42.157+01:00"}
---

# Project #3: Plants have feelings too

I have recently been pretty bad at keeping my house plants alive. I need to add reminders to take care of my plants, and I usually end up ignoring them as "I'll do it when I get home", and then I almost never do. **Wouldn't it be nice if the plant could tell you that it needs attention?**

Plants don't have faces to express themselves, so what if the micro:bit could work for that purpose?

Excluding cacti, the one thing that plants usually need the most is ground moisture. _How is moisture measured?_ **The internet says that conductivity is a pretty good indicator.**

So with a simple Ohmmeter we could measure the increase/decrease in resistance and by setting a few reasonable thresholds we can tell what the resistance corresponds to in terms of moisture levels.

Tools used:

- 3 cables with alligator clips
- 2 galvanised (I think) nails.
- 1 resistor (~1.2KΩ)

The nails were used as ground probes, one connected to power and one connected to `pin0`. The resistor was used as the "known" resistor for the ohmmeter. To replicate this you could use any resistor/ground probes/cabling. Just make sure the code is adapted for the resistor and that the probes are resistant to corrosion.

Also it goes without saying that you should keep the micro:bit at a safe distance from water and dirt ;)

In terms of programming, I set the micro:bit to display a happy, ok or sad face depending on the value of the resistor. Finding the correct thresholds was tricky as they can vary depending on the soil, distance between the probes etc. ([code](https://github.com/Geekfish/microbit-week/blob/master/happy_plant.py))

So, without further ado here's a watering demo of one of my plants (which I kept without water for a few days for that purpose as you can see from its horrible condition!):

![plants have feelings](http://i.giphy.com/26tPmvQGLAWMIOMr6.gif)

As you can see with a bit of watering the plant becomes "OK" and with a bit more it becomes "Happy" ;)

A few potential extensions to this project (probably more important for outdoor plants...):

- Light detector
- Temperature detector


Original publication date: Dec. 30, 2015