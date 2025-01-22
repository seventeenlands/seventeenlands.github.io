---
layout: post
title:  "Impact of the London Mulligan"
date:   2019-10-23
tags:   mulligans
author: viralmisnomer
---

Inspired by [a recent discussion on Limited Resources](http://lrcast.com/limited-resources-514-throne-of-eldraine-aggro-update-and-qa/), I wanted to see if we had any data that would show the effects of the London Mulligan. Before the London Mulligan was [introduced in July](https://magic.wizards.com/en/articles/archive/news/london-mulligan-2019-06-03), players would draw one fewer card after each mulligan and then Scry 1 once a hand was kept. The rules change in July allows players to draw 7 cards after each mulligan and then place a number of cards equal to the number of mulligans on the bottom of their library once a hand is kept.

The goal of the change in mulligan rule was to make games where a player has to mulligan more competitive, so the primary statistic we want to look at is game win rate. 17Lands was ramping up a bit before the change was introduced, so we have a few thousand games to look at under the old rules and plenty more after the change. Because of the mystery surrounding the hand smoothing algorithm for best-of-one matches on Arena, we’re only looking at games from best-of-three (“Bo3”) draft matches.

## Data

Here’s the Bo3 data we have from before the London Mulligan was introduced:

| Play / Draw | # Mulligans | Win Rate | % Games | # Games |
|-------------|-------------|----------|---------|---------|
| *Either*    | *Any*       | *57.2%*  | *100.0%*| *2289*  |
| Play        | 0           | 60.4%    | 39.0%   | 892     |
| Play        | 1           | 40.6%    | 8.2%    | 187     |
| Play        | 2           | 26.3%    | 0.8%    | 19      |
| Draw        | 0           | 60.7%    | 41.9%   | 960     |
| Draw        | 1           | 47.1%    | 9.2%    | 210     |
| Draw        | 2           | 33.3%    | 0.9%    | 21      |

A few things jump out from what we see here. First: mulligans are very punishing. On average, the first mulligan costs about 16 percentage points of win rate. For context, if your win rate goes from 58% to 42% in Bo1 draft leagues, your chance of getting 7 wins drops from 20% to 3%! The other interesting finding is that mulligans are less punishing on the draw than on the play. Intuitively, this makes sense - when you’re drawing first, you’re always operating with one more card than you would have seen had you been on the play, lessening the impact of being down a card.

Now for the data after the addition of the London Mulligan:

| Play / Draw | # Mulligans | Win Rate | % Games | # Games |
|-------------|-------------|----------|---------|---------|
| *Either*    | *Any*       | *55.2%*  | *100.0%*| *23748* |
| Play        | 0           | 59.4%    | 39.9%   | 9477    |
| Play        | 1           | 46.3%    | 9.5%    | 2246    |
| Play        | 2           | 35.9%    | 1.2%    | 276     |
| Draw        | 0           | 56.8%    | 39.4%   | 9358    |
| Draw        | 1           | 44.9%    | 9.0%    | 2133    |
| Draw        | 2           | 28.3%    | 1.1%    | 258     |

Right away, we can see that the new rule reduces the cost of mulligans. Instead of a 16 percentage point drop in win rate from the first mulligan, we see about a 12 percentage point drop. There still being a non-trivial drop means there is some cost, but it’s significantly less, which is a good thing for promoting competitive games.

## Strategy Impact

Because mulligans are less punishing, we should expect to see people mulliganing more than they were before. This is true to a degree, but have people adjusted enough? Previously, people mulliganed in about 19.1% of games; now that’s up to about 20.7%. Given that the cost of mulliganing dropped by about 25%, I’d expect that as good players get used to the London Mulligan more, they’ll be mulliganing more frequently. Another possibility, though, is that people were taking mulligans too frequently before the change.

## What Next?

In the future we’d like to track and analyze more data about the specifics of hands being mulliganed. For example, can we see how likely you are to win if you keep a two-land hand in certain scenarios? Can we see the outcomes for people who keep hands that are missing one of their primary colors of mana?

---

A couple of footnotes:

- People who care enough to track their data using 17Lands are better than the average player, which is why their overall win rate is above 50%.
- The before and after are looking across draft sets. It’s possible that mulligans are more punishing in some sets than others (e.g. the effect might be lessened in a slower set), though that effect is not likely to be too significant.
