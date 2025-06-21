import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'Switcheo';
const REPO_NAME = 'token-icons';
const BRANCH = 'main';
const TOKENS_PATH = 'tokens';
const OUTPUT_DIR = 'assets/tokens';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to make GitHub API request
function makeGitHubRequest(url) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js Token Downloader',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Function to download a file
function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (error) => {
            fs.unlink(filepath, () => {}); // Delete the file if download failed
            reject(error);
        });
    });
}

// Function to get all files in a directory recursively
async function getFilesRecursively(dirPath) {
    try {
        const contents = await makeGitHubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dirPath}?ref=${BRANCH}`);
        const files = [];
        
        for (const item of contents) {
            if (item.type === 'file' && item.name.endsWith('.svg')) {
                files.push({
                    name: item.name,
                    download_url: item.download_url,
                    path: item.path
                });
            } else if (item.type === 'dir') {
                const subFiles = await getFilesRecursively(item.path);
                files.push(...subFiles);
            }
        }
        
        return files;
    } catch (error) {
        console.error(`Error getting files from ${dirPath}:`, error.message);
        return [];
    }
}

// Main function
async function downloadAllTokens() {
    try {
        console.log('🔍 Fetching file list from Switcheo token-icons repository...');
        
        const files = await getFilesRecursively(TOKENS_PATH);
        
        if (files.length === 0) {
            console.log('❌ No SVG files found in the repository');
            return;
        }
        
        console.log(`📁 Found ${files.length} SVG files to download`);
        
        let downloaded = 0;
        let failed = 0;
        
        for (const file of files) {
            try {
                // Create subdirectories if needed
                const relativePath = file.path.replace(`${TOKENS_PATH}/`, '');
                const outputPath = path.join(OUTPUT_DIR, relativePath);
                const outputDir = path.dirname(outputPath);
                
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                
                console.log(`⬇️  Downloading: ${file.name}`);
                await downloadFile(file.download_url, outputPath);
                downloaded++;
                
                // Add a small delay to be respectful to GitHub's API
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`❌ Failed to download ${file.name}:`, error.message);
                failed++;
            }
        }
        
        console.log('\n✅ Download completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Successfully downloaded: ${downloaded} files`);
        console.log(`   - Failed downloads: ${failed} files`);
        console.log(`   - Total files: ${files.length} files`);
        console.log(`📁 Files saved to: ${OUTPUT_DIR}/`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
downloadAllTokens(); 