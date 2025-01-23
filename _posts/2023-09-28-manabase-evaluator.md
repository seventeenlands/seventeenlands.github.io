---
layout: post
title:  "Manabase Evaluator"
date:   2023-09-28
tags:   patreon features mana
author: viralmisnomer
---

Today we’re excited to introduce a new feature for our Rare-level Patrons: the Manabase Evaluator! This feature simulates thousands of games with your deck and estimates how castable all of your spells are. Many people use hypergeometric calculators to evaluate how likely they are to draw certain cards in certain situations - you can think of our Manabase Evaluator as a more context-aware companion that can sanity check your deckbuilding decisions.
![](/assets/img/posts/2023-09-28-manabase-evaluator/evaluation-graph.png){: width="500px" max-width="100%" }

For each limited deck that you submit, we run it through a simulation that shuffles your deck, then determine when you could first cast each card in that permutation of your deck. When deciding if something is castable, this simulation checks its casting cost against the mana sources you have available. It makes sure all requirements are met, including having the correct type of mana (color pips, snow, etc.) and total amount. It’s smart enough to take advantage of hybrid mana costs too!

When determining mana sources, the evaluator doesn’t just look at the lands in your deck; it includes anything that can generate mana - creatures, artifacts, spells that make treasure, and more. It also takes advantage of cards like <auto-card>Evolving Wilds</auto-card>, <auto-card>Skittering Surveyor</auto-card>, and <auto-card>Cultivate</auto-card> that can search up lands from your deck, but only if you can cast them! It will even take advantage of basic landcycling if appropriate.

The output of the Mana Evaluator is an estimate of how castable your cards will be based on the number of cards you’ve drawn. It’s not exactly estimating what turn you’ll be able to play things, but instead attempting to answer, “How many additional cards do I have to draw before I'm able to cast each of my cards?” This is best illustrated with some examples.

Let’s imagine we have the following small deck:
![](/assets/img/posts/2023-09-28-manabase-evaluator/simulation-deck.png){: width="500px" max-width="100%" }

### Simulation 1:

We first shuffle the deck and draw 6 cards (we’ll revisit why 6 and not 7 shortly):

> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-opener.png){: .normal width="150px" max-width="100%" }

At this point, having drawn 0 extra cards, we would be able to play out our lands along with <auto-card>Bramble Familiar</auto-card>. Because it can add an additional green mana, playing <auto-card>Bramble Familiar</auto-card> also allows us to play <auto-card>Tanglespan Lookout</auto-card>. Note that in this simulation, we’re not restricted in how many lands we can play at once nor in reusing our lands for multiple spells. We’re also not restricted by summoning sickness. We can’t play <auto-card>Werefox Bodyguard</auto-card> because we only have access to one white mana, and we can’t play <auto-card>Agatha’s Champion</auto-card> because we only have 3 mana available. At this point, our current state is this:

> Additional cards drawn: 0
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-0-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-0-h.png){: .normal width="150px" max-width="100%" }

The next card off the top of the library is <auto-card>Besotted Knight</auto-card>. While we don’t have access to the mana to be able to play the creature side, we still consider it castable because we can pay for the Adventure half. Given that we can cast it, though, we actually want to look back to see how early we could have cast it, as this will be important in some calculations later. Tracing back, we see that we could have cast it if it were in our opening hand. This is why we only look at 6 cards in the first hand, as we want to be able to imagine all future cards as the possible 7th card in our opening hand. Let’s note that this one would have been castable with our opening hand, and let’s note that for the other nonlands as well. We’re now at the following:

> Additional cards drawn: 1
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-1-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-1-h.png){: .normal width="150px" max-width="100%" }

Next, we draw <auto-card>Evolving Wilds</auto-card>. While it doesn’t produce mana itself, it can fetch a land for us, which we’ll have it do. Now the question is: what land should it get? In this case, it sees we have cards in hand, and it recognizes that we’re constrained on white mana for the Bodyguard, so it prioritizes the remaining Plains in its search. If we didn’t have any cards in hand, or we were equally constrained on colors, it would prioritize the color that’s more unique among mana producers in our deck, which is also white. The thinking here is that we’re more likely to draw a green source in the future, so let’s prioritize the one we’re least likely to get access to.

