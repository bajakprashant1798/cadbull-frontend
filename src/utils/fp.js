export const FP_KEY = 'c_fp_id';

// Helper to hash a string (simple/fast)
const hashString = (str) => {
    let hash = 0;
    if (!str || str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(36);
};

const getUAHash = () => {
    if (typeof window === 'undefined') return '';
    return hashString(navigator.userAgent || '');
};

const createNewFP = (reason = 'init') => {
    let id;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
    } else {
        id = 'fp-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }

    const fpData = {
        id,
        createdAt: Date.now(),
        uaHash: getUAHash(),
        reason
    };

    if (typeof window !== 'undefined') {
        localStorage.setItem(FP_KEY, JSON.stringify(fpData));
    }
    return fpData;
};

export const rotateFP = (reason = 'manual_rotation') => {
    console.log(`🔄 Rotating Fingerprint: ${reason}`);
    return createNewFP(reason);
};

export const getFingerprintData = () => {
    if (typeof window === 'undefined') return null;

    let raw = localStorage.getItem(FP_KEY);
    let fpData = null;

    // Try parsing existing data
    if (raw) {
        try {
            // Check if it's legacy format (string only) or new JSON
            if (raw.startsWith('{')) {
                fpData = JSON.parse(raw);
            } else {
                // Migrate legacy string to object
                fpData = {
                    id: raw,
                    createdAt: Date.now(), // Treat found legacy as "newly discovered"
                    uaHash: getUAHash(),
                    reason: 'migration'
                };
                localStorage.setItem(FP_KEY, JSON.stringify(fpData));
            }
        } catch (e) {
            console.error('FP Parse error', e);
        }
    }

    // Initialize if missing
    if (!fpData || !fpData.id) {
        return createNewFP('fresh_install');
    }

    // CHECK ROTATION RULES
    const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 Days
    const currentUAHash = getUAHash();
    const age = Date.now() - fpData.createdAt;

    let shouldRotate = false;
    let rotateReason = '';

    if (age > MAX_AGE_MS) {
        shouldRotate = true;
        rotateReason = 'expired';
    } else if (fpData.uaHash && fpData.uaHash !== currentUAHash) {
        shouldRotate = true;
        rotateReason = 'ua_change';
    }

    if (shouldRotate) {
        return rotateFP(rotateReason);
    }

    return fpData;
};

// Basic client-side bot detection
export const isBotByUserAgent = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    // Basic pattern for obviously bad bots (matching backend)
    const BAD_BOTS = /python|curl|wget|scrapy|headless|puppeteer|selenium|playwright|cheerio|undici|httpclient/i;
    return BAD_BOTS.test(ua);
};

// Maintains backward compatibility if only ID is needed
export const getFingerprint = () => {
    const data = getFingerprintData();
    return data ? data.id : null;
};

// ✅ TASK A: Helper for Axios Headers
export const getFingerprintHeaders = () => {
    const data = getFingerprintData();
    if (!data) return {};

    const ageDays = Math.floor(
        (Date.now() - data.createdAt) / (1000 * 60 * 60 * 24)
    );

    return {
        'x-fp': data.id,
        'x-fp-age': ageDays
    };
};

// ✅ TASK B: Handle Backend Reset Signal
let fpResetHandled = false;

export const handleBackendFPReset = (response) => {
    if (
        !fpResetHandled &&
        response?.headers?.['x-fp-reset'] === '1'
    ) {
        fpResetHandled = true;
        rotateFP('backend_reset_signal');
        setTimeout(() => { fpResetHandled = false; }, 1000);
    }
};