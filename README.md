# Authentication System by Farischt

- Two types of users : basic users & admins.
- Mailing system to notify users.
- Accout confirmation & password reset features.

## Coming Features

- Full frontend integration.
- Two factor authentication system (SMS).

## Installation

First, you'll need node.js and node package manager "npm" installed : [https://nodejs.org/en/].

- Our version of node.js : v14.17.0.
- Our version of npm : v7.12.1.

## Technologies

Our project uses the following technologies :

- The React framework Next.js for both front-end and back-end (React + Node.js running on the same server).
- A postgreSQL database.

## Getting Started

Install all the dependencies by running the following command :

```bash
npm install --save
```

Then create a file named .env.local in the root directory of the project and follow all the instructions localised inside the file '.env.example' also in the root directory. The application won't run without the environnement variables, since the database connection won't be established.

Go to the file /server/database.js and change the following line of code :

On line 18 change false to true like following:

```
const sync = true
```

This line of code creates all the tables in database.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Go back to file /server/database.js and switch back to false.

```
const sync = false
```

Reload your browser, and that's it, your database is ready !

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
