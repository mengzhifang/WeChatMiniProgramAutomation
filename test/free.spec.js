/**
 * 场景：免费落地页活动、无表单、固定海报
 * 用户进入落地页点击立即领取
 */
const automator = require('miniprogram-automator')

let miniProgram
let page

//所有用例执行之前执行
beforeAll(async() => {
    //设置用例步骤的超时时间
    jest.setTimeout(60000)

    // 连接并启动开发者工具
    miniProgram = await automator.launch({
    // cliPath: 'path/to/cli', // 工具 cli 的位置，如果你没有更改过默认安装位置，可以不设置此项
      projectPath: 'D:\\code\\edu-marketing-weapp', // 指定小程序项目路径
    })

    //需通过命令启动开发者工具，如果开发者工具是打开常驻可以使用，可通过 cli 命令行启动开发者工具的自动化功能
    //连接开发者工具
    // miniProgram = await automator.connect({
    //   wsEndpoint: 'ws://localhost:9420'
    // })
})

describe('免费无表单固定海报',() => {
    let ACTIVITY_NAME = '小程序自动化免费无表单'  //活动名称
    let ACTIVITY_ID,USER_ID,POSTER_ID   //活动id，用户id，海报id
    const POSTER_TYPE = 1  //海报类型为固定海报
    let INDEX_PAGE = '/pages/organization/organization'  //打开小程序进入的页面

    //该describe内所有的测试用例执行之前执行
    beforeAll(async() =>{
        page = await miniProgram.reLaunch(INDEX_PAGE)  //打开小程序指定页面
        await page.waitFor(1000) // 设置等待时间
        console.log(INDEX_PAGE)
        
        //获取当前登陆用户的userid
        const storageToken = await miniProgram.callWxMethod('getStorageSync','EDU_MARKETING_USER')
        console.log('storageToken ======================',storageToken)
        USER_ID = storageToken.userId
        console.log('USER_ID======================',USER_ID)

        //获取用户当前选择的机构信息和角色id
        const storageSelectedInfo = await miniProgram.callWxMethod('getStorageSync','SELECTED_INFO')
        console.log('storageSelectedInfo ====================',storageSelectedInfo)

        //获取活动id
        const organizationList = await page.data('organizationList')
        let activityList
        for(let i = 0;i < organizationList.length;i++){
            let organization = organizationList[i]
            if(organization.id == storageSelectedInfo.selected&&organization.role == storageSelectedInfo.role){
                activityList = organization.activities
                break
            }
        }

        for (let i = 0; i < activityList.length; i++) {
            let activity = activityList[i]
      
            if (activity.name.indexOf(ACTIVITY_NAME) !== -1) {
              ACTIVITY_ID = activity.id
              console.log('ACTIVITY_ID=============================',ACTIVITY_ID)
              break
            }
          }

    })

    it('从主页列表选择PC创建的活动，点击活动，进入活动详情页',async() => {
        page = await miniProgram.currentPage()
        const listContanier = await page.$('.list-index--list')
        //获取列表元素集合
        const activitylistData = await listContanier.$$('.list-index--list-item')
        //列表长度大于0
      //  expect(activitylistData.length).toBeGreaterThan(0) 
        for (let i = 0; i < activitylistData.length; i++) {
          let activity = activitylistData[i]
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

      it('活动详情页面校验', async () => {
        page = await miniProgram.currentPage()
    
        const navbar = await page.$('.navbar-index--navbar')
        const activityName = await navbar.$('.navbar-index--title') // 获取活动名称元素
        expect(await activityName.text()).toContain(ACTIVITY_NAME) // 校验活动名称
    
        // 如果指引弹窗存在，则关闭
        const tipModal = await page.$('.tip-modal-index--tip-modal')
        if (tipModal) {
          const tipModalBtn = await page.$('.tip-modal-index--btn')
          page.waitFor(1000)
          await tipModalBtn.tap()
          const iKnowBtn = await page.$('.tips-index--btn')   //获取“我知道了”按钮
          await iKnowBtn.tap()
          await page.waitFor(500)
        }
    
    
        // 获取分享的固定海报 id，用于落地页页面的 scene,sence=活动id-用户id-海报id
        //获取海报id
        const posterList = await page.data('anonymousState__temp3')
        // console.log('posterList ============ ', posterList)
        for (let i = 0; i < posterList.length; i++) {
          let poster = posterList[i]
          let posterId = poster.id
          if (posterId !== -1 && poster.type === POSTER_TYPE) {
            POSTER_ID = posterId
            console.log('POSTER_ID=============================',POSTER_ID)
            break
          }
        }
      })

      it('活动详情页分享固定海报-分享给好友', async () => {
        page = await miniProgram.currentPage()
    
        // const swiperContainer = await page.$('swiper')
        // await swiperContainer.swipeTo(0) // 滑动到固定海报的第一张海报
    
        // await page.waitFor(2000)
        // page = await miniProgram.currentPage()
    
        // 点击分享给好友按钮
        const actionArea = await page.$('.area-index--action-area')
        const actionAreaBtnWrapper = await actionArea.$('.area-index--button-wrapper')
    
        // 判断用户是否已授权用户信息，如果用户授权后，该元素为空。区分一下是因为没授权导致的用例失败，还是代码本身的问题导致的失败
        const getUserInfo = await actionAreaBtnWrapper.$('.area-index--userinfo')
        if (getUserInfo) {
          expect(getUserInfo).toBeNull()  
        }
    
        // const shareBtn = await actionAreaBtnWrapper.$('.area-index--share')
        // await shareBtn.tap()
    
        // 触发转发操作
        await page.callMethod('onShareAppMessage', {
          from: 'button',
        })
      })

      it('进入落地页，点击立即领取',async()=>{
        page = await miniProgram.currentPage()
        // 落地页 scene 值
      //  const scene = ACTIVITY_ID + '-' + USER_ID + '-' + POSTER_ID
        const scene = '1273-8303-1225'
        console.log('landing scene =============== ', scene)
        // 进入落地页页面
        page = await miniProgram.reLaunch('/pages/landing/landing?scene=' + scene)
        await page.waitFor(500)
        // 判断用户是否已授权用户信息,若没有，出现授权弹窗,点击允许
        const authorizeTab = await page.$('.authorize-modal-index--authorize-modal')
      //  if(authorizeTab){
      //      expect(authorizeTab).toBeNull()
            // const authorizeBtn = await page.$('.authorize-modal-index--btn')
            // await authorizeBtn.tap()
            // await page.waitFor(500)
     //   }
        //点击立即领取
        const getIt = await page.$('.landing-card-index--btn-wrapper')
        const getItBtn = await getIt.$('.landing-card-index--btn')
        await getItBtn.tap()
        await page.waitFor(500)
        const  received = await page.$('.receive-modal-index--receive-modal')  //获取已领取奖励弹窗
        const  receivedText = await received.$('.receive-modal-index--title')
        console.log('receiveText=======================================',await receivedText.wxml())
        expect(await receivedText.text()).toContain('您已领取过该奖励')
      })

      // 所有用例执行结束后的清理操作
        afterAll(async () => {
         await miniProgram.close()
        })
    
    

})


