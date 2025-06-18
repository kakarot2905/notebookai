function runPythonServer() {
    const pythonProcess = spawn("python", ["./Python/Vision.py"]); // Adjust path if needed

    pythonProcess.stdout.on("data", (data) => {
        console.log(`Python Output: ${data.toString()}`);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
        console.log(`Python server exited with code ${code}`);
    });
}

module.exports = runPythonServer;