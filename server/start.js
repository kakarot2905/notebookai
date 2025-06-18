const { exec } = require("child_process");
const path = require("path");
const blessed = require("blessed");

// Create a blessed screen
const screen = blessed.screen({
    smartCSR: true,
    title: "Process Monitor"
});

// Function to create a log window for each process
const createLogBox = (label, top, bgColor) => {
    return blessed.box({
        top: `${top}%`,
        left: "0",
        width: "100%",
        height: "33%",
        label: ` ${label} `,
        border: { type: "line" },
        style: { fg: "white", border: { fg: bgColor } },
        keys: true,
        mouse: true,
        scrollable: true,
        alwaysScroll: true,
        scrollbar: { ch: "█", track: { bg: "grey" } },
        content: `Starting ${label}...\n`
    });
};

// Create three separate log boxes
const frontendLog = createLogBox("Frontend", 0, "blue");
const backendLog = createLogBox("Backend", 33, "green");
const pythonLog = createLogBox("Python Script", 66, "yellow");

// Append boxes to screen
screen.append(frontendLog);
screen.append(backendLog);
screen.append(pythonLog);

// Log history for each box
const logs = {
    frontend: [],
    backend: [],
    python: []
};
const MAX_HISTORY = 100;

// Function to append logs and auto-scroll
const appendLog = (logBox, logKey, message) => {
    logs[logKey].push(message);
    if (logs[logKey].length > MAX_HISTORY) logs[logKey].shift(); // Keep logs within limit
    logBox.setContent(logs[logKey].join("\n")); // Update box content
    logBox.setScrollPerc(100); // Auto-scroll to bottom
    screen.render();
};

// Function to run a command and direct its output to the respective log box
const runCommand = (command, name, cwd, logBox, logKey) => {
    const process = exec(command, { cwd });

    process.stdout.on("data", (data) => appendLog(logBox, logKey, data.trim()));
    process.stderr.on("data", (data) => appendLog(logBox, logKey, `Error: ${data.trim()}`));

    process.on("close", (code) => {
        appendLog(logBox, logKey, `${name} exited with code ${code}`);
    });

    return process;
};

// Root directory
const rootDir = process.cwd();

// Run Frontend
const frontendPath = path.join(rootDir, "frontend");
runCommand("npm run dev", "Frontend", frontendPath, frontendLog, "frontend");

// Run Backend
const backendPath = path.join(rootDir, "server");
runCommand("node ./src/app.js", "Backend", backendPath, backendLog, "backend");

// Run Python script
const pythonPath = path.join(rootDir, "server");
runCommand("python ./scripts/python/Vision.py", "Python Script", pythonPath, pythonLog, "python");

// Enable scrolling using arrow keys and mouse
screen.key(["up", "down", "pageup", "pagedown"], (ch, key) => {
    const focused = screen.focused;
    if (focused && focused.scroll) {
        if (key.name === "up") focused.scroll(-1);
        else if (key.name === "down") focused.scroll(1);
        else if (key.name === "pageup") focused.scroll(-5);
        else if (key.name === "pagedown") focused.scroll(5);
        screen.render();
    }
});

// Allow switching between log boxes using Tab
const logBoxes = [frontendLog, backendLog, pythonLog];
let focusIndex = 0;
screen.key("tab", () => {
    focusIndex = (focusIndex + 1) % logBoxes.length;
    logBoxes[focusIndex].focus();
    screen.render();
});

// Exit on "q" or "Ctrl+C"
screen.key(["q", "C-c"], () => process.exit(0));

// Focus on the first log box initially
frontendLog.focus();
screen.render();
