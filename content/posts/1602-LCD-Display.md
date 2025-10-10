---
title: "1602 LCD, 조도, 초음파, 온습도"
categories: ["arduino"]
date: 2018-10-02T14:18:00+09:00
toc: true
tags:
---
1602 LCD 중에서 (I2C 모듈이 추가되어 있지 않은) 가장 기본적인 형태, 즉 1602 LCD만 있는 상태에서의 출력방법을 알아보겠습니다.

<br>

### schematic

![](/image/1602-01.jpg)

<br>

#### schematic : 백라이트 밝기 조절 추가

백라이트를 사용하지 않으면 너무 어두워서 글자가 잘 보이지 않는다. 적당한 밝기의 백라이트 사용을 위해 **LCD 3번핀을 3.3㏀ 거쳐서 GND로 연결**(혹은 1㏀ 3개를 직렬연결) 하거나, 아래 회로와 같이 가변 저항을 사용하면 백라이트의 밝기를 적절히 조절할 수도 있다.

![](/image/1602-02.jpg)




#### Pin Map
| LCD Pin |      |                    | Arduino Uno                               |
| ------- | ---- | :----------------: | ----------------------------------------- |
| 1       | VSS  |      LCD GND       | GND                                       |
| 2       | VDD  |      LCD 전원      | +5V                                       |
| 3       | VO   |    글자 대비값     | (가변저항 추가/미사용시 3.3㏀ 거쳐서 GND) |
| 4       | RS   |   레지스터 설정    | 12                                        |
| 5       | RW   | 읽기/쓰기모드 설정 | GND                                       |
| 6       | E    |  쓰기모드 활성화   | 11                                        |
| 7       | D0   |     데이터 핀      |                                           |
| 8       | D1   |         ″          |                                           |
| 9       | D2   |         ″          |                                           |
| 10      | D3   |         ″          |                                           |
| 11      | D4   |         ″          | 5                                         |
| 12      | D5   |         ″          | 4                                         |
| 13      | D6   |         ″          | 3                                         |
| 14      | D7   |         ″          | 2                                         |
| 15      | A    | 배경밝기 전압입력  | (가변저항 추가)                           |
| 16      | K    |    배경밝기 GND    | (가변저항 추가)                           |

<br>

<br>

### sketch

#### 라이브러리 설치하기

이 경우에는 Arduino IDE에 기본적으로 포함되어 있는 LiquidCrystal 라이브러리를 이용한다.

*   **스케치**\> **라이브러리 포함하기**\> **LiquidCrystal**

```C
#include <LiquidCrystal.h>
```

<br>

#### function

| function                                  | 기능                                                     |
| ----------------------------------------- | -------------------------------------------------------- |
| LiquidCrystal()                           | LCD 클래스 생성(LCD interface 설정)                      |
| begin()                                   | LCD 화면 초기화(column과 row 설정)                       |
| clear()                                   | LCD 화면을 지우고 커서를 (0,0) 위치로 옮김               |
| home()                                    | 커서를 (0,0) 위치로 옮김                                 |
| setCursor()                               | 커서를 특정 위치로 옮김                                  |
| write()                                   | 현재 커서에 한 문자를 출력                               |
| print()                                   | 현재 커서부터 출력 (Serial.print() 함수와 유사)          |
| cursor(), nocursor()                      | 커서 표시 O or X                                         |
| display(), noDisplay()                    | LCD 화면에 정보 표시 O or X                              |
| scrollDisplayLeft(), scrollDisplayRight() | LCD 내용과 커서를 좌/우로 한 칸 스크롤                   |
| autoscroll(), noautoscroll()              | 문자 출력 시 이전 내용을 스크롤 할 지를 결정             |
| leftToRight(), rightToLeft()              | 문자 출력 후 커서의 이동 위치 결정 (문자 출력 방향 결정) |
| createChar()                              | 사용자 문자 등록, 총 8개까지 가능                        |

<br>

<br>

### 예시

#### sketch : 문자 2열 출력하기
```C
    #include <LiquidCrystal.h>
    
    LiquidCrystal lcd(12,11,5,4,3,2);  // pin 연결에 대한 class 선언 (RS,E,D4,D5,D6,D7)
    
    void setup() {
    	lcd.begin(16, 2);             // LCD크기 지정
    	lcd.print("SKS Afterschool");
    	lcd.setCursor(0, 1);          // 커서를 (0,1) 즉 두번째 줄(행)의 첫번째 칸(열)으로 이동
    	lcd.print("Let's Arduino!!");
    }
    
    void loop() {
    }
```

<br>


#### sketch : 문자열 좌우 스크롤하기
```C
#include <LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  lcd.begin(16, 2);
  lcd.print("SKS Afterschool");
  lcd.setCursor(0, 1);
  lcd.print("Let's Arduino!!");
  delay(1000);
}

void loop() {
  for (int left = 0; left < 15; left++) {
    lcd.scrollDisplayLeft();  // 15번 왼쪽으로 이동 (15글자)
    delay(300);
  }

  for (int right = 0; right < 31; right++) {
    lcd.scrollDisplayRight();  // 31번 오른쪽으로 이동 (15글자+16칸)
    delay(300);
  }

  for (int left = 0; left < 16; left++) {
    lcd.scrollDisplayLeft();  // 16번 왼쪽으로 이동 (16칸)
    delay(300);
  }

  delay(1000);
}
```

