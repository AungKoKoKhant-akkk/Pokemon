# GitHub Utilities Usage Guide

This guide shows you how to use the GitHub utilities to read files from GitHub repositories and install dependencies.

## 📁 Files Created
- `github-utils.js` - Core utility functions
- `github-usage-example.js` - Usage examples
- `README-github-utils.md` - This guide

## 🚀 Quick Start

### 1. Basic File Reading

```javascript
import { readGithubFile } from './github-utils.js';

// Read any file from a public GitHub repo
const content = await readGithubFile(
    'username',    // GitHub username or organization
    'repo-name',   // Repository name
    'file.txt',    // Path to file
    'main'         // Branch (optional, defaults to 'main')
);

console.log(content);
```

### 2. Install Dependencies

```javascript
import { installDependencies } from './github-utils.js';

// Install with npm
await installDependencies('npm');

// Or install with yarn
await installDependencies('yarn');
```

## 📖 Common Use Cases

### Read Package.json from Any Repo
```javascript
const packageJson = await readGithubFile('facebook', 'react', 'package.json');
const parsed = JSON.parse(packageJson);
console.log(parsed.name, parsed.version);
```

### Read README Files
```javascript
const readme = await readGithubFile('microsoft', 'vscode', 'README.md');
console.log(readme);
```

### Read Your Own Private Repo Files
For private repos, you'll need authentication (GitHub token), but for public repos:
```javascript
const myFile = await readGithubFile('your-username', 'your-repo', 'src/App.js');
```

### Download and Save Files Locally
```javascript
import fs from 'fs';
const content = await readGithubFile('owner', 'repo', 'important-file.txt');
fs.writeFileSync('./local-copy.txt', content);
```

## 🏃‍♂️ Running the Examples

To see the utilities in action:

```bash
# Run the example file
node github-usage-example.js
```

## 📝 Example Output
```
📖 Reading package.json from a GitHub repo...
✅ Successfully read package.json:
react
18.2.0

---

📖 Reading README.md from a GitHub repo...
✅ Successfully read README.md:
# Visual Studio Code - Open Source
Visual Studio Code is a distribution of the...

---

✨ Examples completed!
```

## 🔧 Error Handling

The utilities include proper error handling:

```javascript
try {
    const content = await readGithubFile('owner', 'repo', 'file.txt');
    console.log(content);
} catch (error) {
    console.error('Failed to read file:', error.message);
}
```

## 🌟 Tips

1. **Public Repos Only**: These utilities work with public repositories
2. **Rate Limits**: GitHub API has rate limits (60 requests/hour for unauthenticated)
3. **File Paths**: Use forward slashes even on Windows: `src/components/App.js`
4. **Branch Names**: Common branches are 'main', 'master', 'develop'
5. **Large Files**: GitHub raw content has size limits (~100MB)

## 🎯 Real-World Examples

### Download a Configuration File
```javascript
// Download a popular ESLint config
const eslintConfig = await readGithubFile(
    'airbnb', 
    'javascript', 
    'packages/eslint-config-airbnb/.eslintrc.js'
);
```

### Get Latest Version of a Library
```javascript
const pkg = await readGithubFile('lodash', 'lodash', 'package.json');
const version = JSON.parse(pkg).version;
console.log(`Latest lodash version: ${version}`);
```

### Copy Useful Files to Your Project
```javascript
// Copy a useful utility function
const utils = await readGithubFile('sindresorhus', 'awesome', 'readme.md');
fs.writeFileSync('./AWESOME.md', utils);
```

Enjoy using the GitHub utilities! 🚀