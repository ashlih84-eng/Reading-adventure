import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { newPlayer, type PlayerProfile } from '../../profiles/types';
import { MissingColorsMission } from './MissingColorsMission';

const avatar = { skinTone: 'warm', hairStyle: 'curls', hairColor: '#432', outfit: '#639', glasses: false } as const;

function player(progress?: unknown, reduceMotion = false): PlayerProfile {
  const profile = newPlayer('River', avatar);
  return {
    ...profile,
    accessibility: { ...profile.accessibility, reduceMotion },
    activityProgress: progress ? { 'visual-slice:missing-colors': progress } : {},
  };
}

function cluePlayer(clueIndex = 0, restored: string[] = [], reduceMotion = false) {
  return player({ phase: 'clue', clueIndex, restored }, reduceMotion);
}

function mockWorld(container: HTMLElement) {
  const world = container.querySelector('.scene-world') as HTMLElement;
  vi.spyOn(world, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 1_000,
    bottom: 600,
    width: 1_000,
    height: 600,
    toJSON: () => ({}),
  });
}

describe('Restore the Missing Colors visual slice', () => {
  it('shows one short clue before interaction, a real draggable object, captions, and no dropdown', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    expect(screen.getByLabelText('Current clue: The blue ribbon is beside the brook.')).toBeVisible();
    expect(screen.getByTestId('draggable-clue-object')).toHaveAttribute('draggable', 'false');
    expect(screen.getByText(/Sprinkle Snatcher took the meadow’s colors/)).toBeVisible();
    expect(container.querySelector('select')).toBeNull();
  });

  it('makes the grabbed object follow pointer input', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    mockWorld(container);
    const object = screen.getByTestId('draggable-clue-object');
    fireEvent.pointerDown(object, { pointerId: 1, clientX: 480, clientY: 294 });
    fireEvent.pointerMove(object, { pointerId: 1, clientX: 550, clientY: 300 });
    expect(object).toHaveStyle({ left: '55%', top: '50%' });
    expect(object).toHaveClass('is-dragging');
  });

  it('locks a correct object into its real destination and restores blue', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    mockWorld(container);
    const object = screen.getByTestId('draggable-clue-object');
    fireEvent.pointerDown(object, { pointerId: 1, clientX: 480, clientY: 294 });
    fireEvent.pointerMove(object, { pointerId: 1, clientX: 650, clientY: 432 });
    fireEvent.pointerUp(object, { pointerId: 1, clientX: 650, clientY: 432 });
    expect(screen.getByRole('status')).toHaveTextContent(/locked into place/i);
    expect(container.querySelector('.meadow-stage')).toHaveAttribute('data-restored', 'blue');
    expect(screen.getByLabelText('Colors restored')).toHaveAttribute('aria-valuenow', '1');
  });

  it('gently returns an object released at the wrong destination', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    mockWorld(container);
    const object = screen.getByTestId('draggable-clue-object');
    fireEvent.pointerDown(object, { pointerId: 1, clientX: 480, clientY: 294 });
    fireEvent.pointerMove(object, { pointerId: 1, clientX: 900, clientY: 100 });
    fireEvent.pointerUp(object, { pointerId: 1, clientX: 900, clientY: 100 });
    expect(object).toHaveStyle({ left: '48%', top: '49%' });
    expect(screen.getByRole('status')).toHaveTextContent(/floats gently back/i);
  });

  it('provides a four-step Poppy hint ladder without placing the object', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    for (let index = 0; index < 4; index += 1) fireEvent.click(screen.getByRole('button', { name: 'Ask Poppy' }));
    expect(screen.getByText(/I’ll walk near the brook/)).toBeVisible();
    expect(container.querySelector('.scene-poppy')).toHaveClass('poppy-at-brook');
    expect(screen.getByTestId('draggable-clue-object')).toBeVisible();
  });

  it('shows the completed world restoration state', () => {
    const { container } = render(<MissingColorsMission player={player({ phase: 'final', clueIndex: 3, restored: ['blue', 'red', 'gold'] })} onSave={() => {}} onExit={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Sprinkle Meadows shines again!' })).toBeVisible();
    expect(container.querySelector('.meadow-stage')).toHaveAttribute('data-restored', 'blue red gold');
    expect(container.querySelector('.butterflies')).toHaveAttribute('opacity', '1');
    expect(container.querySelector('.villain-haze')).toHaveAttribute('opacity', '0.010000000000000009');
  });

  it('walks the avatar and both human guides into the active clue scene', () => {
    vi.useFakeTimers();
    const { container } = render(<MissingColorsMission player={player()} onSave={() => {}} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin the color rescue' }));
    act(() => vi.advanceTimersByTime(3_600));
    expect(container.querySelector('.scene-player')).toHaveAttribute('data-walking', 'true');
    expect(container.querySelector('.scene-player .human-walk')).toBeTruthy();
    expect(container.querySelector('.scene-chef')).toHaveAttribute('data-walking', 'true');
    expect(container.querySelector('.scene-poppy')).toHaveAttribute('data-walking', 'true');
    vi.useRealTimers();
  });

  it('supports keyboard pick-up and placement without exposing a form', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    const object = screen.getByTestId('draggable-clue-object');
    fireEvent.keyDown(object, { key: 'Enter' });
    expect(object).toHaveAttribute('aria-grabbed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Brook placement area' }));
    expect(screen.getByRole('status')).toHaveTextContent(/locked into place/i);
    expect(container.querySelector('form, select, input[type="radio"]')).toBeNull();
  });

  it('marks every scene character with a reduced-motion alternative', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer(0, [], true)} onSave={() => {}} onExit={() => {}} />);
    expect(container.querySelectorAll('.scene-human[data-motion="reduced"]')).toHaveLength(3);
  });

  it('declares an active camera destination for the small-screen layout', () => {
    const { container } = render(<MissingColorsMission player={cluePlayer()} onSave={() => {}} onExit={() => {}} />);
    expect(container.querySelector('.meadow-stage')).toHaveAttribute('data-camera', 'brook');
    expect(container.querySelector('.scene-world-camera')).toBeInTheDocument();
  });
});
