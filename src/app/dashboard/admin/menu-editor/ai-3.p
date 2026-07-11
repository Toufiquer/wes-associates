Look at the file
Client UI:
'src/components/MenuClient.tsx',
'src/components/TopBanner.tsx',

Admin UI:
'src/app/dashboard/admin/menu-editor/page.tsx',
'src/app/dashboard/admin/menu-editor/BrandSettingsEditor.tsx',
'src/app/dashboard/admin/menu-editor/TopBannerEditor.tsx',
'src/app/dashboard/admin/menu-editor/SearchIconEditor.tsx',

api: 
'src/app/api/menu-editor/controller.ts'
'src/app/api/menu-editor/model.ts'
'src/app/api/menu-editor/route.ts'

'src/app/api/brand-settings/controller.ts'
'src/app/api/brand-settings/model.ts'
'src/app/api/brand-settings/route.ts'



I want to implement two features. Now please implement those features as the following instructions.

Dashboard UI:
Please add a new tab beside the Logo, Banner, Cart, Search. it look like same as logo with two tabs. 

Features 1: first tab I want to Edit mobile Footer Menu.


Features 2: second tab please add an option named Mobile Menu. it tas an option for enable and disable. if it is enable then render Mobile Menu data inside MenuClient.tsx, if disabled then render initialMenuItems inside 'src/components/MenuClient.tsx'
 - there is option for add item with logo, name and url.
 - there is an optioin named View Style it will have two display option 
    * Grid View [there is option for 2*2, 2*3, 3*2, 3*3][row*column]
    * Flex view [render single item in single line]



Now look at the "New Item" and inside the model you found how I add icon. please implement the same style inside Edit MObile Footer Menu.

Now please update "Edit Mobile Footer Menu" as the following instructions.  
1. please show only two div. 
   - first is example or preview.
      * How it look like in mobile.

   - and second is add new button.
    * it will open a popup insdie the popup there is option for name, icon, path.  and  submit button. 

Now please update "Mobile Menu" as the following instructions.  
    - Mobile menu with switch is good. no need to change.
    - Please add two grid in desktop view. in left side please show View Style. and in right side Grid Layout.


Now please update "Edit Mobile Footer Menu" as the following instructions.
- Please move "Add New" inside 'Mobile Footer Menu' at the top right side of the page below the tabs 'Edit Mobile Footer Menu' and 'Mobile Menu'
- Please add two section.
    * first section will display Preview. 
    * second section will display accordion.
    * please add an update button beside each delete button

- add accordion in preview mode.
Now please update "Mobile Menu" as the following instructions.  
- If I click Grid View then it display Grid Layout in right side. 
- If I click Flex View then it display Flex Layout in right side.