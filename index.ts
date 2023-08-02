import http from 'http'
import express, { Express } from 'express'
import { default as esbuild } from 'esbuild'
import { externalGlobalPlugin } from 'esbuild-plugin-external-global'

export async function setupFrontend(app: Express) {
  const ctx = await esbuild.context({
    entryPoints: [
      'src/index.tsx'
    ],
    outdir: 'static',
    bundle: true,
    logLevel: 'info',
    minify: false,
    sourcemap: true,
    metafile: true,
    target: ["chrome111", "firefox111", "safari16"],
    define: {
      "process.env.NODE_ENV": '"development"'
    },
    plugins: [
      {
        name: 'notify',
        setup(build) {
          build.onEnd(async (result) => {
            if (result.metafile) {
              console.log(await esbuild.analyzeMetafile(result.metafile))
            }
          })
        }
      },
      externalGlobalPlugin({
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
        'react-dom/client': 'window.ReactDOM',
      })
    ]
  })
  ctx.watch()
 
  // Serve static files
  app.use('/dist/react.js', express.static('./node_modules/react/umd/react.development.js'))
  app.use('/dist/react-dom.js', express.static('./node_modules/react-dom/umd/react-dom.development.js'))
  app.use(express.static('static'))
}

const port = process.env.PORT || 7890
const app = express()

setupFrontend(app)
const server = http.createServer(app)
server.listen(port, () => {
  console.log(`» server is running on port ${port}`)
})
