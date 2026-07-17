# ssvnauka.net

Professional website for Prof. Sergiy Valentinovich Sushkov — surgeon, oncologist, scientist, and educator.

## Structure

- Root pages: English homepage and clinic page
- Localized pages: [ru](ru/) and [uk](uk/)
- Static assets: [assets](assets/)

## Local preview

Open the site directly in a browser from the repository root, or serve it locally with:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Deployment

The repository is configured for GitHub Pages deployment via GitHub Actions.

- Push to the main branch
- GitHub Actions will publish the site automatically
- The workflow file is [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

## Notes

- The site is fully static and does not require a build step.
- The file [.nojekyll](.nojekyll) is included to ensure assets are served correctly on GitHub Pages.
