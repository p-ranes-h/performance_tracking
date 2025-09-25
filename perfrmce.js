// Function to update the DOM with performance data
function displayPerformanceData(data) {
    debugger;
    const perfMetricsList = document.getElementById('performance-metrics');
    const brokenLinksList = document.getElementById('broken-links-list');
    const missingAltsList = document.getElementById('missing-alts-list');
    const emptyTagsList = document.getElementById('empty-tags-list');
    const ariaIssuesList = document.getElementById('aria-issues');
    const codeQualityList = document.getElementById('code-quality-list');
    const jsAnalysisList = document.getElementById('js-analysis-list');
    const navHistoryList = document.getElementById('navigation-history-list');

    // Clear previous content
    [perfMetricsList, brokenLinksList, missingAltsList, emptyTagsList, ariaIssuesList, codeQualityList, jsAnalysisList, navHistoryList].forEach(el => el.innerHTML = '');

    // Performance Metrics (Static analysis doesn't provide these)
    // perfMetricsList.innerHTML = '<li>Performance metrics require a live page load and cannot be determined from a static HTML fetch.</li>';
    if (data.performanceEstimate) {
        perfMetricsList.innerHTML = `
        <li>Performance metrics require a live page load and cannot be determined from a static HTML fetch.</li><br>
         <li><strong>Static details---</strong></li>
            <li><strong>Total Scripts:</strong> ${data.performanceEstimate.totalScripts}</li>
            <li><strong>Blocking Scripts:</strong> 
                ${data.performanceEstimate.blockingScripts.length > 0 
                    ? data.performanceEstimate.blockingScripts.join(", ") 
                    : "None"}
            </li>
            <li><strong>Inline Script Count:</strong> ${data.performanceEstimate.inlineScriptCount}</li>
            <li><strong>Total Images:</strong> ${data.performanceEstimate.totalImages}</li>
            <li><strong>External Stylesheets:</strong> ${data.performanceEstimate.externalStylesheets}</li>
            <li><strong>Inline Style Blocks:</strong> ${data.performanceEstimate.inlineStyleBlocks}</li>
            <li><strong>Estimated Requests:</strong> ${data.performanceEstimate.requestsEstimate}</li>
        `;
    } else {
        perfMetricsList.innerHTML = '<li>No performance estimate available.</li>';
    }
    // Broken Links
    if (data.brokenLinks && data.brokenLinks.length > 0) {
        data.brokenLinks.forEach(link => {
            brokenLinksList.innerHTML += `<li><strong>URL:</strong> ${link.link} - <strong>Status:</strong> ${link.status}</li>`;
        });
    } else {
        brokenLinksList.innerHTML = '<li>No broken links detected.</li>';
    }
    
    // Missing Alt
    if (data.accessibility && data.accessibility.missingAlts) {
        data.accessibility.missingAlts.forEach(img => {
            missingAltsList.innerHTML += `<li><strong>Image Source:</strong> ${img.src} - <strong>Reason:</strong> ${img.reason}</li>`;
        });
    } else if (data.accessibility && data.accessibility.missingAltsError) {
        missingAltsList.innerHTML = `<li>Error: ${data.accessibility.missingAltsError}</li>`;
    } else {
        missingAltsList.innerHTML = '<li>No missing alt attributes detected.</li>';
    }

    // Empty Tags
    if (data.accessibility && data.accessibility.emptyTags) {
        data.accessibility.emptyTags.forEach(tag => {
            emptyTagsList.innerHTML += `
                <li>
                    <strong>Tag Name:</strong> &lt;${tag.tagName.toLowerCase()}&gt;<br>
                    
               
                </li>`;
        });
    } else if (data.accessibility && data.accessibility.emptyTagsError) {
        emptyTagsList.innerHTML = `<li>Error: ${data.accessibility.emptyTagsError}</li>`;
    } else {
        emptyTagsList.innerHTML = '<li>No empty tags detected.</li>';
    }

    // ARIA Issues
    if (data.accessibility && data.accessibility.aria) {
        data.accessibility.aria.forEach(issue => {
            ariaIssuesList.innerHTML += `<li>${issue}</li>`;
        });
    } else if (data.accessibility && data.accessibility.ariaError) {
        ariaIssuesList.innerHTML = `<li>Error: ${data.accessibility.ariaError}</li>`;
    } else {
        ariaIssuesList.innerHTML = '<li>No ARIA issues detected.</li>';
    }

    // Code Quality Suggestions
    if (data.jsAnalysis && data.jsAnalysis.codeQualitySuggestions && data.jsAnalysis.codeQualitySuggestions.length > 0) {
        data.jsAnalysis.codeQualitySuggestions.forEach(suggestion => {
            codeQualityList.innerHTML += `<li>${suggestion}</li>`;
        });
    } else {
        codeQualityList.innerHTML = '<li>No code quality suggestions detected.</li>';
    }

    // JS Analysis
    if (data.jsAnalysis) {
        jsAnalysisList.innerHTML += `<li><strong>Uses 'eval' or 'new Function':</strong> ${data.jsAnalysis.usesEval ? 'Yes' : 'No'}</li>`;
        
        if (data.jsAnalysis.globalVars && data.jsAnalysis.globalVars.length > 0) {
            jsAnalysisList.innerHTML += `<li><strong>Detected Global Variables:</strong> ${data.jsAnalysis.globalVars.length}</li>`;
        }

        // Variable Declarations
        if (data.jsAnalysis.variableDeclarations) {
            const { var: varDecl, let: letDecl, const: constDecl } = data.jsAnalysis.variableDeclarations;
            jsAnalysisList.innerHTML += `<li><strong>Variable Declarations:</strong></li>`;
            jsAnalysisList.innerHTML += `<ul>`;
            jsAnalysisList.innerHTML += `<li><strong>var:</strong> ${varDecl.count} (Lines: ${varDecl.lines.length > 0 ? varDecl.lines.join(', ') : 'None'})</li>`;
            jsAnalysisList.innerHTML += `<li><strong>let:</strong> ${letDecl.count} (Lines: ${letDecl.lines.length > 0 ? letDecl.lines.join(', ') : 'None'})</li>`;
            jsAnalysisList.innerHTML += `<li><strong>const:</strong> ${constDecl.count} (Lines: ${constDecl.lines.length > 0 ? constDecl.lines.join(', ') : 'None'})</li>`;
            jsAnalysisList.innerHTML += `</ul>`;
        }

        // Heavy Scripts (from perfrmce.js)
        if (data.jsAnalysis.heavyScripts && data.jsAnalysis.heavyScripts.length > 0) {
            jsAnalysisList.innerHTML += `<li><strong>External/Heavy Scripts:</strong></li>`;
            jsAnalysisList.innerHTML += `<ul>`;
            data.jsAnalysis.heavyScripts.forEach(script => {
                jsAnalysisList.innerHTML += `<li>${script.name} - Size: ${script.size}, Duration: ${script.duration}</li>`;
            });
            jsAnalysisList.innerHTML += `</ul>`;
        }
    }

    // Navigation History
    if (data.navigationHistory && data.navigationHistory.length > 0) {
        data.navigationHistory.forEach(entry => {
            navHistoryList.innerHTML += `<li><strong>Page:</strong> ${entry.page} - <strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</li>`;
        });
    } else {
        navHistoryList.innerHTML = '<li>No navigation history recorded.</li>';
    }

    // Save to localStorage
    localStorage.setItem('performanceData', JSON.stringify(data));
}
function findBrokenLinks(doc) {
    const links = [...doc.querySelectorAll("a[href]")];
    return links.map(l => ({ link: l.href, status: "unchecked" }));
}

