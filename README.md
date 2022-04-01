# video-duration

Extract the duration of a video from its metadata.

## Dependencies

0 dependencies.

## Usage

```js
const duration = require('video-duration')

const videoPath = 'path/to/video.mp4'
const vd = new duration(videoPath)
const durationInSeconds = vd.getDuration()
```
