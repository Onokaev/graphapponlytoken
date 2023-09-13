import * as msal from '@azure/msal-node';
import * as vscode from 'vscode';

let msalConfig = {
    auth: {
        clientId: '',
        authority: '',
        clientSecret: ''
    }
};

const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default']
};

const confidentialClientApplication = new msal.ConfidentialClientApplication(msalConfig);

export async function getToken(){
    const clientID = await vscode.window.showInputBox({
        placeHolder: 'Enter client ID'
    });

    const clientSecret = await vscode.window.showInputBox({
        placeHolder: 'Enter client secret'
    });

    const authority = await vscode.window.showInputBox({
        placeHolder: 'Enter authority or use default'
    });

    msalConfig.auth.clientId = clientID ? clientID : msalConfig.auth.clientId;
    msalConfig.auth.clientSecret = clientSecret ? clientSecret : msalConfig.auth.clientSecret;
    msalConfig.auth.authority = authority ? authority : msalConfig.auth.authority;

    return confidentialClientApplication.acquireTokenByClientCredential(tokenRequest);
}