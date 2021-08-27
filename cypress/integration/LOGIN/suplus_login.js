import {suplusLoginUser} from "./suplus_login.data";

describe("企业平台登录",function () {
    context('素+平台登录测试',function () {
        for(const user of suplusLoginUser){
            it(user.summary, function () {
                cy.visit("/#/login")
                //选择密码登录
                cy.get('#tab-pwd').click()
                //:nth-child(n)选择器，匹配其父元素的第n个子元素，不论类型，右键copy-copy selector
                cy.get('#pane-pwd > form > div:nth-child(1) > div > div > input')
                    .type(user.username)
                cy.get('#pane-pwd > form > div:nth-child(2) > div > div > input')
                    .type(user.password)
                cy.get('#pane-pwd > form > div:nth-child(4) > div > button > span')
                    .click()
                // 选择公司
                cy.get('[style="cursor: pointer;"]')
                    .click()
                cy.url().should("contain",'/workbench')
                // cy.getCookie('jsessionid').should('exist')
                cy.get('ul').should("contain",'工作台')

    });
        }
    })

})