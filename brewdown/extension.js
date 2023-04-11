const vscode = require('vscode');


// set output channel
const outputChannel = vscode.window.createOutputChannel('BrewDown');

let makeJson = async () => {
	// message
	outputChannel.appendLine('command: brewdown.makeJson');

	// get text from open document
	const editor = vscode.window.activeTextEditor;
	// get path of open document
	const path = editor.document.fileName;

	// extension of open document
	const ext = path.split('.').pop();
	if (ext !== 'md' && ext !== 'markdown') {
		outputChannel.appendLine('	not a markdown file... exiting 🍻');
		return;
	}

	// path to save json
	const savePath = path.split('.').shift() + '.json';
	outputChannel.appendLine('	savepath: ' + savePath);

	// create json
	const text = editor.document.getText();
	const json = text;

	// is a file at savePath?
	let uriScheme = '';
	await vscode.workspace.fs.stat(vscode.Uri.parse('file:' + savePath)).then(async () => {
		// yes
		// overwrite?
		await vscode.window.showWarningMessage('File already exists. Overwrite?', 'Yes', 'No').then((value) => {
			outputChannel.appendLine('	file exists');
			if (value === 'Yes') {
				outputChannel.appendLine('	overwrite approved');

				uriScheme = 'file';
			} else {
				outputChannel.appendLine('	overwrite denied... exiting 🍻');
			}
		});
	}, () => {
		// no
		outputChannel.appendLine('	file does not exist');
		uriScheme = 'untitled';
	});

	console.log('uriScheme: ' + uriScheme);
	console.log(uriScheme + ":" + savePath);

	if (uriScheme === '') {
		console.log('uriScheme is empty... returning');
		return;
	}

	// open json in code editor with title.json on the right to copy
	vscode.window.showTextDocument(vscode.Uri.parse(uriScheme + ":" + savePath), { viewColumn: vscode.ViewColumn.Two }).then((editor) => {
		editor.edit((edit) => {
			edit.insert(new vscode.Position(0, 0), json);
		});
	}
	).then(() => {
		outputChannel.appendLine('	🍻 open and filled!');
	});
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// activating message
	outputChannel.appendLine('Activating...');

	// set status bar
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = '🍻';
	//tooltip
	statusBarItem.tooltip = 'BrewDown';
	statusBarItem.command = 'brewdown.makeJson';
	statusBarItem.show();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('brewdown.makeJson', makeJson);
	context.subscriptions.push(disposable);

	// active message
	outputChannel.appendLine('Activated 🍻!');
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
