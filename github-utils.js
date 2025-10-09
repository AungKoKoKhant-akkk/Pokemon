// github-utils.js
// Utility functions for reading files from GitHub and installing dependencies

import https from 'https';
import fs from 'fs';
import { exec } from 'child_process';

/**
 * Reads a file from a public GitHub repository using the GitHub API.
 * @param {string} owner - GitHub repo owner
 * @param {string} repo - GitHub repo name
 * @param {string} filePath - Path to the file in the repo
 * @param {string} branch - Branch name (default: 'main')
 * @returns {Promise<string>} - File contents as string
 */
export function readGithubFile(owner, repo, filePath, branch = 'main') {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`Failed to fetch file: ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Installs dependencies using npm or yarn.
 * @param {string} [packageManager='npm'] - 'npm' or 'yarn'
 * @returns {Promise<void>}
 */
export function installDependencies(packageManager = 'npm') {
    return new Promise((resolve, reject) => {
        exec(`${packageManager} install`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
}
