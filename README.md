# EJS Beautify

## Features

A formatter extension for EJS files for VS Code. 'js-beautify' is used as the format engine.

![demo](./preview.gif)

### 1.0.6

Current release.

## Settings

Please add the following to 'settings.json'.

```
 "emmet.includeLanguages": {
    "ejs": "html",
  },
 "[html]": {
    "editor.defaultFormatter": "j69.ejs-beautify"
  },
```

## External file settings

You can define development team-specific rules by placing a ".ejsbrc.json" file in your workspace.If there is no ".ejsbrc.json" file, the contents of Settings will be reflected.Below is a sample of the configurable settings and their default values.

Please refer to Feature Contributions for a description of the items.

.ejsbrc.json
```
{
  "formatting": true,
  "indent_size": 2,
  "indent_char": " ",
  "indent_with_tabs": false,
  "editorconfig": false,
  "eol": "\n",
  "end_with_newline": false,
  "indent_level": 0,
  "preserve_newlines": true,
  "max_preserve_newlines": 5,
  "space_in_paren": false,
  "space_in_empty_paren": false,
  "jslint_happy": false,
  "space_after_anon_function": false,
  "space_after_named_function": false,
  "space_before_conditional": true,
  "brace_style": "collapse",
  "unindent_chained_methods": false,
  "break_chained_methods": false,
  "keep_array_indentation": false,
  "unescape_strings": false,
  "wrap_line_length": 0,
  "e4x": false,
  "comma_first": false,
  "operator_position": "before-newline",
  "indent_empty_lines": false,
  "templating": ["erb", "django", "handlebars", "php"],
  "indent_inner_html": false,
  "indent_body_inner_html": true,
  "indent_head_inner_html": true,
  "indent_handlebars ": true,
  "wrap_attributes": "auto",
  "wrap_attributes_indent_size": 4,
  "extra_liners": "['head', 'body', '/html']",
  "inline": [
    "a",
    "abbr",
    "area",
    "audio",
    "b",
    "bdi",
    "bdo",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "map",
    "mark",
    "math",
    "meter",
    "noscript",
    "object",
    "output",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "select",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "var",
    "video",
    "wbr",
    "text",
    "acronym",
    "big",
    "strike",
    "tt"
  ],
  "void_elements": [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "!doctype",
    "?xml",
    "basefont",
    "isindex"
  ],
  "unformatted": [],
  "content_unformatted": ["pre", "textarea"],
  "unformatted_content_delimiter": "",
  "indent_scripts": "normal"
}
```

