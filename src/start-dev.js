const {
  execSync
} = require('child_process');
const os = require('os');
const fs = require('fs');
// Kill any processes using port 3000
try {
  if (os.platform() === 'win32') {
    execSync('netstat -ano | findstr :3000', {
      stdio: 'pipe'
    }).toString().split('\n').forEach(line => {
      const match = line.match(/\s+(\d+)$/);
      if (match) {
        try {
          execSync(`taskkill /F /PID ${match[1]}`);
          console.log(`Killed process ${match[1]} using port 3000`);
        } catch (e) {
          // Process might already be gone
        }
      }
    });
  } else {
    execSync('lsof -i :3000 | grep LISTEN | awk \'{print $2}\' | xargs kill -9', {
      stdio: 'pipe'
    });
    console.log('Killed processes using port 3000');
  }
} catch (e) {
  // No processes found using port 3000
  console.log('No processes found using port 3000');
}
// Start the development server
console.log('Starting development server...');
try {
  execSync('npm start', {
    stdio: 'inherit'
  });
} catch (e) {
  console.error('Failed to start development server:', e);
}