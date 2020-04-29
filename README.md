# IPFS Video Mirror

Very simple experiment that takes YouTube video URLs, mirrors them to IPFS, then shows you the IPFS Video with IPFS link.

## Install

- make sure you have a recent version of node.js
- start IPFS with default settings or set the `IPFS_URL` environment variable to point to the API URL of an IPFS instance
- install dependencies with `npm install`
- run this with `npm start`

## Usage

The app listes on port `3000` (you can customize this by setting the `PORT` env variable).

Take a youtube link and replace `www.youtube.com` with `localhost:3000` (or whatever port) so it looks like `http://localhost:3000/watch?v=VIDEO_ID_HERE` and open it

After the video is downloaded, you should see the video and an IPFS link to share it. If the video has already been downloaded,
then the process will be instant.

Videos are stored in IPFS MFS under `/youtube`, so you can see them in the Files section of IPFS Desktop for example.