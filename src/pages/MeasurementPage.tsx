<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Pillow Measurement Tool</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            background: #000;
            color: white;
            position: fixed;
            width: 100%;
            height: 100%;
        }

        #app {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        #camera-feed {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            background: #000;
        }

        #ar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .measurement-point {
            position: absolute;
            width: 40px;
            height: 40px;
            transform: translate(-50%, -50%);
            pointer-events: auto;
            cursor: move;
            z-index: 10;
            touch-action: none;
        }

        .point-inner {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            border: 3px solid #007AFF;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s;
        }

        .measurement-point.active .point-inner {
            background: #007AFF;
            transform: scale(1.3);
        }

        .measurement-line {
            position: absolute;
            background: #FFCC00;
            height: 3px;
            transform-origin: left center;
            pointer-events: none;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        .measurement-label {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: #FFCC00;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            pointer-events: none;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 204, 0, 0.3);
        }

        #crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            pointer-events: none;
            z-index: 5;
        }

        #crosshair::before,
        #crosshair::after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        }

        #crosshair::before {
            width: 100%;
            height: 2px;
            top: 50%;
            transform: translateY(-50%);
        }

        #crosshair::after {
            width: 2px;
            height: 100%;
            left: 50%;
            transform: translateX(-50%);
        }

        #measurement-guide {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            padding: 15px 25px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 20;
            text-align: center;
            border: 2px solid #007AFF;
        }

        #measurement-guide h3 {
            font-size: 18px;
            margin-bottom: 5px;
            color: #007AFF;
        }

        #measurement-guide p {
            font-size: 14px;
            opacity: 0.9;
        }

        #controls {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 20;
        }

        .control-btn {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-user-select: none;
            user-select: none;
        }

        .control-btn:active {
            transform: scale(0.95);
        }

        .control-btn.add {
            background: #007AFF;
            color: white;
        }

        .control-btn.next {
            background: #34C759;
            color: white;
        }

        .control-btn.done {
            background: #FF9500;
            color: white;
        }

        #measurements-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.85);
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 20;
            min-width: 200px;
        }

        #measurements-panel h4 {
            margin-bottom: 15px;
            color: #007AFF;
            font-size: 16px;
        }

        .measurement-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .measurement-item:last-child {
            border-bottom: none;
        }

        .measurement-name {
            color: rgba(255, 255, 255, 0.8);
        }

        .measurement-value {
            color: #FFCC00;
            font-weight: 600;
        }

        #permission-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            padding: 20px;
        }

        #permission-overlay h2 {
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
            color: #007AFF;
        }

        #start-camera {
            padding: 15px 30px;
            font-size: 18px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            -webkit-appearance: none;
            margin-bottom: 30px;
        }

        .measurement-tips {
            background: rgba(52, 199, 89, 0.1);
            border: 1px solid #34C759;
            padding: 20px;
            border-radius: 12px;
            max-width: 400px;
            text-align: left;
        }

        .measurement-tips h3 {
            color: #34C759;
            margin-bottom: 15px;
        }

        .measurement-tips ul {
            margin-left: 20px;
            line-height: 1.8;
        }

        .silhouette-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 400px;
            pointer-events: none;
            opacity: 0.3;
            z-index: 3;
        }

        .silhouette-neck {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><path d="M150 50 C120 50 100 70 100 100 L100 150 C100 180 120 200 150 200 C180 200 200 180 200 150 L200 100 C200 70 180 50 150 50 Z" fill="none" stroke="white" stroke-width="2" stroke-dasharray="5,5"/><circle cx="150" cy="100" r="30" fill="none" stroke="white" stroke-width="2"/><text x="150" y="250" text-anchor="middle" fill="white" font-size="16">Position neck here</text></svg>') no-repeat center;
            background-size: contain;
        }

        .silhouette-shoulders {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><path d="M50 200 C50 180 70 160 90 160 L210 160 C230 160 250 180 250 200 L250 250 L50 250 Z" fill="none" stroke="white" stroke-width="2" stroke-dasharray="5,5"/><line x1="50" y1="200" x2="250" y2="200" stroke="yellow" stroke-width="3"/><text x="150" y="300" text-anchor="middle" fill="white" font-size="16">Align shoulders</text></svg>') no-repeat center;
            background-size: contain;
        }

        #results-modal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            padding: 30px;
            border-radius: 20px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 50;
            min-width: 300px;
            display: none;
            border: 2px solid #007AFF;
        }

        #results-modal h3 {
            color: #007AFF;
            margin-bottom: 20px;
            text-align: center;
        }

        #results-modal button {
            width: 100%;
            padding: 15px;
            margin-top: 20px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
        }

        .error-message {
            color: #FF3B30;
            margin-top: 20px;
            text-align: center;
            line-height: 1.5;
            max-width: 400px;
        }
    </style>
