const fs = require('fs').promises

const magicNumbers = {
  mp4: [0x66, 0x74, 0x79, 0x70],
  webm: [0x1a, 0x45, 0xdf, 0xa3],
  mkv: [0x1a, 0x45, 0xdf, 0xa3],
  mpeg: [0x00, 0x00, 0x01, 0xb3],
  mpg: [0x00, 0x00, 0x01, 0xb3],
  avi: [0x52, 0x49, 0x46, 0x46],
  m4a: [0x4d, 0x54, 0x68, 0x64],
  m4v: [0x4d, 0x54, 0x68, 0x64],
  mov: [0x66, 0x72, 0x65, 0x65],
}

export class VideoDuration {
  private _path: string

  constructor(path: string) {
    this._path = path
  }

  // getters
  public get path(): string {
    return this._path
  }

  // methods
  // returns duration in milliseconds
  public async getDuration(): Promise<number> {
    // we only support mp4 files for now
    if (!(await this.isMp4())) {
      throw new Error('Only mp4 files are supported')
    }

    const buff = Buffer.alloc(200)
    const header = Buffer.from('mvhd')
    const file = await fs.open(this._path, 'r')
    const { buffer } = await file.read(buff, 0, 200, 0)
    await file.close()

    const start = buffer.indexOf(header) + 17
    // A time value that indicates the time scale for this movie—that is, the number
    // of time units that pass per second in its time coordinate system.
    // A time coordinate system that measures time in sixtieths of a second,
    // for example, has a time scale of 60.
    const timeScale = buffer.readUInt32BE(start)
    // A time value that indicates the duration of the movie in time scale units.
    // Note that this property is derived from the movie’s tracks.
    // The value of this field corresponds to the duration of the longest track in the movie.
    const duration = buffer.readUInt32BE(start + 4)
    // duration in second
    const durationInSeconds = Math.floor((duration / timeScale) * 1000)
    return durationInSeconds
  }

  // checks if file is mp4
  public async isMp4(): Promise<boolean> {
    return (await this.getFileType()) === 'mp4'
  }

  // returns file type
  public async getFileType(): Promise<string> {
    const buff = Buffer.alloc(50)
    const file = await fs.open(this._path, 'r')
    const { buffer } = await file.read(buff, 0, 50, 0)
    await file.close()

    for (const key in magicNumbers) {
      const sig = Buffer.from(magicNumbers[key])
      if (buffer.indexOf(sig) !== -1) {
        return key
      }
    }
    return 'unknown'
  }
}
