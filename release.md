# To release:

## Automated GitHub Release

- Update version numbers
- Push changes to `release` branch
- Edit the release draft when the assets are ready
- Publish the release

## Snapcraft (for Snap Store)

### First time

- Update version numbers
- You can be on the main branch, or the `release` branch if it's up to date
- Run `sudo snapcraft` to build the snap package
- Push the snap package to the Snap Store using `snapcraft push <snap-file>`
- Perform updates on the Snap dashboard (snapcraft.io/codequill)

### Automated (With GitHub Integration)

- After pushing the first time, you can configure the GitHub integration on the Snap Store dashboard to automatically build on push and update latest/edge
- When you are ready, promote latest/edge to stable on the Snap Store dashboard

## Flatpak

- Create the latest release on GitHub, since this needs to download the assets from GitHub
- Update the `org.codequill.CodeQuill.yml` manifest file
- Run `flatpak-builder --force-clean flatpak-build/ org.codequill.CodeQuill.yml`
- A `.flatpak-builder` directory is created and the package is built in `flatpak-build/`
- Run `flatpak-builder --run flatpak-build/ org.codequill.CodeQuill.yml codequill` to test the app
