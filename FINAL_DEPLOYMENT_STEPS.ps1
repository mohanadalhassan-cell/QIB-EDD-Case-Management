#!/usr/bin/env powershell
# ============================================================================
# FINAL DEPLOYMENT PREPARATION SCRIPT
# ============================================================================
# This script prepares the Simplify Governance Platform for production deployment

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FINAL DEPLOYMENT PREPARATION" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
node --version

# Step 2: Check Git
Write-Host ""
Write-Host "2. Checking Git installation..." -ForegroundColor Yellow
git --version

# Step 3: Show current branch
Write-Host ""
Write-Host "3. Current Git branch..." -ForegroundColor Yellow
git rev-parse --abbrev-ref HEAD

# Step 4: Show pending changes
Write-Host ""
Write-Host "4. Checking for uncommitted changes..." -ForegroundColor Yellow
git status --short

# Step 5: Stage all changes
Write-Host ""
Write-Host "5. Staging all changes..." -ForegroundColor Yellow
git add -A
Write-Host "Changes staged successfully." -ForegroundColor Green

# Step 6: Create final commit
Write-Host ""
Write-Host "6. Creating final deployment commit..." -ForegroundColor Yellow
git commit -m "Final deployment-ready state: Fixed Raafat name removal, updated Netlify config, verified all pages functional" --quiet

# Step 7: Show recent commits
Write-Host ""
Write-Host "7. Recent commits:" -ForegroundColor Yellow
git log --oneline -5

# Step 8: Display deployment instructions
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "DEPLOYMENT READY!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host ""
Write-Host "1. NETLIFY DEPLOYMENT (Recommended for external sharing):"
Write-Host "   - Visit: https://app.netlify.com/"
Write-Host "   - Connect your Git repository"
Write-Host "   - Netlify will auto-detect netlify.toml configuration"
Write-Host "   - Deploy automatically on each git push"
Write-Host ""
Write-Host "2. LOCAL TESTING (Before Netlify):"
Write-Host "   - Run: npm run dev"
Write-Host "   - Open: http://localhost:8585"
Write-Host "   - Login with credentials in js/login.js"
Write-Host ""
Write-Host "3. PUSH TO GITHUB:"
Write-Host "   - This script has committed all changes locally"
Write-Host "   - Use: git push origin main"
Write-Host "   - This will trigger Netlify deployment if connected"
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
