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
'src/app/api/products/v1/controller.ts'
'src/app/api/products/v1/model.ts'
'src/app/api/products/v1/route.ts'

Redux:
'src/redux/features/products/productsSlice.ts'

Dashboard UI:
'src/app/dashboard/products/page.tsx'

example model:
```
title: string,
real_price: number,
discount_price: number,
description: richTextArea,
features: listofString,
star: floatNumber,
view: string,
discount: floatNumber,
primary_images: singleImage,
product_images: arrOfImages,
status: active|hide|draft,
offerEnds: Date,
ShareButton: arrayOf{Link,icon},
liveUrl: string,
Note: string,
bestfor: string,
VideoUrl: string,