<br><br>

### 문자열과 조도센서값을 출력하기


#### schematic
![](/image/1602-03.jpg)

<br>

#### sketch : 문자열과 조도센서를 읽은 조도값을 동시에 출력하기
```C
#include <LiquidCrystal.h>

LiquidCrystal lcd(12,11,5,4,3,2);  // pin 연결에 대한 class 선언 (RS,E,D4,D5,D6,D7)

void setup() {
	lcd.begin(16, 2);             // LCD크기 지정
	lcd.print("Illumination:");
}

void loop() {
	lcd.setCursor(0, 1);         // 커서를 (0,1) 즉 첫번째 줄의 두번째 칸으로 이동
	lcd.print(analogRead(A0));   // A0에서 읽은 조도값을 출력
	delay(200);
}
```

<br>

#### sketch : 조도 센서값을 위로 스크롤시키기
```C
#include <LiquidCrystal.h>

int i, j, k=1;
LiquidCrystal lcd(12,11,5,4,3,2);

void setup() {
  lcd.begin(16, 2);
  lcd.print("Illumination:");
  lcd.setCursor(0, 1);        // 두번째 줄에
  i = analogRead(A0);
  lcd.print("Check#");
  lcd.print(k);               // 측정 횟수
  lcd.print(" : ");
  lcd.print(i);               // 첫번째 조도값 출력
  delay(1000);
}

void loop() {
  lcd.clear();                // lcd 화면 지우고 (0,0)으로 커서 이동
  j = i;                      // 이전 조도값을 j에 저장
  lcd.print("Check#");
  lcd.print(k);               // 이전 조도값 측정 횟수
  lcd.print(" : ");
  lcd.print(j);               // 이전 조도값 출력

  lcd.setCursor(0, 1);        // 두번째 줄로 이동
  i = analogRead(A0);         // 새로운 조도값 측정
  k++;                        // 측정 횟수 증가
  lcd.print("check#");
  lcd.print(k);               // 새로운 측정 횟수
  lcd.print(" : ");
  lcd.print(i);               // 새로운 조도값 출력
  
  delay(1000);
}
```

<br>

<br>

### 초음파 센서 거리값 출력하기

초음파를 이용하여 사물간의 거리를 측정하는 센서입니다. 아두이노에서는 HC-SR04, US-100 제품을 많이 사용하며, 여기서는 HC-SR04를 사용해보겠습니다.

<br>


#### schematic

![](/image/1602-04.jpg)

<br>

#### Pin Map : HC-SR04

| DHT11              | 아두이노           |
| ------------------ | ------------------ |
| VCC                | 5V                 |
| Trig (초음파 송신) | 8 (pinMode 설정함) |
| Echo (초음파 수신) | 9 (pinMode 설정함) |
| GND                | GND                |

<br>

#### sketch
```C
#include <LiquidCrystal.h>
#define TRIG 8
#define ECHO 9

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
   pinMode(TRIG, OUTPUT);
   pinMode(ECHO, INPUT);
   lcd.begin(16, 2);
}

void loop() {
  digitalWrite(TRIG, LOW);  // 초음파발사 정지(초기화)
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); // 초음파발사
  delayMicroseconds(2);
  digitalWrite(TRIG, LOW);  // 초음파발사 정지

  long distance = pulseIn(ECHO, HIGH)/58.2;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(distance);
  lcd.print(" cm");
  delay(200);
}
```

<br>

<br>

### DHT11 온·습도센서 값 출력하기
DHT11 센서를 사용하면 온도와 습도를 동시에 측정할 수 있다. 여기서는 1602 LCD에 온도와 습도를 출력해본다.

<br>

#### schematic

![](/image/1602-05.jpg)

<br>

#### Pin Map

| DHT11   | 1    | 2    | 3                      | 4    |
| ------- | ---- | ---- | ---------------------- | ---- |
| Arduino | 5V   |      | 2, 10㏀ 저항 거쳐서 5V | GND  |

<br>

#### 라이브러리 추가하기
*   **스케치**\> **라이브러리 포함하기**\> **라이브러리 관리**\> **라이브러리 매니저** 에서 "DHT11" 검색
*   DHT sensor library by Adafruit 설치

<br>

#### sketch
```C
#include <LiquidCrystal.h>
#include <DHT.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);    // RS, E, D4, D5, D6, D7
#define DHTPIN 10
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  dht.begin();
  lcd.begin(16, 2);
}

void loop() {
  float t = dht.readTemperature();       // read temperature
  float h = dht.readHumidity();          // read humidity

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp.: ");                  // write temperature 
  lcd.print(t);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Humi.: ");                  // write humidity
  lcd.print(h);
  lcd.print("%");
  delay(1000);
}
```

<br>

<br>

### 과제
입력버튼을 만들과, 각 버튼을 누를때마다 A → B → C → D 등 출력하기

