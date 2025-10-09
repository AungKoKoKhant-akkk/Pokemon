// quick-start.js
// Simple examples to get you started with GitHub utilities

import { readGithubFile, installDependencies } from './github-utils.js';

console.log('🚀 GitHub Utilities - Quick Start Examples\n');

// Example 1: Read a simple file
try {
    console.log('1️⃣ Reading a LICENSE file...');
    const license = await readGithubFile('microsoft', 'TypeScript', 'LICENSE.txt');
    console.log(`📄 License preview: ${license.substring(0, 100)}...`);
    console.log('✅ Success!\n');
} catch (error) {
    console.error('❌ Error:', error.message);
}

// Example 2: Read package.json from a popular library
try {
    console.log('2️⃣ Reading package.json from Lodash...');
    const pkg = await readGithubFile('lodash', 'lodash', 'package.json', 'master');
    const parsed = JSON.parse(pkg);
    console.log(`📦 Package: ${parsed.name} v${parsed.version}`);
    console.log(`📝 Description: ${parsed.description || 'A modern JavaScript utility library.'}`);
    console.log('✅ Success!\n');
} catch (error) {
    console.error('❌ Error:', error.message);
}

// Example 3: Read a README
try {
    console.log('3️⃣ Reading README from jQuery...');
    const readme = await readGithubFile('jquery', 'jquery', 'README.md');
    console.log(`📖 README preview: ${readme.substring(0, 150)}...`);
    console.log('✅ Success!\n');
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('🎉 All examples completed!');
console.log('\n💡 Tips:');
console.log('- Change the owner/repo/file parameters to read different files');
console.log('- Use installDependencies("npm") to install packages');
console.log('- Check README-github-utils.md for more examples');