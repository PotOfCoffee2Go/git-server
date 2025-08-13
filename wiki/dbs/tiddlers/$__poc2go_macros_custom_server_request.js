/*\
title: $:/poc2go/macros/custom/server/request.js
type: application/javascript
module-type: macro

Client-side custom request using WebServer connection
\*/

if ($tw.browser) {
	
// Name of route - note is module-type macro
// Must be the same name as in server-side route JS tiddler
//  $:/poc2go/modules/custom/server/route.js
const route = 'git-server';

// Macro to send request to server
//  <<${route} topic [[filter]]>>
$tw.wiki.addTiddler({
	title: `$:/temp/${route}/macro`,
	tags: '$:/tags/Macro',
	text: `\\define ${route}(topic:"" filter:"") ` +
	`<$macrocall $name=${route}-io ` +
	` topic='$topic$' filter='$filter$' sender="$(currentTiddler)$" />`
});

(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// WebServer base URL
const getWebServerHost = () => $tw.syncadaptor.host;
// Have syncer get tiddler(s) created by server
const syncFromServer = () => $tw.syncer.syncFromServer();

// Exports for the $:/core to load and run this macro
//  name must differ from the marco \define name above
exports.name = `${route}-io`; 
exports.params = [
	{name: 'topic'},  // topic the server is to process
	{name: 'filter'}, // a filter of tiddlers for server to act upon
	{name: 'sender'}, // Tiddler title sending request - currentTiddler
];
exports.run = (topic, filter, sender) => {
	// Check request values
	if (!topic)  { topic = 'default'; }
	if (!filter) { filter = '[[]]'; }
	if (!sender) { sender = 'GettingStarted' }

	// Send request and process response via 'callback' function below
	const url = getWebServerHost() + `${route}/${topic}/${filter}/${sender}`;
	$tw.utils.httpRequest({	url, callback });
}

// Called with stringified JSON response from server
function callback(err, jsonstr) {
	if (err) {
		console.log(err);
		return;
	}

	var json;
	try {
		json = JSON.parse(jsonstr);
	} catch(e) {
		console.log(`Route ${route} - Invalid JSON in response`)
		return;
	}
	console.log(json); // for debugging 
	syncFromServer();  // have syncer get tiddler(s) created by server
}


})(); // (function() {

} // if ($tw.browser) {
