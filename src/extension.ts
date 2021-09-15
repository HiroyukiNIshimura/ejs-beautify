// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
    languages,
    ExtensionContext,
    workspace,
    TextDocument,
    Position,
    Range,
    DocumentSelector,
    Disposable,
    TextEdit,
    window,
    commands,
    WorkspaceConfiguration,
    Uri,
} from 'vscode';

//https://github.com/beautify-web/js-beautify
const jsbeautify = require('js-beautify');

let formatterHandler: undefined | Disposable;
let rangeFormatterHandler: undefined | Disposable;

/**
 * Dispose formatters
 */
function disposeHandlers() {
    if (formatterHandler) {
        formatterHandler.dispose();
    }
    if (rangeFormatterHandler) {
        rangeFormatterHandler.dispose();
    }
    formatterHandler = undefined;
    rangeFormatterHandler = undefined;
}

/**
 * Build formatter selectors
 */
const selectors = [
    'ejs', //EJS (Embedded JavaScript) Templates
    'erb', //ERB (Embedded Ruby)
    'html', //HTML
    'razor', //Razor (cshtml)
    'tpl', //Underscore Templates (TPL)
    'xml', //XML
    'xslt', //XSLT
];


function format(document: TextDocument, range: Range, opts: any) {
    let output = jsbeautify.html(document.getText(range), opts);
    if (output) {
        output = output.replace(/\n\n(\s+{{)/g, '\n$1');
    }
    return output;
}

async function getConfig() {
    let config = workspace.getConfiguration('js-beautify');
    let opts = JSON.parse(JSON.stringify(config));

    let rc = await workspace.findFiles('**/.ejsbrc.json');
    if (rc && rc.length > 0) {
        try {
            let doc = await workspace.openTextDocument(Uri.file(rc[0].fsPath));
            let extendOption = JSON.parse(doc.getText());
            opts = Object.assign(opts, extendOption);
        } catch (error) {
            console.log(error);
        }
    }
    return opts;
}

const beautify = async (document: TextDocument, range: Range) => {
    const result = [];
    var config = await getConfig();
    let output = format(document, range, config);
    result.push(TextEdit.replace(range, output));
    return result;
};

export async function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('extension.formatSelectionAsHtmlBeautify', formatSelectionAsHtmlBeautify));

    interface Selectors {
        rangeLanguageSelector: DocumentSelector;
        languageSelector: DocumentSelector;
    }

    const enabledLanguages = selectors.filter(function (el) {
        return true;
    });

    function registerFormatter() {
        disposeHandlers();

        for (let lang of enabledLanguages) {
            rangeFormatterHandler = languages.registerDocumentRangeFormattingEditProvider({
                scheme: 'file',
                language: lang
            }, {
                provideDocumentRangeFormattingEdits: function (document: TextDocument, range: Range) {
                    let end = range.end;

                    if (end.character === 0) {
                        end = end.translate(-1, Number.MAX_VALUE);
                    } else {
                        end = end.translate(0, Number.MAX_VALUE);
                    }

                    const rng = new Range(new Position(range.start.line, 0), end);
                    return beautify(document, rng);
                }
            });

            formatterHandler = languages.registerDocumentFormattingEditProvider({
                scheme: 'file',
                language: lang
            }, {
                provideDocumentFormattingEdits: function (document: TextDocument) {
                    const start = new Position(0, 0);

                    const end = new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
                    const rng = new Range(start, end);
                    return beautify(document, rng);
                }
            });
        }
    }

    var config = await getConfig();
    if (config.formatting) {
        registerFormatter();
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function formatSelectionAsHtmlBeautify() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    const selection = window.activeTextEditor.selection;

    var config = await getConfig();
    let output = format(document, selection, config);
    await window.activeTextEditor.edit(builder => builder.replace(selection, output));
}

