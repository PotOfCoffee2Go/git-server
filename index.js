const path = require('node:path');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const { configPath } = require('./lib/parameters').parameters();
const config = require(configPath).config();
config.repoDir = path.parse(configPath).name;
 
const { repoServer } = require('./lib/reposerver');

process.chdir(path.dirname(configPath));

console.log(hue(`Configuration file: ${configPath}\n`));
repoServer(config);
