import React from 'react';
import type { Progress } from '../types';

interface CustomizationPanelProps {
    progress: Progress;
    currentTheme: string;
    onSetTheme: (theme: string) => void;
    currentVoice: string;
    onSetVoice: (voice: string) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ progress, currentTheme, onSetTheme, currentVoice, onSetVoice }) => {
    // Compute unlocks logic here (adapted from patch pack)
    const isBrightUnlocked = progress.mentor_trust >= 1;
    const isProUnlocked = progress.momentum >= 10;

    // Voice unlocks (example logic)
    const isDeepUnlocked = progress.mentor_trust >= 5;
    const isEnergeticUnlocked = progress.momentum >= 15;

    return (
        <div className="customization-panel section-card">
            <h3>Customization</h3>
            <p className="hint-text" style={{ fontSize: '0.9em', color: '#888', marginBottom: '1rem' }}>
                Make progress with your challenges to unlock new options
            </p>

            <div className="theme-selector">
                <label>Interface Theme</label>
                <div className="theme-buttons">
                    <button
                        className={currentTheme === 'dark' ? 'active' : ''}
                        onClick={() => onSetTheme('dark')}
                    >
                        Dark
                    </button>
                    <button
                        className={currentTheme === 'bright' ? 'active' : ''}
                        onClick={() => onSetTheme('bright')}
                        disabled={true}
                        title="Theme locked"
                    >
                        Bright 🔒
                    </button>
                    <button
                        className={currentTheme === 'pro' ? 'active' : ''}
                        onClick={() => onSetTheme('pro')}
                        disabled={true}
                        title="Theme locked"
                    >
                        Pro 🔒
                    </button>
                </div>
            </div>

            <div className="theme-selector" style={{ marginTop: '1rem' }}>
                <label>Mentor Voice (Linked to Avatar)</label>
                <div className="theme-buttons">
                    <button className={currentVoice === 'en-US-JennyNeural' ? 'active' : ''} disabled>
                        Jenny {currentVoice !== 'en-US-JennyNeural' && '🔒'}
                    </button>
                    <button className={currentVoice === 'en-US-GuyNeural' ? 'active' : ''} disabled>
                        Guy {currentVoice !== 'en-US-GuyNeural' && '🔒'}
                    </button>
                    <button className={currentVoice === 'en-US-DavisNeural' ? 'active' : ''} disabled>
                        Davis {currentVoice !== 'en-US-DavisNeural' && '🔒'}
                    </button>
                    <button className={currentVoice === 'en-US-SaraNeural' ? 'active' : ''} disabled>
                        Sara {currentVoice !== 'en-US-SaraNeural' && '🔒'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationPanel;
