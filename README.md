# CI Traffic Light

[![Actions Status](https://github.com/ownik/ci-traffic-light/workflows/Node%20CI/badge.svg?)](https://github.com/ownik/ci-traffic-light/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/81e0b5303a29abe2cdc9/test_coverage)](https://codeclimate.com/github/ownik/ci-traffic-light/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/81e0b5303a29abe2cdc9/maintainability)](https://codeclimate.com/github/ownik/ci-traffic-light/maintainability)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fownik%2Fci-traffic-light.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fownik%2Fci-traffic-light?ref=badge_shield)

It is very simple web apllication for your ci/cd build system, which can indicate you status of your processes.

## Usage 

1. Download [latest release](https://github.com/ownik/ci-traffic-light/releases/latest) for your operating system.
2. Unpack it.
3. Create setting.json (see the sample below).
4. Run `ci-traffic-light` and open page in browser.

>Web server will be running on port, which you set in settings.json (default port is 8080). You should open this port manually if you want to open this page from other devices.

## Settings file sample

```json
{
  "port": 8080,
  "serverUrl": "http://localhost:8111",
  "auth": {
    "username": "root",
    "password": "123456"
  },
  "branch": "(default:true)",
  "buildTypes": [
    "CiIndicatorTest_Build1",
    "CiIndicatorTest_Build2"
  ],
  "updateStateInterval": 10000
}
```

## Custom events handlers

You can create custom handlers for these events:
- `statusChanged`
- `itemsChanged`

## Supported CI/CD
- [Teamcity](https://www.jetbrains.com/teamcity)

## License

This project is [MIT Licensed](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fownik%2Fci-traffic-light.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fownik%2Fci-traffic-light?ref=badge_large)
