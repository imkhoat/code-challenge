# Problem 02 - Token Swap Interface

A modern, interactive token swap interface built with TypeScript, featuring real-time price fetching, custom dropdowns with token icons, and automatic exchange rate calculations.

## 📁 Project Structure

```
problem-02/
├── src/
│   ├── assets/
│   │   └── tokens/          # Token SVG icons (532+ tokens)
│   ├── dropdown.ts          # Custom dropdown component
│   ├── main.ts             # Main application logic
│   ├── style.css           # Application styles
│   └── vite-env.d.ts       # Vite environment types
├── index.html              # Main HTML file
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-challenge/problem-02
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 🎯 How to Use

### Basic Swap Process

1. **Select Input Token**
   - Click on the first dropdown (default: ETH)
   - Choose the token you want to send
   - Use the search box to filter tokens quickly

2. **Enter Amount**
   - Type the amount you want to swap
   - Only numbers and decimals are allowed
   - Maximum 6 decimal places supported

3. **Select Output Token**
   - Click on the second dropdown (default: USDC)
   - Choose the token you want to receive
   - The output amount will be calculated automatically

4. **Confirm Swap**
   - Click "CONFIRM SWAP" button
   - Wait for processing (2 seconds simulation)
   - View success message with swap details