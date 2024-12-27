# Josh's Pizzeria

This is a simple NextJS application that allows you to manage Pizza Toppings and Pizza Recipe's. The app has two users, named 'Owner' and 'Chef': the password for each user is 'pass'. 'Owner' has the ability to modify pizza toppings, and 'Chef' has the ability to modify pizza recipes.

To run the application, clone this github repo, run `npm install` or `pnpm install`, and run either `npm run dev` or build the application via `npm run build` and then `npm run start` after the build is complete.

## Technical Info

As stated earlier, this application uses NextJS as the frontend framework, and uses NeonDB+Drizzle for database management. For Authorization/Authentication, the app uses Auth.js with credentials injected directly into the app for simplicity. For styling, I've decided to use TailwindCSS, as that is the most comfortable styling framework for me.