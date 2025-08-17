const AMD = (tree) => ['A','M','D'].includes(tree);
const _MTD = (tree) => [' ','M','T','D'].includes(tree);
const MTARC = (index) => ['M','T','A','R','C'].includes(index);
const _MTARC = (index) => [' ','M','T','A','R','C'].includes(index);

const btnAddIdx = (file) => `<$button class="fbtn-b" actions=<<xxx>> >stage</$button>`;
const btnUnstageIdx = (file) => `<$button class="fbtn-r" actions=<<xxx>> >unstage</$button>`;
const btnRestoreIdx = (file) => `<$button class="fbtn-r" actions=<<xxx>> >restore</$button>`;
const btnTrackFile = (file) => `<$button class="fbtn-b" actions=<<xxx>> >track</$button>`;
const btnUntrackFile = (file) => `<$button class="fbtn-r" actions=<<xxx>> >untrack</$button>`;
const btnIgnoreFile = (file) => `<$button class="fbtn-p" actions=<<xxx>> >ignore</$button>`;
const clrFileTracked = (file) => `@@.mono-g ${file}@@`
const clrFileUntracked = (file) => `@@.mono-o ${file}@@`
const clrFileTrackedChanged = (file) => `@@.mono-dg ${file}@@`
const clrFileTrackedNotstaged = (file) => `@@.mono-r ${file}@@`

exports.fileStatesLookup = function fileStatesLookup($tw, settings, fileState) {
	const {file, index, tree  } = fileState;
	var  stateTrack = [], stateFile = [], stateIndex = [], stateTree = [];

	if (index === '?' && tree === '?') { stateTrack.push(`${btnTrackFile()} ${btnIgnoreFile()}`); }
	if (index === '!' && tree === '!') { stateTrack.push('ignored'); }
	if (index === ' ' && tree === 'R') { stateTrack.push('renamed in work'); }
	if (index === ' ' && tree === 'C') { stateTrack.push('copied in work'); }

	if (index === ' ' && AMD(tree)) { stateIndex.push(`@@.mono-r not staged@@`); }
	if (index === 'M' && _MTD(tree)) { stateIndex.push(`${btnUnstageIdx()} @@.mono-y staged@@`); }
	if (index === 'T' && _MTD(tree)) { stateIndex.push(`${btnUnstageIdx()} @@.mono-y type changed@@`); }
	if (index === 'A' && _MTD(tree)) { stateIndex.push(`${btnUnstageIdx()} @@.mono-y staged (added)@@`); }
	if (index === 'D') { stateIndex.push('@@.mono-y deleted@@'); }
	if (index === 'R' && _MTD(tree)) { stateIndex.push('@@.mono-y renamed@@'); }
	if (index === 'C' && _MTD(tree)) { stateIndex.push('@@.mono-y copied@@'); }

	if (MTARC(index) && tree === ' ') { stateTree.push(`${btnRestoreIdx()} @@.mono-q matches@@`); }
	if (_MTARC(index) && tree === 'M') { stateTree.push(`${btnAddIdx()} ${btnRestoreIdx()} @@.mono-q changed@@`); }
	if (_MTARC(index) && tree === 'T') { stateTree.push(`${btnAddIdx()} ${btnRestoreIdx()} @@.mono-q type changed since index@@`); }
	if (_MTARC(index) && tree === 'D') { stateTree.push(`${btnAddIdx()} ${btnRestoreIdx()} @@.mono-q deleted@@`); }

	if (stateTrack.length === 0) {
		stateTrack.push(`${btnUntrackFile()}`);
		if (index === ' ' && AMD(tree)) { //tracked Not Staged
			stateFile.push(`${clrFileTrackedNotstaged(file)}`);
		} else { // tracked staged
			if (_MTARC(index) && tree === 'M') { // tree has changed
				stateFile.push(`${clrFileTrackedChanged(file)}`);
			} else { // tree matches
				stateFile.push(`${clrFileTracked(file)}`);
			}
		}
	} else {
		stateFile.push(`${clrFileUntracked(file)}`);
	}
	return { 
		track: stateTrack.join(';'),
		file: stateFile.join(' '),
		work: stateTree.join(';'),
		index: stateIndex.join(';')
	}
}
