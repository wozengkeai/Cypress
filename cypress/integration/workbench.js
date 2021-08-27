describe('访问工作台',function () {
    before(function () {
        cy.login_request()
    })

    it('访问工作台',function () {
        cy.visit('http://suplus-front-dev.fjmaimaimai.com/#/workbench')
        // cy.url().should('include','workbench')
        cy.url().should('include','workbench')
    })
})