function detectLanguage(code) {
    const allowedLanguages = [
        "html",
        "javascript",
        "typescript",
        "python",
        "java",
        "c",
        "php",
        "css",
    ];

    // Remove comments and strings to avoid false positives
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"/g, '');

    const languagePatterns = {
        html: /<\/?[a-z][\s\S]*>/i,
        javascript: /\b(var|let|const|function|if|else|for|while|return|async|await)\b/,
        typescript: /\b(interface|type|enum|namespace|import\s+{.*?}\s+from)\b/,
        python: /\b(def|class|import|from|if|elif|else|for|while|return|yield)\b/,
        java: /\b(public|private|protected|class|interface|enum|extends|implements|new)\b/,
        c: /\b(int|char|float|double|void|struct|typedef|enum|const|volatile|extern)\b/,
        php: /(<\?php|\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/,
        css: /[a-z0-9\s\.\#\:]+\s*\{\s*[a-z\-]+\s*:\s*[^}]+\}/i,
    };

    const languageKeywords = {
        html: ['html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style'],
        javascript: ['console', 'document', 'window', 'Array', 'Object', 'Math'],
        typescript: ['interface', 'type', 'enum', 'namespace', 'readonly'],
        python: ['print', 'def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'return'],
        java: ['public', 'private', 'protected', 'class', 'interface', 'enum', 'extends', 'implements'],
        c: ['printf', 'scanf', 'malloc', 'free', 'include'],
        php: ['echo', 'print', 'function', 'array', '$_GET', '$_POST'],
    };

    let detectedLanguage = null;
    let highestScore = 0;

    for (const lang of allowedLanguages) {
        let score = 0;

        if (languagePatterns[lang] && languagePatterns[lang].test(code)) {
            score += 2;
        }

        if (languageKeywords[lang]) {
            for (const keyword of languageKeywords[lang]) {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                const matches = (code.match(regex) || []).length;
                score += matches;
            }
        }

        if (score > highestScore) {
            highestScore = score;
            detectedLanguage = lang;
        }
    }

    return detectedLanguage || "unknown";
}

export default detectLanguage