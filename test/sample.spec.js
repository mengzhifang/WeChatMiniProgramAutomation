/**
 * 场景：免费落地页活动、无表单、固定海报
 * 用户进入落地页点击立即领取
 */
const automator = require('miniprogram-automator')
 
// 测试用例集描述
describe('免费无表单固定海报', () => {
  let miniProgram
  let page
 
  // 所有用例执行前的初始化操作
  beforeAll(async () => {
    // jest.setTimeout(50000)
    // 连接并启动开发者工具
    miniProgram = await automator.launch({
    // cliPath: 'path/to/cli', // 工具 cli 的位置，如果你没有更改过默认安装位置，可以不设置此项
      projectPath: 'D:\\code\\edu-marketing-weapp', // 指定小程序项目路径
    })

    // miniProgram = await automator.connect({
    //   wsEndpoint: 'ws://localhost:9420'
    // })
    // console.log('miniProgram ======================= ', miniProgram)
 
    // 启动小程序后打开的页面
    page = await miniProgram.reLaunch('/pages/organization/organization')
    await page.waitFor(1000) // 设置等待时间
  }, 60000)

 
  // 测试用例
  it.skip('进入到管理员主页', async () => {
    // 获取页面元素并利用 expect 断言进行校验
    //通过.navbar-index--title选择器获取目标元素
    //获取当前页面（可能由于未知原因，当前页面没有刷新出来，因此需要重新获取）
    const organizationName = await page.$('.navbar-index--title')
    //目标元素应该包含有“哈哈测试”的文本
    expect(await organizationName.text()).toContain('哈哈测试')
   
  })

  //mengzhf
  // const item = (await page.$$('.list-index--list-item'))[0]
  it.skip('从主页列表选择PC创建的活动，点击活动，进入活动详情页',async() => {
    const listContanier = await page.$('.list-index--list')
    //获取列表元素集合
    const listData = await listContanier.$$('.list-index--list-item')
    //列表长度大于0
    expect(listData.length).toBeGreaterThan(0) 
    for (let i = 0; i < listData.length; i++) {
      let activity = listData[i]
      let name = await activity.$('.list-index--item-name')
      console.log('name ==================== ', await name.text())
  // expect(await activity.text()).toMatch(/小程序自动化/)
  // break
      if (((await name.text()).search("免费无表单"))!= -1) {
       await name.tap()
       await page.waitFor(500)
       expect((await miniProgram.currentPage()).path).toBe('pages/activity/activity')
       
      }
   }

  })

  it.skip('生成专属海报,分享给好友',async() => {
    page = await miniProgram.currentPage()
    const proPoster = await page.$('.tip-modal-index--tip-modal')
    const proPosterBtn = await page.$('.tip-modal-index--btn')
    console.log('proPosterBtn =======================================',await proPosterBtn.text())
    if(((await proPosterBtn.text()).search('立即生成专属海报'))!=-1){
      await proPosterBtn.tap()
      await page.waitFor(500)
      const iKnowBtn = await page.$('.tips-index--btn')
      await proPosterBtn.tap()
      await page.waitFor(500)
    }
    //分享给好友，直接调用小程序分享的方法
    await page.callMethod('onShareAppMessage',{
      from:'button'
    })
   
  })
    
  it.skip('点击分享给好友---测试分享按钮',async() => {
    page = await miniProgram.currentPage()
    const sharebutton  = await page.$('.area-index--share')
//  console.log(await sharebutton.wxml());
//  console.log('button ================================== ', await sharebutton.text())
// 判断按钮显示内容
    expect(await sharebutton.wxml()).toContain('分享给好友')
    await sharebutton.tap()
    await page.waitFor(500)

  })
  
  
   it.skip('已分享给好友',async() => {
     page = await miniProgram.currentPage()
     const shareSucc = await page.$('subscribe-modal-index--text')
     expect(await shareSucc.text()).toContain('已分享给好友')
   })
   
// 所有用例执行结束后的清理操作
  afterAll(async () => {
    await miniProgram.close()
  })


  })
 
  



