Look at the example 
Api :
'src/app/api/news/v1/controller.ts'
'src/app/api/news/v1/model.ts'
'src/app/api/news/v1/route.ts'

Redux:
'src/redux/features/news/newsSlice.ts'

Dashboard UI:
'src/app/dashboard/news/page.tsx'

Now your task is generate those file for the example model 

Look at the example 
Api :
'src/app/api/campaign/v1/controller.ts'
'src/app/api/campaign/v1/model.ts'
'src/app/api/campaign/v1/route.ts'

Redux:
'src/redux/features/campaign/campaignSlice.ts'

Dashboard UI:
'src/app/dashboard/campaign/page.tsx'

in Dashboard I please implement those features 
1. At the top there is a button for add 'Campaign ID' 
2. There is a search bar. and it will search saved campaign.
3. There is a select Campaign. it can select from saved campaign.

here is how to implement it 
```
Here is a highly detailed, clear prompt you can give to an AI agent or developer to build this feature for you:
------------------------------
Role: Expert Next.js Developer
Task: Implement a dynamic campaign results page in a Next.js application using the App Router.
Objective: Create a route that captures a unique campaignId from the URL, fetches the corresponding campaign performance data, and displays it in a clean dashboard UI.
Technical Requirements:

   1. Routing: Set up a dynamic route at app/campaigns/[campaignId]/page.tsx.
   2. Data Fetching:
   * Properly handle the async params in Next.js to extract campaignId.
      * Fetch data from the campaign API endpoint using the ID.
      * Include basic error handling if the campaign is not found or the fetch fails. [1] 
   3. UI/Components:
   * Create a clean layout using Tailwind CSS.
      * Display key metrics such as Total Impressions, Clicks, Click-Through Rate (CTR), and Conversions.
      * Include a loading state while data is fetching. [2, 3] 
   
Deliverables:

* Provide the complete file structure and code for the server-side page component.
* Provide an example of the expected JSON data structure mock. [4] 

------------------------------
If you want to refine this prompt further, let me know:

* Your Next.js version (e.g., Next.js 14 or 15)?
* Your preferred styling library (Tailwind CSS, CSS Modules, or shadcn/ui)?
* Any specific API authentication details (like bearer tokens or API keys) the agent needs to account for?

I can update the prompt to include these exact requirements!

[1] [https://blog.getodin.ai](https://blog.getodin.ai/how-to-build-an-ai-agent-a-tech-enthusiasts-guide/)
[2] [https://www.sprinklr.com](https://www.sprinklr.com/help/articles/sprinklr-ai-agent-overview/create-sprinklr-ai-agent-application/685d17e8174819486109b0fa)
[3] [https://ferrerponseti.com](https://ferrerponseti.com/en/blog/ai-prompts-automate-marketing/)
[4] [https://pub.aimind.so](https://pub.aimind.so/prompts-masterclass-output-formatting-json-5-3a5c177a9095)
```