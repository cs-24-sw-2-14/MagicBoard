// Store to handle global state

import { writable } from 'svelte/store';

export const serverId = writable('');

export const viewChat = writable(false);

export const settings = writable(false);

export interface CanvasView {
  x: number;
  y: number;
  width: number; // Default values, will be replaced on mount
  height: number; // Default values, will be replaced on mount
  scale: number;
}

export const canvasView = writable<CanvasView>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: 100
});

export interface ToolStates {
  draw: boolean;
  erase: boolean;
  pan: boolean;
  move: boolean;
}

export const toolState = writable<ToolStates>({
  draw: false,
  erase: false,
  pan: true,
  move: false
});

export function activateTool(tool: keyof ToolStates) {
  toolState.update((current) => {
    return { ...current, draw: false, erase: false, pan: false, move: false, [tool]: true };
  });
}
export interface CanvasMousePosition {
  x: number;
  y: number;
}
export const canvasMousePosition = writable<CanvasMousePosition>({
  x: 0,
  y: 0,
});

export const canvasMouseDown = writable(false)

export const mouseEvents = {
  down: () => canvasMouseDown.set(true),
  move: (event: MouseEvent) => canvasMousePosition.update(() => {
    return { x: event.clientX, y: event.clientY };
  }),
  up: () => canvasMouseDown.set(false),
};
