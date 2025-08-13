/*\
title: $:/poc2go/modules/custom/server/route.js
type: application/javascript
module-type: route

Server-side custom WebServer route

GET /{route}/topic/filter/sender

\*/
"use strict";

// Name of route - note is module-type route
// Must be the same name as in client-side macro JS tiddler
//  $:/poc2go/macros/custom/server/request.js
const route = 'git-server';

var reqCounter = 1;

const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const { exec } = require('node:child_process');

const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const packageDir = (fpath) => path.resolve(os.homedir(), '.git-server', fpath);
const setText = (title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);
console.log(process.cwd());

const { commands } = require(path.resolve($tw.boot.wikiPath, './lib/commands'));

function run(cmd, args) {
	return new Promise((resolve, reject) => {
		exec(cmd, { ...args, timeout: 10000 }, (err, stdout, stderr) => {
			if (err) { return reject(err); }
			if (stderr) { return reject(stderr); }
			resolve(stdout);
		});
	});
}

var test = {
//	testName: '', // overrides defalut test name
	repoUrl: 'http://localhost:8005/test3.git',
	workDir: packageDir('tests/working'),
	remote: 'origin',
	branch: 'main',
}


function decodeUriParams(state) {
	const params = [];
	state.params[0].split('/').forEach(p => {
		params.push($tw.utils.decodeURIComponentSafe(p));
	})
	return params
}

function tiddlerToWiki(jsonTiddler) {
	$tw.wiki.addTiddler(new $tw.Tiddler(
		$tw.wiki.getCreationFields(),
		jsonTiddler,
		$tw.wiki.getModificationFields(),
	));
}

function deleteServerTiddlers() {
	const tiddlers = $tw.wiki.filterTiddlers('[prefix[Server Tiddler #]]');
	$tw.utils.each(tiddlers,function(title) {
		$tw.wiki.deleteTiddler(title);
	});
}


exports.method = "GET";
exports.path = new RegExp(`^\/${route}\/(.+)$`);

// Do server side things - all $tw objects/functions are available
exports.handler = async function(request,response,state) {
	//createWork(test);
	
	
	// DecodeURI special characters in params
	const params = decodeUriParams(state);
	
	// Assign params to friendly names
	const topic = params[0], filter = params[1], sender = params[2];

	var settings = $tw.utils.parseJSONSafe(
		$tw.wiki.getTiddlerText('git-server-settings')
	);
	
	var out = '', didCmd = false;
	if (topic === 'commands') {
		if (commands($tw, settings)[filter]) {
			let cmds = commands($tw, settings)[filter];
			for (const cmd of cmds) {
				out += `$ ${cmd}\n`;
				await run(cmd, {cwd: settings.workDir})
					.then((stdout) => { out += stdout; })
				.catch((err) => { out += err;});
				didCmd = true;
			}
		}
		if (!didCmd) {
			var cmd = filter;
			out += `$ ${cmd}\n`;
			await run(cmd, {cwd: settings.workDir})
				.then((stdout) => { out += stdout; })
			.catch((err) => { out += err;});
		}
	}

	// Reset - delete server iddlers and reset counter
	if (topic === 'resetTiddlers') {
		deleteServerTiddlers();
		reqCounter = 1;
	}
	
	// Values of this request
	const urlValues = { route, topic, filter, sender };
	const tiddlerFromServer = `Server Tiddler #${reqCounter}`;
	
	// Responding with those values
	const jsonResponse = { urlValues, tiddlerFromServer }
	// console.dir(jsonResponse);
/*	
	tiddlerToWiki({
		title: tiddlerFromServer,
		text: `Server added this tiddler\n\n@@color:aqua; Request #${reqCounter++}@@\n\n` +
		'```json\n' +  JSON.stringify(jsonResponse, null, 2)  + '\n```\n\n' +
		'```\n' +  out + '\n```\n\n'
	});
*/	
	setText('git-server-intro', `Repository: @@.mono ${settings.repoUrl}@@\n\n` +
		`Working directory: @@.mono ${settings.workDir}@@ \n\n` +
		`Remote: @@.mono ${settings.remote}@@ <span style="margin-left:4em;" /> Branch: @@.mono ${settings.branch}@@ \n\n` +
		`@@.mono-q Command:@@ @@.mono-m ${filter}@@ \n\n` +
		'```\n' + out + '\n```\n\n');

	// Respond with JSON of results for this topic
	state.sendResponse(200, {"Content-Type": "application/json"},
		JSON.stringify(jsonResponse)
	);
}
