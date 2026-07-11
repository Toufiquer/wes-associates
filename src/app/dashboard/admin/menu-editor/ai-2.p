Look at the file
Client UI:
'src/components/common/Menu/BrandSettings.tsx',
'src/components/common/Menu/CartMenuLink.tsx',
'src/components/common/Menu/MenuClient.tsx',
'src/components/common/Menu/MenuWithSession.tsx',
'src/components/common/Menu/MobileBottomMenu.tsx',
'src/components/common/Menu/MobileMainMenu.tsx',
'src/components/common/Menu/SearchMenuButton.tsx',
'src/components/common/Menu/TopBanner.tsx',


Admin UI:
'src/app/dashboard/admin/menu-editor/BrandSettingsEditor.tsx',
'src/app/dashboard/admin/menu-editor/CartIconEditor.tsx',
'src/app/dashboard/admin/menu-editor/MobileFooterMenuEditor.tsx',
'src/app/dashboard/admin/menu-editor/MobileMainMenuEditor.tsx',
'src/app/dashboard/admin/menu-editor/page.tsx',
'src/app/dashboard/admin/menu-editor/SearchIconEditor.tsx',
'src/app/dashboard/admin/menu-editor/TopBannerEditor.tsx',

api: 
'src/app/api/menu-editor/controller.ts'
'src/app/api/menu-editor/model.ts'
'src/app/api/menu-editor/route.ts'

'src/app/api/brand-settings/controller.ts'
'src/app/api/brand-settings/model.ts'
'src/app/api/brand-settings/route.ts'

I want to saparage the file for better understanding. Now please seaparate it as the following instructions.
* I will give you name and path. you will generate file if need and remove code if need. 

1. PrimaryMenuEditor.tsx [change name from BrandSettingsEditor to PrimaryMenuEditor]
    Admin   - 'src/app/dashboard/admin/menu-editor/PrimaryMenuEditor.tsx', [change name from BrandSettingsEditor to PrimaryMenuEditor]
    Client  - 'src/components/common/Menu/PrimaryMenu.tsx', [change name from BrandSettings to PrimaryMenu] [move code from MenuClient, and render it inside MenuClient]
    api     - 'src/app/api/menu/primary-menu/controller.ts'
              'src/app/api/menu/primary-menu/model.ts'
              'src/app/api/menu/primary-menu/route.ts'

2. CartLinkEditor.tsx
    Admin   - 'src/app/dashboard/admin/menu-editor/CartLinkEditor.tsx',
    Client  - 'src/components/common/Menu/CartLink.tsx',
    api     - 'src/app/api/menu/cart-link/controller.ts'
              'src/app/api/menu/cart-link/model.ts'
              'src/app/api/menu/cart-link/route.ts'

3. MobileBottomMenuEditor.tsx
    Admin   - 'src/app/dashboard/admin/menu-editor/MobileBottomMenuEditor.tsx',
    Client  - 'src/components/common/Menu/MobileBottomMenu.tsx',
    api     - 'src/app/api/menu/mobile-bottom-menu/controller.ts'
              'src/app/api/menu/mobile-bottom-menu/model.ts'
              'src/app/api/menu/mobile-bottom-menu/route.ts'

4. MobileMainMenuEditor.tsx
    Admin   - 'src/app/dashboard/admin/menu-editor/MobileMainMenuEditor.tsx',
    Client  - 'src/components/common/Menu/MobileMainMenu.tsx',
    api     - 'src/app/api/menu/mobile-main-menu/controller.ts'
              'src/app/api/menu/mobile-main-menu/model.ts'
              'src/app/api/menu/mobile-main-menu/route.ts'

5. SearchMenuButtonEditor.tsx
    Admin   - 'src/app/dashboard/admin/menu-editor/SearchMenuButtonEditor.tsx',
    Client  - 'src/components/common/Menu/SearchMenuButton.tsx',
    api     - 'src/app/api/menu/search-menu-button/controller.ts'
              'src/app/api/menu/search-menu-button/model.ts'
              'src/app/api/menu/search-menu-button/route.ts'

6. TopBannerEditor.tsx
    Admin   - 'src/app/dashboard/admin/menu-editor/TopBannerEditor.tsx',
    Client  - 'src/components/common/Menu/TopBanner.tsx',
    api     - 'src/app/api/menu/top-banner/controller.ts'
              'src/app/api/menu/top-banner/model.ts'
              'src/app/api/menu/top-banner/route.ts'

* and you can change others file as needed.