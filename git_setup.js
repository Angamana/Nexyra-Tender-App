const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const gitPaths = [
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\bin\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
    path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Programs', 'Git', 'cmd', 'git.exe')
];

let gitExe = null;
for (const p of gitPaths) {
    if (fs.existsSync(p)) {
        gitExe = p;
        break;
    }
}

if (gitExe) {
    console.log('Found Git at: ' + gitExe);
    try {
        const repoUrl = 'https://github.com/Angamana/Nexyra-Tender-App';
        console.log(execSync(`"${gitExe}" init`).toString());
        console.log(execSync(`"${gitExe}" add .`).toString());
        
        try {
            console.log(execSync(`"${gitExe}" commit -m "Initial commit of Tender App Architecture"`).toString());
        } catch (e) {
            console.log('Commit already exists or nothing to commit.');
        }
        
        try {
            execSync(`"${gitExe}" remote add origin ${repoUrl}`);
            console.log('Added remote origin.');
        } catch (e) {
            execSync(`"${gitExe}" remote set-url origin ${repoUrl}`);
            console.log('Updated remote origin.');
        }

        console.log(execSync(`"${gitExe}" branch -M main`).toString());
        console.log('SUCCESS: Repository prepared.');
        console.log(`Now run: "${gitExe}" push -u origin main`);
    } catch (err) {
        console.error('Error executing git commands:', err.message);
    }
} else {
    console.log('Git not found in standard paths.');
}
