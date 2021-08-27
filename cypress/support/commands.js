// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

// 公共用例，只需要执行一次
Cypress.Commands.add(
  "login_request",
  (uesrname = "13700000001", password = "123456") => {
    // function get_secret(url){
    //     urllist = url.split('code=',1)
    //     code = urllist[1]
    //     de_code = decodeURIComponent(code)
    //     return de_code
    // }
    cy.request({
      url:
        "https://suplus-business-admin-gateway-test.fjmaimaimai.com/auth/pwdLogin",
      method: "POST",
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        authority: "suplus-business-admin-gateway-test.fjmaimaimai.com",
      },
      body: {
        username: "13700000001",
        password: "7c4a8d09ca3762af61e59520943dc26494f8941b",
      },
    })
      .its("body")
      .as("resp_login")
      .then(function () {
        expect(this.resp_login.code).to.eq(0);
        expect(this.resp_login.msg).to.contain("ok");
        //存入localStorage
        window.localStorage.setItem(
          "jwt",
          "Bearer " + this.resp_login.data.access.token
        );
      });
    cy.window().then((window) => {
      cy.request({
        url:
          "https://suplus-business-admin-gateway-test.fjmaimaimai.com/auth/anonymousLogin",
        method: "POST",
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
          authority: "suplus-business-admin-gateway-test.fjmaimaimai.com",
          authorization: window.localStorage.getItem("jwt"),
        },
        body: {
          companyId: "359",
        },
      })
        .its("body")
        .as("resp")
        .then(function () {
          // console.log(get.headers)
          window.localStorage.setItem(
            "token",
            "Bearer " + this.resp.data.access.token
          );
          // const auth1 = "Bearer " + auth
          // cy.get(auth)
          expect(this.resp.msg).to.contain("ok");
          // cy.get(require)
        });
    });
    cy.window().then((window) => {
      cy.request({
        url:
          "https://suplus-business-admin-gateway-test.fjmaimaimai.com/companies/userCompamies",
        method: "POST",
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
          authorization: window.localStorage.getItem("token"),
        },
      })
        .its("body")
        .as("comp")
        .then(function () {
          expect(this.comp.msg).to.contain("ok");
          const company = this.comp.data.company[0];
          window.localStorage.setItem("userCompany", JSON.stringify(company)); //取JSON.parse(localStorage.getItem("userInfo"))
        });
    });
    cy.window().then((window) => {
      cy.request({
        url:
          "https://suplus-business-admin-gateway-test.fjmaimaimai.com/auth/getSingleLoginMenus",
        method: "POST",
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
          authorization: window.localStorage.getItem("token"),
        },
      })
        .its("body")
        .as("secret")
        .then(function () {
          // expect(this.secret.code).to.eq(0)
          expect(this.secret.msg).to.contain("ok");
          const url = this.secret.data.list[0].url;
          const urllist = url.split("code=");
          const code = urllist[1];
          const de_code = decodeURIComponent(code);
          window.localStorage.setItem("secretid", de_code);
        });
    });
    cy.window().then((window) => {
      cy.request({
        url: "https://suplus-web-gateway-test.fjmaimaimai.com/auth/login",
        method: "POST",
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
          authorization: window.localStorage.getItem("token"),
        },
        body: {
          secret: window.localStorage.getItem("secretid"),
        },
      })
        .its("body")
        .as("loginresp")
        .then(function () {
          expect(this.loginresp.msg).to.contain("ok");
          const { user, permissions, menus } = this.loginresp.data;
          const authorized = this.loginresp.data.access.token;
          window.localStorage.setItem("access-token-authorized", authorized);
          // window.localStorage.setItem('systemOriginalMenus',JSON.stringify(this.loginresp.data.menus))
          // window.localStorage.setItem('userPermission',JSON.stringify(this.loginresp.data.permissions))
          // window.localStorage.setItem('userInfo',JSON.stringify(this.loginresp.data.user))
          // window.localStorage.setItem('userAvailableMenus',JSON.stringify(this.loginresp.data.menus))

          // user
          window.localStorage.setItem("userInfo", JSON.stringify(user));

          // company
          window.localStorage.setItem(
            "userCompany",
            JSON.stringify(findCompany(user))
          );

          //permissions
          window.localStorage.setItem(
            "userPermission",
            JSON.stringify(permissions)
          );

          // systemOriginalMenus
          window.localStorage.setItem(
            "systemOriginalMenus",
            JSON.stringify(menus)
          );

          // userAvailableMenus
          const usermenu = roleFilter(menus, window);
          window.localStorage.setItem(
            "userAvailableMenus",
            JSON.stringify(usermenu)
          );

          // userSlaveMenus & userMasterMenus
          const _menus = split(usermenu, window);
          for (const m in _menus) {
            window.localStorage.setItem(m, JSON.stringify(_menus[m]));
          }
        });
    });
  }
);

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/zentao/user-login.html");
  //输入用户名
  cy.get("#account").type(username).should("have.value", username);
  //输入密码
  cy.get('[name="password"]').type(password).should("have.value", password);
  //提交表单
  cy.get("#submit").click();
  //判断跳转到
  cy.url().should("include", "/zentao/my/");
  //and '我的地盘'校验
  cy.get("body").should("contain", "我的地盘");
  //存在cookie
  cy.getCookie("zentaosid").should("exist");
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function findCompany(user) {
  if (
    !user ||
    !Object.keys(user).length ||
    !user.companys ||
    !user.companys.length
  )
    return {};
  const ACTIVE_COMPANY = 1;
  return user.companys.find((val) => val.type === ACTIVE_COMPANY);
}

