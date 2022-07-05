# Edge server setup

## Requirements

- Chromium-based browser

- Peripherals

  - Video/audio input devices (e.g. webcam)
  - Display/audio output device (e.g. touch display/speaker)

- Raspberry Pi OS settings

  - Set up WIFI with on-screen keyboard
  - Go to the main menu and open the Raspberry Pi Configuration tool. Select the Interfaces tab and ensure that the camera is enabled. Reboot your Raspberry Pi.
  - Adjust audio volume
  - Screen resolution of 800 x 480 pixels
  - Auto-hide taskbar
  - Right-click on the taskbar and select "Panel Settings". Click on the "Advanced" tab, and check "Minimize panel when not in use".
  - Install Korean language

    ```bash
    sudo apt-get install fonts-unfonts-core
    sudo apt-get install ibus ibus-hangul
    sudo reboot
    ```

  - Install nodejs and packages

    ```bash
    sudo su
    curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
    ```

    ```bash
    sudo apt install nodejs -y
    ```

    ```bash
    npm i
    ```

## Media file install

### gdown

```bash
pip install gdown
```

### Media

```bash
mkdir dist
/home/pi/.local/bin/gdown https://drive.google.com/drive/folders/1EzQYUTTUvaCoHJxrn7jCHh-MHFcdFe6- -O dist/ --folder
```
