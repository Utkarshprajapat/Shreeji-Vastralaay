const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = __dirname;
const destDir = path.join(__dirname, 'public');
const exclude = [
    'public',
    'node_modules',
    '.git',
    '.vercel',
    'admin',
    'package.json',
    'package-lock.json',
    'vercel.json',
    'build-site.js',
    '.gitignore'
];

// Create public directory
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir);

// Copy root files
console.log('Copying root files to public...');
const entries = fs.readdirSync(sourceDir);
entries.forEach(entry => {
    if (exclude.includes(entry)) return;

    const srcPath = path.join(sourceDir, entry);
    const destPath = path.join(destDir, entry);

    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
        fs.copyFileSync(srcPath, destPath);
    }
});

// Build Admin
console.log('Building Admin Panel...');
try {
    execSync('cd admin && npm install && npm run build -- --outDir ../public/admin', { stdio: 'inherit' });
    console.log('Admin build complete.');
} catch (error) {
    console.error('Admin build failed:', error);
    process.exit(1);
}

console.log('Build successful!');
