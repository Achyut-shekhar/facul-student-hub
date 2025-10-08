Write-Host "Starting development servers..." -ForegroundColor Green

# Kill any existing node processes
taskkill /F /IM node.exe 2>$null

# Start the development servers
npm run start:dev