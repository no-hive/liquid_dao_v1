# Liquid DAO

A shared core for organizations that can evolve.

## Read the whitepaper

**[Read Liquid DAO on the website →](https://no-hive.github.io/liquid_dao_v1/)**

The website contains the complete paper, the original ecosystem diagrams, and the launchpad fork example. Use the theme switch on the website to choose your reading appearance.

## Update the website

`whitepaper.md` is the single source for the paper. Edit it, then rebuild the ready-to-publish page with Node.js 20 or later:

```sh
node scripts/build_site.mjs
```

Commit the updated `whitepaper.md` and generated `index.html` together. The Markdown parser is included in `scripts/vendor/`; no package installation is needed. The website itself is static and does not need Node.js, JavaScript libraries, or a build service to display the paper.

The presentation templates are in `site/`, and the seven original diagrams are stored locally in `assets/diagrams/`. Editorial instructions for future diagrams remain in the Markdown source and are omitted from the published page.

## GitHub Pages

The generated `index.html` is already included. For the existing GitHub Pages site, keep publishing from the repository root on the `main` branch. No deployment workflow or hosting migration is required.

To upload the replacement, extract the archive and replace the old repository contents with the extracted files. Keep `index.html`, `README.md`, `whitepaper.md`, and the other folders at the repository root; do not upload the ZIP itself or put everything inside another enclosing folder. Preserve the repository's GitHub Pages settings.

## Contributing

The concept is open to discussion and further development. Fork the repository to propose improvements to the paper or implementation.

## Typography

The paper uses locally bundled Source Serif 4 and Source Sans 3. Their license notices are included in `assets/fonts/`. Typography overrides are in `site/typography.css`.

## License

[MIT](LICENSE). The bundled Marked parser has its own [MIT notice](scripts/vendor/marked.LICENSE.md).
