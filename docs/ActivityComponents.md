# Activity components

`ActivityPlayer` produces a structured score containing activity ID, numeric score, correctness, response, and skill evidence. Supported authored types include ordering, matching data, syllable breakdown, morphology, sentence construction, evidence selection, written response, retelling, vocabulary warmups, and standard selected responses. Read-aloud and listen-then-read use the speech service separately.

Ordering exposes native drag behavior and explicit earlier/later controls so touch, mouse, keyboard, and assistive technology have equivalent paths. Save every `onProgress` payload under the player and activity ID, then supply it as `saved` when reopening.
