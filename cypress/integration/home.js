describe("登陆后访问首页",function() {
        before( () => {
            cy.login("zengxiaoyan","zxy0502/")
        })
        /*在cypress/support/index.js设置白名单可替代如下代码，省去每一个test前的操作
        beforeEach(() =>{
            //cypress会在每个test前清空cookie，preserveOnce在多个test之间保留cookie
            Cypress.Cookies.preserveOnce('zentaosid','windowWidth','windowHeight')
        })
        */
        it("访问首页",() =>
        {
            cy.visit("http://192.168.100.254:8088/zentao/my/")
            cy.url().should("include","/zentao/my/")
            cy.title().should("contain","我的地盘")
        })
        it("访问产品页",() =>
        {
            cy.visit("http://192.168.100.254:8088/zentao/product/")
            cy.url().should("include","/zentao/product/")
            cy.title().should("contain","产品")
        })
})