import React from 'react';
import type { SkillCard } from '../types';

interface SkillCardItemProps {
    card: SkillCard;
    // onComplete removed
}

const SkillCardItem: React.FC<SkillCardItemProps & { selectedOutcome?: 'none' | 'partial' | 'full', onChange: (outcome: 'none' | 'partial' | 'full') => void }> = ({ card, selectedOutcome = 'none', onChange }) => {
    return (
        <div className={`skill-card ${selectedOutcome !== 'none' ? 'card-active' : ''}`}>
            <h3>{card.title}</h3>
            <p>{card.why}</p>
            <div className="tags">
                {card.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>

            <div className="card-actions-row">
                <select
                    value={selectedOutcome}
                    onChange={(e) => onChange(e.target.value as any)}
                    className="outcome-select"
                >
                    <option value="none">Select Outcome...</option>
                    <option value="partial">Partial (+1 Momentum)</option>
                    <option value="full">Done (+2 Momentum)</option>
                </select>
                {/* Submit button removed in favor of batch submit */}
            </div>
        </div>
    );
};

export default SkillCardItem;
