---
title: Arduino, 1602 LCD (I2C)
categories:
  - arduino
date: 2018-09-03 00:42:00
tags:
---

## schematic
![](/image/1602lcd.png)

<br>

| 1602 LCD | SDA  | SCL  | VCC  | GND  |
| -------- | ---- | ---- | ---- | ---- |
| Arduino  | A4   | A5   | 5V   | GND  |

<br>

## 라이브러리 설치하기


**스케치**\> **라이브러리 포함하기**\> **라이브러리 관리**

*   Wire : 기본 내장 라이브러리
*   LiquidCrystal I2C (by Frank de Brabander) 검색하여 설치

<br>

## sketch

```C
// I2C 1602 LCD (연결핀을 바꿀 수 없음)
// VCC-5V / GND-GND / SDA-A4 / SCL-A5
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// i2c address 는 칩에 따라 0x20~0x27 혹은 0x3F값을 가짐
LiquidCrystal_I2C lcd(0x27, 16, 2);  

void setup() {
  lcd.init();               // lcd 초기화
  lcd.backlight();

  lcd.print("I Love Steam!!");   // LCD창에 메시지 출력
  delay(1000);
}

void loop() {
  // 문자열의 길이 13개를 왼쪽으로 스크롤
  for(int pCount = 0; pCount < 13; pCount++) {  
    lcd.scrollDisplayLeft();         // 왼쪽으로 스크롤
    delay(700);
  }
  // 문자열 길이 13열 + 기본 16열 = 29개 위치를 오른쪽으로 스크롤
  for(int pCount = 0; pCount < 29; pCount++) { 
    lcd.scrollDisplayRight();       // 오른쪽으로 스크롤
    delay(700);
  }
  // 왼쪽으로 16개 위치 스크롤하여 처음 위치로 이동
  for(int pCount = 0; pCount < 16; pCount++) {
    lcd.scrollDisplayLeft();         // 왼쪽으로 스크롤
    delay(700);
  }
 
  delay(1000);
}
```

<br>

<br>

### 주의사항

- I2C 모듈에 점퍼선을 뺏다가 다시 끼우는 경우, 정상적인 상황에서도 LCD가 작동하지 않는 경우가 있음 (주로 첫번째라인에 ■■■■■■■■■■■■■■■■ 형태로 출력되는 오류가 발생됨)
- 이런 경우에는 배선을 모두 완료한 상태에서 스케치 업로드를 다시 하면 대부분 해결됨

<br>

<br>

## 여러 가지 문자열 출력해보기

*   첫 번째 행에 I Love Steam!!
*   두 번째 행에 본인의 영문이름을 써서 스크롤 해보기
*   두 번째 행에 출력하는 방법 : lcd.setCursor(0,1);

<br>

<br>

# 1602LCD에 DS18b20 온도센서 값 출력하기

<br>


## schematic

![](/image/1602lcd-ds18b20.png)

<br>

## sketch

```C
// DS18b20 Temperature Sensor
#include <OneWire.h>
#include <DallasTemperature.h>

#define TEMP_PIN 2

OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);
float celciusTemperature;

// I2C 1602 LCD (연결핀을 바꿀 수 없음)
// VCC-5V / GND-GND / SDA-A4 / SCL-A5
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// i2c address 는 칩에 따라 0x27, 0x3F값을 가짐
LiquidCrystal_I2C lcd(0x27, 16, 2);  

void setup() {
  Serial.begin(9600);  
  Serial.println("DallasTemperature IC Control");

  // Start up the Temperature Sensor library
  sensors.begin();

  // lcd 초기화
  lcd.init();    
  lcd.backlight();
}

void loop() {
  sensors.requestTemperatures();
  celciusTemperature = sensors.getTempCByIndex(0);
  Serial.print("Temperature is: ");
  Serial.println(celciusTemperature);

  lcd.setCursor(0, 0);
  lcd.print("Temperature : ");
  lcd.setCursor(0, 1);
  lcd.print(celciusTemperature);
  lcd.print("*C");
  delay(2000);
}
```