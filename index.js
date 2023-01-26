const express = require('express')
const playwright = require('playwright')
const fs = require('fs')

const app = express()

app.get('/', (req, res) => {
  res.send(
    '<body style="background-color:black; color:white; font-size:24px;"><center style="margin-top: 400px">To use api u need reach /user location and use query nickname=(your nickname) and query server=(your server example euw)</center><br><center>Example: <a href="/user?nickname=Dzu&server=euw" target="_blank">https://apiurl.com/user?nickname=Dzu&server=euw</a></center></body>'
  )
})

app.get('/user', async (req, res) => {
  const nickname = req.query.nickname
  const server = req.query.server

  const browser = await playwright.request.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`https://www.op.gg/summoners/${server}/${nickname}`)

  if (
    server === undefined ||
    server === '' ||
    nickname === undefined ||
    nickname === ''
  ) {
    res.send({
      error: 403,
      message: 'Nickname and server is required'
    })
    return
  }

  const superData = await page.$$eval('body ', elements =>
    elements.map(e => ({
      nickname: e.querySelector('span.summoner-name').innerText,
      rank: e.querySelector('span.ranking').innerText,
      tier: e.querySelector('div.tier').innerText,
      winlose: e.querySelector('div.win-lose').innerText,
      winrate: e.querySelector('div.ratio').innerText
    }))
  )
  res.send({
    user: superData
  })
  console.log(superData)
  await browser.close()
})

app.listen(3000, () => console.log('Listening on port 3000'))
