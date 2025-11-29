# Aadi Enterprises Website

Company website for Aadi Enterprises Pune.

🌐 **Live Site:** [www.aadienterprisespune.com](https://www.aadienterprisespune.com)

---

## 📋 Prerequisites (One-time Setup)

### 1. Install Node.js

Node.js is required to run this project.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (recommended)
3. Run the installer and follow the prompts (keep all default settings)
4. Restart your computer after installation

**Verify installation:** Open Command Prompt or PowerShell and type:
```bash
node --version
```
You should see something like `v20.x.x`

### 2. Install Git

Git is required to download and upload code.

1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download for Windows
3. Run the installer (keep all default settings)
4. Restart your computer after installation

**Verify installation:**
```bash
git --version
```

### 3. Install VS Code (Recommended)

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download and install

---

## 📥 Download the Project (Clone)

Open Command Prompt or PowerShell and run:

```bash
cd Desktop
git clone https://github.com/sadiksp4-ai/aadi-enterprise.git
cd aadi-enterprise
```

This creates a folder called `aadi-enterprise` on your Desktop.

---

## 📦 Install Dependencies

Inside the project folder, run:

```bash
npm install
```

This downloads all the required packages. Wait for it to complete.

---

## 🚀 Run the Website Locally

```bash
npm run dev
```

Open your browser and go to: **http://localhost:5173**

You'll see the website running on your computer!

**To stop the server:** Press `Ctrl + C` in the terminal.

---

## ✏️ Making Changes

### Project Structure

```
aadi-enterprise/
├── src/react-app/
│   ├── components/     ← Reusable parts (Navbar, Footer, etc.)
│   ├── pages/          ← Full pages (HomePage, AboutPage, etc.)
│   ├── App.tsx         ← Main app file with routes
│   └── App.css         ← Global styles
├── public/             ← Static files (images, favicon, etc.)
└── index.html          ← Main HTML file
```

### Common Changes

**To edit text/content:**
- Open the relevant file in `src/react-app/pages/` or `src/react-app/components/`
- Find the text you want to change
- Save the file
- The browser will automatically refresh!

**To add images:**
1. Put your image in `public/` folder
2. Reference it in code as `/your-image.png`

---

## 📤 Upload Your Changes (Push to GitHub)

### First-time setup (only once)

Configure your Git identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Every time you make changes

1. **Check what changed:**
   ```bash
   git status
   ```

2. **Add all changes:**
   ```bash
   git add .
   ```

3. **Save changes with a message:**
   ```bash
   git commit -m "Describe what you changed"
   ```
   Example: `git commit -m "Updated phone number on contact page"`

4. **Upload to GitHub:**
   ```bash
   git push
   ```

**That's it!** GitHub will automatically deploy your changes to the live website in ~2 minutes.

---

## 🔄 Get Latest Changes (Pull)

If someone else made changes, get them with:

```bash
git pull
```

Run this before making your own changes to avoid conflicts.

---

## 🐛 Troubleshooting

### "npm is not recognized"
→ Node.js not installed properly. Reinstall and restart your computer.

### "git is not recognized"
→ Git not installed properly. Reinstall and restart your computer.

### "Permission denied" or authentication error on push
→ You need to log in to GitHub. Run `git push` and follow the prompts to authenticate.

### Website not updating after push
→ Wait 2-3 minutes. Check GitHub Actions tab to see if deployment is running.

### Changes not showing in browser
→ Hard refresh: Press `Ctrl + Shift + R`

---

## 📞 Need Help?

Contact the developer if you're stuck!
