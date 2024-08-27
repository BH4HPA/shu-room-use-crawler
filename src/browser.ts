import * as puppeteer from 'puppeteer-core';

export function GetRoomUseInfos(auth: {
  username: string;
  password: string;
}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Starting Headless Browser..');
      const browser = await puppeteer.launch({
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto('https://cj.shu.edu.cn');

      const username = await page.$('#username');
      await username?.type(auth.username);
      const password = await page.$('#password');
      await password?.type(auth.password);

      const submit = await page.$('#submit-button');
      console.log('Logging in..');
      await submit?.click();

      await page.waitForNavigation({
        timeout: 5000,
      });

      if (page.url() !== 'https://cj.shu.edu.cn/Home/StudentIndex') {
        reject('登录失败');
      }

      await page.goto('https://cj.shu.edu.cn/RoomUse/RoomUseDate/');

      await page.waitForSelector('#R_CurrentDate');

      console.log('Getting Room Use Infos..');

      await page.waitForSelector('#roomsearchtab');

      console.log('Got Room Use Infos');
      const roomUseInfos = [];
      for (let i = 1; i <= 4; i++) {
        console.log('Loading Page ' + i);
        await page.evaluate(`CtrlRoomUseDate(${i})`);
        await page.waitForSelector('#roomsearchtab');
        const part = await page.evaluate(() => {
          return Array.from(
            document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
          )
            .slice(2)
            .map((classroom) => {
              const infos = Array.from(classroom.getElementsByTagName('td'));
              let status = infos[3].style.color === 'green' ? 0 : 1;
              for (const info of infos.slice(4))
                status = (status << 1) | (info.style.color === 'green' ? 0 : 1);
              return {
                campus: infos[0].innerText,
                building: infos[1].innerText,
                classroom: infos[2].innerText,
                status,
              };
            });
        });
        roomUseInfos.push(...part);
      }

      console.log('Done');

      await browser.close();

      resolve(roomUseInfos);
    } catch (err) {
      reject(err);
    }
  });
}
