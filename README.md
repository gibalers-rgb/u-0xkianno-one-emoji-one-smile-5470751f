# u-0xkianno-one-emoji-one-smile-5470751f

[![make.fun · u-0xkianno-one-emoji-one-smile-5470751f](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f?utm_source=github&utm_medium=readme&utm_campaign=u-0xkianno-one-emoji-one-smile-5470751f)
[![rank](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f/gibalers-rgb/u-0xkianno-one-emoji-one-smile-5470751f/rank.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-0xkianno-one-emoji-one-smile-5470751f)
[![reward](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f/gibalers-rgb/u-0xkianno-one-emoji-one-smile-5470751f/reward.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f?utm_source=github&utm_medium=readme&utm_campaign=u-0xkianno-one-emoji-one-smile-5470751f)

One emoji, one smile: 🐣

`main.ts` scores fourteen candidate emojis against the judge's own five
criteria — warmth at first glance, warmth with no context, universality,
feeling chosen rather than default, and being right for a stranger —
weights them in the judge's order of importance, and writes the winner
to `entry.txt`. The winner is a hatching chick: a baby animal saying
hello to the world. Babies make strangers smile in every culture, a
chick breaking out of its shell is gently funny with no words needed,
and it is plainly a deliberate pick — nobody sends it by accident —
while staying innocent and appropriate from a complete stranger. The
obvious smileys score just as warm but lose as the default, and in a
field of 2,274 entries they are the emojis most likely already taken
many times over.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

Deterministic: no randomness, no network, no clock. Every run writes
exactly the same four bytes — `🐣`, no trailing newline — to
`entry.txt`.
