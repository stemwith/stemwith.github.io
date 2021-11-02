---
title: esp32-WROOM-32D DevkitC V4
categories:
  - esp32
date: 2019-10-19 01:58:29
tags:
---

### ESP32-WROOM-32D DevkitC V4

![](/image/esp32-pinout.png)

[핀아웃 다운로드](/attach/ESP32-Pinout.hwp)

<br>

*   녹색핀: 사용에 적합한 핀
*   노란색: 사용은 가능하나 부팅시 예기치 않은 동작이 발생할 수 있으므로 주의해야 하는 핀 (GPIO34~39는 Input only!)
*   빨간색: 입력 또는 출력으로 사용할 수 없는 핀을 의미한다. (사용이 가능하더라도 사용하지 않음!)
*   보라색: Wifi사용시 사용불가한 analog핀
*   GPIO에서 Output이 가능한 모든 핀은 PWM으로 사용 가능
*   ADC: 0~3.3V (0~4095) (0~0.15V구간과 3.1~3.3V의 값은 리니어하지 않으므로 구별이 거의 불가능함
*   I2C: 아두이노IDE에서 사용하는 디폴트 핀
*   RTC GPIO: Ultra Low Power(Deep Sleep)모드의 ESP32를 Wake up
*   Strapping Pins: Bootloader나 Flashing시에 사용되며, 코드 업로드시 문제될 수 있음
*   High at Boot, Low at Boot, BOOT, PWM at Boot: Boot시 신호가 나오며, Output으로 사용하면 reset이나 booting시에 문제가 될 수 있는 핀

<br>

<br>

### Peripheral
ADC와 DAC 기능은 특정 핀에 고정되어 있다. 하지만 UART, I2C, SPI, PWM등의 기능은 어느 핀에 사용할지 결정해서 코드에서 지정해 줘야 한다. 소프트웨어에서 핀의 속성을 정의해 줄 수 있지만, 각 핀들은 디폴트로 지정되어 있는 기능들이 있다. (Pinout 참고)

| Pheripheral | ADC Channel | SP   | UART | I2C  | PWM  | DAC  | I2S  | Capacitive touch GPIO |
| ----------- | ----------- | ---- | ---- | ---- | ---- | ---- | ---- | --------------------- |
| 개수        | 18          | 3    | 3    | 2    | 16   | 2    | 2    | 10                    |

<br>


#### PWM(Pulse Width Modulation)
ESP32는 16개의 독립적인 채널을 통해 각각 다른 속성의 PWM 신호를 만들 수 있다. 출력으로 사용할 수 있는 모든 핀은 PWM으로 사용할 수 있으며, GPIO 34~39는 Input only핀이므로 PWM으로 사용할 수 없다. PWM신호를 만들기 위해 코드상에 4개의 파라미터를 정해주어야 한다.

*   Signal Frequency
*   Duty Cycle
*   PWM Channel
*   신호를 출력할 GPIO핀

<br>

#### I2C
I2C를 디폴트가 아닌 다른 핀을 사용할 경우, 아래와 같은 코드를 통해 지정한다. (디폴트 SDA 21, SCL 22)
```C
Wire.begin(SDA, SCL);
```

<br>

#### Interrupts
모든 GPIO핀은 인터럽트로 사용할 수 있다.

<br>

#### EN (Enable)
풀업되어 있는 3.3V 레귤레이터의 enable 핀이다. GND에 연결하면 3.3V 레귤레이터가 비활성화된다. 이 핀을 푸쉬버튼에 연결하면 ESP32를 재시동하는데 사용할 수 있다.

<br>

#### GPIO Current draw
권장 동작 조건에 따라 GPIO마다 최대 40mA의 전류를 흘릴 수 있다.

<br>

<br>

### Vin

ESP32 보드에 전원을 공급하는 방법은 3가지가 있다.

* USB 포트를 통한 공급
* 5V/GND 핀을 통한 공급
  * 5V핀을 통해서 전원을 공급할 경우, 전압은 5~12V 정도 사용하면 된다.
  * 최적 공급 전압은 **6~7V** 정도이며, 이보다 높은 전압을 공급할 경우 과열될 수 있다.
  * 5V 공급시 소비전류는 128mA이며, 10V 공급시 99.9mA 정도를 유지한다. 
* 3.3V/GND핀을 통한 공급
  * 3.3V핀을 통해서 전원을 공급할 경우에는, 공급 전압을 **(정확하게) 3.3V**로 유지해야 한다.

위 3가지 중 1가지 방법만으로 전원을 공급해야하며, 동시에 2~3가지 방법을 사용하면 ESP32 보드 자체가 고장날 수 있음에 유의한다.

<br>

<br>

### Troubleshooting

#### 1) 업로드시 error 메세지 

~~~
Warning: Could not auto-detect Flash size (FlashID=0xffffff, SizeID=0xff), defaulting to 4MB
Compressed 8192 bytes to 47...

A fatal error occurred: Timed out waiting for packet content
A fatal error occurred: Timed out waiting for packet content
~~~

GPIO12에 풀업을 넣을 경우 플래시 인식 오류가 발생한다. GPIO12 핀은 사용하지 않는 것이 좋다. 

<br>

<br>

### 그밖의 보드

#### TTGO T-Energy

![TTGO T-Energy](/image/TTGO-T-Energy01.jpg)

![TTGO T-Energy](/image/TTGO-T-Energy02.jpg)

<br>

#### TTGO T-BEAM

![TTGO T-BEAM](/image/TTGO-T-BEAM01.jpg)

![TTGO T-BEAM](/image/TTGO-T-BEAM02.jpg)