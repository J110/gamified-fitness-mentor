import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MentorPanelProps {
    scriptText: string;
    triggerGeneration: number; // Changed from boolean to ID
    onGenerationComplete: () => void;
    sourceUrl?: string | null;
    voiceId?: string;
}

const MentorPanel: React.FC<MentorPanelProps> = ({ scriptText, triggerGeneration, onGenerationComplete, sourceUrl, voiceId }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('idle');
    const [error, setError] = useState<string | null>(null);
    const [displayedScript, setDisplayedScript] = useState(scriptText);

    // Track last handled trigger to avoid double-firing or stale logic
    const lastTriggerRef = React.useRef(0);

    // Race condition prevention
    const currentRequestId = React.useRef(0);

    // Default alice image
    const defaultSource = "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg";
    const effectiveSource = sourceUrl || defaultSource;

    useEffect(() => {
        // Only generate if trigger increased
        if (triggerGeneration > lastTriggerRef.current && scriptText) {
            lastTriggerRef.current = triggerGeneration;
            generateVideo();
        } else {
            // If just idle update (e.g. init or text change without trigger), keep text synced if no video playing
            if (status === 'idle' && !videoUrl) {
                setDisplayedScript(scriptText);
            }
        }
    }, [triggerGeneration, scriptText]);

    const generateVideo = async () => {
        const requestId = ++currentRequestId.current;
        setStatus('generating');
        setError(null);
        // Do not clear videoUrl immediately to avoid flashing, wait for new one
        // But if we want to show loading spinner, maybe we should? 
        // User said: "started, but then... previous video". 
        // Better to keep previous video until new one is ready? Or show loading?
        // Let's show loading to clarify action.
        setVideoUrl(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/did/talk`, {
                source_url: effectiveSource,
                text: scriptText,
                voice: {
                    provider: "microsoft",
                    voice_id: voiceId || "en-US-JennyNeural"
                }
            });

            if (currentRequestId.current !== requestId) return; // Stale

            const { talk_id } = response.data;
            pollForVideo(talk_id, requestId);

        } catch (err: any) {
            if (currentRequestId.current !== requestId) return;
            console.error(err);
            setStatus('error');
            setDisplayedScript(scriptText); // Show text even if video failed

            const errorData = err.response?.data;
            const errorMsg = typeof errorData === 'string' ? errorData
                : errorData?.error?.description
                || errorData?.error
                || errorData?.message
                || err.message
                || 'Failed to generate video';

            setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : String(errorMsg));
        }
    };

    const pollForVideo = (id: string, requestId: number) => {
        const interval = setInterval(async () => {
            if (currentRequestId.current !== requestId) {
                clearInterval(interval);
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/did/talk/${id}`);
                const { status: talkStatus, video_url } = res.data;

                if (talkStatus === 'done' && video_url) {
                    clearInterval(interval);
                    if (currentRequestId.current === requestId) {
                        setVideoUrl(video_url);
                        setDisplayedScript(scriptText); // NOW update the text
                        setStatus('playing');
                        onGenerationComplete();
                    }
                } else if (talkStatus === 'error') {
                    clearInterval(interval);
                    if (currentRequestId.current === requestId) {
                        setStatus('error');
                        setError('Generation failed via D-ID');
                        setDisplayedScript(scriptText);
                    }
                }
            } catch (err) {
                clearInterval(interval);
                if (currentRequestId.current === requestId) {
                    setStatus('error');
                }
            }
        }, 1200);

        setTimeout(() => {
            clearInterval(interval);
            if (currentRequestId.current === requestId && status !== 'playing' && status !== 'error') {
                setStatus('timeout');
            }
        }, 45000);
    };

    return (
        <div className="mentor-panel section-card">
            <h2>Your Mentor</h2>

            <div className="mentor-display">
                {status === 'generating' && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Consulting mentor...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mentor-fallback">
                        <img src={effectiveSource} alt="Mentor" className="static-avatar" />
                        <div className="bubble error">
                            <p><strong>Connection Issue:</strong> {error}</p>
                            <p>{displayedScript}</p>
                        </div>
                    </div>
                )}

                {status === 'idle' && !videoUrl && (
                    <div className="mentor-fallback">
                        <img src={effectiveSource} alt="Mentor" className="static-avatar" />
                        <div className="bubble">
                            <p>{displayedScript || "I've analyzed your chapters. Ready to review?"}</p>
                        </div>
                    </div>
                )}

                {videoUrl && (
                    <div className="video-wrapper">
                        <video src={videoUrl} autoPlay playsInline controls className="mentor-video" width="100%" />
                        <div className="transcript-box">
                            <p>"{displayedScript}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorPanel;
