# 1. Install Node.js
Download and install Node.js v22.14.0 (recommended):

<https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi>

If installation fails:

1.Uninstall completely

2.Try alternative version (v18.19.1):

<https://nodejs.org/dist/v18.19.1/node-v18.19.1-x64.msi>

Important: Allow installer to set PATH environment variables.

# 2. Verify Installation
Run in CMD/PowerShell (Windows built-in terminals):

```bash
node -v
npm -v
```

If commands not found:

Manually add Node.js to system PATH.

# 3. Install Dependencies
Navigate to repository and run:

```bash
npm i --legacy-peer-deps
```
If failed, try these alternatives:

1. cnpm

   ```bash
   npm install cnpm -g
   cnpm i --legacy-peer-deps
   ```

2. yarn

   ```bash
   npm install yarn -g
   yarn i --legacy-peer-deps
   ```


# 4. Execution Commands

1. Development server:

    ```bash
    npm run vite
    ```

2. Production build:

    ```bash
    npm run vite:build
    ```
    Tips: Output in folder \dist

2. Preview production build:

    ```bash
    npm run vite:preview
    ```

    Tips: production environment is the contents in folder \dist