Now that we have double white available, we’ve unlocked casting the Bodyguard, so we mark that as castable. The updated state is:

> Additional cards drawn: 2
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-2-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-2-h.png){: .normal width="150px" max-width="100%" }

Now we draw <auto-card>Brave the Wilds</auto-card>. We can cast it, and doing so fetches us another land. There are only two lands left in our deck, both of which are Forests, so we grab one. That puts us at 5 total mana available, which also unlocks <auto-card>Agatha’s Champion</auto-card>, so we cast that as well!

> Additional cards drawn: 3
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-3-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

After that, we draw <auto-card>Prophetic Prism</auto-card>, which is also playable. While it does fix our mana, we aren’t constrained on colors for anything right now. The simulator also doesn’t draw any cards off the top of our library (decks with moderate amounts of card draw can look a lot better than they should, so we don’t do any drawing), so our state doesn’t change much.

> Additional cards drawn: 4
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-4-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

Next off the top is <auto-card>Syr Armont, the Redeemer</auto-card>, which would have been castable after 3 draws.

> Additional cards drawn: 5
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-5-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

Lastly, we draw the final Forest, which gives us our final state:

> Additional cards drawn: 6
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/1-6-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

### Simulation 2:

After the first simulation, we shuffle the deck and run a second simulation. Let’s assume our new opening hand gives us the following state:

> Additional cards drawn: 0
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-0-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-0-h.png){: .normal width="150px" max-width="100%" }

We can’t cast anything! Luckily, off the top, we get a <auto-card>Prophetic Prism</auto-card>, which we can cast. This lets our <auto-card>Brave the Wilds</auto-card> grab a Forest, which also makes <auto-card>Tanglespan Lookout</auto-card> and <auto-card>Werefox Bodyguard</auto-card> castable. Our state is then:

> Additional cards drawn: 1
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-1-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-1-h.png){: .normal width="150px" max-width="100%" }

Assuming the remaining cards are in the following order:

> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-r.png){: .normal width="150px" max-width="100%" }

We wind up with the following final state:

> Additional cards drawn: 6
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/2-f-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

### Simulations 3 and 4:

Let’s breeze through a couple of more simulations, as the logic should be the same. Simulation 3 starts with the following deck order:

> ![](/assets/img/posts/2023-09-28-manabase-evaluator/3-o.png){: .normal width="150px" max-width="100%" }

Note that fetch effects (like <auto-card>Evolving Wilds</auto-card> and <auto-card>Brave the Wilds</auto-card>) cause the simulator to shuffle the deck after fetching, but for this simplified example, we’ll assume it takes the next land that matches the priority algorithm described above. This gives us the following final state:

> Additional cards drawn: 6
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/3-f-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

Simulation 4 starts with the following deck order:

> ![](/assets/img/posts/2023-09-28-manabase-evaluator/4-o.png){: .normal width="150px" max-width="100%" }

This gives us the following final state:

> Additional cards drawn: 6
> 
> Played:
> 
> ![](/assets/img/posts/2023-09-28-manabase-evaluator/4-f-p.png){: .normal width="150px" max-width="100%" }
> 
> In hand: None

### Results

Now that we’ve run a few simulations, let’s see how it all rolls up into our final numbers. What we look at is how castable each card is after every card drawn across all the simulations - this is why we wanted to keep track of how early we could have cast each card, regardless of when we drew it. You can think of it like a matrix as follows:
![](/assets/img/posts/2023-09-28-manabase-evaluator/castability-matrix.png){: width="500px" max-width="100%" }

We then take an average over the whole deck for each draw number:
![](/assets/img/posts/2023-09-28-manabase-evaluator/results.png){: width="100px" max-width="100%" }

### Limitations

