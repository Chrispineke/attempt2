// --- FEATURE 1: WEB AUDIO SYNTH AUDIO GENERATION ---
let audioCtxInstance = null;
const audioAuthBtn = document.getElementById('audio-auth-btn');

function triggerSyntheticAlarmTone(frequency, duration, patternType = "sawtooth") {
    if (!audioCtxInstance) return; 
    try {
        const osc = audioCtxInstance.createOscillator();
        const gain = audioCtxInstance.createGain();
        
        osc.type = patternType;
        osc.frequency.setValueAtTime(frequency, audioCtxInstance.currentTime);
        
        gain.gain.setValueAtTime(0.04, audioCtxInstance.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxInstance.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtxInstance.destination);
        
        osc.start();
        osc.stop(audioCtxInstance.currentTime + duration);
    } catch (e) { console.warn("Audio Context failure: ", e); }
}

audioAuthBtn.addEventListener('click', () => {
    if (!audioCtxInstance) {
        audioCtxInstance = new (window.AudioContext || window.webkitAudioContext)();
        audioAuthBtn.innerText = "AUDIO SYNTH: ONLINE";
        audioAuthBtn.className = "bg-emerald-500 text-black px-2 py-1 font-bold transition-all text-[10px]";
        triggerSyntheticAlarmTone(600, 0.15, "sine");
    }
});

// --- FEATURE 2: OBJECT-ORIENTED ENGINE ENGINE SCHEMATIC ---
class TransportTelemetryDeck {
    constructor() {
        this.cacheKey = "axon_telemetry_cache_v5";
        const savedState = JSON.parse(localStorage.getItem(this.cacheKey)) || {};

        this.distance = savedState.distance || 200;
        this.trafficFactor = savedState.trafficFactor || 1.0;
        this.roadFactor = savedState.roadFactor || 1.0;
        this.weight = savedState.weight || 15.0;
        this.fuel = savedState.fuel || 600;
        this.governor = savedState.governor !== undefined ? savedState.governor : false;

        this.maxLegalWeightLimit = 36.0;
    }

    saveCurrentStateToLocalStorage() {
        const stateDataMap = {
            distance: this.distance, trafficFactor: this.trafficFactor,
            roadFactor: this.roadFactor, weight: this.weight,
            fuel: this.fuel, governor: this.governor
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(stateDataMap));
    }
}

const EngineInstance = new TransportTelemetryDeck();

// --- DOM ELEMENT BINDINGS ---
const distSlider = document.getElementById('distance-slider');
const distVal = document.getElementById('distance-val');
const weightSlider = document.getElementById('weight-slider');
const weightVal = document.getElementById('weight-val');
const fuelSlider = document.getElementById('fuel-slider');
const fuelVal = document.getElementById('fuel-val');
const governorCheck = document.getElementById('speed-governor');
const weighbridgeWarning = document.getElementById('weighbridge-warning');

const outCost = document.getElementById('out-cost');
const outCo2 = document.getElementById('out-co2');
const outSpeed = document.getElementById('out-speed');
const outFuelStatus = document.getElementById('out-fuel-status');
const consoleStream = document.getElementById('console-stream');
const dispatchTrigger = document.getElementById('dispatch-trigger');
const apiStatusLight = document.getElementById('api-status-light');

const graphBurnPct = document.getElementById('graph-burn-pct');
const graphBurnBar = document.getElementById('graph-burn-bar');
const graphStrainPct = document.getElementById('graph-strain-pct');
const graphStrainBar = document.getElementById('graph-strain-bar');

// --- FEATURE 3: CHROMA STREAM TERMINAL LOGGER ---
function writeToTerminalPipeline(message, textTailwindColor = "text-cyan-400") {
    const stamp = new Date().toLocaleTimeString().split(' ')[0];
    const cleanDiv = document.createElement('div');
    cleanDiv.className = "leading-relaxed";
    cleanDiv.innerHTML = `<span class="text-zinc-700">[${stamp}]</span> <span class="${textTailwindColor}">SYS_ENGINE //</span> ${message}`;
    consoleStream.appendChild(cleanDiv);
    consoleStream.scrollTop = consoleStream.scrollHeight;
}

