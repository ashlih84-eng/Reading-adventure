# Speech Comparison

`SpeechRecognitionService` has Web Speech, no-speech fallback, and remote-transcription extension points. The Web Speech adapter stores only the transcript in memory. The fallback completes practice without a microphone.

Comparison normalizes case, punctuation, apostrophes, contractions, and minor plural variation, then uses edit-distance sequence alignment to label matches, omissions, substitutions, insertions, and repetitions. Results are estimates because browser recognition varies by device, accent, noise, and connectivity. Speed is reported but is not treated as proficiency.
