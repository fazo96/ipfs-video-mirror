const fs = require('fs')
const os = require('os')
const path = require('path')
const Koa = require('koa')
const ytdl = require('ytdl-core')
const ipfsClient = require('ipfs-http-client')

async function getVideoMapping(v) {
  try {
    const folder = await ipfs.files.ls('/youtube')
    for await (const file of folder) {
      if (file.name === `${v}.flv`) {
        console.log('FOUND', v, file.cid)
        return file.cid
      }
    }
    return null
  } catch (error) {
    return null
  }
}

const app = new Koa()

const ipfs = ipfsClient(process.env.IPFS_API) // if undefined uses localhost:5001

// This is to reset the "cache" if needed
// ipfs.files.rm('/youtube', { recursive: true }).catch(error => {}) // ignore error

app.use(async (ctx, next) => {
  console.log(ctx.method, ctx.path, ctx.querystring)
  if (ctx.method === 'GET' && ctx.path === '/watch') {
    const { v } = ctx.query
    console.log('Reading', v)
    let cid = await getVideoMapping(v)
    if (!cid) {
      console.log('MISS', v)
      const videoPath = path.join(VIDEOS_PATH, `/${v}.flv`)
      console.log('Downloading', v)
      await ipfs.files.write(`/youtube/${v}.flv`, ytdl(v), { create: true, parents: true })
      cid = await getVideoMapping(v)
      console.log(v, '=> IPFS', cid)
    } else {
      console.log('HIT', v)
    }
    if (cid) {
      console.log('Responding')
      const ipfsUrl = `https://ipfs.io/ipfs/${cid}`
      ctx.response.set('Content-Type', 'text/html')
      ctx.response.body = `
        <body>
          <a href="${ipfsUrl}">${ipfsUrl}</a>
          <br>
          <video controls src="${ipfsUrl}" />
        </body>
      `
      ctx.response.set('X-Ipfs-Path', ipfsUrl)
      ctx.response.status = 200
      // ctx.response.set('Location', ipfsUrl)
      console.log('OK')
    } else {
      ctx.response.status = 500
    }
  } else {
    ctx.response.status = 400
  }
  await next()
})

app.listen(process.env.PORT || 3000)