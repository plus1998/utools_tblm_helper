async function createAdzone(tbToken, siteId, adzoneName) {
  return new Promise((resolve, reject) => {
    const t = parseInt(new Date().getTime())
    $.post(
      `/openapi/param2/1/gateway.unionpub/record.adzone.create.json?t=${t}&_tb_token_=${tbToken}`,
      {
        tag: '29',
        recordId: siteId,
        reqParams: JSON.stringify({
          adzoneName: adzoneName
        }),
        sceneCode: 'adzone_common'
      },
      function (result) {
        resolve(result)
      }
    )
  })
}

function paddingZero(num, n) {
  num = '' + num
  while (num.length < n) num = '0' + num
  return num
}

pid_generate = async (prefix, tbToken, siteId, count, startIndex) => {
  const pids = []
  let message
  for (let i = 0; i < count; ++i) {
    const adzoneName = `${prefix}_${paddingZero(startIndex + i, 4)}`
    const result = await createAdzone(tbToken, siteId, adzoneName)
    if (result.url) {
      message = '需要验证码，建议10分钟后再尝试'
      console.error(message)
      return { success: false, message, data: pids }
    }
    if (result && result.data) {
      if (result.data.ruleDesc) {
        message = result.data.ruleDesc
        console.error(message)
        return { success: false, message, data: pids }
      }
      else if (result.data.pid) {
        const pid = `${result.data.pid}----${result.data.adzoneName}`;
        pids.push(pid);
        console.log(`%c${pid}`, 'color: #fff; background: green; font-size: 24px;');
      }
      else {
        message = JSON.stringify(result)
        console.error(message)
        return { success: false, message, data: pids }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  return { success: true, data: pids };
}

console.log('%cPID创建函数已注入.', 'color: #fff; background: #f40; font-size: 24px;');