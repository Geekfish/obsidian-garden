---
{"dg-publish":true,"permalink":"/garden/microbit-project-1-dice-roller/","tags":["microbit","python","embedded","games"],"created":"2024-03-01T18:48:35.833+01:00","updated":"2024-03-01T18:57:07.297+01:00"}
---

# Project # 1: Dice roller

So the plan is to make a simple dice roller application.

- The buttons should cycle through the various dice from a simple standard RPG poly set (d4, d6, d8, d10, d12, d20)
- Once a die is selected the player should be able to roll it by shaking the micro:bit.

Possible difficulties:

- Find a way to distinguish the rolling motion from other types of movement. My gut tells me this will be through detecting certain types of acceleration.

## Continued...

I didn't get the chance to work on this yesterday due to Christmas preparations but today I got a couple of hours playing with the Micro:bit again :)

Back to detecting dice rolling, turns out this wasn't too hard but I did need to play a little bit with calibrating the thresholds for detecting consecutive changes in acceleration. There are probably more precise ways to do this, but it works for now!

I created a [repo](https://github.com/Geekfish/microbit-week/) for the rest of the Micro:bit projects and [this is the code for the dice roller](https://github.com/Geekfish/microbit-week/blob/master/dicer_roller.py).

![dice roller demo](http://i.giphy.com/d2Z6C1b3VckTDHpe.gif)

I just realised this is very similar to what Martin O'Hanlon did with his [8-ball shuffle](http://www.stuffaboutcode.com/2015/11/microbit-magic-8-ball-with-micropython.html), our solution was actually pretty similar. I had to add some time thresholds as well, otherwise the shake event ended up happening way too easily and offset.

Original publication date: Dec. 22, 2015