function checkAccessibility(doc) {
    const ariaIssues = [];

    // Scan all elements for aria-* attributes
    doc.querySelectorAll("*").forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith("aria-")) {
                if (!attr.value.trim()) {
                    ariaIssues.push(`Element <${el.tagName.toLowerCase()}> has empty ${attr.name} attribute.`);
                }
            }
        });
    });

    // Elements with empty role
    doc.querySelectorAll("[role]").forEach(el => {
        if (!el.getAttribute("role").trim()) {
            ariaIssues.push(`Element <${el.tagName.toLowerCase()}> has an empty role attribute.`);
        }
    });

    // ARIA misuse
    doc.querySelectorAll("[aria-hidden='true']").forEach(el => {
        if (["button", "a", "input"].includes(el.tagName.toLowerCase())) {
            ariaIssues.push(`Interactive element <${el.tagName.toLowerCase()}> should not be aria-hidden.`);
        }
    });

    // 🔧 For debugging: force a test issue if none found
    if (ariaIssues.length === 0) {
        ariaIssues.push("✅ No real ARIA issues detected (test message to verify UI).");
    }

    return {
        missingAlts: [...doc.querySelectorAll("img:not([alt])")].map(img => ({
            src: img.src,
            reason: "Missing alt"
        })),
        emptyTags: [...doc.querySelectorAll("*")].filter(el => !el.textContent.trim()).map(el => ({
            tagName: el.tagName,
            outerHTML: el.outerHTML,
            lineNumber: "N/A"
        })),
        aria: ariaIssues
    };
}




