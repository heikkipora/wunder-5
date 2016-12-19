'use strict'

const fs = require('fs')
const PNG = require('pngjs2').PNG

const START_UP = rgb(7, 84, 19)
const START_LEFT = rgb(139, 57, 137)
const STOP = rgb(51, 69, 169)
const TURN_RIGHT = rgb(182, 149, 72)
const TURN_LEFT = rgb(123, 131, 154)

fs.createReadStream('image.png')
  .pipe(new PNG())
  .on('parsed', function() {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          drawPath(x, y, this.width, this.height, this.data)
        }
    }
    console.log("Writing output file at 'message.png'")
    this.pack().pipe(fs.createWriteStream('message.png'))
  })

function drawPath(x, y, width, height, data) {
  var deltaX = 0
  var deltaY = 0
  var drawing = false

  do {
    let index = (width * y + x) << 2
    const color = rgb(data[index], data[index + 1], data[index + 2])

    switch (color) {
      case START_UP:
        drawing = true
        deltaX = 0
        deltaY = -1
        break;
      case START_LEFT:
        drawing = true
        deltaX = -1
        deltaY = 0
        break;
      case STOP:
        plotIfDrawing(data, index, drawing)
        drawing = false
        break;
      case TURN_RIGHT:
        var swapX = -deltaY
        var swapY = deltaX
        deltaX = swapX
        deltaY = swapY
        break;
      case TURN_LEFT:
        var swapX = deltaY
        var swapY = -deltaX
        deltaX = swapX
        deltaY = swapY
        break;
      default:
    }

    plotIfDrawing(data, index, drawing)

    x += deltaX
    y += deltaY
  }
  while (x >= 0 && x < width && y >= 0 && y < height && drawing)
}

function plotIfDrawing(data, index, drawing) {
  if (drawing) {
    data[index] = 0
    data[index + 1] = 0
    data[index + 2] = 0
    data[index + 3] = 0xff
  }
}

function rgb(r, g, b) {
  return r << 16 | g << 8 | b
}
