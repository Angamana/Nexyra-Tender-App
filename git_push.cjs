const { execSync } = require('child_process');
const fs = require('fs');

const gitExe = fs.existsSync('.\\tools\\git\\cmd\\git.exe') ? '.\\tools\\git\\cmd\\git.exe' : 'git';

try {
  console.log(execSync(`"${gitExe}" add .`).toString());
  console.log(execSync(`"${gitExe}" commit --allow-empty -m "Trigger GitHub Pages deployment build"`).toString());
  console.log(execSync(`"${gitExe}" push origin main`).toString());
  console.log('Pushed successfully!');
} catch (e) {
  console.error(e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
}
