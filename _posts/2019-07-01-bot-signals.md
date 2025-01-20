---
layout: post
title:  "Do the Bots Send Signals?"
date:   2019-07-01
tags: quickdraft bots draft signals
author: rconroy293
---

Draft is often cited as the biggest test of skills for a Magic player, as there are three distinct areas where a drafter must excel in order to do well: drafting, deckbuilding, and playing. With the advent of Arena, “the bots” have disrupted the drafting component significantly. In this post, we’ll try to explore how bots affect the way we draft, backed up by data from real Arena and Magic Online drafts.

# Drafters’ Incentives

Drafting with humans in seats next to each other is not a zero-sum game. Players must cooperate with the drafters next to them in order to end up with better decks. If they instead fight over cards of the same color, they’ll wind up with worse decks and lose more games. Because 5/7 games (on average) in an 8 person pod are played against opponents that aren’t your neighbors, there is an incentive to make your own deck better, even if it means your neighbors’ decks are a little better too.

The introduction of leagues in Magic Online altered these incentives slightly. When drafting and playing in-pod, “hate drafting” has some benefit if you can make your neighbor’s deck worse at little to no cost to your own deck. In leagues, however, drafters play against opponents outside of their pod, and hate drafting has almost no effect, since the chance of playing against your neighbor is very small.

In Arena, humans draft against seven automated draft bots. Because the bots only take cards out of packs and don’t have to build decks or play matches, the drafting experience is significantly altered. By not playing matches, the bots don’t have any incentive to send or receive signals outside of WotC trying to keep Arena interesting to limited players. With that in mind, let’s try to evaluate how far off from a real drafting experience drafting on Arena is.

# Establishing Card Ratings

Because players aren’t allowed to communicate during a draft, the only way for a player to know what colors their opponent is drafting is to infer that information from the cards being passed. The simplest solution might be to count the number of cards in each color, but there's a lot of variance in that. Instead, we get better signal from the card strength. If the blue, white, and red cards being passed to a player in the first pack are consistently stronger than the green and black ones, it’s more likely that the person to their right is drafting green and black. But what do we mean by "stronger"?

To evaluate strength, we need to understand how our neighbors value the cards. This is challenging to do unless we have lots of data to work with. With hundreds of drafts, we can identify the rating of cards based on how late we see each card in a pack on average. To illustrate with an example, let's look at *Invading Manticore* in [this draft](https://www.17lands.com/draft/e688e13849bf46bf9e3a7f07f8fa1242). Throughout the draft, we see it the following times:

- Pack 1 pick 1
- Pack 1 pick 9 (indicating no one took this picks 2 through 8)
- Pack 3 pick 7

