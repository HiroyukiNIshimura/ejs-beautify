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
    TextEdit
} from 'vscode';

const jsbeautify = require('js-beautify');
const config = workspace.getConfiguration('js-beautify');

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
    'tpl', //Underscore Templates (TPL)
    'xml', //XML
    'xslt', //XSLT
];

const prettyDiff = (document: TextDocument, range: Range) => {
    const result = [];

    let output = jsbeautify.html(document.getText(range), config);
    result.push(TextEdit.replace(range, output));
    return result;
};

export function activate(context: ExtensionContext) {
    interface Selectors {
        rangeLanguageSelector: DocumentSelector;
        languageSelector: DocumentSelector;
    }

    const enabledLanguages = selectors.filter(function (el) {
        return true;
    });

    function registerFormatter() {
        disposeHandlers();

        for (let i in enabledLanguages) {
            rangeFormatterHandler = languages.registerDocumentRangeFormattingEditProvider({
                scheme: 'file',
                language: enabledLanguages[i]
            }, {
                provideDocumentRangeFormattingEdits: function (document: TextDocument, range: Range) {
                    let end = range.end;

                    if (end.character === 0) {
                        end = end.translate(-1, Number.MAX_VALUE);
                    } else {
                        end = end.translate(0, Number.MAX_VALUE);
                    }

                    const rng = new Range(new Position(range.start.line, 0), end);
                    return prettyDiff(document, rng);
                }
            });

            formatterHandler = languages.registerDocumentFormattingEditProvider({
                scheme: 'file',
                language: enabledLanguages[i]
            }, {
                provideDocumentFormattingEdits: function (document: TextDocument) {
                    const start = new Position(0, 0);

                    const end = new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
                    const rng = new Range(start, end);
                    return prettyDiff(document, rng);
                }
            });
        }
    }

    if (config.formatting) {
        registerFormatter();
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }