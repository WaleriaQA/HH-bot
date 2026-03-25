# 🤖 HH.ru Smart Job Bot (Puppeteer)

This project is a simple automation bot built with **Node.js + Puppeteer** that helps you search and apply for jobs on hh.ru.

## 🚀 Features

- 🔍 Searches jobs by keyword (e.g. "JavaScript")
- 📄 Parses job titles and links
- 🧠 Filters jobs by:
  - keywords
  - excluding unwanted roles (Senior, QA, Mentor, etc.)
- 📖 Opens each vacancy and analyzes description
- ⚡ Automatically clicks "Apply" if available
- 🔄 Navigates through multiple pages
- 🕒 Uses random delays to simulate human behavior

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/HH-bot.git
cd HH-bot

Install dependencies:
npm install

Important Notes
- The bot uses your Chrome profile, so you must already be logged in to hh.ru.
- Make sure Chrome is closed before running the script.
- The bot only applies to jobs where:
- no additional forms are required
- "Apply" button is directly available

How it works
- Opens hh.ru job search page
- Collects all job elements on the page
- Extracts:
job title
job link
- Filters jobs by title
- Opens each job page
- Reads job description
- Applies additional filtering
- Clicks "Apply" button if available
- Moves to the next page and repeats



Stop the bot
Press: Ctrl + C

Disclaimer
This project is for educational purposes only.
Use automation responsibly and respect website rules.

Future Improvements
- Auto-fill cover letters
- Save applied jobs
- Advanced filtering (salary, location)
- Anti-detection improvements

⭐ If you like this project

Give it a star on GitHub 🙂
