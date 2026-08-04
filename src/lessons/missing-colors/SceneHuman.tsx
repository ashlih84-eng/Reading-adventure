import type { AvatarConfig } from '../../profiles/types';

export type SceneHumanKind = 'player' | 'chef' | 'poppy';
type HumanState = 'idle' | 'talk' | 'point' | 'walk' | 'water' | 'celebrate' | 'encourage';

function PlayerHair({ avatar, color }: { avatar: AvatarConfig; color: string }) {
  if (avatar.hairStyle === 'curls') {
    return (
      <g fill={color}>
        {[48, 58, 69, 80, 91].map((x, index) => <circle key={x} cx={x} cy={index % 2 ? 35 : 31} r="13" />)}
      </g>
    );
  }
  if (avatar.hairStyle === 'waves') {
    return <path d="M43 56Q38 22 67 20q37-6 33 42-8-23-28-20-18-8-29 14Z" fill={color} />;
  }
  return <path d="M43 54Q45 21 70 20q29 0 31 34-13-13-30-12-17-3-28 12Z" fill={color} />;
}

export function SceneHuman({
  kind,
  avatar,
  state = 'idle',
  facing = 'right',
  reduceMotion = false,
}: {
  kind: SceneHumanKind;
  avatar?: AvatarConfig;
  state?: HumanState;
  facing?: 'left' | 'right';
  reduceMotion?: boolean;
}) {
  const isPlayer = kind === 'player';
  const playerAvatar = avatar ?? {
    skinTone: 'warm',
    hairStyle: 'curls',
    hairColor: '#4b2f26',
    outfit: '#526f9f',
    glasses: false,
  };
  const skin = isPlayer
    ? ({ light: '#f6cfb2', warm: '#c9825b', deep: '#75452f' }[playerAvatar.skinTone])
    : kind === 'chef' ? '#b86f45' : '#c9825a';
  const hair = isPlayer ? playerAvatar.hairColor : kind === 'chef' ? '#3d261f' : '#733b28';
  const outfit = isPlayer ? playerAvatar.outfit : kind === 'chef' ? '#fff4dc' : '#4f8b62';
  const label = kind === 'player' ? 'School-age player' : kind === 'chef' ? 'Chef Cinnamon' : 'Poppy the Gardener';

  return (
    <svg
      className={`scene-human scene-human-${kind} human-${state}`}
      data-motion={reduceMotion ? 'reduced' : state}
      data-facing={facing}
      viewBox="0 0 140 330"
      role="img"
      aria-label={`${label}, ${state}`}
    >
      <g className="human-scale" transform={isPlayer ? 'translate(8 34) scale(.88)' : undefined}>
        <g className="human-rig">
          {isPlayer ? <PlayerHair avatar={playerAvatar} color={hair} /> : kind === 'chef' ? (
            <>
              <path d="M43 55Q44 25 69 23q28 0 31 33" fill={hair} />
              <path d="M35 30q-5-24 17-22 18-17 31 1 26-7 28 20-2 13-15 17H47Q37 42 35 30" fill="#fffaf0" stroke="#70472e" strokeWidth="3" />
            </>
          ) : (
            <>
              <circle cx="92" cy="25" r="18" fill={hair} />
              <path d="M43 56Q42 25 69 22q28 1 31 35-13-15-30-14-16-4-27 13Z" fill={hair} />
            </>
          )}

          <ellipse cx="70" cy="63" rx="25" ry="29" fill={skin} stroke="#563629" strokeWidth="3" />
          <path d="M54 51q7-5 14 0m6 0q7-5 14 0" fill="none" stroke="#563629" strokeWidth="2.4" strokeLinecap="round" />
          <g className="human-eyes"><circle cx="61" cy="59" r="2.7" /><circle cx="79" cy="59" r="2.7" /></g>
          <path d="m70 60-2 7h5" fill="none" stroke="#7a4738" strokeWidth="2" strokeLinecap="round" />
          <path className="human-mouth" d="M61 74q9 6 18 0" fill="none" stroke="#753e3e" strokeWidth="3" strokeLinecap="round" />
          {isPlayer && playerAvatar.glasses && (
            <g fill="none" stroke="#352f3f" strokeWidth="2.5"><circle cx="60" cy="59" r="9" /><circle cx="80" cy="59" r="9" /><path d="M69 59h2" /></g>
          )}

          <path d="M64 91v13h12V91" fill={skin} stroke="#563629" strokeWidth="2" />
          <path d="M42 105Q70 93 98 105L93 194H47Z" fill={outfit} stroke="#49352e" strokeWidth="3" />
          {isPlayer && (
            <>
              <path d="M48 122h44M47 178h46" stroke="#f6e8c8" strokeWidth="6" opacity=".8" />
              <path d="M54 106 47 151m32-48 15 46" fill="none" stroke="#33425f" strokeWidth="4" />
            </>
          )}
          {kind === 'chef' && (
            <>
              <path d="M62 103h16v91H62z" fill="#c86a4a" />
              <path d="M43 113h54" stroke="#fff" strokeWidth="7" />
              <circle cx="55" cy="136" r="3" fill="#744430" /><circle cx="84" cy="136" r="3" fill="#744430" />
            </>
          )}
          {kind === 'poppy' && (
            <>
              <path d="M46 137h48" stroke="#e6b85b" strokeWidth="8" />
              <path d="M55 144h30v42H55z" fill="#e8c772" stroke="#725337" strokeWidth="2" />
            </>
          )}

          <g className="human-arm-left">
            <path d="M45 114 25 159 31 202" fill="none" stroke="#563629" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M45 114 25 159 31 202" fill="none" stroke={skin} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="31" cy="207" r="7" fill={skin} stroke="#563629" strokeWidth="2" />
          </g>
          <g className="human-arm-right">
            <path d="M95 114 116 157 109 200" fill="none" stroke="#563629" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M95 114 116 157 109 200" fill="none" stroke={skin} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="109" cy="206" r="7" fill={skin} stroke="#563629" strokeWidth="2" />
          </g>
          <g className="human-leg-left">
            <path d="M57 194 53 252 47 301" fill="none" stroke="#3f4560" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="53" cy="252" r="7" fill="#30364e" />
            <path d="M33 310h29" stroke="#41352f" strokeWidth="13" strokeLinecap="round" />
          </g>
          <g className="human-leg-right">
            <path d="M83 194 88 251 94 301" fill="none" stroke="#3f4560" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="88" cy="251" r="7" fill="#30364e" />
            <path d="M80 310h30" stroke="#41352f" strokeWidth="13" strokeLinecap="round" />
          </g>

          {kind === 'poppy' && (
            <g className="watering-can">
              <path d="M96 181h36l-4 27H99Z" fill="#65a4ba" stroke="#31586b" strokeWidth="2" />
              <path d="M129 187 139 175" stroke="#65a4ba" strokeWidth="7" />
              <path d="M101 181q12-15 24 0" fill="none" stroke="#65a4ba" strokeWidth="5" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