</head>
<body>
    <div id="app">
        <video id="camera-feed" autoplay playsinline muted></video>
        <canvas id="ar-overlay"></canvas>
        <div id="crosshair"></div>
        <div class="silhouette-overlay" id="silhouette"></div>
        
        <div id="measurements-panel">
            <h4>Pillow Measurements</h4>
            <div class="measurement-item">
                <span class="measurement-name">Neck Width:</span>
                <span class="measurement-value" id="neck-value">--</span>
            </div>
            <div class="measurement-item">
                <span class="measurement-name">Shoulder Width:</span>
                <span class="measurement-value" id="shoulder-value">--</span>
            </div>
            <div class="measurement-item">
                <span class="measurement-name">Neck to Shoulder:</span>
                <span class="measurement-value" id="length-value">--</span>
            </div>
        </div>

        <div id="measurement-guide">
            <h3 id="guide-title">Step 1: Measure Neck</h3>
            <p id="guide-text">Place points at each side of your neck</p>
        </div>
        
        <div id="controls">
            <button class="control-btn add" id="add-point">+</button>
            <button class="control-btn next" id="next-measurement" style="display: none;">→</button>
            <button class="control-btn done" id="complete-measurements" style="display: none;">✓</button>
        </div>

        <div id="results-modal">
            <h3>Measurements Complete!</h3>
            <div id="final-measurements"></div>
            <button onclick="saveMeasurements()">Save to Pillow Finder</button>
            <button onclick="retakeMeasurements()">Retake</button>
        </div>
        
        <div id="permission-overlay">
            <h2>Pillow Measurement Tool</h2>
            <button id="start-camera">Start Measuring</button>
            
            <div class="measurement-tips">
                <h3>📏 How to Measure for Your Perfect Pillow</h3>
                <ul>
                    <li><strong>Neck Width:</strong> Measure across your neck at the base</li>
                    <li><strong>Shoulder Width:</strong> Measure from shoulder to shoulder</li>
                    <li><strong>Neck to Shoulder:</strong> Measure the distance for proper support</li>
                </ul>
                <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                    Have someone help you for more accurate measurements!
                </p>
            </div>
            
            <div class="error-message" id="error-message"></div>
        </div>
    </div>

    <script>
        class PillowMeasurementApp {
            constructor() {
                this.video = document.getElementById('camera-feed');
                this.canvas = document.getElementById('ar-overlay');
                this.ctx = this.canvas.getContext('2d');
                
                // Measurement states
                this.measurementStep = 0;
                this.measurements = {
                    neck: null,
                    shoulders: null,
                    length: null
                };
                
                this.currentPoints = [];
                this.pixelsPerCm = 10; // This would be calibrated
                
                this.measurementSteps = [
                    {
                        name: 'neck',
                        title: 'Step 1: Measure Neck',
                        text: 'Place points at each side of your neck',
                        silhouette: 'silhouette-neck'
                    },
                    {
                        name: 'shoulders',
                        title: 'Step 2: Measure Shoulders',
                        text: 'Place points at each shoulder',
                        silhouette: 'silhouette-shoulders'
                    },
                    {
                        name: 'length',
                        title: 'Step 3: Neck to Shoulder',
                        text: 'Place points from neck base to shoulder',
                        silhouette: null
                    }
                ];
                
                this.init();
            }

            async init() {
                document.getElementById('start-camera').addEventListener('click', () => this.startCamera());
                document.getElementById('add-point').addEventListener('click', () => this.addPoint());
                document.getElementById('next-measurement').addEventListener('click', () => this.nextMeasurement());
                document.getElementById('complete-measurements').addEventListener('click', () => this.completeMeasurements());
                
                window.addEventListener('resize', () => this.resizeCanvas());
            }

            async startCamera() {
                try {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        throw new Error('Camera API not supported');
                    }

                    const constraints = {
                        audio: false,
                        video: {
                            facingMode: 'user', // Front camera for self-measurement
                            width: { ideal: 1920 },
                            height: { ideal: 1080 }
                        }
                    };

                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.video.srcObject = stream;
                    
                    await this.video.play();
                    
                    this.video.addEventListener('playing', () => {
                        document.getElementById('permission-overlay').style.display = 'none';
                        this.resizeCanvas();
                        this.updateGuide();
                    }, { once: true });

                } catch (error) {
                    console.error('Camera error:', error);
                    document.getElementById('error-message').textContent = 
                        'Camera access required. Please allow camera permissions and reload.';
                }
            }

            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }

            updateGuide() {
                const step = this.measurementSteps[this.measurementStep];
                document.getElementById('guide-title').textContent = step.title;
                document.getElementById('guide-text').textContent = step.text;
                
                // Update silhouette if needed
                const silhouette = document.getElementById('silhouette');
                if (step.silhouette) {
                    silhouette.style.display = 'block';
                    silhouette.className = 'silhouette-overlay ' + step.silhouette;
                } else {
                    silhouette.style.display = 'none';
                }
            }

            addPoint() {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                if (this.currentPoints.length < 2) {
                    const point = {
                        x: centerX,
                        y: centerY,
                        id: Date.now()
                    };
                    
                    this.currentPoints.push(point);
                    this.createPointElement(centerX, centerY, point.id);
                    
                    if (this.currentPoints.length === 2) {
                        // Calculate and display measurement
                        this.calculateCurrentMeasurement();
                        
                        // Show next button
                        document.getElementById('add-point').style.display = 'none';
                        document.getElementById('next-measurement').style.display = 'block';
                    }
                }
            }

            createPointElement(x, y, id) {
                const point = document.createElement('div');
                point.className = 'measurement-point active';
                point.dataset.pointId = id;
                point.style.left = x + 'px';
                point.style.top = y + 'px';
                point.innerHTML = '<div class="point-inner"></div>';
                
                // Make it draggable
                let isDragging = false;
                let startX, startY;
                
                const handleStart = (e) => {
                    isDragging = true;
                    const touch = e.touches ? e.touches[0] : e;
                    startX = touch.clientX - x;
                    startY = touch.clientY - y;
                    e.preventDefault();
                };
                
                const handleMove = (e) => {
                    if (!isDragging) return;
                    const touch = e.touches ? e.touches[0] : e;
                    const newX = touch.clientX - startX;
                    const newY = touch.clientY - startY;
                    
                    point.style.left = newX + 'px';
                    point.style.top = newY + 'px';
                    
                    // Update stored position
                    const pointData = this.currentPoints.find(p => p.id === id);
                    if (pointData) {
                        pointData.x = newX;
                        pointData.y = newY;
                        this.calculateCurrentMeasurement();
                    }
                    
                    e.preventDefault();
                };
                
                const handleEnd = () => {
                    isDragging = false;
                };
                
                point.addEventListener('touchstart', handleStart, { passive: false });
                point.addEventListener('touchmove', handleMove, { passive: false });
                point.addEventListener('touchend', handleEnd);
                point.addEventListener('mousedown', handleStart);
                window.addEventListener('mousemove', handleMove);
                window.addEventListener('mouseup', handleEnd);
                
                document.getElementById('app').appendChild(point);
                
                // Animate in
                setTimeout(() => {
                    point.classList.remove('active');
                }, 500);
            }

            calculateCurrentMeasurement() {
                if (this.currentPoints.length !== 2) return;
                
                const p1 = this.currentPoints[0];
                const p2 = this.currentPoints[1];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Create or update line
                let line = document.querySelector('.measurement-line.current');
                if (!line) {
                    line = document.createElement('div');
                    line.className = 'measurement-line current';
                    document.getElementById('app').appendChild(line);
                }
                
                line.style.left = p1.x + 'px';
                line.style.top = p1.y + 'px';
                line.style.width = distance + 'px';
                line.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
                
                // Create or update label
                let label = document.querySelector('.measurement-label.current');
                if (!label) {
                    label = document.createElement('div');
                    label.className = 'measurement-label current';
                    document.getElementById('app').appendChild(label);
                }
                
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const cm = (distance / this.pixelsPerCm).toFixed(1);
                
                label.textContent = cm + ' cm';
                label.style.left = midX + 'px';
                label.style.top = (midY - 30) + 'px';
                label.style.transform = 'translate(-50%, -50%)';
                
                // Store measurement
                const stepName = this.measurementSteps[this.measurementStep].name;
                this.measurements[stepName] = parseFloat(cm);
                
                // Update display
                this.updateMeasurementDisplay(stepName, cm);
            }

            updateMeasurementDisplay(type, value) {
                const mapping = {
                    'neck': 'neck-value',
                    'shoulders': 'shoulder-value',
                    'length': 'length-value'
                };
                
                const element = document.getElementById(mapping[type]);
                if (element) {
                    element.textContent = value + ' cm';
                }
            }

            nextMeasurement() {
                // Clear current measurement visuals
                document.querySelectorAll('.measurement-point, .measurement-line.current, .measurement-label.current').forEach(el => {
                    el.remove();
                });
                
                this.currentPoints = [];
                this.measurementStep++;
                
                if (this.measurementStep < this.measurementSteps.length) {
                    this.updateGuide();
                    document.getElementById('next-measurement').style.display = 'none';
                    document.getElementById('add-point').style.display = 'block';
                } else {
                    // All measurements complete
                    document.getElementById('next-measurement').style.display = 'none';
                    document.getElementById('complete-measurements').style.display = 'block';
                }
            }

            completeMeasurements() {
                const resultsHtml = `
                    <div class="measurement-item">
                        <span class="measurement-name">Neck Width:</span>
                        <span class="measurement-value">${this.measurements.neck} cm</span>
                    </div>
                    <div class="measurement-item">
                        <span class="measurement-name">Shoulder Width:</span>
                        <span class="measurement-value">${this.measurements.shoulders} cm</span>
                    </div>
                    <div class="measurement-item">
                        <span class="measurement-name">Neck to Shoulder:</span>
                        <span class="measurement-value">${this.measurements.length} cm</span>
                    </div>
                `;
                
                document.getElementById('final-measurements').innerHTML = resultsHtml;
                document.getElementById('results-modal').style.display = 'block';
            }
        }

        // Global functions for results modal
        function saveMeasurements() {
            const app = window.measurementApp;
            
            // Store measurements in localStorage for the pillow app
            localStorage.setItem('pillowMeasurements', JSON.stringify({
                neck: app.measurements.neck,
                shoulders: app.measurements.shoulders,
                length: app.measurements.length,
                timestamp: new Date().toISOString()
            }));
            
            alert('Measurements saved! Return to the Pillow Finder to see your personalized recommendations.');
            
            // If in same window/tab, could redirect
            // window.location.href = 'pillow-finder.html';
        }

        function retakeMeasurements() {
            location.reload();
        }

        // Initialize the app
        window.measurementApp = new PillowMeasurementApp();
    </script>
</body>
</html>