function tree2list(tree) {
  if (!tree || !tree.length) return [];
  const list = [];

  const push = function (item) {
    if (item && Object.keys(item).length) {
      const fresh = {};
      // cut 'children' property out
      const props = Object.keys(item).filter((val) => val !== "children");
      props.forEach((val) => {
        fresh[val] = item[val];
      });
      list.push(fresh);
    }
  };

  const collectItem = function (items) {
    if (items && items.length) {
      items.forEach((val) => {
        if (val && Object.keys(val).length) push(val);
        if (val.children && val.children.length) {
          collectItem(val.children);
        }
      });
    }
  };
  collectItem(tree);

  return list;
}

function roleFilter(list, window) {
  const user = JSON.parse(window.localStorage.getItem("userInfo"));
  if (user && Object.keys(user).length) {
    const invisible = ["ENTERPRISE_ADDRESS_BOOK"];
    const visible = list.filter((val) => !invisible.includes(val.code));
    if (user.adminType === 1 || user.adminType === 2) return visible;
    else {
      if (visible && visible.length) {
        const adminMenuItems = ["ENTERPRISE_ADMIN"];
        return visible.filter((val) => {
          return !adminMenuItems.includes(val.code);
        });
      } else return [];
    }
  } else return list;
}

function split(list, window) {
  if (list && list.length) {
    const needCutChild = "WORKBENCH";
    const theMenuItem = list.find((val) => val.code === needCutChild);
    if (theMenuItem && Object.keys(theMenuItem).length) {
      const fullMenus = tree2list(
        menuRuleCalculation(new Menu(list, 0, "id", "parentId").nodes())
      );
      // calculate menu status as workbench menu data
      const submenu = new Menu(fullMenus, theMenuItem.id, "id", "parentId");
      // const calculated = menuRuleCalculation(submenu.nodes());
      // Cache.set(constants.keys.slaveMenu, tree2list(calculated));
      const user = JSON.parse(window.localStorage.getItem("userInfo"));
      const notAdmin = ["WORKBENCH", "TASK", "ADDRESS_BOOK"];
      const ALLOW = 1;
      // cut workbench child nodes out and filter not permission nodes in enterprise set
      const cut = fullMenus
        .filter((val) => val.parentId !== theMenuItem.id)
        .filter((val) => {
          if (notAdmin.includes(val.code)) {
            return true;
          } else {
            return val.status === ALLOW;
          }
        });

      let masterMenus = new Menu(cut, 0, "id", "parentId").flat();
      // regular user(not admin)
      if (
        user &&
        Object.keys(user).length &&
        user.adminType !== 1 &&
        user.adminType !== 2
      ) {
        masterMenus = masterMenus.filter((val) => notAdmin.includes(val.code));
      }
      return {
        userSlaveMenus: submenu.flat(),
        userMasterMenus: masterMenus,
      };
    }
  }
}

