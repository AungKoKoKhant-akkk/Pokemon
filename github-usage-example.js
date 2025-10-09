// github-usage-example.js
// Examples of how to use the GitHub utilities

import { readGithubFile, installDependencies } from './github-utils.js';
import fs from 'fs';

// Example 1: Reading a file from GitHub
async function readPackageJson() {
    try {
        console.log('📖 Reading package.json from a GitHub repo...');
        
        // Read package.json from lodash (a good example)
        const packageJson = await readGithubFile(
            'lodash',        // GitHub username/organization
            'lodash',        // Repository name
            'package.json',  // File path
            'master'         // Branch (lodash uses 'master')
        );
        
        console.log('✅ Successfully read package.json:');
        const parsed = JSON.parse(packageJson);
        console.log(`Name: ${parsed.name || 'Not found'}`);
        console.log(`Version: ${parsed.version || 'Not found'}`);
        console.log(`Description: ${parsed.description || 'Not found'}`);
        
    } catch (error) {
        console.error('❌ Error reading file:', error.message);
    }
}

// Example 2: Reading a README file
async function readReadmeFile() {
    try {
        console.log('📖 Reading README.md from a GitHub repo...');
        
        const readme = await readGithubFile(
            'microsoft',
            'vscode',
            'README.md'
        );
        
        console.log('✅ Successfully read README.md:');
        console.log(readme.substring(0, 200) + '...');
        
    } catch (error) {
        console.error('❌ Error reading README:', error.message);
    }
}

// Example 3: Reading your own repo files
async function readYourOwnRepo() {
    try {
        console.log('📖 Reading from your own repo...');
        
        // Example: Read from your Pokemon project
        const packageJson = await readGithubFile(
            'AungKoKoKhant-akkk',  // Your GitHub username
            'Pokemon',             // Your repo name
            'package.json',        // File to read
            'features-update'      // Your current branch
        );
        
        console.log('✅ Successfully read your package.json:');
        const parsed = JSON.parse(packageJson);
        console.log(`Project: ${parsed.name}`);
        console.log(`Version: ${parsed.version}`);
        
    } catch (error) {
        console.error('❌ Error reading your repo:', error.message);
    }
}

// Example 4: Installing dependencies
async function installProjectDependencies() {
    try {
        console.log('📦 Installing dependencies...');
        
        // Install with npm (default)
        await installDependencies('npm');
        console.log('✅ Dependencies installed with npm!');
        
        // Or install with yarn
        // await installDependencies('yarn');
        // console.log('✅ Dependencies installed with yarn!');
        
    } catch (error) {
        console.error('❌ Error installing dependencies:', error.message);
    }
}

// Example 5: Download and save a file locally
async function downloadAndSaveFile() {
    try {
        console.log('💾 Downloading file and saving locally...');
        
        const fileContent = await readGithubFile(
            'facebook',
            'react',
            'LICENSE'
        );
        
        // Save to local file
        fs.writeFileSync('./downloaded-license.txt', fileContent);
        
        console.log('✅ File downloaded and saved as downloaded-license.txt');
        
    } catch (error) {
        console.error('❌ Error downloading file:', error.message);
    }
}

// Run examples
async function runExamples() {
    console.log('🚀 Running GitHub utilities examples...\n');
    
    // Uncomment the examples you want to run:
    
    await readPackageJson();
    console.log('\n---\n');
    
    await readReadmeFile();
    console.log('\n---\n');
    
    // await readYourOwnRepo();
    // console.log('\n---\n');
    
    // await installProjectDependencies();
    // console.log('\n---\n');
    
    // await downloadAndSaveFile();
    
    console.log('✨ Examples completed!');
}

// Run the examples
runExamples().catch(console.error);

export {
    readPackageJson,
    readReadmeFile,
    readYourOwnRepo,
    installProjectDependencies,
    downloadAndSaveFile
};