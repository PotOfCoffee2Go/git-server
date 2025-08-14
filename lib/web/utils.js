var $tw;
module.exports = function(_$tw) {
	$tw = _$tw;
	
	function decodeUriParams(state) {
		const params = [];
		state.params[0].split('/').forEach(p => {
			params.push($tw.utils.decodeURIComponentSafe(p));
		})
		return params;
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
	return {
		decodeUriParams,
		tiddlerToWiki,
		deleteServerTiddlers
	};
}
