---
title: "Arduino, 온도측정(DS18b20)"
categories: ["arduino"]
date: 2018-09-02T00:41:00+09:00
toc: true
tags:
---

### DS18b20 온도센서

DS18b20 온도 센서를 이용하여 온도를 측정한다. 

- one-wire 버스 통신
- 공급전압: 3.0V ~ 5.5V
- 작동온도: -55ºC ~ +125ºC
- 오차: +/-0.5 ºC (-10ºC ~ 85ºC 범위에서)

<br>

#### Pinout

{{< figure src="/image/DS18b20.png" width="33%" class="center" >}}

<br>

#### schematic
DS18b20 센서는 두 가지 연결방법을 제공하는데, 하나는 VCC를 5V에 연결하는 Normal Mode이고 다른 하나는 VCC를 GND에 연결하는 Parasite Mode이다. 두가지 방법 모두 지원되지만 (경험상) Normal를 추천하며 (원인은 잘 모르겠지만) Parasite Mode에서는 온도센서가 작동이 되지 않는 경우도 가끔 있었다. 회로 구성을 위해 **4.7㏀ 저항 1개**가 필요하며 Normal Mode 구성을 위해 다음 그림과 같이 연결한다.

* 3가닥의 선에 브레드보드에 연결할 수 있는 핀을 납땜하고, 노란색선과 빨간색선의 연결부위에 4.7㏀ 저항을 추가로 납땜하여 연결한다.

{{< figure src="/image/ESP32-DS18b20-R01.png" width="75%" class="center" >}}

* 수축튜브를 사용하여 연결부위를 절연한 뒤,

{{< figure src="/image/ESP32-DS18b20-R02.png" width="75%" class="center" >}}

* 구경이 조금 더 큰 수축튜브를 사용하여 3가닥을 하나로 감싸 마무리한다.

{{< figure src="/image/ESP32-DS18b20-R03.png" width="75%" class="center" >}}

<br>

##### Normal Mode

{{< figure src="/image/ds18b20-temperature-normal-mode.png" width="75%" class="center" >}}

| DS18b20 | Yellow | Red  | Black |
| ------- | ------ | ---- | ----- |
| Arduino | 2      | 5V   | GND   |
| 4.7㏀   | O      | O    |       |

<br>

##### Parasite Mode

{{< figure src="/image/ds18b20-temperature.png" width="75%" class="center" >}}

| DS18b20 |      | Yellow | Red  | Black |
| ------- | ---- | ------ | ---- | ----- |
| Arduino | 5V   | 2      | GND  | GND   |
| 4.7㏀   | O    | O      |      |       |

<br>

#### sketch

##### 라이브러리 준비하기

*   OneWire (by Jim Studt etc.)
*   DallasTemperature (by Miles Burton)

<br>

##### sketch

```C++
#include <OneWire.h>
#include <DallasTemperature.h>

#define TEMP_PIN 2

OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);  
  Serial.println("DallasTemperature IC Control");

  // Start up the library
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
 
  float temperatureC = sensors.getTempCByIndex(0);
  float temperatureF = sensors.getTempFByIndex(0);
  Serial.print(temperatureC);
  Serial.println("*C");
  Serial.print(temperatureF);
  Serial.println("*F");
  delay(2000);
}
```

<br>

<br>


### TM1637에 온도 표시하기

<br>

#### schematic: Normal Mode
{{< figure src="/image/ds18b20-temperature-normal-mode-tm1637.png" width="100%" class="center" >}}

<br>

#### sketch
```C++
#include <Arduino.h>
#include <TM1637Display.h>

// Module connection pins (Digital Pins)
#define CLK 4
#define DIO 7

TM1637Display display(CLK, DIO);
uint8_t data[] = { 0xff, 0xff, 0xff, 0xff };
int seg3, seg2, seg1, seg0;

// DS18b20 Temperature Sensor Setting
#include <OneWire.h>
#include <DallasTemperature.h>
#define TEMP_PIN 2

OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);

float celciusTemperature;  // Celcius Temperature
int tempTemperature;

void setup() {
  Serial.begin(9600);  
  Serial.println("DallasTemperature IC Control");

  // DS18b20 Temperature Sensor Initialize
  sensors.begin();

  // TM1637 Initialize
  display.setBrightness(15); // 0 ~ 15 (15가 가장 밝음)
  // display.setBrightness(0x0f);
}

void loop() {
  sensors.requestTemperatures();
  celciusTemperature = sensors.getTempCByIndex(0);
  Serial.print("Temperature is: ");
  Serial.println(celciusTemperature);
  tempTemperature = celciusTemperature * 100;

  seg0 = (tempTemperature / 1000) % 10; // 4자리에서 1000의 자리 숫자 저장
  seg1 = (tempTemperature / 100) % 10;  // 4자리에서 100의 자리 숫자 저장
  seg2 = (tempTemperature / 10) % 10;   // 4자리에서 10의 자리 숫자 저장
  seg3 = tempTemperature % 10;          // 4자리에서 1의 자리 숫자 저장
    
  data[0]=display.encodeDigit(seg0);  // 첫번째 FND에 1000의 자리 숫자배열
  data[1]=display.encodeDigit(seg1);  // 두번째 FND에 100의 자리 숫자 배열
  data[2]=display.encodeDigit(seg2);  // 세번째 FND에 10의 자리 숫자 배열
  data[3]=display.encodeDigit(seg3);  // 네번째 FND에 1의 자리 숫자 배열

  // 온도가 100도보다 높으면 소수점 첫째자리까지 출력
  if (celciusTemperature >= 100) {
    display.showNumberDecEx(tempTemperature, (0x80 >> 2), true);
  }
  
  // 온도가 100도보다 낮으면 소수점 둘째자리까지 출력
  else {
    display.showNumberDecEx(tempTemperature, (0x80 >> 1), true);
  }

  delay(2000);
}
```

