// src/components/effects/ParticleBackground.tsx
// TS Particles background effects for Tokabi
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { useTheme } from '../contexts/ThemeContext';

type ParticlePreset = 'hero' | 'subtle' | 'network' | 'floating';

interface ParticleBackgroundProps {
  preset?: ParticlePreset;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  preset = 'hero',
  className = '',
}) => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Initialize particles engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Cyan color palette based on theme
  const colors = useMemo(() => ({
    primary: isDark ? '#22d3ee' : '#0e7490',      // cyan-400 / cyan-700
    secondary: isDark ? '#06b6d4' : '#0891b2',   // cyan-500 / cyan-600
    tertiary: isDark ? '#0891b2' : '#155e75',    // cyan-600 / cyan-800
    links: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(14, 116, 144, 0.1)',
  }), [isDark]);

  // Configuration presets
  const configs: Record<ParticlePreset, ISourceOptions> = useMemo(() => ({
    // Hero section - Dynamic network effect
    hero: {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
              color: colors.primary,
            },
          },
          push: {
            quantity: 3,
          },
        },
      },
      particles: {
        color: {
          value: [colors.primary, colors.secondary, colors.tertiary],
        },
        links: {
          color: colors.links,
          distance: 150,
          enable: true,
          opacity: isDark ? 0.3 : 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        number: {
          density: {
            enable: true,
            width: 1200,
            height: 800,
          },
          value: 60,
        },
        opacity: {
          value: { min: 0.3, max: 0.7 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    },

    // Subtle floating particles
    subtle: {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 30,
      particles: {
        color: {
          value: colors.secondary,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'top',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        number: {
          density: {
            enable: true,
            width: 1200,
            height: 800,
          },
          value: 25,
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.3,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      detectRetina: true,
    },

    // Network grid effect
    network: {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'connect',
          },
        },
        modes: {
          connect: {
            distance: 100,
            links: {
              opacity: 0.3,
            },
            radius: 150,
          },
        },
      },
      particles: {
        color: {
          value: colors.primary,
        },
        links: {
          color: colors.secondary,
          distance: 200,
          enable: true,
          opacity: isDark ? 0.2 : 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: false,
          straight: false,
          outModes: {
            default: 'bounce',
          },
        },
        number: {
          density: {
            enable: true,
            width: 1200,
            height: 800,
          },
          value: 40,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: 2,
        },
      },
      detectRetina: true,
    },

    // Floating orbs effect
    floating: {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 30,
      particles: {
        color: {
          value: [colors.primary, colors.secondary],
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        number: {
          density: {
            enable: true,
            width: 1200,
            height: 800,
          },
          value: 15,
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
          animation: {
            enable: true,
            speed: 0.2,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 20, max: 80 },
        },
      },
      detectRetina: true,
    },
  }), [colors, isDark]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={`tsparticles-${preset}`}
      className={`absolute inset-0 ${className}`}
      options={configs[preset]}
    />
  );
};

export default ParticleBackground;
