# Release and Distribution Strategy

## GitHub Releases versus source repository

Keep source, skill instructions, docs, and GitHub automation in the repository. Publish tested desktop and mobile application builds as **GitHub Release assets**, not as large binaries committed to the Git history. Create a release tag such as `v0.1.0` for the app; skill version and app version may be different and should be documented independently.

## Release asset checklist

| Target | Example filename (illustrative, not an existing file) | Verification |
|---|---|---|
| macOS Apple Silicon | `SCENECUTTER-macos-arm64.dmg` | macOS version, Apple Silicon support, signing/notarization status |
| macOS Intel | `SCENECUTTER-macos-x64.dmg` | Publish only if tested and supported |
| Windows | `SCENECUTTER-windows-x64-setup.exe` | Publish only if built and tested |
| Android | `SCENECUTTER-android.apk` | Android minimum version, signing, permissions, install steps |
| iOS | Distribution channel and installation instructions | A normal GitHub `.ipa` is not a universal install path; explain signing/TestFlight/App Store constraints |

Only include targets for which working builds exist. Development on a MacBook does not imply that Windows, Android, or iOS binaries already exist.

## Before publishing an app release

- Verify app name and version inside each build.
- Install and smoke-test on the intended device/OS.
- Test import/paste of source timestamp ranges and an actual short editing workflow.
- Document minimum OS requirements, supported architectures, permissions, and storage needs.
- Publish SHA-256 checksums for each asset.
- Add release notes with features, known limitations, and breaking changes.
- Sign/notarize packages where applicable; clearly disclose when unsigned.
- Avoid uploading copyrighted movie footage, sample movie files, API keys, or user transcripts.

## User onboarding

README should explain two separate steps: (1) install/invoke the Agent Skill on a supported host, (2) download/install the SCENECUTTER app from a published GitHub Release if one exists. Installing one does not automatically install the other.

## Example release note template

```markdown
# SCENECUTTER vX.Y.Z

## Downloads
- macOS: [actual asset once published]
- Android: [actual asset once published]

## What's new
- [tested feature]

## System requirements
- [verified requirements]

## Known limitations
- [verified limitations]

## Integrity
- [SHA-256 checksums]
```
