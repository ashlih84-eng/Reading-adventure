import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { CompanionArt } from '../../components/art/CompanionArt';
import { dialogueFor } from '../../npc/data/dialogue';
import { npcById } from '../../npc/data/npcs';
import { requestNpcHelp } from '../../npc/engine/npcEngine';
import { npcVoiceService } from '../../npc/voice/voiceService';
import type { PlayerProfile } from '../../profiles/types';
import { ReadAloud } from '../../speech/components/ReadAloud';
import { recordLessonAttempt } from '../engine/masteryEngine';
import { SceneHuman } from './SceneHuman';
import { playSceneSound } from './sceneSound';

type Place = 'start' | 'brook' | 'oak' | 'bridge';
type ColorId = 'blue' | 'red' | 'gold';
type Phase = 'intro' | 'clue' | 'read' | 'final';

interface Clue {
  id: ColorId;
  text: string;
  object: string;
  target: Exclude<Place, 'start'>;
  position: { x: number; y: number };
}

interface SavedMission {
  phase: Phase;
  clueIndex: number;
  restored: ColorId[];
}

const clues: Clue[] = [
  {
    id: 'blue',
    text: 'The blue ribbon is beside the brook.',
    object: 'blue ribbon',
    target: 'brook',
    position: { x: 0.65, y: 0.72 },
  },
  {
    id: 'red',
    text: 'The red basket is under the oak tree.',
    object: 'red berry basket',
    target: 'oak',
    position: { x: 0.22, y: 0.56 },
  },
  {
    id: 'gold',
    text: 'The golden trail goes to the bridge.',
    object: 'golden trail',
    target: 'bridge',
    position: { x: 0.84, y: 0.59 },
  },
];

const progressKey = 'visual-slice:missing-colors';
const placeX: Record<Place, number> = { start: 8, oak: 22, brook: 62, bridge: 84 };
const objectHome: Record<ColorId, { x: number; y: number }> = {
  blue: { x: 48, y: 49 },
  red: { x: 10, y: 52 },
  gold: { x: 70, y: 48 },
};

