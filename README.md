[![Version](https://img.shields.io/github/v/release/Screenly/simple-timer-app)](https://github.com/Screenly/simple-timer-app/releases/latest)

# Screenly Simple Timer App

![Simple Timer App Preview](/screenshots/1920x1080.webp)

## Getting Started

```bash
bun install
```

## Deployment

Create and deploy the Edge App:

```bash
screenly edge-app create --name my-simple-timer --in-place
bun run deploy
screenly edge-app instance create
```

### Releasing

Pushes to `main` deploy to stage automatically. To release to production, tag a commit on `main` and push the tag (the workflow refuses tags not on `main`):

```bash
git checkout main && git pull
git tag v26.10.0
git push origin v26.10.0
```

Then publish a GitHub Release whose notes list the pull requests merged since the previous release. Add `--draft` to review the notes before publishing:

```bash
gh release create v26.10.0 --verify-tag --generate-notes --title v26.10.0
```

## Configuration

The app accepts the following settings via `screenly.yml`:

| Setting             | Description                                                                                                                                                   | Type               | Default |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- |
| `display_errors`    | Display detailed error messages on screen for debugging purposes                                                                                              | optional, advanced | `false` |
| `duration`          | Timer duration in seconds (e.g., 60 for 1 minute, 300 for 5 minutes, 3600 for 1 hour)                                                                         | required           | `60`    |
| `override_locale`   | Override the default locale with a supported language code (e.g., en, fr, de). Defaults to English if not specified                                           | optional           | `en`    |
| `override_timezone` | Override the default timezone with a supported timezone identifier (e.g., `Europe/London`, `America/New_York`). Defaults to the system timezone if left blank | optional           | -       |

## Development

```bash
bun install      # Install dependencies
bun run dev      # Start development server
```

## Testing

```bash
bun test
```

## Screenshots

Generate screenshots at all supported resolutions:

```bash
bun run screenshots
```

Screenshots are saved to the `screenshots/` directory.
