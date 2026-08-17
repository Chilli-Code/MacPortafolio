// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EdgeAura } from "edge-aura/react";
import { EDGE_AURA_PRESETS } from "edge-aura";
import { useAppSettingsStore } from "./store/appSettingsStore";
import { registerAuraHandle } from "./lib/auraController";
import './index.css';
import App from './App.jsx';
import GamePage from './routes/Game.jsx';

const EdgeAuraLayer = () => {
  const enabled = useAppSettingsStore((s) => s.edgeAuraEnabled);
  const config = useAppSettingsStore((s) => s.edgeAuraConfig);
  const theme = useAppSettingsStore((s) => s.theme);

  if (!enabled) return null;

  // "default" means "no appearance preset bundle" — only the explicit config applies.
  const preset =
    config.preset && config.preset !== 'default' ? EDGE_AURA_PRESETS[config.preset] : null;

  const options = {
    ...preset,
    geometry: {
      ...preset?.geometry,
      band: config.band,
      cornerRadius: config.cornerRadius,
      inset: config.inset,
      cornerFill: config.cornerFill,
    },
    palette: {
      ...preset?.palette,
      ringAlpha: config.ringAlpha,
      pastel: config.pastel,
      background: theme === 'dark' ? 'dark' : 'light',
    },
    motion: {
      ...preset?.motion,
      rotateIdleS: config.rotateIdleS,
      hueDriftDeg: config.hueDriftDeg,
      highlight: config.highlightOn
        ? { arcDeg: config.highlightArc, periodS: config.highlightPeriod, min: config.highlightMin }
        : undefined,
    },
    input: preset?.input,
  };

  return (
    <EdgeAura
      ref={registerAuraHandle}
      palette={config.palette}
      options={options}
      style={{ zIndex: 1 }}
    />
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
      <EdgeAuraLayer />
    </BrowserRouter>
  </StrictMode>,
);