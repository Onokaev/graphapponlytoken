import * as msal from '@azure/msal-node';
import * as vscode from 'vscode';
import { showCustomInputDialog } from './util';

export const getToken = async () => {
    console.log('We are here');
    let msalConfig = {
        auth: {
            clientId: '',
            authority: '',
            clientSecret: ''
        }
    };
    
    const tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
        skipCache: true
    };
    
    
    const inputItems = await showCustomInputDialog();
    const { clientID, clientSecret, tenantID } = inputItems;
    
    if(clientID && clientSecret && tenantID) {
        msalConfig.auth.clientId = clientID;
        msalConfig.auth.clientSecret = clientSecret;
        msalConfig.auth.authority = `https://login.microsoftonline.com/${tenantID}`;
        const confidentialClientApplication = new msal.ConfidentialClientApplication(msalConfig);
        return await confidentialClientApplication.acquireTokenByClientCredential(tokenRequest);
    }
};