function analyzeJavaScript(doc) {
    const scripts = [...doc.querySelectorAll("script")];
    const results = {
        usesEval: false,
        globalVars: [],
        variableDeclarations: {
            var: { count: 0, lines: [] },
            let: { count: 0, lines: [] },
            const: { count: 0, lines: [] }
        },
        heavyScripts: [],
        codeQualitySuggestions: []   // ✅ added
    };

    scripts.forEach((script, idx) => {
        const code = script.innerHTML || "";  

        // 1. Check eval/new Function
        if (code.includes("eval(") || code.includes("new Function(")) {
            results.usesEval = true;
            results.codeQualitySuggestions.push("Avoid using eval() or new Function() due to security risks.");
        }

        // 2. Count variable declarations
        code.split("\n").forEach((line, i) => {
            if (line.includes("var ")) {
                results.variableDeclarations.var.count++;
                results.variableDeclarations.var.lines.push(i + 1);
                results.codeQualitySuggestions.push("Replace 'var' with 'let' or 'const' for better scoping.");
            }
            if (line.includes("== ")) {
                results.codeQualitySuggestions.push("Use '===' instead of '==' for strict comparison.");
            }
        });

        // 3. Track external scripts
        if (script.src) {
            results.heavyScripts.push({
                name: script.src,
                size: "unknown",
                duration: "unknown"
            });
            results.codeQualitySuggestions.push(`Consider lazy loading or deferring external script: ${script.src}`);
        }
    });

    return results;
}



function updateNavigationHistory() {
    const history = JSON.parse(localStorage.getItem("navHistory") || "[]");
    history.push({ page: window.location.href, timestamp: Date.now() });
    localStorage.setItem("navHistory", JSON.stringify(history));
    return history;
}
function estimatePerformanceFromHTML(doc) {
    const scripts = [...doc.querySelectorAll("script[src]")];
    const blockingScripts = scripts.filter(s => !s.async && !s.defer && s.closest("head"));
    const images = [...doc.querySelectorAll("img")];
    const stylesheets = [...doc.querySelectorAll("link[rel='stylesheet']")];

    return {
        totalScripts: scripts.length,
        blockingScripts: blockingScripts.map(s => s.src),
        inlineScriptCount: doc.querySelectorAll("script:not([src])").length,
        totalImages: images.length,
        externalStylesheets: stylesheets.length,
        inlineStyleBlocks: doc.querySelectorAll("style").length,
        requestsEstimate: scripts.length + stylesheets.length + images.length
    };
}

window.analyzeFetchedHTML = function(html) {
    // Parse HTML string into a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Run your analysis functions here
    const analysisResult = {
        brokenLinks: findBrokenLinks(doc),
        accessibility: checkAccessibility(doc),
        jsAnalysis: analyzeJavaScript(doc),
        performanceEstimate: estimatePerformanceFromHTML(doc),
        navigationHistory: updateNavigationHistory()
    };
    console.log("analyzeFetchedHTML ");
    console.log(analysisResult);
    // Display results
    displayPerformanceData(analysisResult);
};

// Tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const tab = button.getAttribute('data-tab');
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === tab) panel.classList.add('active');
        });
    });
});

// Sub-Tabs functionality
const subTabButtons = document.querySelectorAll('.sub-tab-button');
const subTabPanels = document.querySelectorAll('.sub-tab-panel');

subTabButtons.forEach(button => {
    button.addEventListener('click', () => {
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const subTab = button.getAttribute('data-sub-tab');
        subTabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === subTab) panel.classList.add('active');
        });
    });
});

document.getElementById('runTests').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert('Please enter a URL or code');
        return;
    }
    fetchAndAnalyzeUrl(url);
});

// Fetch + analyze
function fetchAndAnalyzeUrl(params) {
    const corsProxy = 'https://cors-anywhere.com/';
    const url = corsProxy + params;
    fetch(url)
        .then(response => response.text())
        .then((html) => {
            console.log(html);
            window.analyzeFetchedHTML(html);
        })
        .catch(err => console.error('Error:', err));
}

// Restore data on page load
// document.addEventListener('DOMContentLoaded', () => {
//     const storedData = localStorage.getItem('performanceData');
//     if (storedData) {
//         displayPerformanceData(JSON.parse(storedData));
//     }
// });
