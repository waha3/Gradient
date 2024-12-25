import { Browser, Builder, By } from "selenium-webdriver";
import Chrome, { type Options } from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";
import request from "request";
import proxy from "selenium-webdriver/proxy";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
};

const extensionId = "caacbgbklghmpodbdafajbgdnegacfmo";
const extentionUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=109.0.5414.87&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc`;

const outputFilePath = path.resolve(__dirname, `crx/${extensionId}.crx`);

const configProxy = async (options: Chrome.Options) => {
  const proxyIp = process.env.proxy_ip;
  const proxyUsername = process.env.proxy_username;
  const proxyPassword = process.env.proxy_password;

  console.log("-> 代理链接启动中...");
  console.log("-> 用户:", proxyUsername);
  console.log("-> 密码:", proxyPassword);
  console.log("-> 代理:", proxyIp);

  const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl)

  options.setProxy(
    proxy.manual({
      http: proxyIp,
      userInfo: {},
    })
  );
};

const downloadExtension = async () => {
  if (fs.existsSync(outputFilePath)) {
    return 0;
  }

  console.log(`准备下载 ${extensionId}`);
  return new Promise((resolve, reject) => {
    request
      .get(extentionUrl, {
        headers,
      })
      .on("close", () => {
        resolve(1);
      })
      .on("error", function (response) {
        reject();
        console.error(`下载失败: ${response}`);
      })
      .on("response", () => {
        console.log(`正在下载插件：${extensionId}`);
      })
      .pipe(fs.createWriteStream(outputFilePath));
  });
};

const getDriverOptions = (allow_debug = false): Options => {
  const options = new Chrome.Options();

  // options.addArguments("--headless");
  // options.addArguments("--single-process");
  // options.addArguments(`user-agent=${headers["User-Agent"]}`);
  // options.addArguments("--remote-allow-origins=*");
  // options.addArguments("--disable-dev-shm-usage");
  // options.addArguments("enable-automation");
  // options.addArguments("--window-size=1920,1080");
  // options.addArguments("--start-maximized");
  // options.addArguments("--disable-renderer-backgrounding");
  // options.addArguments("--disable-background-timer-throttling");
  // options.addArguments("--disable-backgrounding-occluded-windows");
  // options.addArguments("--disable-low-res-tiling");
  // options.addArguments("--disable-client-side-phishing-detection");
  // options.addArguments("--disable-crash-reporter");
  // options.addArguments("--disable-oopr-debug-crash-dump");
  // options.addArguments("--disable-infobars");
  // options.addArguments("--dns-prefetch-disable");
  // options.addArguments("--disable-crash-reporter");
  // options.addArguments("--disable-in-process-stack-traces");
  // options.addArguments("--disable-popup-blocking");
  // options.addArguments("--disable-gpu");
  // options.addArguments("--disable-web-security");
  // options.addArguments("--disable-default-apps");
  // options.addArguments("--ignore-certificate-errors");
  // options.addArguments("--ignore-ssl-errors");
  // options.addArguments("--no-sandbox");
  // options.addArguments("--no-crash-upload");
  // options.addArguments("--no-zygote");
  // options.addArguments("--no-first-run");
  // options.addArguments("--no-default-browser-check");
  // options.addArguments("--remote-allow-origins=*");
  // options.addArguments("--allow-running-insecure-content");
  // options.addArguments("--enable-unsafe-swiftshader");

  // if (allow_debug) {
  //   options.addArguments("--enable-logging");
  //   options.addArguments("--v=1");
  // }

  return options;
};

const run = async () => {
  await downloadExtension();

  console.log("-> 启动浏览器...");

  const options = getDriverOptions(true);
  options.addExtensions(outputFilePath);

  console.log(`-> 扩展已添加! ${extensionId}`);

  try {
    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();

    console.log("-> 浏览器已启动!");

    console.log("-> 已启动! 正在登录 https://app.gradient.network/...");
    await driver.get("https://app.gradient.network/");
  } catch (error) {
    console.log("error is ", error);
  }

  const emailInput = By.css('[placeholder="Enter Email"]');
  const passwordInput = By.css('[type="password"]');
  const loginButton = By.css("button");
};

run();
