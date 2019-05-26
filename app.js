const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const hashString = 'Hello from IPFS Gateway Checker'

const $results = document.querySelector('#results')

function returnHtmlLink (gateway) {
  let gatewayTitle = gateway.split(hashToTest)[0]
  return '<a title="' + gatewayTitle + '" href="' + gateway + '">' + gateway + '</a>'
}

function addNode (gateway, online, status, roundtripInMs) {
  const para = document.createElement('div')
  let node
  if (online) {
    node = document.createElement('strong')
    node.innerHTML = '✅ - Online  - ' + returnHtmlLink(gateway)
    node.innerHTML += ' (' + roundtripInMs + 'ms)'
  } else {
    node = document.createElement('div')
    node.innerText = '❌ - Offline - ' + gateway
  }
  node.setAttribute('title', status)
  para.appendChild(node)
  $results.appendChild(para)
}

function updateStats (total, checked) {
  document.getElementById('stats').innerText = checked + '/' + total + ' gateways checked'
}

function checkGateways (gateways) {
  const total = gateways.length
  let checked = 0
  gateways.forEach((gateway) => {
    const gatewayAndHash = gateway.replace(':hash', hashToTest)
    // opt-out from gateway redirects done by browser extension
    const testUrl = gatewayAndHash + '#x-ipfs-companion-no-redirect'
    const start = performance.now()
    fetch(testUrl)
      .then(res => res.text())
      .then((text) => {
        const matched = text.trim() === hashString.trim()
        const status = matched ? 'All good' : 'Output did not match expected output'
        const ms = performance.now() - start
        addNode(gatewayAndHash, matched, status, ms);
        checked++
        updateStats(total, checked)
      }).catch((err) => {
        window.err = err
        addNode(gatewayAndHash, false, err)
        checked++
        updateStats(total, checked)
      })
  })
}

const $networks = document.querySelector('#networks')

const pathnameSplited = window.location.href.split("?net=")
fetch("./gateways/network.json")
  .then(res => res.json())
  .then(networks => {
    if (pathnameSplited.length == 1) {
      window.location = pathnameSplited[0] + "?net=" + networks[0]
    } else {
      networks.forEach(network => {
        let a = document.createElement("a")
        a.innerText = network
        if (network == pathnameSplited[1]) {
          a.classList.add("selected")
        } else {
          a.href = pathnameSplited[0] + "?net=" + encodeURI(network)
        }
        $networks.appendChild(a)
        $networks.innerHTML += " "
      })
    }
})
if (pathnameSplited.length == 2) {
  // Decoding then Encoding may looks strange but that a security reason
  fetch("./gateways/" + encodeURI(decodeURI(pathnameSplited[1])) + ".json")
    .then(res => res.json())
    .then(gateways => checkGateways(gateways))
}
