import type { Chapter, ChapterStatus } from '../types';

interface DashboardProps {
    chapters: ChapterStatus[];
    activeChapter: Chapter;
    onSelectChapter: (c: Chapter) => void;
}

const ChapterDashboard: React.FC<DashboardProps> = ({ chapters, activeChapter, onSelectChapter }) => {
    // Sort logic or just find active
    const activeCh = (chapters && chapters.length > 0) ? (chapters.find(c => c.id === activeChapter) || chapters[0]) : null;

    return (
        <div className="dashboard-container">
            <div className="tabs">
                {chapters.map(ch => (
                    <button
                        key={ch.id}
                        className={`tab ${activeChapter === ch.id ? 'active' : ''}`}
                        onClick={() => onSelectChapter(ch.id)}
                    >
                        {ch.id}
                    </button>
                ))}
            </div>

            {activeCh && activeCh.stage && (
                <div className={`chapter-card ${activeCh.stage.toLowerCase()} active-view`}>
                    <div className="chapter-header">
                        <div className="score-container">
                            <span className="score-label">Current Score</span>
                            <span className={`score-value ${activeCh.score >= 70 ? 'good' : activeCh.score <= 40 ? 'bad' : 'neutral'}`}>{activeCh.score}</span>
                        </div>
                        <div className={`stage-badge ${activeCh.stage.toLowerCase()}`}>
                            <span className="stage-label">Status: {activeCh.stage.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <div className="metrics-list">
                        <h4>Contributing Metrics (0-100)</h4>
                        {activeCh.metrics.map(m => (
                            <div key={m.name} className={`metric-row ${m.is_good ? 'good-metric' : 'bad-metric'}`}>
                                <span>{m.name}</span>
                                <span>{Math.round(m.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterDashboard;
