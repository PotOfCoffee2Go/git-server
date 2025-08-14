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

exports.method = "GET";
exports.path = new RegExp(`^\/${route}\/(.+)$`);
exports.handler = function(request,response,state) {
	$tw.web.handler($tw, request, response, state);
}
