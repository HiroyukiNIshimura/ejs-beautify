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
    let output = "";
    const beautifyOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        indent_size: 4,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        indent_char: " ",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        indent_with_tabs: false,
        editorconfig: false,
        eol: "\n",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        end_with_newline: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        indent_level: 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        preserve_newlines: true,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_preserve_newlines: 10,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        space_in_paren: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        space_in_empty_paren: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jslint_happy: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        space_after_anon_function: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        space_after_named_function: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        brace_style: "collapse",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unindent_chained_methods: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        break_chained_methods: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        keep_array_indentation: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unescape_strings: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wrap_line_length: 0,
        e4x: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        comma_first: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        operator_position: "before-newline",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        indent_empty_lines: false,
        templating: ["auto"]
    };

    output = jsbeautify.html(document.getText(range), beautifyOptions);
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

    registerFormatter();
}

// this method is called when your extension is deactivated
export function deactivate() { }