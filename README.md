# bgrand

Simple Background Image Randomizer for Ubuntu >= 20.04

## Installation

```bash
deno task install
```

Then copy the `bgrand.service` file to `~/.config/systemd/user/` and enable it with:

```bash
systemctl --user enable bgrand.service
systemctl --user start bgrand.service
```

This will start the service to change the background image every 15 minutes, you can change the interval by editing the `bgrand.service` file.

## Cli Usage

```bash
bgrand --help
```
