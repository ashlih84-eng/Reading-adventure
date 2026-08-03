# Reading curriculum architecture

Each Storybook Kingdom region owns one primary reading competency. A child advances only after repeated, independent evidence for that competency—not from an average of unrelated scores.

## Hierarchy

- A region defines one primary competency and its prerequisites.
- Each regular mission practices one supporting skill that builds that competency.
- Activities use different game actions but record the mission’s single supporting skill.
- The review integrates supporting skills.
- The villain challenge applies the region competency in a story mission.
- The checkpoint uses fresh text and independent performance.

The typed source of truth is `src/curriculum/regions.ts`. It contains all fifteen competencies, child-facing goals, prerequisites, supporting skills, evidence requirements, interventions, thresholds, and checkpoint requirements.

## Region 1

Sprinkle Meadows teaches **foundational decoding and accurate simple-text reading**. Its mission sequence focuses on high-frequency words, short-sentence reading, blends, short vowels, and digraphs. Review, villain, and checkpoint activities integrate those word-reading skills in controlled simple text.

Mastery requires at least three independently successful regular missions, the review, the villain challenge, and a fresh checkpoint at 80% or higher. Scores attached to another competency cannot unlock the next region.

## Controlled text

Every Region 1 lesson declares its reading band, grade range, scored skill, vocabulary ceiling, measured average and maximum sentence lengths, unfamiliar-word allowance, unfamiliar words, and whether those words are pre-taught. New words include a short natural explanation from Chef Cinnamon.

Automated validation reports excessive sentence length, excessive or unprepared vocabulary, unnecessary academic language, outside-knowledge requirements, unsupported answers, and activities that drift across multiple scored skills.

## Placement and reporting

Placement records each competency as `notAssessed`, `needsInstruction`, `developing`, or `mastered`. The earliest unmastered prerequisite becomes the starting region. Secure earlier regions may be skipped, remain available for optional review, and appear restored.

The parent dashboard reports the competency, supporting skills, evidence count, status, interventions, and latest checkpoint result. Child screens use strengths-based story language rather than clinical status labels.
