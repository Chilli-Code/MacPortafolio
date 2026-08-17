// src/lib/auraController.js
// Bridge between the Settings preview controls and the live <EdgeAura> instance.
// The React adapter listens to window CustomEvents (prefix "aura"), so the
// "Pulse" and "Play" actions just dispatch those; "Replay entrance" uses the
// imperative ref handle registered by the EdgeAuraLayer in main.jsx.

let handle = null;

export function registerAuraHandle(h) {
  handle = h;
}

// Reveal the steady ring spreading from the screen centre (entrance kindle).
export function replayAuraEntrance() {
  if (handle) {
    handle.kindle(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// Ambient pulse — e.g. "a save just happened".
export function pulseAura() {
  window.dispatchEvent(new CustomEvent("aura:saved-pulse"));
}

// Simulate a keystroke at x (0..1 across the bottom edge).
export function playAuraKey(x) {
  window.dispatchEvent(
    new CustomEvent("aura:key", { detail: { x: Math.max(0, Math.min(1, x)) } }),
  );
}