For any card that wheels (i.e. we see it again when the pack comes back around), we ignore the first time we saw it. Using just the data from the draft above, the “average available position” for *Invading Manticore* would be 8.0. Averaging across all the WAR drafts shared using 17Lands, the actual number for *Invading Manticore* with the Arena bots is 7.6. We also have data from hundreds of Magic Online drafts with human drafters to compare to, provided by [Magic Pro Tools](https://magicprotools.com/). Averaging across those human drafters, that number for *Invading Manticore* is 6.2. A great card like *Spark Harvest* is usually only available in the first couple of picks, and its number is 3.0.

To turn this “average available position” into a number representing the strength of the cards being passed, we scale this number to be between 0 (lowest valued) and 1 (highest valued), and then square it to account for good cards being significantly more valuable than mediocre cards. The table below shows this value for a sample of *War of the Spark* cards for Arena drafts logged on 17Lands between May 9 (the most recent announced update to the bots) and June 20 and from the sample of MTGO drafts uploaded to Magic Pro Tools.

| Name | Rarity | Colors | Humans Value | Bots Value | Difference |
|------|--------|--------|--------------|------------|------------|
| Arlinn's Wolf | common | G | 0.31 | 0.497 | 0.187 |
| Arlinn, Voice of the Pack | uncommon | G | 0.776 | 0.787 | 0.012 |
| Bond of Discipline | uncommon | W | 0.166 | 0.318 | 0.153 |
| Emergence Zone | uncommon |  | 0.022 | 0.018 | -0.004 |
| Invading Manticore | common | R | 0.177 | 0.074 | -0.103 |
| Living Twister | rare | GR | 0.552 | 0.786 | 0.233 |
| Merfolk Skydiver | uncommon | GU | 0.518 | 0.757 | 0.239 |
| Mobilized District | rare |  | 0.487 | 0.881 | 0.394 |
| Vraska, Swarm's Eminence | uncommon | BG | 0.828 | 0.846 | 0.018 |
| Wanderer's Strike | common | W | 0.474 | 0.567 | 0.092 |

# Finding Your Lane

We can’t interpret the power level of colors in any one pack to be fully indicative of what our neighbor is drafting. However, if we track the power level throughout all of the picks in a pack, we get a pretty good sense of what those passing to us are drafting. Assuming the other drafters don’t change colors after the first pack, we expect to see the total power level passed to us in pack one to be relatively close to the power level passed to us by those same drafters in pack three.

To evaluate the benefit to finding the open colors, we’ll need a methodical way for doing so. For each color, we take the sum of the maximum-valued card in each pack of that color (we’ll split the value of multicolor cards evenly across their colors). Let's take blue in [this draft](https://magicprotools.com/draft/show?id=YToekpZPp1IRG81NMS4ZWbFcsmA) as an example.

- Pick 1 isn’t passed to us, so we don’t value it.
- P1P2, *Tamiyo, Collector of Tales* adds 0.36 (because it is two colors, we split
- P1P3, *Eternal Skylord* adds 0.79, bringing our total to 1.14.
- P1P4, *Thunder Drake* adds 0.52. Total is 1.66.
- P1P5, *Tamiyo’s Epiphany* adds 0.49, putting the total at 2.15.

And so on through the end of the pack. The total for blue throughout pack one comes out to about 3.26. In pack three, following the same logic, the total is about 3.62.

The chart below shows these values for all the WAR Magic Online drafts submitted to Magic Pro Tools. Each draft has five data points: one for each color. The x-axis represents the total power level throughout pack one, while the y-axis represents the total for that same color seen throughout pack three.

![Open Lane Benefit: MTGO](/assets/img/posts/2019-07-01-bot-signals/open-lane-mtgo.png)

The positive slope demonstrates what we intuited before: there is a definite benefit to identifying the open colors in a draft! If you consistently get passed good cards in a color in pack one, on average you’ll see much better cards in the third pack in that color. This isn’t guaranteed, though. Other drafters could switch colors, or the cards could just be weaker in pack three.

Below is a similar plot using Arena drafts with the bots’ valuations.

![Open Lane Benefit: Arena](/assets/img/posts/2019-07-01-bot-signals/open-lane-arena.png)

We see a similar trend, indicating that the Arena bots mirror the behavior of real drafters. In this case, the slope is even steeper, indicating there may be **more** value to reading signals drafting with the Arena bots than with humans! If the bots send signals like humans, though, why does drafting against the Arena bots feel different from drafting against humans?

# Difference in Pick Order

The most obvious difference in drafting with bots is that their pick order is different. When bots overvalue cards like *Giant Growth*, drafters don’t have a chance to take it where they feel it should be going, and as a result it’s almost never seen in draft play on Arena. It is hard to notice the absence of something, though, and it not being there in any one draft isn’t that odd. What sticks out like a sore thumb, though, is when cards go way later than they should. There have been some extreme examples in past sets, like *Gate Colossus* and *Sauroform Hybrid* in RNA. Since the latest update to the bots, the examples in WAR aren’t quite so bad, but *Lazotep Plating* and *Dreadmalkin* are a couple that still seem to stick out.

# Pick Order Variance

Another key insight is that the bots are much stricter with their pick order than the variety of humans who draft. Looking at the variance of how late cards are seen across the pick order, this becomes clear:

![Pick Position Variance](/assets/img/posts/2019-07-01-bot-signals/pick-position-variance.png)

The first thing to note from this graph is that there are quite a few cards with zero variance - there are 18 rares and mythics that the Arena bots have never passed in the hundreds of drafts recorded, even in the third pack when it's not in their colors. This compares to only four cards never passed in the sample of Magic Online drafts. There are three reasons someone might take a card that they're not going to play: they can sell it, they need it outside of the draft, or they’re hate drafting. Because there’s no secondary market on Arena, the first reason wouldn’t apply, so we would expect less of this behavior, not more.

The other thing to note from this graph is that across the entire pick order, the variance is lower. This indicates that the bots likely have a very strict pick order within each color, and they stick to it throughout the draft. Not only do different human drafters have different valuations of the cards, but even an individual drafter’s pick order will change throughout the draft to fill in holes in their deck. For example, someone might be light on two-drops and take *Kronch Wrangler* over *Bloom Hulk* later in the draft, even though the latter is a better card in a vacuum. Given the data presented, though, it’s unlikely the bots make these sorts of in-draft adjustments.

# Self-Correction

The metagame for drafting with humans is usually self-correcting. When blue and red are seen as the deepest colors in a format, more people draft those colors. As a consequence, they get fewer powerful blue and red cards, and the people who are drafting white, black, and green will get their choice of the powerful cards in the shallower colors. With the Arena bots being so strict in their pick order, though, the metagame doesn’t shift, and any mistakes in the bots’ card evaluation continue to be exploited. The table below shows the percentage of decks playing each color for 17Lands users’ opponents and the win rate of those decks (note that 17Lands players are better than average, thus their opponents’ have a win rate of under 50%):

| Color | # Games | Metagame Share | Win Percentage |
|-------|---------|----------------|----------------|
| White | 1063    | 35.1%          | 41.9%          |
| Blue  | 1490    | 49.1%          | 44.4%          |
| Black | 1440    | 47.5%          | 43.8%          |
| Red   | 1222    | 40.3%          | 43.7%          |
| Green | 1273    | 42.0%          | 43.1%          |

Even though white has a very low share of the metagame at around 35%, it still has the lowest win rate. We can see why when looking at another statistic: the power level of Arena packs when using the average human pick order derived from MTGO drafts:

| Color | Average Bot Value | Average Human Value |
|-------|-------------------|---------------------|
| White | 2.15              | 1.69                |
| Blue  | 2.47              | 2.15                |
| Black | 2.22              | 1.88                |
| Red   | 2.16              | 1.83                |
| Green | 2.35              | 2.06                |

In forming this data, we use the same methodology for finding the open colors earlier to value each pack, but then average across all packs from all Arena drafts logged. We compare the value using both the bot pick order and the human pick order. While white, black, and red are relatively close in the value the bots perceive they are passing, humans perceive white to be much worse on average. From humans’ perspective, blue is often the strongest. As a result, it’s generally better to move into blue, even if the bots are making it seem slightly less open.

# Summary

There’s a lot we can learn about how to best draft in Arena by looking at data. For the *War of the Spark* bots, at least, it seems they do send signals worth reading, but it’s best to keep in mind that the signals are relative to the bots’ pick orders, not your own.

---

Do you want to help contribute data for analyses like these in the future? Check out our [Getting Started](https://www.17lands.com/getting_started) page to install the lightweight Arena tracker and get access to the draft and deck viewers!