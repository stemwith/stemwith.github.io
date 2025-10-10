---
title: "Arduino, 온도 및 습도 측정 (DHT22)"
categories: ["arduino"]
date: 2018-09-02T01:41:00+09:00
toc: true
tags:
---

### 온습도 센서 DHT22

DHT22 센서를 이용하여 온도와 습도를 측정한다. 

| 센서 | DHT11                         | DHT22 (AM2302)                                               |
| ---- | ----------------------------- | ------------------------------------------------------------ |
| 사진 | ![DHT11](/image/dht22-02.png) | {{< figure src="/image/dht22-01.png" class="center" >}} |
| 온도 | 0 ~ 50℃ (오차범위 ±2℃)        | -40 ~ 100℃ (오차범위 ±0.5℃) (해상도 0.1℃)                    |
| 습도 | 20 ~ 90% (오차범위 ±5%)       | 0 ~ 100% (오차범위 ±2~5%) (해상도 0.1%)                      |

<br>

#### Pinout

| DHT22   | DAT  | VCC  | GND  |
| ------- | ---- | ---- | ---- |
| Arduino | 8    | 5V   | GND  |

<br>

#### schematic
![](/image/dht22-05.png)

<br>

<br>

#### 라이브러리 준비하기
##### Case1: 위 사진과 같은 형태의 DHT22 모듈을 사용하는 경우

- 라이브러리 매니저검색창에 검색어로 'AM2302'를 입력
  
  - Groove Temperature And Humidity Sensor (by Seeed Studio) 설치
  
    ![](/image/dht22-07.png)

<br>

##### Case2: 위 라이브러리로 동작하지 않는 경우

2개의 라이브러리가 필요합니다. 

* 먼저 DHT sensor library (by Adafruit)를 검색하여 설치를 클릭합니다.

  ![](/image/dht22-03.png)

- 그러면 Dependencies for library DHT sensor library 창이 나타나는데, 이때 Install all을 클릭하면 2개의 라이브러리가 동시에 설치됩니다.

  ![](/image/dht22-04.png)

두 개의 라이브러리를 설치하기만 하면 되기때문에, 순서가 바뀌어도 관계없습니다.

<br>

<br>

#### sketch
```C
#include <DHT.h>

#define DHTPIN    8          // data pin
#define DHTTYPE   DHT22      // change to DHT11 if you're using the DHT11
                             // AM2301(DHT21) -> DHT21, AM2302(DHT22) -> DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);
  
  // float temperature = dht.readTemperature();
  // float humidity = dht.readHumidity();
  float temp_hum_val[2] = {0};

  if(!dht.readTempAndHumidity(temp_hum_val)){
    Serial.print("Temperature: ");
    Serial.print(temp_hum_val[1]);
    Serial.print(" *C\t,\t");
    Serial.print("Humidity: ");
    Serial.print(temp_hum_val[0]);
    Serial.println(" %");
  }
  else{
    Serial.println("Failed to get temprature and humidity value.");  
  }
}
```

<br>

<br>

### 1602 LCD에 온도, 습도 출력하기


#### schematic

![](/image/dht22-06.png)

<br>

#### sketch

```C
#include <DHT.h>

#define DHTPIN    8          // data pin
#define DHTTYPE   DHT22      // change to DHT11 if you're using the DHT11
                             // AM2301(DHT21) -> DHT21, AM2302(DHT22) -> DHT22
DHT dht(DHTPIN, DHTTYPE);

// I2C 1602 LCD (연결핀을 바꿀 수 없음)
// VCC-5V / GND-GND / SDA-A4 / SCL-A5
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// i2c address 는 칩에 따라 0x27, 0x3F값을 가짐
LiquidCrystal_I2C lcd(0x27, 16, 2);  

void setup() {
  Serial.begin(9600);
  dht.begin();
    
  // lcd 초기화
  lcd.init();    
  lcd.backlight();
}

void loop() {
  delay(2000);
  
  // float temperature = dht.readTemperature();
  // float humidity = dht.readHumidity();
  float temp_hum_val[2] = {0};

  if(!dht.readTempAndHumidity(temp_hum_val)){
    Serial.print("Temperature: ");
    Serial.print(temp_hum_val[1]);
    Serial.print(" *C\t,\t");
    
    lcd.setCursor(0, 0);
    lcd.print("Temp. : ");
    lcd.print(temp_hum_val[1]);
    lcd.print("*C");

    Serial.print("Humidity: ");
    Serial.print(temp_hum_val[0]);
    Serial.println(" %");
      
    lcd.setCursor(0, 1);
    lcd.print("Humi. : ");
    lcd.print(temp_hum_val[0]);
    lcd.print(" %");
  }
  else{
    Serial.println("Failed to get temprature and humidity value.");  
  }
}
```

