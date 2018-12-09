OrgCSS - Stylesheet for Org-exported HTML
=========================================

## Table of Contents

- [Usage](#usage)
- [Caveats](#caveats)
- [Code Highlight](#code-highlight)
- [Related](#related)

## Usage

Add the following setup to your org file to use the stylesheet.

```org
#+HTML_HEAD: <link rel="stylesheet" type="text/css" href="https://gongzhitaao.org/orgcss/org.css"/>
```

## Caveats

As the [Orgmode](http://orgmode.org/) is frequently updated, the structure of
the exported source code is changed drastically.  As a result, I added tags
(since Orgmode v9.1.4) to indicate the corresponding Orgmode version.

## Code Highlight

When exported to HTML, there are three options for code highlighting, controlled
by the variable `org-html-htmlize-output-type`.

1. `(setq org-html-htmlize-output-type 'inline-css)`

   This is the default setting.  It highlights the code according to the current
   Emacs theme you are using.  It directly applies color to the code with inline
   styles, e.g., ~<span style="color: 0x000000">int</span>~.

   The problem is that the highlight theme depends on the Emacs theme.  If you
   use a dark theme in your Emacs but a light theme (usually we like light
   themed web pages) web pages, the exported code are hardly illegible due to
   the light font color, or vice versa.

2. `(setq org-html-htmlize-output-type nil)`

   This configuration disables highlighting by ~htmlize~.  You may use a
   third-party Javascript highlight library.  I recommend [highlight.js](https://highlightjs.org/) if I
   need code highlight.  There are two problems:
   1. The problem is that you have to rely on highlight.js support on a certain
      language which is occasionally missing, e.g., `emacs-lisp`, `org`, etc.
   2. `highlight.js` by default does not recognized the tags and classes
      exported by org mode.  You need some extra Javascript code in your
      Org file.

3. `(setq org-html-htmlize-output-type 'css)`

    This is my preferred way.  If you use my org.css, then set this option in
    your init file and you are all set.

    This is similar to the first optional, instead of using inline styles, this
    will assign classes to each component of the code, e.g., `<span
    class="org-type">int</span>`, and you could create your own stylesheet for
    `.org-type`.

    To obtain a list of all supported org classes, run <kbd>M-x
    org-html-htmlize-generate-css</kbd>.  This will create a buffer containing
    all the available org style class names in the current Emacs session (refer
    to [src/css/_htmlize.css](src/css/_htmlize.css) for an example).

## Related

The CSS classes used by `ox-html` are documented [here](http://orgmode.org/manual/CSS-support.html).

1. [fniessen/org-html-themes](https://github.com/fniessen/org-html-themes)
2. [mowen/gist326524](https://gist.github.com/mowen/326524)
3. [Web Pages Made with Org-Mode](http://orgmode.org/worg/org-web.html)
4. [thomasf/solarized-css](https://github.com/thomasf/solarized-cs)
5. [org-spec](http://demo.thi.ng/org-spec/)
6. [Organize Your Life In Plain Text!](http://doc.norang.ca/org-mode.html)
