Look at the file
Client UI:
'src/components/MenuClient.tsx',
'src/components/TopBanner.tsx',

Admin UI:
'src/app/dashboard/admin/menu-editor/page.tsx',
'src/app/dashboard/admin/menu-editor/BrandSettingsEditor.tsx',
'src/app/dashboard/admin/menu-editor/TopBannerEditor.tsx',
'src/app/dashboard/admin/menu-editor/WhatsAppButtonEditor.tsx',
'src/app/dashboard/admin/whatsapp/page.tsx',

api: 
'src/app/api/menu-editor/controller.ts'
'src/app/api/menu-editor/model.ts'
'src/app/api/menu-editor/route.ts'

'src/app/api/brand-settings/controller.ts'
'src/app/api/brand-settings/model.ts'
'src/app/api/brand-settings/route.ts'


Now implement those features as the following instructions.
1. I want to implement a search features in menu bar. only search icon is visible in menu. 
2. I want an option to hide or visible search icon from menu. and want to customize it like 'src/app/dashboard/admin/menu-editor/TopBannerEditor.tsx',
3. Sync search with localstorage. and add a batch with current product quantity. you found search icon as SearchIcon inside 'src/components/common/MenuClient.tsx'
4. When I click search button it will open a new div if I write 3 char then it will col and open a new div. [I will working later]

Look at the file 'src/components/common' inside the file you found many file. please generate folder with the following name and more those file as the following instructions.
1. Loading 
    - Loading.tsx
    - LoadingServerSkeleton.tsx
    - LoadingSkeleton.tsx

2. Footer    
    - MainFooter.tsx


Look at the file 'src/app/dashboard/menu-editor/MobileFooterMenuEditor.tsx' and 'src/components/common/MobileBottomMenu.tsx' 

Now Please update "Mobile Footer Menu" as the following instructions.
1. do not load data from "Mobile Menu" [It is just a design I will work later]
2. Update the Preview section with select options.
    - 4 icon 
    - 5 icon
    ** and please make sure The preview item is not removed.


Look at the file 'src/app/dashboard/menu-editor/MobileFooterMenuEditor.tsx' and implement the follwoing instructions.
1. When render the 5 icon. Please udpate the design. 
2. the middle icon have a padding-bottom 4px and rounded white background color.


Look at the file 'src/app/dashboard/menu-editor/MobileFooterMenuEditor.tsx' and 'src/components/common/MobileBottomMenu.tsx'
1. Please make sure MobileBottomMenu only linked with MobileFooterMenuEditor tab.
2. please move 'Mobile Main Menu' to a new tabs.
3. below the mobile tabs there is two tabs shown
    - Mobile Main Menu
    - Mobile Footer Menu


Look at the file 'src/components/common/WhatsAppButton.tsx' and 'src/app/dashboard/admin/whatsapp/page.tsx' and 'src/app/dashboard/admin/whatsapp/WhatsAppButtonEditor.tsx'
Now your task is implement those features as the following instructions.
1. remove Show WhatsApp Button switch.
2. Now please a new switch named 'Show WhatsApp Button in Desktop'
3. Now please a new switch named 'Show WhatsApp Button in Mobile'
4. and please make sure in mobile device the 'whatsapp' text is remove and the position will change add 120px padding-bottom.


Look at the file 'src/components/common/SearchMenuButton.tsx' and Look at the products 'src/app/dashboard/assets/products/page.tsx' Now implement Search functionality with products. and if there is more then 10 products then add pagination. If I click one product then it will redirect to '/template?title=LiteBox-NextJS-Proper-Theme'  And make sure it working well in mobile device.


Look at the file 'src/components/common/WhatsAppButton.tsx' and 'src/app/dashboard/admin/whatsapp/page.tsx' and 'src/app/dashboard/admin/whatsapp/WhatsAppButtonEditor.tsx'
Now your task is implement those features as the following instructions. When I edit in my browser it working. But If I open in ignore tap then it is not working fix it.