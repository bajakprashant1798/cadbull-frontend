import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaExpand, FaCompress, FaTimes, FaSearch, FaMicrophone, FaPaperPlane, FaLightbulb, FaHouseDamage, FaToolbox, FaSprayCan, FaTrash, FaMagic, FaDownload, FaEye } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { getSafeImageUrl } from "@/utils/imageUtils";

function slugify(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\-+/g, "-")
        .replace(/^\-+|\-+$/g, "");
}

export default function AISearchAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_MAIN || "http://localhost:5001/api";

    // Load from sessionStorage strictly on mount
    useEffect(() => {
        const saved = sessionStorage.getItem('cadbull_ai_chat');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Wipe stale dummy greetings from previous iterations
                if (parsed.length === 1 && parsed[0].explanation && parsed[0].explanation.includes("Hello there! I'm happy to help")) {
                    sessionStorage.removeItem('cadbull_ai_chat');
                    setMessages([]);
                } else if (parsed.length > 0) {
                    setMessages(parsed);
                }
            } catch (e) { }
        }
    }, []);

    // Save to sessionStorage when messages changes
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('cadbull_ai_chat', JSON.stringify(messages));
        }
    }, [messages]);

    // Clear chat handler
    const handleClearChat = () => {
        setMessages([]);
        sessionStorage.removeItem('cadbull_ai_chat');
    };

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Toggle Modal
    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    // Handle Quick Suggestions
    const handleQuickQuery = (text) => {
        setQuery(text);
        executeSearch(text);
    };

    // Execute Search
    const executeSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;

        const currentQuery = searchQuery.trim();
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: currentQuery }]);
        setQuery(''); // Clear input
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/ai/search-assistant`, { query: currentQuery });
            if (response.data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    explanation: response.data.explanation,
                    results: response.data.results
                }]);
            }
        } catch (error) {
            console.error("AI Search Failed:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                explanation: 'Sorry, I experienced a network hiccup or hit a rate limit. Please try again in slightly different words.',
                results: []
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Voice to Text functionality
    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition is not supported by your browser. Try Google Chrome.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(prev => prev ? prev + ' ' + transcript : transcript);
        };

        recognition.onerror = (event) => {
            console.error("Voice recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!isOpen) {
        return (
            <button
                onClick={toggleModal}
                className="btn btn-primary position-fixed shadow-lg d-flex align-items-center justify-content-center border-0 gap-2 px-4"
                style={{
                    bottom: '24px', right: '24px',
                    height: '54px',
                    zIndex: 9999, transition: 'transform 0.2s ease-in-out, background-color 0.2s',
                    // backgroundColor: '#1d4ed8', 
                    color: 'white',
                    borderRadius: '30px',
                    fontWeight: '600', fontSize: '18px', letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    // e.currentTarget.style.backgroundColor = '#1e40af';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    // e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                title="AI File Finder"
            >
                <BsStars size={22} className="mb-1" />
                AI File Finder
            </button>
        );
    }

    return (
        <>
            <style jsx>{`
            @keyframes pulse-mic {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }
            .mic-listening {
                animation: pulse-mic 1.2s infinite ease-in-out;
                color: #ef4444 !important;
            }
        `}</style>
            <div
                className="position-fixed shadow-lg d-flex flex-column overflow-hidden text-dark"
                style={{
                    bottom: '16px', right: '16px',
                    width: isExpanded ? 'calc(100vw - 32px)' : 'calc(100vw - 32px)',
                    maxWidth: isExpanded ? '1200px' : '480px',
                    height: isExpanded ? 'calc(100vh - 32px)' : '750px',
                    maxHeight: 'calc(100vh - 32px)',
                    zIndex: 10000, borderRadius: '20px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center p-3 bg-white" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <div className="d-flex align-items-center">
                        <div className="rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm position-relative overflow-hidden" style={{ width: '42px', height: '42px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                            <Image src="/logo.webp" layout="fill" objectFit="contain" alt="AI Logo" />
                            <div className="position-absolute rounded-circle bg-success" style={{ width: '10px', height: '10px', bottom: '2px', right: '2px', border: '2px solid white' }}></div>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold fs-5">AI File Finder</h6>
                            <small className="text-muted" style={{ fontSize: '12px' }}>
                                <FaMicrophone size={10} className="me-1" />
                                {messages.filter(m => m.role === 'user').length} queries • {messages.reduce((total, m) => total + (m.results?.length || 0), 0)} results
                            </small>
                        </div>
                    </div>
                    <div className="d-flex gap-2 text-muted align-items-center">
                        {messages.length > 0 && (
                            <button className="text-muted border-0 bg-transparent p-1" style={{ cursor: 'pointer', outline: 'none' }} onClick={handleClearChat} title="Clear Chat">
                                <FaTrash size={16} />
                            </button>
                        )}
                        <button className="text-muted border-0 bg-transparent p-1" style={{ cursor: 'pointer', outline: 'none' }} onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Collapse" : "Expand"}>
                            {isExpanded ? <FaCompress size={16} /> : <FaExpand size={16} />}
                        </button>
                        <button className="text-muted border-0 bg-transparent p-1 ms-1" style={{ cursor: 'pointer', outline: 'none' }} onClick={toggleModal} title="Close">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#ffffff' }}>

                    {/* Default State (No Search Yet) */}
                    {messages.length === 0 && (
                        <div className="text-center mt-3">
                            <div className="mx-auto rounded-4 d-flex align-items-center justify-content-center mb-4" style={{ width: '75px', height: '75px', backgroundColor: '#eff6ff', border: '1px solid #dbeafe' }}>
                                <FaSearch size={32} className="text-primary" />
                            </div>
                            <h5 className="fw-bold mb-2 text-dark">What CAD file do you need?</h5>
                            <p className="text-muted small mb-4" style={{ letterSpacing: '0.3px', lineHeight: '1.6' }}>Describe dimensions, room types, or building<br />styles — I'll find the best matches.</p>

                            {/* Category Badges */}
                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <span onClick={() => handleQuickQuery("House Plans")} className="badge text-primary border border-primary p-2 px-3 rounded-pill fw-normal shadow-sm" style={{ cursor: 'pointer', backgroundColor: 'rgb(239, 246, 255)' }}><FaHouseDamage className="me-1" /> House Plans</span>
                                <span onClick={() => handleQuickQuery("Structural Details")} className="badge text-muted border p-2 px-3 rounded-pill fw-normal" style={{ cursor: 'pointer', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}><FaToolbox className="me-1 text-warning" /> Structural</span>
                                <span onClick={() => handleQuickQuery("Interior Details")} className="badge text-muted border p-2 px-3 rounded-pill fw-normal" style={{ cursor: 'pointer', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}><FaSprayCan className="me-1 text-secondary" /> Interior</span>
                            </div>

                            {/* Quick Suggestions Map */}
                            <div className="row g-2 mb-4 text-start mt-2">
                                {['2BHK house plan', '3BHK 30x40 plan', 'villa floor plan', 'duplex plan'].map(qs => (
                                    <div className="col-6" key={qs}>
                                        <div className="border rounded-4 p-3 text-muted" style={{ cursor: 'pointer', backgroundColor: '#f8fafc', borderColor: '#f1f5f9', fontSize: '13px' }} onClick={() => handleQuickQuery(qs)}>
                                            {qs}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pro Tips Alert */}
                            <div className="alert border border-primary border-opacity-25 rounded-4 text-start p-3 mt-4 mx-1" style={{ backgroundColor: 'rgb(239, 246, 255)' }}>
                                <p className="mb-1 fw-bold text-primary" style={{ fontSize: '13px' }}><FaLightbulb className="me-1 text-warning" /> Pro Tips</p>
                                <p className="mb-0 text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                    Be specific: "30x40 2BHK east-facing" · mention room counts · ask by style like "modern villa with parking"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chat History */}
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className="mb-4">
                            {msg.role === 'user' ? (
                                <div className="d-flex flex-column align-items-end mb-2 w-100">
                                    <div className="rounded-5 py-2 px-3 shadow-sm mb-1" style={{ backgroundColor: '#1d4ed8', borderBottomRightRadius: '4px', maxWidth: '85%' }}>
                                        <p className="mb-0 fw-medium" style={{ fontSize: '14.5px', color: '#ffffff' }}>{msg.content}</p>
                                    </div>
                                    <small className="text-muted text-end me-1" style={{ fontSize: '10px' }}>{new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-start mb-2 w-100">
                                    <div className="d-flex align-items-start mb-2 w-100">
                                        <div className="rounded-3 d-flex justify-content-center align-items-center me-3 flex-shrink-0 shadow-sm overflow-hidden position-relative" style={{ width: '30px', height: '30px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                                            <Image src="/logo.webp" layout="fill" objectFit="contain" alt="AI" />
                                        </div>
                                        <div className="flex-grow-1">
                                            {msg.explanation && (
                                                <div className="d-flex flex-column align-items-start mb-3">
                                                    <div className="rounded-4 py-3 px-4 shadow-sm mb-1 bg-white" style={{ borderTopLeftRadius: '4px', border: '1px solid #e2e8f0', maxWidth: '95%' }}>
                                                        <p className="mb-0 text-dark" style={{ fontSize: '15px', lineHeight: '1.6' }}>{msg.explanation}</p>
                                                    </div>
                                                    <small className="text-muted ms-1" style={{ fontSize: '10px' }}><FaMicrophone className="me-1 d-none" /> {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                                </div>
                                            )}

                                            {/* Result Grid -> Horizontal Cards */}
                                            {msg.results && msg.results.length === 0 && idx !== 0 ? (
                                                <div className="text-muted small p-2">
                                                    No exact matches found. Try broadening your terms.
                                                </div>
                                            ) : msg.results && msg.results.length > 0 ? (
                                                <div className="mt-2 w-100">
                                                    <p className="text-muted fw-bold mb-3 ps-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                                                        <FaSearch className="me-1 mb-1" /> {msg.results.length} FILES FOUND
                                                    </p>

                                                    <div className="d-flex flex-column gap-3 w-100 m-0">
                                                        {msg.results.map((product, index) => (
                                                            <div key={product.id} className="position-relative w-100">
                                                                <div className="position-absolute d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                                                                    style={{ width: '22px', height: '22px', backgroundColor: '#f59e0b', borderRadius: '50%', fontSize: '12px', top: '-8px', left: '-8px', zIndex: 10 }}>
                                                                    {index + 1}
                                                                </div>
                                                                <div className="card w-100 border-0 shadow-sm overflow-hidden d-flex flex-row p-2 text-decoration-none bg-white"
                                                                    style={{ cursor: 'pointer', border: '1px solid #e2e8f0', borderLeftWidth: '3px', borderLeftColor: '#3b82f6', borderRadius: '12px', transition: 'box-shadow 0.2s' }}
                                                                    onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
                                                                    onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
                                                                    onClick={() => router.push(`/detail/${product.id}/${slugify(product.title)}`)}>

                                                                    <div className="position-relative rounded-2 flex-shrink-0 ms-2 my-1 border" style={{ width: '70px', height: '70px', overflow: 'hidden' }}>
                                                                        <Image src={getSafeImageUrl(product.image)} layout="fill" objectFit="cover" alt={product.title} />
                                                                    </div>
                                                                    <div className="ps-3 pe-2 d-flex flex-column justify-content-center flex-grow-1 overflow-hidden py-1">
                                                                        <div className="d-flex justify-content-between align-items-start">
                                                                            <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ fontSize: '14.5px' }} title={product.title}>{product.title}</h6>
                                                                            <FaExpand className="text-muted flex-shrink-0 ms-2" size={10} style={{ opacity: 0.5 }} />
                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap gap-2 mt-1">
                                                                            <span className="badge rounded-pill text-primary fw-medium" style={{ backgroundColor: 'rgb(239, 246, 255)', fontSize: '10px' }}>{product.file_type || 'DWG'}</span>
                                                                            <span className="badge rounded-pill text-dark fw-medium" style={{ backgroundColor: '#f1f5f9', fontSize: '10px' }}>Architectural</span>
                                                                            <span className="text-muted" style={{ fontSize: '10px' }}>{product.file_size || '2.7 MB'}</span>
                                                                        </div>
                                                                        <div className="text-muted mt-2 d-flex align-items-center" style={{ fontSize: '11px' }}>
                                                                            <FaDownload className="me-1" size={9} /> {product.download || 0}
                                                                            <span className="ms-3 text-primary d-flex align-items-center fw-medium mt-1"><FaEye className="me-1" /> View →</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="d-flex justify-content-start mb-4 ps-5">
                            <div className="rounded-4 py-2 px-3 shadow-sm d-flex align-items-center bg-white border" style={{ borderTopLeftRadius: '4px' }}>
                                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                <small className="text-dark fw-medium">Searching files for you...</small>
                            </div>
                        </div>
                    )}

                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sticky Footer Search Input */}
                <div className="p-3 bg-white pb-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="position-relative flex-grow-1">
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control rounded-pill pe-5 py-3 text-dark bg-white"
                                placeholder="Describe the file you need..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)' }}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className={`position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-4 ${isListening ? 'mic-listening' : 'text-muted'}`}
                                style={{ outline: 'none' }}
                                onClick={startVoiceRecognition}
                                title={isListening ? "Listening... Speak now" : "Voice Search"}
                            >
                                <FaMicrophone size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => executeSearch(query)}
                            disabled={isLoading || !query.trim()}
                            className="btn btn-primary rounded-4 d-flex align-items-center justify-content-center border-0 flex-shrink-0"
                            style={{ width: '54px', height: '54px', backgroundColor: '#20325A', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)' }}
                        >
                            <FaPaperPlane className="" size={20} />
                        </button>
                    </div>
                    <div className="text-center mt-3 pb-1">
                        <small className="text-muted" style={{ fontSize: '10px' }}>Enter to send · Esc to close</small>
                    </div>
                </div>
            </div>
        </>
    );
}
