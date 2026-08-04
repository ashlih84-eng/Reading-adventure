import { useState } from 'react';
import { newPlayer, type AvatarConfig, type PlayerProfile } from '../../profiles/types';
import { MissingColorsMission } from './MissingColorsMission';
import { SceneHuman } from './SceneHuman';

const reviewAvatar: AvatarConfig = {
  skinTone: 'deep',
  hairStyle: 'waves',
  hairColor: '#2b1c19',
  outfit: '#4f70a7',
  glasses: false,
};

export function HumanStyleReviewScreen() {
  return (
    <main className="human-style-review">
      <nav className="review-toolbar" aria-label="Development review pages">
        <a href="?visual-slice=1">Play the visual slice</a>
        <a href="?human-review=1" aria-current="page">Human character comparison</a>
        <a href="./">Return to app</a>
      </nav>
      <header className="review-heading">
        <p>Development-only art gate</p>
        <h1>Human Character Style Review</h1>
        <p>School-age player, adult mentor, and adult gardener shown at the same scale before more character production proceeds.</p>
      </header>
      <section className="human-comparison" aria-label="Human character proportions and animation states">
        <article>
          <SceneHuman kind="player" avatar={reviewAvatar} state="walk" />
          <h2>School-age player</h2>
          <p>Visible neck, shoulders, elbows, knees, hands, feet, natural clothes, and an active walking gait.</p>
        </article>
        <article>
          <SceneHuman kind="chef" state="point" />
          <h2>Chef Cinnamon</h2>
          <p>Adult mentor proportions, baker clothing, pointing arm, expressive face, and talking state.</p>
        </article>
        <article>
          <SceneHuman kind="poppy" state="water" />
          <h2>Poppy the Gardener</h2>
          <p>Adult gardener proportions, working pose, watering can, walking, reacting, and celebration states.</p>
        </article>
      </section>
      <section className="human-state-strip" aria-label="Character movement state comparison">
        {(['idle', 'talk', 'point', 'walk', 'celebrate'] as const).map((state) => (
          <figure key={state}>
            <SceneHuman kind="chef" state={state} />
            <figcaption>{state}</figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}

export function VisualSliceReviewScreen() {
  const [player, setPlayer] = useState<PlayerProfile>(() => ({
    ...newPlayer('River', reviewAvatar),
    placementComplete: true,
    selectedCompanion: 'fox',
    inventory: ['fox'],
  }));
  return (
    <main className="visual-slice-review">
      <MissingColorsMission player={player} onSave={setPlayer} onExit={() => { window.location.search = 'human-review=1'; }} />
    </main>
  );
}