function ClueObject({ color }: { color: ColorId }) {
  if (color === 'blue') {
    return (
      <svg viewBox="0 0 150 70" aria-hidden="true">
        <path d="M8 32Q45 4 80 34t62-8" fill="none" stroke="#168bd1" strokeWidth="18" />
        <path d="m68 28 22-20 8 30" fill="#168bd1" />
      </svg>
    );
  }
  if (color === 'red') {
    return (
      <svg viewBox="0 0 130 90" aria-hidden="true">
        <path d="M15 35h100l-10 48H25Z" fill="#b26b3c" />
        <path d="M30 38q35-45 70 0" fill="none" stroke="#7a432b" strokeWidth="9" />
        {[45, 66, 87].map((x) => <circle key={x} cx={x} cy="50" r="11" fill="#d93245" />)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 150 75" aria-hidden="true">
      <path d="M8 56Q45 5 142 25" fill="none" stroke="#f2c94c" strokeWidth="22" strokeDasharray="15 8" />
    </svg>
  );
}

export function MissingColorsMission({
  player,
  onSave,
  onExit,
}: {
  player: PlayerProfile;
  onSave: (profile: PlayerProfile) => void;
  onExit: () => void;
}) {
  const saved = (player.activityProgress?.[progressKey] ?? {
    phase: 'intro',
    clueIndex: 0,
    restored: [],
  }) as SavedMission;
  const [phase, setPhase] = useState<Phase>(saved.phase);
  const [clueIndex, setClueIndex] = useState(saved.clueIndex);
  const [restored, setRestored] = useState<ColorId[]>(saved.restored);
  const [caption, setCaption] = useState(
    `Hello, ${player.firstName}. The Sprinkle Snatcher took the meadow’s colors. Will you help me find them?`,
  );
  const [speaker, setSpeaker] = useState<'poppy' | 'chef'>('poppy');
  const [speaking, setSpeaking] = useState<'poppy' | 'chef'>();
  const [hintLevel, setHintLevel] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [picked, setPicked] = useState(false);
  const [point, setPoint] = useState(() => objectHome[clues[Math.min(saved.clueIndex, clues.length - 1)].id]);
  const [feedback, setFeedback] = useState('');
  const [avatarPlace, setAvatarPlace] = useState<Place>(() => {
    if (saved.phase === 'intro') return 'start';
    if (saved.clueIndex >= 3) return 'bridge';
    if (saved.clueIndex <= 2) return clues[saved.clueIndex].target;
    return 'start';
  });
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const worldRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const poppy = npcById('poppy');
  const chef = npcById('chef-cinnamon');
  const clue = clues[Math.min(clueIndex, clues.length - 1)];
  const reduceMotion = player.accessibility.reduceMotion;

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout);
    npcVoiceService.stop();
  }, []);

  function schedule(action: () => void, delay: number) {
    timers.current.push(window.setTimeout(action, reduceMotion ? 0 : delay));
  }

  function save(next: SavedMission, extra: Partial<PlayerProfile> = {}) {
    onSave({
      ...player,
      ...extra,
      activityProgress: { ...player.activityProgress, [progressKey]: next },
    });
  }

  function travelTo(target: Exclude<Place, 'start'>) {
    setFacing(placeX[target] < placeX[avatarPlace] ? 'left' : 'right');
    setWalking(true);
    setAvatarPlace(target);
    schedule(() => setWalking(false), 950);
  }

  function speak(who: 'poppy' | 'chef', text: string) {
    setSpeaker(who);
    setCaption(text);
    setSpeaking(who);
    const npc = who === 'poppy' ? poppy : chef;
    if (player.parentSettings?.masterMute) {
      schedule(() => setSpeaking(undefined), 700);
      return;
    }
    npcVoiceService.speak(npc, text, player.parentSettings?.voiceVolume ?? 0.8, {
      onStart: () => setSpeaking(who),
      onEnd: () => setSpeaking(undefined),
    });
  }

  function begin() {
    playSceneSound('meadow', player.parentSettings);
    playSceneSound('brook', player.parentSettings);
    speak('poppy', `Hello, ${player.firstName}. The Sprinkle Snatcher took the meadow’s colors. Will you help me find them?`);
    schedule(() => speak('chef', 'Read each clue, then search the meadow for the matching object.'), 1_700);
    schedule(() => {
      setPhase('clue');
      save({ phase: 'clue', clueIndex: 0, restored });
      travelTo(clues[0].target);
      speak('chef', clues[0].text);
    }, 3_600);
  }

  function hearWord(word: string) {
    if (!player.parentSettings?.masterMute) {
      npcVoiceService.speak(chef, word, player.parentSettings?.voiceVolume ?? 0.8, {
        onStart: () => setSpeaking('chef'),
        onEnd: () => setSpeaking(undefined),
      });
    }
  }

  function askPoppy() {
    const result = requestNpcHelp(player, poppy, `visual-${clue.id}`, 'foundational decoding', hintLevel);
    const level = result.hint.level;
    setHintLevel(level);
    const text = level === 1
      ? `Look for the ${clue.object}.`
      : level === 2
        ? 'The clue tells where it belongs. Listen for the place word.'
        : level === 3
          ? `Watch the ${clue.target}. It will glow for a moment.`
          : `I’ll walk near the ${clue.target}. You still get to place the ${clue.object}.`;
    speak('poppy', text);
    onSave(result.player);
  }

  function normalized(clientX: number, clientY: number) {
    const box = worldRef.current!.getBoundingClientRect();
    return { x: (clientX - box.left) / box.width, y: (clientY - box.top) / box.height };
  }

  function onPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    setPicked(true);
    playSceneSound('pickup', player.parentSettings);
    const next = normalized(event.clientX, event.clientY);
    setPoint({ x: next.x * 100, y: next.y * 100 });
  }

  function onPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const next = normalized(event.clientX, event.clientY);
    setPoint({
      x: Number(Math.max(3, Math.min(94, next.x * 100)).toFixed(2)),
      y: Number(Math.max(8, Math.min(88, next.y * 100)).toFixed(2)),
    });
  }

  function tryPlace(target: string) {
    if (target !== clue.target) {
      setDragging(false);
      setPicked(false);
      setFeedback(`The ${clue.object} floats gently back. Look at the place word in the clue.`);
      setPoint(objectHome[clue.id]);
      playSceneSound('return', player.parentSettings);
      speak('poppy', 'Let’s look at the place word again. The object will wait for you.');
      return;
    }

    const nextRestored = [...restored, clue.id];
    setRestored(nextRestored);
    setDragging(false);
    setPicked(false);
    setFeedback(`${clue.object} locked into place. ${clue.id} returned to the meadow!`);
    playSceneSound('correct', player.parentSettings);
    playSceneSound('color', player.parentSettings);
    speak(
      'poppy',
      clue.id === 'blue'
        ? 'The brook is blue again!'
        : clue.id === 'red'
          ? 'The berries and flowers are red again!'
          : 'The trail shines gold again!',
    );

    schedule(() => {
      if (clueIndex < clues.length - 1) {
        const nextIndex = clueIndex + 1;
        setClueIndex(nextIndex);
        setHintLevel(0);
        setPoint(objectHome[clues[nextIndex].id]);
        setFeedback('');
        save({ phase: 'clue', clueIndex: nextIndex, restored: nextRestored });
        travelTo(clues[nextIndex].target);
        speak('chef', clues[nextIndex].text);
      } else {
        setPhase('read');
        save({ phase: 'read', clueIndex: 3, restored: nextRestored });
        speak('chef', 'One last line will bring every color home.');
      }
    }, 1_300);
  }

  function onPointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const next = normalized(event.clientX, event.clientY);
    const distance = Math.hypot(next.x - clue.position.x, next.y - clue.position.y);
    tryPlace(distance < 0.17 ? clue.target : 'other');
  }

  function finishRead() {
    const independent = !(player.npcHelpHistory ?? [])
      .some((event) => event.activityId.startsWith('visual-') && event.guided);
    const updated = recordLessonAttempt(
      {
        ...player,
        activityProgress: {
          ...player.activityProgress,
          [progressKey]: { phase: 'final', clueIndex: 3, restored },
        },
      },
      'meadow-1',
      1,
      independent,
    );
    setPhase('final');
    onSave(updated);
    playSceneSound('celebrate', player.parentSettings);
    speak('poppy', dialogueFor('poppy', 'region-restoration', player.firstName));
  }

  return (
    <section className={`color-slice color-stage-${phase} restored-${restored.length}`} aria-label="Visual Slice: Restore the Missing Colors">
      <div className="slice-topbar">
        <strong>Visual Slice: Restore the Missing Colors</strong>
        <div className="color-progress" role="progressbar" aria-label="Colors restored" aria-valuemin={0} aria-valuemax={3} aria-valuenow={restored.length}>
          {[0, 1, 2].map((index) => <span key={index} className={index < restored.length ? 'lit' : ''} />)}
        </div>
        <button onClick={onExit}>Leave mission</button>
      </div>

      <div
        className={`meadow-stage ${hintLevel >= 3 ? `hint-glow-${clue.target}` : ''}`}
        data-camera={phase === 'clue' ? clue.target : phase}
        data-restored={restored.join(' ')}
      >
        <div className="scene-world-camera">
          <div className="scene-world" ref={worldRef}>
            <svg className="meadow-environment" viewBox="0 0 1200 650" role="img" aria-label="A faded meadow with clouds, trees, brook, bridge, flowers, baskets, ribbons, and a path">
              <defs>
                <linearGradient id="meadowSky" x2="0" y2="1">
                  <stop stopColor={restored.includes('gold') ? '#88d8ff' : '#b5bdc2'} />
                  <stop offset="1" stopColor="#f8e9bd" />
                </linearGradient>
                <filter id="mist"><feGaussianBlur stdDeviation="8" /></filter>
              </defs>
              <rect width="1200" height="650" fill="url(#meadowSky)" />
              <g className="moving-clouds" fill="#fff" opacity=".82">
                <ellipse cx="180" cy="100" rx="95" ry="35" />
                <ellipse cx="760" cy="80" rx="120" ry="40" />
              </g>
              <path d="M0 410Q240 300 490 410T880 365T1200 350V650H0Z" fill={restored.length === 3 ? '#6fc867' : '#929b8d'} />
              <g className="oak-tree">
                <path d="M225 130v350" stroke="#67452f" strokeWidth="70" />
                <circle cx="220" cy="145" r="120" fill={restored.includes('red') ? '#478f4d' : '#788079'} />
              </g>
              <g className="meadow-props" opacity=".5">
                <path d="M275 405h92l-9 54h-74Z" fill="#91664b" stroke="#5c4435" strokeWidth="6" />
                <path d="M290 407q30-48 62 0" fill="none" stroke="#654838" strokeWidth="8" />
                <path d="M638 448q45-34 82 7t74-5" fill="none" stroke="#718b99" strokeWidth="14" />
                <path d="m704 449 25-20 10 34" fill="#718b99" />
              </g>
              <path className="brook-water" d="M480 650Q570 520 760 505T1200 430" fill="none" stroke={restored.includes('blue') ? '#42b9ed' : '#9aa6ab'} strokeWidth="105" />
              <g className="bridge">
                <path d="M935 370h235" stroke={restored.includes('gold') ? '#e9bc48' : '#6d665c'} strokeWidth="35" />
                <path d="M960 370v-90m180 90v-90" stroke="#775039" strokeWidth="18" />
              </g>
              <path className="gold-trail" d="M690 610Q820 500 1010 410" fill="none" stroke={restored.includes('gold') ? '#f4cf4f' : '#a59e8e'} strokeWidth="42" strokeDasharray="22 14" />
              <g className="swaying-plants" opacity={restored.includes('red') ? 1 : 0.3}>
                {[330, 380, 430, 560, 620].map((x, index) => (
                  <g key={x} transform={`translate(${x} ${470 + (index % 2) * 35})`}>
                    <path d="M0 0v65" stroke="#3d8548" strokeWidth="8" />
                    <circle r="18" fill="#e44555" />
                  </g>
                ))}
              </g>
              <g className="butterflies" opacity={restored.length === 3 ? 1 : 0}>
                <path d="m760 260q-35-30-35 15 35 20 35-15m0 0q35-30 35 15-35 20-35-15" fill="#f4d35e" />
              </g>
              <path className="villain-haze" d="M0 230Q250 170 430 230T830 185T1200 220" fill="none" stroke="#60456d" strokeWidth="45" opacity={Math.max(0, 0.55 - restored.length * 0.18)} filter="url(#mist)" />
            </svg>

            <div className={`scene-player travel-${avatarPlace}`} data-walking={walking} data-facing={facing}>
              <SceneHuman kind="player" avatar={player.avatar} state={walking ? 'walk' : phase === 'final' ? 'celebrate' : 'idle'} facing={facing} reduceMotion={reduceMotion} />
            </div>
            <div className={`scene-chef chef-at-${avatarPlace}`} data-walking={walking}>
              <SceneHuman kind="chef" state={walking ? 'walk' : speaking === 'chef' ? 'talk' : phase === 'final' ? 'celebrate' : 'point'} reduceMotion={reduceMotion} />
            </div>
            <div className={`scene-poppy poppy-at-${hintLevel === 4 ? clue.target : avatarPlace}`} data-walking={walking || hintLevel === 4}>
              <SceneHuman kind="poppy" state={walking || hintLevel === 4 ? 'walk' : speaking === 'poppy' ? 'talk' : phase === 'final' ? 'celebrate' : 'water'} reduceMotion={reduceMotion} />
            </div>
            {player.selectedCompanion && (
              <CompanionArt kind={player.selectedCompanion} className={`scene-companion travel-${avatarPlace}`} />
            )}

            <button className="scene-target target-brook" aria-label="Brook placement area" onClick={() => picked && tryPlace('brook')}>
              <span>brook</span>
            </button>
            <button className="scene-target target-oak" aria-label="Oak tree placement area" onClick={() => picked && tryPlace('oak')}>
              <span>oak tree</span>
            </button>
            <button className="scene-target target-bridge" aria-label="Bridge placement area" onClick={() => picked && tryPlace('bridge')}>
              <span>bridge</span>
            </button>

            {phase === 'clue' && (
              <button
                className={`draggable-clue-object object-${clue.id} ${dragging ? 'is-dragging' : ''}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                draggable={false}
                aria-label={`Pick up ${clue.object}. Press Enter, then move to the ${clue.target} and press Enter to place.`}
                aria-grabbed={picked}
                data-testid="draggable-clue-object"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setPicked(true);
                    setFeedback(`${clue.object} picked up. Tab to a place in the meadow.`);
                  }
                }}
              >
                <ClueObject color={clue.id} />
              </button>
            )}
          </div>
        </div>

        <div className="scene-dialogue" data-speaker={speaker}>
          <strong>{speaker === 'poppy' ? 'Poppy' : 'Chef Cinnamon'}</strong>
          <p aria-live="polite">{caption}</p>
          <button onClick={() => speak(speaker, caption)}>Replay</button>
        </div>

        {phase === 'intro' && (
          <button className="scene-action primary" onClick={begin}>Begin the color rescue</button>
        )}

        {phase === 'clue' && (
          <div className="clue-overlay">
            <p aria-label={`Current clue: ${clue.text}`}>
              {clue.text.split(' ').map((word, index) => (
                <button key={`${word}-${index}`} onClick={() => hearWord(word.replace(/[^a-z]/gi, ''))}>{word}</button>
              ))}
            </p>
            <div className="clue-actions">
              <button onClick={() => speak('chef', clue.text)}>Hear the clue</button>
              <button className="primary" onClick={askPoppy}>Ask Poppy</button>
            </div>
            <span className="sr-only">Drag the object to its place. Keyboard users can pick it up, then activate a scene destination.</span>
          </div>
        )}

        {feedback && <p className="scene-feedback" role="status">{feedback}</p>}

        {phase === 'read' && (
          <div className="read-overlay">
            <ReadAloud passage="The colors are back in the meadow." microphoneEnabled={player.parentSettings?.microphoneEnabled ?? true} onComplete={finishRead} />
          </div>
        )}

        {phase === 'final' && (
          <div className="final-overlay">
            <h1>Sprinkle Meadows shines again!</h1>
            <p>Flowers bloom, butterflies return, the bridge glows, and the dark mist slips away.</p>
            <div className="reward-star" aria-label="Color Keeper reward">★</div>
            <button className="primary" onClick={onExit}>Return to Sprinkle Meadows</button>
          </div>
        )}
      </div>
    </section>
  );
}
