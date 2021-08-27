/*
describe声明一个测试用例集
beforeEach测试用例前置操作，相当于setup
it声明一个测试用例
cy.get定位元素
type输入文本
should断言，have.value是元素的value值
clear清空文本
*/


describe('第一个hello world脚本从百度开始', function() {
    beforeEach(() => {
          cy.visit('https://www.baidu.com')
        })
      it("百度输入框功能", function()
      {
          cy.get('#kw').type('yoyo')
              .should('have.value', 'yoyo')
              .clear()
              .should('have.value', '')
          })
    })
