Look at the main file 'src/components/common/Menu/MobileBottomMenu.tsx' 

Dashboard UI : 'src/app/dashboard/admin/footer-editor/page.tsx'

and old api : 'src/app/api/menu/mobile-bottom-menu/...'
and new api : 'src/app/api/footer-settings/mobile-bottom-menu/v1/...'

Now please Update MobileBottomMenu.tsx, admin/footer-editor/page.tsx, and new api so it work with sync, and remove old api.


Look at the menu file only for Tablet and Desktop version. 'src/components/common/Menu/PrimaryMenu.tsx' Now update the menu only in Tablet and Desktop verson as the following instructions.
1. Add font-family to : Noto Sans. 
2. Add font-size to : 16px.
3. If I hover the menu or Click from the tab then It will display sub-menu like the picture.
and also Update admin UI : 
'src/app/dashboard/admin/menu-editor/page.tsx' and inside theme tabs. there you found three Font Family please add this one too. and also add font size 16 px. 
