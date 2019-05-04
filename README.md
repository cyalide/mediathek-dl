# mediathek-dl

**Current stage:** unusable

This tool downloads all videos matching specific keywords from public German media libraries using the [MediathekViewWeb](https://mediathekviewweb.de) API.

## Usage
To try out the utility, modify your `config.json` file and run `npm run dev`.
The utility will save the videos to the `./dl` directory.
The tool will also create an `archive.json` file containing a list of all already downloaded videos.

### Environment variables
**ARCHIVE** - set custom path for `archive.json`

**DLDIR** - set custom download directory

**CONF** - set custom path for `config.json`

## TODO
- Error handling
- Configuring and running unit tests
- Show progress
- Improve `archive.json` handling
