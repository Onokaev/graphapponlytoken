import * as vscode from 'vscode';
import { getToken } from './auth';
import * as clipboard from 'clipboardy';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('graphapponlytoken.generateToken', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const authResult = await getToken();
		if(authResult){
			clipboard.default.writeSync(authResult.accessToken);
			vscode.window.showInformationMessage('Token copied to clipboard');
		}
	});
	context.subscriptions.push(
		vscode.window.registerUriHandler({
			handleUri: async (uri: vscode.Uri) => {
				if(uri.path === '/'){
					console.log('Hit default URI');
					return;
				}
				if(uri.path.toLocaleLowerCase() === '/gettoken'){
					console.log('Hit getToken URI');
					const authResult = await getToken();
					if(authResult){
						clipboard.default.writeSync(authResult.accessToken);
						vscode.window.showInformationMessage('Token copied to clipboard');
						return;
					}
				}
			}
		})
	)

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