Magic is a very complicated game, and we can’t build out a full simulator of games, so this tool certainly has its limitations. Being aware of the limitations of it can help you understand where it might not provide the most accurate assessment of your mana.
* No handling for cards that let you use cards from the top of your library. If your deck has cards like <auto-card>Oracle of Mul Daya</auto-card> or <auto-card>Future Sight</auto-card>, this won’t count their ability to pull cards from the top of your library.
* No scrying, surveiling, etc. or card draw spells cast. Similar to the point above, if you have cards that help churn through your deck to aggressively find a land, this won’t give you additional credit for those. You can always imagine that you’ll be some number of steps ahead on the castability curve, though!
* No fetching of creatures. If you have cards that allow you to search your deck for a mana-producing creature, this won’t take advantage of that.
* Cards that can fetch a land multiple times (e.g. <auto-card>Elvish Reclaimer</auto-card>) will only do so once. Note that cards that fetch multiple cards at a time (e.g. <auto-card>Burnished Hart</auto-card>) will still fetch multiple lands.
* No paying for kicker or alternative casting costs. If you’re only including a card with the intention of paying its kicker cost, this will overestimate your ability to cast it. If you have a card with an alternative casting cost (cards with evoke, exploit, suspend, etc.) that you’ll use frequently, this won’t consider those.
* Any part of a card that has multiple castable spells counts. If a card has multiple parts that can be cast (split cards, adventures, etc.), we can’t be sure which part is most important to you, so we consider all parts when evaluating castability. The part that is most castable across all the simulations is the one that counts towards the deck's castability score.
* X is always 1. Sometimes you might cast cards with X=0, and oftentimes you’ll use a much larger X. We can’t really determine what’s going to be best for such flexible cards, so we’ve chosen what we think is a reasonable fallback.
* No mulligans. If your deck happens to be built in a way where it will mulligan aggressively if a certain card is not in your opening hand, this cannot account for that.

We hope to address many of these in the future, but if you keep these in mind in the meantime, we think this is a very powerful tool to take advantage of.

### Real World Examples

The simplified example above was useful for illustration purposes, but how can we use this in the real world? Let’s take this deck as an example:
![](/assets/img/posts/2023-09-28-manabase-evaluator/real-deck.png){: width="750px" max-width="100%" }

There’s a lot going on here - a few double-pipped cards in blue and black, <auto-card>The Goose Mother</auto-card> on a splash of green, and some off-color adventures in red and white that we could consider splashing for, and nothing in our deck makes treasures.

If we had no fixing at all, we’d have no hope of running the red or white splashes. For experimental purposes, maybe we see what would happen if we ran [8 Islands, 8 Swamps, and 1 Forest](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/1). That would certainly make our prospects of casting <auto-card>The Goose Mother</auto-card> pretty poor, but maybe it doesn’t hurt our blue or black cards too much. If we define overall castability as the average per-turn castability over draws 0-9, the simulator estimates the overall castability of this choice of lands at 74.4%.

What if we had one land that could help us fix? If we [swapped out a Swamp for a Crystal Grotto](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/7), we’d get a score of 75.1%. [If we had an Evolving Wilds instead](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/5), we’d get 74.9%. [If it were an Edgewall Inn](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/6), regarded by most as the best fixer in the set, we’d get a score of 76.8% - noticeably better!

If we had one of each and used them to [replace two Swamps and an Island](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/0), we’d get a reasonable bump to a score of 77.1%. What if we got greedy and wanted to [include a Plains and a Mountain for the Evolving Wilds](https://www.17lands.com/deck/25d12e63779c4e1dba9a51a0939bf4af/2) to fetch to increase our chances of being able to play our off-color adventures? That’d give us a score of 75.1%.

### Conclusion

Building manabases is often very challenging! Sometimes the Arena auto-lands functionality is totally fine, but often it can get things wrong and cost you win percentage. Our Manabase Evaluator aims to give you an additional objective perspective on how good your manabase is. While it does have some limitations, we’ve been explicit about how the simulations work so that you can use it as an effective tool in your toolbox. We wouldn’t recommend always choosing the deck build that has the higher score - a powerful splash might be worth a small dip in castability of your other cards - but if you see an unexpectedly low score for your deck, it might be worth double checking that you’re setting yourself up for success.

Don’t have access to the Manabase Evaluator yet? Become a patron (or upgrade your level) today at [patreon.com/17lands](https://www.patreon.com/17lands)!