// --- FEATURE 4: ASYNC API SIMULATION ---
async function queryDatabaseServerRouteNode() {
    apiStatusLight.innerText = "API_SOCKET: RE-FETCHING NODE...";
    apiStatusLight.className = "text-yellow-400 bg-yellow-950/60 px-3 py-1 border border-yellow-500/30 animate-pulse";
    
    await new Promise(resolve => setTimeout(resolve, 450));
    
    apiStatusLight.innerText = "API_SOCKET: NODE SYNCED";
    apiStatusLight.className = "text-emerald-400 bg-emerald-950/60 px-3 py-1 border border-emerald-500/30";
}

// --- FEATURE 5: COMPUTATION AND GRAPH RENDERING ENGINE ---
function executeStateCalculationLoop() {
    distVal.innerText = `${EngineInstance.distance} KM`;
    weightVal.innerText = `${EngineInstance.weight.toFixed(1)} Tons`;
    fuelVal.innerText = `${EngineInstance.fuel} L`;

    if (EngineInstance.weight > EngineInstance.maxLegalWeightLimit) {
        weighbridgeWarning.classList.remove('hidden');
        triggerSyntheticAlarmTone(180, 0.08, "sawtooth"); 
    } else {
        weighbridgeWarning.classList.add('hidden');
    }

    let initialTopVelocity = 100;
    if (EngineInstance.governor) initialTopVelocity = 65;
    const absoluteVelocity = Math.max(10, initialTopVelocity / (EngineInstance.trafficFactor * (1 + (EngineInstance.roadFactor - 1) * 0.6)));
    outSpeed.innerText = `${Math.round(absoluteVelocity)} km/h`;

    const fundamentalBurnKilo = 0.30;
    const variableBurnFactor = fundamentalBurnKilo * (EngineInstance.weight / 10) * EngineInstance.trafficFactor * EngineInstance.roadFactor * (EngineInstance.governor ? 0.82 : 1.22);
    const projectionRangeRadius = Math.round(EngineInstance.fuel / variableBurnFactor);
    outFuelStatus.innerHTML = `RADIUS: ${projectionRangeRadius} KM <br><span class="text-[10px] text-zinc-500">CONSUME: ${variableBurnFactor.toFixed(2)}L/KM</span>`;

    const compoundedFinances = (EngineInstance.distance * variableBurnFactor * 2.25 * EngineInstance.roadFactor).toFixed(2);
    const dynamicCo2Emissions = (EngineInstance.distance * variableBurnFactor * 2.68).toFixed(1);
    outCost.innerText = `$${compoundedFinances}`;
    outCo2.innerText = `${dynamicCo2Emissions} kg`;

    const numericBurnPct = Math.min(100, Math.round((variableBurnFactor / 3.0) * 100));
    const numericStrainPct = Math.min(100, Math.round((EngineInstance.weight / 50) * 100));
    
    graphBurnPct.innerText = `${numericBurnPct}%`;
    graphBurnBar.style.width = `${numericBurnPct}%`;
    graphStrainPct.innerText = `${numericStrainPct}%`;
    graphStrainBar.style.width = `${numericStrainPct}%`;

    EngineInstance.saveCurrentStateToLocalStorage();
}

// --- SYSTEM BINDINGS & EVENT LISTENERS ---
distSlider.addEventListener('input', (e) => {
    EngineInstance.distance = parseInt(e.target.value);
    executeStateCalculationLoop();
    if(Math.random() < 0.08) {
        writeToTerminalPipeline(`Distance variable modified: ${EngineInstance.distance}KM`, "text-cyan-400");
        queryDatabaseServerRouteNode();
    }
});

weightSlider.addEventListener('input', (e) => {
    EngineInstance.weight = parseFloat(e.target.value);
    executeStateCalculationLoop();
    if(Math.random() < 0.08) writeToTerminalPipeline("Weighbridge telemetry registering structural displacement wave.", "text-fuchsia-400");
});

fuelSlider.addEventListener('input', (e) => {
    EngineInstance.fuel = parseInt(e.target.value);
    executeStateCalculationLoop();
});

governorCheck.addEventListener('change', (e) => {
    EngineInstance.governor = e.target.checked;
    writeToTerminalPipeline(`Electronic governor array shifted state: ${EngineInstance.governor ? 'ACTIVE_CEILING_REDUCE' : 'UNRESTRICTED'}`, "text-yellow-400");
    triggerSyntheticAlarmTone(440, 0.1, "sine");
    executeStateCalculationLoop();
});

