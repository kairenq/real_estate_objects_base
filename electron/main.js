const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('path');

// URL вашего приложения на Render
const APP_URL = process.env.APP_URL || 'https://real-estate-objects-base.onrender.com';

let mainWindow;

// Настройка сессии перед созданием окна
app.whenReady().then(() => {
  // Очищаем кеш и данные при запуске для чистой сессии
  const ses = session.defaultSession;

  // Устанавливаем User-Agent чтобы сайт не думал что это бот
  ses.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RealEstateDesktop/1.0');

  // Настраиваем CSP для разрешения загрузки изображений с Unsplash
  ses.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' " + APP_URL + "; " +
          "img-src 'self' data: https: blob: " + APP_URL + " https://images.unsplash.com; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' " + APP_URL + "; " +
          "style-src 'self' 'unsafe-inline' " + APP_URL + "; " +
          "connect-src 'self' " + APP_URL + " https://images.unsplash.com; " +
          "font-src 'self' data: " + APP_URL + ";"
        ]
      }
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'База Недвижимости',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      partition: 'persist:realestate', // Используем постоянную сессию
    },
    backgroundColor: '#1976d2',
    show: false,
  });

  // Блокируем навигацию на внешние сайты (например, render.com dashboard)
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const targetHost = parsedUrl.hostname;
    const appHost = new URL(APP_URL).hostname;

    // Разрешаем только навигацию внутри нашего домена
    if (targetHost !== appHost && !navigationUrl.startsWith('data:')) {
      event.preventDefault();
      console.log('Blocked navigation to:', navigationUrl);

      // Если это render.com или другой внешний сайт - игнорируем
      if (targetHost.includes('render.com') && !navigationUrl.includes(appHost)) {
        console.log('Blocked Render dashboard redirect');
        return;
      }
    }
  });

  // Блокируем открытие новых окон
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const targetHost = parsedUrl.hostname;
    const appHost = new URL(APP_URL).hostname;

    // Если это наш домен - открываем в том же окне
    if (targetHost === appHost) {
      mainWindow.loadURL(url);
    }

    // Блокируем все внешние окна
    return { action: 'deny' };
  });

  // Загружаем веб-приложение с Render
  mainWindow.loadURL(APP_URL, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  // Показываем окно когда контент загружен
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Обработка ошибок загрузки
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);

    // Показываем страницу ошибки
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ошибка подключения</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 48px; margin: 0 0 20px 0; }
            p { font-size: 18px; margin: 10px 0; opacity: 0.9; }
            button {
              margin-top: 30px;
              padding: 15px 40px;
              font-size: 16px;
              font-weight: 600;
              background: white;
              color: #2563eb;
              border: none;
              border-radius: 10px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ Ошибка подключения</h1>
            <p>Не удалось подключиться к серверу</p>
            <p>Проверьте подключение к интернету</p>
            <p><small>URL: ${APP_URL}</small></p>
            <button onclick="location.reload()">Попробовать снова</button>
          </div>
        </body>
      </html>
    `);
  });

  // Логируем загрузку страниц для отладки
  mainWindow.webContents.on('did-navigate', (event, url) => {
    console.log('Navigated to:', url);
  });

  mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
    console.log('Navigated in page to:', url);
  });

  // Создаем меню приложения
  const menuTemplate = [
    {
      label: 'Приложение',
      submenu: [
        {
          label: 'Обновить',
          accelerator: 'F5',
          click: () => {
            mainWindow.reload();
          },
        },
        {
          label: 'Перезагрузить',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.loadURL(APP_URL);
          },
        },
        { type: 'separator' },
        {
          label: 'Очистить кеш и перезагрузить',
          click: async () => {
            await session.defaultSession.clearCache();
            await session.defaultSession.clearStorageData();
            mainWindow.loadURL(APP_URL);
          },
        },
        { type: 'separator' },
        {
          label: 'Выход',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Навигация',
      submenu: [
        {
          label: 'Назад',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          },
        },
        {
          label: 'Вперед',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          },
        },
      ],
    },
    {
      label: 'Вид',
      submenu: [
        {
          label: 'Полноэкранный режим',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        { type: 'separator' },
        {
          label: 'Инструменты разработчика',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Выход когда все окна закрыты (кроме macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
