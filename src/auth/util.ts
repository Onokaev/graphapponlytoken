import * as vscode from 'vscode';
interface InputDialogResult {
    clientID: string;
    clientSecret: string;
    tenantID: string;
}
export const showCustomInputDialog = async (): Promise<InputDialogResult> => {
    return new Promise((resolve, reject) => {
        // Create a custom input dialog
        const inputDialog = vscode.window.createInputBox();
        
        // Set up the input dialog properties
        inputDialog.title = 'Enter Credentials';
        inputDialog.step = 1;
        inputDialog.totalSteps = 3;
        inputDialog.ignoreFocusOut = true;
        inputDialog.placeholder = 'Enter client ID';
        
        // Define an array to hold the entered values
        const enteredValues: string[] = [];

        inputDialog.onDidChangeValue(value => {
            // Store the entered value at the current step
            enteredValues[inputDialog.step! - 1] = value;
        });

        inputDialog.onDidAccept(() => {
            // Move to the next step or complete the input
            if (inputDialog.step! < inputDialog.totalSteps!) {
                inputDialog.step!++;
                inputDialog.value = enteredValues[inputDialog.step! - 1] || '';
                inputDialog.placeholder = `Enter ${inputDialog.step === 1 ? 'client ID' : inputDialog.step === 2 ? 'client secret' : 'tenant ID'}`;
            } else {
                // All inputs are complete
                inputDialog.dispose();

                const [clientID, clientSecret, tenantID] = enteredValues;
                // Resolve the promise with the entered values
                resolve({ clientID, clientSecret, tenantID });
            }
        });

        inputDialog.onDidHide(() => {
            // Clean up when the dialog is hidden (e.g., by pressing Escape)
            inputDialog.dispose();
        });

        // Show the initial input dialog
        inputDialog.show();
    });
};