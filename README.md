# Admin Panel with Payment Integration

This is a React-based admin panel with integrated payment processing using Razorpay.

## 🚀 Quick Start

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server with payment server:**
   ```bash
   npm run dev
   ```
   This starts both the React app (port 3000) and the payment server (port 3001).

   **OR** start them separately:
   ```bash
   # Terminal 1: Start payment server
   npm run server

   # Terminal 2: Start React app
   npm start
   ```

3. **Open your browser:**
   - Admin Panel: [http://localhost:3000](http://localhost:3000)
   - Payment Server Health: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### Production Deployment (Vercel)

1. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

2. **Set environment variables in Vercel dashboard:**
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

3. **Verify deployment:**
   - Check `https://your-app.vercel.app/api/health` for payment server status

## 🏗️ Architecture

### Local Development
- Frontend: React app running on port 3000
- Backend: Express server running on port 3001
- Payment processing: Direct connection to local Razorpay server

### Production (Vercel)
- Frontend: Static React build served by Vercel
- Backend: Serverless functions in `/api` folder
- Payment processing: Vercel serverless functions handle Razorpay

## 📊 Features

- **Payment Management**: Process vendor payments via Razorpay
- **Commission Tracking**: Manage vendor commission rates
- **Transaction History**: View and export transaction data
- **Vendor Management**: Detailed vendor analytics and payment history
- **Real-time Status**: Server connectivity monitoring

## 🔧 Environment Configuration

### Local Development (`.env.development`)
```
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_RAZORPAY_KEY_ID=your_key_here
```

### Production (`.env.production`)
```
REACT_APP_API_BASE_URL=
REACT_APP_ENVIRONMENT=production
REACT_APP_RAZORPAY_KEY_ID=your_key_here
```

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
