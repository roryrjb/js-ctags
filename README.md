# js-ctags

## Motivation

You know what? I prefer Vim or Emacs over something like VS Code or JetBrains and I prefer `ctags` over LSP any day, if I can get away with it.
Why? Well you can jump to a tag immediately without a server spinning up. You don't have to be in a matching file type. There's much less overhead
and it's instant. LSPs give you a lot more than go-to-definition, but to me that's all a distraction. Give me a compiler or at the very least
a type checker and `ctags` and I can get the job done.

I would even argue that with AI tools like Claude Code that can work outside of "IDE" integration and decouple you from an editor, this approach actually becomes relevant again.

## About

This repo basically contains a `.ctags` file that is compatible and only tested with [__Exuberant CTags__](https://ctags.sourceforge.net/ctags.html). Yes it's _ancient_ at this
point, is no longer maintained but, it still does the job. It relies on regexes to find patterns in code, what could be simpler? This is my maintained
configuration that I use for JavaScript, TypeScript and Vue single file components. It's not 100% perfect, which is why I'm sharing it, because it
will evolve over time as I come across scenarios where the current patterns don't match anything.
