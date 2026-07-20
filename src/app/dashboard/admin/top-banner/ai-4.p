Look at the TopBanner 'src/components/common/Menu/TopBanner.tsx'
here is admin url 'src/app/dashboard/admin/top-banner/page.tsx' 
and here is api 'src/app/api/top-banner/...'

Now your task is Update the topbanner with the following design. 
```
      <div className="bg-[#080c14] text-[10px] font-semibold text-white/80">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>Email: info@wesassociates.com</span>
            <span className="hidden sm:inline">Call now: +880 1303-537667</span>
            <span className="hidden md:inline">Open: Sat-Thu, 10:00 AM - 7:00 PM</span>
          </div>
          <div className="flex gap-2">
            {[Facebook, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social media" className="grid h-6 w-6 place-items-center rounded-full bg-white/10 transition hover:bg-[#ed1c24]">
                <Icon size={11} />
              </a>
            ))}
          </div>
        </div>
      </div>
```

Change the top banner as the following instructions.
1. At the left side there is social icon(Lucid Reat) button name 
    - Call
    - Email
    - Location
    - Messager
    - WhatsApp
     * inside the admin please add those field
        - Public
        - Font Color
        - Size
        - Padding 
        - url 
        - openInNewTab 

2. At the right side there is a button with Text name 'login' or 'Dashboard' 
Look at the example from  'src/components/common/Menu/MenuClient.tsx' How to switch Login with Dashboard with auth session. 
