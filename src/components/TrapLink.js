import React, { useEffect, useState } from 'react';

const TrapLink = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) return null; // Logic to ensure it renders on client if needed, or simple render is fine

    // Randomize the trap URL slightly if needed, or keep it static
    // Using a static path that looks internal but boring
    const trapPath = "/api/internal/verify/integrity-check";

    return (
        <a
            href={trapPath}
            rel="nofollow"
            aria-hidden="true"
            tabIndex="-1"
            style={{
                position: 'absolute',
                left: '-9999px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
                visibility: 'hidden'
            }}
        >
            System Check
        </a>
    );
};

export default TrapLink;
