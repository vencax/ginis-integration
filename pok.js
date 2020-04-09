var soap = require('soap')
const urlPlaintext = 'https://ws.gordic.cz/384/Ssl2/wsdl.ashx'
const urlDigest = 'https://ws.gordic.cz/384/Ssl1/wsdl.ashx'

var wsSecurity = new soap.WSSecurity('DEMO00000001\\test', 'test', {
  passwordType: 'PasswordText',
  hasTimeStamp: true,
  mustUnderstand: true
})

async function run () {
  const opts = {} // { disableCache: true }
  const client = await soap.createClientAsync(urlPlaintext, opts)
  client.setSecurity(wsSecurity)

  const info = client.describe()
  console.log(JSON.stringify(info, null, 2))

  try {
    send(client)
  } catch (err) {
    console.error(err)
  }
}

function send (client) {
  const args = {
    _xml: `<Ws-info xmlns="http://www.gordic.cz/svc/xrg-ssl/v_1.0.0.0">
      <requestXml>
        <Xrg xmlns="http://www.gordic.cz/xrg/ws-info/request/v_1.0.0.0">
          <Ws-info>
            <Typ-pozadavku>kompletni</Typ-pozadavku>
          </Ws-info>
        </Xrg>
      </requestXml>
    </Ws-info>`
  }
  client.SslService.SslPort['Ws-info'](args, (err, res) => {
    if (err) throw err
    console.log(res)
  }, {
    postProcess: function (_xml) {
      // _xml = _xml.replace('DEMO00000001\\test', 'DEMO00000001\\test')
      console.log(_xml)
      return _xml
    }
  })
}

run()
