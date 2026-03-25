const puppeteer = require("puppeteer");

function randomDelay(min = 2000, max = 5000) {
  const time = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, time));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir:
      "C:\\Users\\Валерия\\AppData\\Local\\Google\\Chrome\\User Data",
    args: ["--profile-directory=Profile 5"],
  });

  const pages = await browser.pages();
  const page = pages[0];

  // 👉 ВАЖНО: открываем ТОЛЬКО ОДИН РАЗ
  await page.goto("https://hh.ru/search/vacancy?text=JavaScript");
  await randomDelay();

  let currentPage = 1;
  const maxPages = 3;

  while (currentPage <= maxPages) {
    console.log(`\n===== Страница ${currentPage} =====`);

    console.log("Страница загрузилась, ищем вакансии...");

    await page
      .waitForSelector('[data-qa="vacancy-serp__vacancy"]', { timeout: 5000 })
      .catch(() => {});

    const jobElements = await page.$$('[data-qa="vacancy-serp__vacancy"]');
    console.log("Найдено вакансий:", jobElements.length);

    const jobs = [];

    for (let jobElement of jobElements) {
      const title = await jobElement.$eval(
        '[data-qa="serp-item__title"]',
        (el) => el.innerText,
      );
      const link = await jobElement.$eval("a", (el) => el.href);
      jobs.push({ title, link });
    }

    // фильтр по названию
    const filteredJobs = jobs.filter((job) => {
      if (!job.title) return false;
      const title = job.title.toLowerCase();
      return (
        title.includes("javascript") &&
        !title.includes("senior") &&
        !title.includes("ментор") &&
        !title.includes("наставник") &&
        !title.includes("qa") &&
        !title.includes("middle") &&
        !title.includes("backend")
      );
    });

    const filteredJobsSmart = [];
    let count = 0;

    for (let job of filteredJobs) {
      if (count >= 3) break;

      console.log("Открываем:", job.title);

      await page.goto(job.link, { waitUntil: "domcontentloaded" });
      await randomDelay();

      let description = "";
      try {
        await page.waitForSelector('[data-qa="vacancy-description"]', {
          timeout: 5000,
        });
        description = await page.$eval(
          '[data-qa="vacancy-description"]',
          (el) => el.innerText,
        );
      } catch (err) {
        console.log("Не удалось достать описание вакансии");
      }

      const descLower = description.toLowerCase();

      if (
        descLower.includes("javascript") &&
        !descLower.includes("senior") &&
        !descLower.includes("mentor") &&
        !descLower.includes("наставник") &&
        !descLower.includes("qa") &&
        !descLower.includes("middle") &&
        !descLower.includes("backend")
      ) {
        filteredJobsSmart.push({
          title: job.title,
          link: job.link,
          description: description.slice(0, 200),
        });

        // 👉 немного скроллим (иногда кнопка появляется после этого)
        await page.evaluate(() => window.scrollBy(0, 500));
        await randomDelay(1000, 2000);

        // 👉 пробуем разные варианты кнопки
        let applyButton = null;

        const selectors = [
          '[data-qa="vacancy-response"]',
          '[data-qa="vacancy-response-link-top"]',
          'button[data-qa*="response"]',
        ];

        for (let selector of selectors) {
          try {
            await page.waitForSelector(selector, { timeout: 3000 });
            applyButton = await page.$(selector);
            if (applyButton) break;
          } catch (e) {}
        }

        if (applyButton) {
          try {
            await applyButton.click();
            console.log("Кликнули Откликнуться!");
            await randomDelay(2000, 4000);
          } catch (err) {
            console.log("Ошибка при клике (возможно редирект):", err.message);
          }
        } else {
          console.log("Кнопка отклика не найдена (или нельзя откликнуться)");
        }

        if (applyButton) {
          await applyButton.click();
          console.log("Кликнули Откликнуться!");
          await randomDelay(2000, 4000);
        } else {
          console.log("Кнопка отклика не найдена.");
        }
      }

      // 👉 возвращаемся назад к списку
      try {
        await page.goBack({ waitUntil: "domcontentloaded" });
      } catch (err) {
        console.log("Не удалось вернуться назад, пробуем заново открыть поиск");

        await page.goto("https://hh.ru/search/vacancy?text=JavaScript");
      }

      await randomDelay();

      count++;
    }

    console.log("ОТФИЛЬТРОВАННЫЕ вакансии:");
    console.log(filteredJobsSmart);

    // 👉 переход на следующую страницу
    const nextButton = await page.$('[data-qa="pager-next"]');

    if (nextButton) {
      console.log("Переходим на следующую страницу...");
      await Promise.all([
        nextButton.click(),
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      ]);
      await randomDelay(3000, 6000);

      currentPage++;
    } else {
      console.log("Больше страниц нет.");
      break;
    }
  }

  await new Promise(() => {});
})();
