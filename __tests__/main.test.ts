const path = require('path')
import { VideoDuration } from '../src/videoDuration'

const fileMp4 = path.join(__dirname, 'test.mp4')

test('Contructor', () => {
  const videoInfo = new VideoDuration(fileMp4)
  expect(videoInfo).toBeInstanceOf(VideoDuration)
  expect(videoInfo.path).toBe(fileMp4)
})

test('mp4', async () => {
  const videoInfo = new VideoDuration(fileMp4)
  expect(await videoInfo.isMp4()).toBe(true)
  expect(await videoInfo.getDuration()).toBe(17066)
})

test('not-supported', async () => {
  const videoInfo = new VideoDuration(path.join(__dirname, 'test.txt'))
  expect(await videoInfo.isMp4()).toBe(false)
  expect(async () => await videoInfo.getDuration()).rejects.toThrow(
    'Only mp4 files are supported'
  )
})
