# Placement task bank

The placement mission contains eight bands from early-kindergarten foundations through sixth-grade readiness. Each band has four runtime-validated tasks. A band change requires two consistent responses at the current level; one item never determines placement. Two consecutive misses stop the mission to limit frustration. Results record instructional and independent bands, confidence, the evidence summary, and the stopping reason.

Add tasks in `src/placement/data/steps.ts` with a unique ID, band, difficulty 1–8, skill, age-respectful mission wording, at least two options, and a valid answer index. The Zod validator fails during startup and tests when task data is malformed. Foundational prompts must remain neutral and respectful for older readers. These estimates guide instruction and are not formal diagnostic results.