function menuRuleCalculation(list) {
  if (!list || !list.length) return [];
  const ENABLED = 1;
  const DISABLED = 0;

  const nodeRule = function (node) {
    if (!node || !Object.keys(node).length) return DISABLED;
    if ("children" in node && node.children.length) {
      node.children.forEach((val) => {
        val.status = nodeRule(val);
      });

      return node.children.some((val) => val.status === ENABLED)
        ? ENABLED
        : DISABLED;
    } else {
      return node.status;
    }
  };

  const tree = JSON.parse(JSON.stringify(list));
  tree.forEach((val) => {
    val.status = nodeRule(val);
  });

  return tree;
}

class Tree {
  constructor(list, root, id, pid) {
    this.list = [];

    this.idField = id || "id";
    this.pIdField = pid || "pid";
    this.root = typeof root !== "undefined" ? root : 0;

    this.treeNodes = this.build(list);
  }

  /**
   * convert list to tree data format
   *
   * @param list
   * @returns {*}
   */
  build(list) {
    if (!list || !list.length) return;
    const organized = [];
    const fill = (items) => {
      items.forEach((value) => {
        const sub = list
          .filter((val) => val[this.pIdField] === value[this.idField])
          .map((val) => {
            // val.path = `${value.path}-${val.id}`;
            organized.push(val);
            return val;
          });
        if (sub && sub.length) {
          fill(sub);
          value.children = sub;
        }
      });
    };

    const rootNodes = list
      .filter((val) => val[this.pIdField] === this.root)
      .map((val) => {
        // val.path = String(val.id);
        organized.push(val);
        return val;
      });

    fill(rootNodes);
    this.list = organized;

    return rootNodes;
  }

  /**
   * tree format data
   *
   * [
   *     {a:1, b:2, c:3, children: [{...},{...}]}
   * ]
   *
   * @returns {*}
   */
  nodes() {
    return this.treeNodes;
  }

  flat() {
    return this.list.map(({ children, ...attrs }) => attrs);
  }

  findById(id) {
    if (!this.list.length) return null;
    return this.list.find((val) => val[this.idField] === id);
  }

  findByCodes(codes) {
    return codes.map((val) => {
      return this.list.find((value) => value.code === val);
    });
  }

  /**
   * use code to find the module full path
   *
   * @param code
   * @returns {null|Array}
   */
  getFullPathByCode(code) {
    if (!code) return null;
    const path = [];
    const current = this.list.find((val) => val.code === code);
    if (current && Object.keys(current).length) {
      path.push(current);

      const findParent = (item) => {
        if (item && Object.keys(item).length) {
          const pid = item[this.pIdField];
          if (typeof pid !== "undefined") {
            const parent = this.list.find((val) => val[this.idField] === pid);
            if (parent && Object.keys(parent).length) {
              path.unshift(parent);
              if (parent[this.pIdField] !== this.root) findParent(parent);
            }
          }
        }
      };

      findParent(current);
    }
    return path;
  }
}

class Menu extends Tree {
  // eslint-disable-next-line no-useless-constructor
  constructor(list, root, id, pid) {
    super(list, root, id, pid);
  }

  /**
   * convert list to menu data format
   *
   * @param list
   * @returns {*}
   */
  build(list) {
    if (!list || !list.length) return;
    const organized = [];
    const fill = (items) => {
      items.forEach((value) => {
        const sub = list
          .filter((val) => val[this.pIdField] === value[this.idField])
          .map((val) => {
            val.path = `${value.path}-${val[this.idField]}`;
            organized.push(val);
            return val;
          });
        if (sub && sub.length) {
          fill(sub);
          value.children = sub;
        }
      });
    };

    const rootNodes = list
      .filter((val) => val[this.pIdField] === this.root)
      .map((val) => {
        val.path = String(val[this.idField]);
        organized.push(val);
        return val;
      });

    fill(rootNodes);
    this.list = organized;

    return rootNodes;
  }
}
