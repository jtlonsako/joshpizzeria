# Josh's Pizzeria

This is a simple NextJS application that allows you to manage Pizza Toppings and Pizza Recipe's. The app is built using NextJS on the frontend and Neon+Drizzle for the backend.

## How To Use the App

There are two accounts: **Owner** and **Chef**. Owner has access to manage toppings, and Chef has access to manage pizza recipes. To use the app:
- Press the 'sign in' button on the top right.
- Enter *owner* into username to access topping management, or *chef* to access pizza recipe management.
- Enter *pass* into the password field.
- Click the button that has now been enabled on the homepage to use the web app.

To run the application locally, clone this github repo, run `npm install` or `pnpm install`, and run either `npm run dev` or build the application via `npm run build` and then `npm run start` after the build is complete.

## Technical Info

As stated earlier, this application uses NextJS as the frontend framework, and uses NeonDB+Drizzle for database management. For Authorization/Authentication, the app uses Auth.js with credentials injected directly into the app for simplicity. For styling, I've decided to use TailwindCSS, as that is the most comfortable styling framework for me.