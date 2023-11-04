import * as vscode from 'vscode';
import { getToken } from './auth';
import * as clipboard from 'clipboardy';
import TelemetryReporter from '@vscode/extension-telemetry';

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
	const reporter = new TelemetryReporter(context.extension.packageJSON.telemetryInstrumentationKey);
	context.subscriptions.push(
		vscode.window.registerUriHandler({
			handleUri: async (uri: vscode.Uri) => {
				if(uri.path === '/'){
					console.log('Hit default URI');
					return;
				}
				if(uri.path.toLocaleLowerCase() === '/getToken'){
					console.log('Hit getToken URI');
					const authResult = await getToken();
					if(authResult){
						clipboard.default.writeSync(authResult.accessToken);
						vscode.window.showInformationMessage('Token copied to clipboard');
						return;
					}
				}
			}
		}),
		reporter,
		registerCommandWithTelemetry(reporter, 'graphapponlytoken.generateToken', async () => {
			const authResult = await getToken();
			if(authResult){
				clipboard.default.writeSync(authResult.accessToken);
				vscode.window.showInformationMessage('Token copied to clipboard');
			}
		})
	);
	context.subscriptions.push(disposable);
}

function getQueryParameters(uri: vscode.Uri): Record<string, string> {
	const query = uri.query;
	if (!query) {
	  return {};
	}
	const queryParameters = (query.startsWith('?') ? query.substring(1) : query).split("&");
	const parameters = {} as Record<string, string>;
	queryParameters.forEach((element) => {
	  const keyValue = element.split("=");
	  parameters[keyValue[0].toLowerCase()] = decodeURIComponent(keyValue[1]);
	});
	return parameters;
  }

  function registerCommandWithTelemetry(reporter: TelemetryReporter, command: string, callback: (...args: any[]) => any, thisArg?: any): vscode.Disposable {
	return vscode.commands.registerCommand(command, (...args: any[]) => {
	  const splatCommand = command.split('/');
	  const eventName = splatCommand[splatCommand.length - 1];
	  reporter.sendTelemetryEvent(eventName);
	  return callback.apply(thisArg, args);
	}, thisArg);
  }

// This method is called when your extension is deactivated
export function deactivate() {}