document.getElementById('traffic-button-group').addEventListener('click', (e) => {
    const targetButton = e.target.closest('button');
    if(!targetButton) return;
    EngineInstance.trafficFactor = parseFloat(targetButton.getAttribute('data-factor'));
    
    document.querySelectorAll('#traffic-button-group button').forEach(b => b.className = "border border-zinc-700 bg-zinc-900/50 text-zinc-400 p-2 text-xs uppercase transition-all cursor-pointer");
    targetButton.className = "border-2 border-emerald-500 bg-emerald-950 text-emerald-400 font-bold p-2 text-xs uppercase transition-all cursor-pointer";
    
    writeToTerminalPipeline(`Traffic infrastructure index recalibrated: ${EngineInstance.trafficFactor}x`, "text-emerald-400");
    triggerSyntheticAlarmTone(300, 0.05, "triangle");
    executeStateCalculationLoop();
});

document.getElementById('road-button-group').addEventListener('click', (e) => {
    const targetButton = e.target.closest('button');
    if(!targetButton) return;
    EngineInstance.roadFactor = parseFloat(targetButton.getAttribute('data-factor'));
    
    document.querySelectorAll('#road-button-group button').forEach(b => b.className = "border border-zinc-700 bg-zinc-900/50 text-zinc-400 p-2 text-xs uppercase transition-all cursor-pointer");
    targetButton.className = "border-2 border-fuchsia-500 bg-fuchsia-950 text-fuchsia-400 font-bold p-2 text-xs uppercase transition-all cursor-pointer";
    
    writeToTerminalPipeline(`Surface friction data matrix skewed: ${EngineInstance.roadFactor}x`, "text-fuchsia-400");
    triggerSyntheticAlarmTone(350, 0.05, "triangle");
    executeStateCalculationLoop();
});

document.getElementById('reset-cache-btn').addEventListener('click', () => {
    localStorage.clear();
    writeToTerminalPipeline("Local storage system initialization records purged. Performing system soft reset.", "text-red-400");
    setTimeout(() => window.location.reload(), 800);
});

dispatchTrigger.addEventListener('click', () => {
    if (EngineInstance.weight > EngineInstance.maxLegalWeightLimit) {
        writeToTerminalPipeline("❌ DISPATCH ARRESTED: STRUCTURAL COMPLIANCE SHIELD FAILURE CORRELATION VECTORS DETECTED", "text-red-500");
        triggerSyntheticAlarmTone(120, 0.4, "sawtooth");
    } else {
        writeToTerminalPipeline("🚀 MANIFEST EXECUTED: TELEMETRY ENVELOPE MERGED INTO GLOBAL PIPELINE STACK", "text-emerald-400");
        triggerSyntheticAlarmTone(800, 0.25, "sine");
    }
});

// --- FEATURE 6: HIGH-PERFORMANCE RECURSIVE LATENCY TRACKER ---
function executeHardwareTrackingSequence() {
    const initialPerformanceToken = performance.now();
    requestAnimationFrame(() => {
        const finishingPerformanceToken = performance.now();
        const preciseMicrosecondLatency = (finishingPerformanceToken - initialPerformanceToken).toFixed(3);
        document.getElementById('hardware-benchmark').innerText = `RENDER DELAY: ${preciseMicrosecondLatency}ms`;
    });
}
setInterval(executeHardwareTrackingSequence, 2000);

// --- INITIALIZE FROM OBJECT STORAGE AND CACHE DATA MAPS ---
distSlider.value = EngineInstance.distance;
weightSlider.value = EngineInstance.weight;
fuelSlider.value = EngineInstance.fuel;
governorCheck.checked = EngineInstance.governor;

document.querySelectorAll('#traffic-button-group button').forEach(b => {
    if(parseFloat(b.getAttribute('data-factor')) === EngineInstance.trafficFactor) {
        b.className = "border-2 border-emerald-500 bg-emerald-950 text-emerald-400 font-bold p-2 text-xs uppercase transition-all cursor-pointer";
    }
});
document.querySelectorAll('#road-button-group button').forEach(b => {
    if(parseFloat(b.getAttribute('data-factor')) === EngineInstance.roadFactor) {
        b.className = "border-2 border-fuchsia-500 bg-fuchsia-950 text-fuchsia-400 font-bold p-2 text-xs uppercase transition-all cursor-pointer";
    }
});

writeToTerminalPipeline("Axon logic architecture instantiated successfully. Cache engine pipeline online.", "text-emerald-400");
executeStateCalculationLoop();