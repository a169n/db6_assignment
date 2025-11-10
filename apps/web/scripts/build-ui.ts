import { execSync } from 'child_process';

execSync('npx tailwindcss -i ./src/styles/index.css -o ./dist/ui.css --minify', {
  stdio: 'inherit',
  cwd: process.cwd()
});
