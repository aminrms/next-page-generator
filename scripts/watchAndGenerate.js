const chokidar = require('chokidar');
const path = require('path');
const { runGeneration } = require('./generatePages'); // Import your generation function

const watchTarget = path.join(__dirname, '../data/sourceData.json'); // Example: Watch a data file
// Or watch a directory:
// const watchTarget = path.join(__dirname, '../sourceTemplates');

console.log(`Watching for changes in: ${watchTarget}`);

chokidar.watch(watchTarget, { ignored: /(^|[\/\\])\../, persistent: true })
  .on('add', (path) => {
    console.log(`File ${path} has been added`);
    runGeneration();
  })
  .on('change', (path) => {
    console.log(`File ${path} has been changed`);
    runGeneration();
  })
  .on('unlink', (path) => {
    console.log(`File ${path} has been removed`);
    // You might want to re-run generation or clean up if a source file is removed
    runGeneration();
  })
  .on('error', (error) => {
    console.error(`Watcher error: ${error}`);
  });

// Optionally, run generation once when the watcher starts
runGeneration();

console.log('Watcher started. Press Ctrl+C to stop.');