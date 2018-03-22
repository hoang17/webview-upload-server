const express = require('express')
const fileUpload = require('express-fileupload')
var morgan = require('morgan')
var errorHandler = require('errorhandler')
var path = require('path')
var { green } = require('chalk')

const app = express()

var uploadDir = path.join(__dirname, '/upload')

var port = process.env.PORT || 3000
app.set('port', port)
app.use(morgan('dev'))
app.use(errorHandler())
app.use(fileUpload())
app.use(express.static(uploadDir))

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.')

  let sampleFile = req.files.sampleFile
  let fileName = req.files.sampleFile.name

  sampleFile.mv(path.join(uploadDir, fileName), function(err) {
    if (err)
      return res.status(500).send(err)

    res.send(`File uploaded!<p/><a target="_blank" href="/${fileName}">${fileName}</a>`)
  })
})

var server = require('http').Server(app)

server.listen(port, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', green('✓'), port, app.get('env'))
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
