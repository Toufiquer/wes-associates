Look at the account page.tsx 'src/app/account/page.tsx'
Now your task is 
1. Impelment tabs  
    - Parsonal Info
        * Name
        * Mobile Number
        * Email
        * password [hide/visible]
        * update password 
        * photo [user can update photo]
    - Download
        * It will render 'src/app/dashbaord/my-products' [inside the tab please write the code again.]
    - Licenses
        * for each purchase products generate unique Licenses key. with 16 digit Hex.
    - Support
        * It have a WhatsApp Button. number '+880 1726-020097'

and look 'src/app/dashboard/assets/admin-account/page.tsx' and 'src/app/dashbaord/assets/products/page.tsx' Now generate a new api named CustomerAccount and it will  link with admin-account. inside admin-account I want to do the following task. 
1. Create new account with password.
2. Update password.
3. Can block the user.
4. I can see all their Licenses.
5. Please make sure there is features like
    - Summery
    - Reload
    - Filter
    - Add account
    - Bulk Update
    - Bulk Delete
    - Single View
    - Single Update
    - Single Delete 
    - Pagination
    - Responsive
6. and it  will  also link 'src/app/account/page.tsx' but it will  only fetch user data. and can not see others user data. and only update own data. 


Look  at the 'src/app/account/page.tsx' and implement the follwoing instructions.
1. If I load the account page then  it will automatic create a user. remove it.
2. First it  will check  If there any user in local storage or  not if Found then  check it and update Login State.
3. If login  Found then render 4 tabs.
4. If  not  log in  then render  login div and signup- button. with it's features. 







Look at the account page.tsx 'src/app/account/page.tsx' and look at the 'src/app/dashboard/assets/admin-account/page.tsx' My problem is when I login or create account from this then it will sync with Session 'import { useSession } from '@/lib/auth-client';' Now your task is implement those features as the follwoing instructions.  
1. Remove sync with Session. 
2. I want If create or log in account then it will hash password and it will save in cookies. and database named 'CustomerAccount' in customer-account api. 
3. And you found another login method inside /login and /registration please do not change or sync with it. 


Look at the account page.tsx 'src/app/account/page.tsx' and add a new accordion named 'Membership' it will look like and do the same task like 'src/membership/page.tsx' Now implement it.