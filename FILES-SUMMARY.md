# 📁 GitHub Utilities - File Summary

I've created a complete GitHub utilities system for you! Here's what each file does:

## 🔧 Core Files

### `github-utils.js` 
**Main utility functions**
- `readGithubFile(owner, repo, filePath, branch)` - Reads any file from GitHub
- `installDependencies(packageManager)` - Installs npm/yarn dependencies

### `quick-start.js`
**Simple examples to get started**
- Run with: `node quick-start.js`
- Shows 3 basic examples of reading files from GitHub

### `github-usage-example.js`
**Comprehensive examples**
- Run with: `node github-usage-example.js`  
- Shows advanced usage patterns and error handling

### `README-github-utils.md`
**Complete documentation**
- How to use all functions
- Common use cases
- Troubleshooting tips

## 🚀 How to Use

### Quick Test
```bash
node quick-start.js
```

### Read Any GitHub File
```javascript
import { readGithubFile } from './github-utils.js';

// Read package.json from any repo
const content = await readGithubFile('owner', 'repo', 'package.json');
console.log(content);
```

### Install Dependencies
```javascript
import { installDependencies } from './github-utils.js';

await installDependencies('npm');  // or 'yarn'
```

## 📋 Common Examples

```javascript
// Read your own repo's README
const readme = await readGithubFile('your-username', 'your-repo', 'README.md');

// Get latest version of a library
const pkg = await readGithubFile('lodash', 'lodash', 'package.json', 'master');
const version = JSON.parse(pkg).version;

// Download configuration files
const eslint = await readGithubFile('airbnb', 'javascript', '.eslintrc.js');
```

## ✅ Features

- ✅ ES Module compatible (works with your React project)
- ✅ Promise-based async/await syntax
- ✅ Error handling included
- ✅ Works with public GitHub repositories
- ✅ No authentication required for public repos
- ✅ Can read any file type (JSON, MD, JS, CSS, etc.)
- ✅ Install dependencies with npm or yarn

## 🎯 Use Cases

- Download configuration files from other projects
- Check latest versions of libraries
- Copy useful code snippets
- Read documentation from repos
- Analyze project structures
- Backup/clone specific files

Happy coding! 🚀