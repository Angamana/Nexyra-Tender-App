$ErrorActionPreference = "Stop"

$minGitUrl = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip"
$zipPath = "$env:TEMP\MinGit.zip"
$destPath = ".\tools\git"

if (!(Test-Path $destPath)) {
    Write-Host "Downloading MinGit..."
    New-Item -ItemType Directory -Force -Path $destPath | Out-Null
    Invoke-WebRequest -Uri $minGitUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $destPath -Force
    Remove-Item $zipPath
}

$git = ".\tools\git\cmd\git.exe"

Write-Host "Initializing git..."
& $git init

& $git config user.name "Angamana"
& $git config user.email "developer@nexyra.com"

& $git branch -M main

Write-Host "Staging files..."
& $git add .

Write-Host "Committing..."
try {
    & $git commit -m "Initial commit - Nexyra Tender App"
} catch {
    Write-Host "Commit already exists."
}

$repoUrl = "https://github.com/Angamana/Nexyra-Tender-App.git"
try {
    & $git remote add origin $repoUrl
} catch {
    & $git remote set-url origin $repoUrl
}

Write-Host "Setup Complete! To upload, please run:"
Write-Host ".\tools\git\cmd\git.exe push -u origin main"
