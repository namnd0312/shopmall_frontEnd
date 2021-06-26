export const DynamicHeaderMenuConfig = {
    items: [
        {
            title: 'Trang chủ',
            root: true,
            alignment: 'left',
            page: '/dashboard',
            // translate: 'MENU.DASHBOARD',
        },

        {
            title: 'Giới thiệu',
            root: true,
            alignment: 'left',
            page: '/introduction',
            // translate: 'MENU.DASHBOARD',
        },

        {
          title: 'Danh mục sản phẩm',
          root: true,
          alignment: 'left',
          toggle: 'click',
          page: '',
          submenu: [
            {
              title: 'Sách IT',
              bullet: 'dot',
              icon: 'flaticon-business',
              permission: 'accessToECommerceModule',
              page: '/ecommerce'

            },
            {
              title: 'Sách giáo khoa',
              bullet: 'dot',
              icon: 'flaticon-user',
              page: '/user-management'
            },
            {
              title: 'Sách chuyên ngành KT',
              bullet: 'dot',
              icon: 'flaticon2-list-2',
              page: '/error'


            },
            {
              title: 'Sách cũ',
              bullet: 'dot',
              icon: 'flaticon2-mail-1',
              page: '/wizards'
            }
          ]
        }
    ]
};
