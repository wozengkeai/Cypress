describe('登陆禅道案例',function(){
    beforeEach(() => {
        cy.visit('http://192.168.100.254:8088/zentao/user-login.html')
        cy.fixture('login.json').as('login')
    } )
    it("登陆案例",function()
    {
        cy.log("读取文件账号" +this.login.username)
        cy.log("读取文件密码" +this.login.password)
        let username = this.login.username
        let password = this.login.password
        //输入用户名
        cy.get('#account').type(username)
            .should('have.value',username)
        //输入密码
        cy.pause()
        cy.get('[name="password"]').type(password)
            .should('have.value',password)
        //提交表单
        cy.get('#submit').click()
        //判断跳转到
        cy.url().should('include','/zentao/my/')
        //and '我的地盘'校验
        cy.get('body').should('contain','我的地盘')
        //存在cookie
        cy.getCookie('zentaosid').should('exist')

    })
})