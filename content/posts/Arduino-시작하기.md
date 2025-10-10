---
title: "Arduino 시작하기, RGB LED, PWM"
categories: ["arduino"]
date: 2018-09-01T16:00:00+09:00
toc: true
tags:
---

## Arduino

![](/image/arduino-01uno.png)

<br>

### Pinout

#### Digital & Analog

![](/image/arduino-02unopin.png)

* Digital 
  * 0~13번 핀
  * PWM:3,5,6,9,10,11번 핀 (**8bit**로 **0~255**의 범위를 사용)
* Analog Input:  ADC **10bit**로 **0~1023**의 범위를 사용
* 스케치 업로드 중에는 0번핀(RX), 1번핀(TX)을 사용할 수 없다.

<br>

#### 전원부 V_in

* input으로 사용
  * 기본적으로 파워잭을 사용하는 것과 같음
  * 아두이노에 전원을 공급 (6.6V~12V 범위에서 가능)
  * 외부전원이 Vin을 통해 공급되면, USB포트에서 나오는 전원공급은 자동으로 차단됨
  * 최소 전압은 6.6V이나, 다이오드에서의 전압 강하로 인해, 최소 7.2V가 공급되어야 USB포트에서의 전원이 차단되고, 외부전원으로 아두이노가 전원을 공급받기 시작함

* output으로 사용
  * 파워잭으로 전원을 공급하면, Vin은 자동으로 OUTPUT용도가 됨
  * 5V보다 큰 전압, 전류를 필요로 하는 장치(모터 등)를 연결할 경우, 파워잭으로 전원을 공급하고 Vin으로 출력

<br>

### Arduino 보드의 종류
![](/image/arduino-04arduino.png)

<br>

### 브레드 보드 & 점퍼선
![](/image/arduino-03breadboard.png)

<br>

### 부품, 센서, 모듈, 쉴드
![](/image/arduino-05parts.png)

<br>

<br>

## Arduino IDE

### Arduino IDE 설치하기
*   2021년 9월 현재 최신버전 1.8.60 & 2.0 beta 11 (당분간 1.8.x 버전 설치 추천)
*   [아두이노 홈페이지, www.arduino.cc](https://www.arduino.cc/en/Main/Software) 에서 다운로드 받아 설치
*   설치 경로에 한글이 포함되지 않도록 한다.
*   설치 완료 후, 아두이노 IDE를 실행하면 arduino driver가 설치된다. 모두 설치
*   호환칩(CH340 or CH341)을 사용하는 아두이노의 경우, [칩제조사 홈페이지](http://www.wch.cn/download/CH341SER_ZIP.html)에서 별도의 driver를 다운로드 받은 후 추가로 설치해야 한다.

<br>

>CH340/341 호환칩을 사용하는 아두이노 우노보드의 경우 빨간색으로 된 표시된 부분의 칩이 직사각형인 형태로 되어 있는 경우가 많다. 정품의 경우 FT232칩을 사용하며, 대부분의 경우 동일한 위치에 정사각형 모양의 칩을 가지고 있다. 드라이버 추가 설치이외의 기능상의 차이점은 없다.

![](/image/arduino-ch341.png)

<br>

### Arduino IDE의 기본 구성
![](/image/arduino-06ide.png)

<br>

### Arduino 연결하기

1. USB A(M)-B(M) 케이블을 사용하여 PC와 아두이노 우노를 연결한다. (아두이노에 연결하는 포트는 대부분 USB-B(M) type이나, 최근 나오는 일부 호환 보드의 경우 microUSB 포트인 경우도 있다.)

   ![](/image/arduino-07link.png)

<br>

2. **툴**\> **보드**\> 에서 Arduino 보드를 선택한다. → Arduino/Genuino Uno
   ![](/image/arduino-08board.png)

<br>

3. **툴**\> **포트**\> 에서 Arduino에 연결되어 있는 포트를 선택한다. → COMx (Arduino/Genuino Uno)
   ![](/image/arduino-09comport.png)

<br>

<br>

## Arduino 스케치

### 기본 구조

```c
블록‘I’             // 블록I은 라이브러리, 변수 선언 (필요없는 경우 생략가능)
    
void setup() {     // 블록II 부분을 아두이노 켜질 때 딱 한번 실행
	블록‘II’        // 초기화, pinMode …   
}
    
void loop() {      // 블록III 부분을 반복 실행
	블록‘III’
}
```

<br>

<br>

### Exercise 1:

```C
/* 처음 해보는 아두이노 코딩
   LED 깜박이기 */

void setup() {
  pinMode(13, OUTPUT);      // digitalWrite 사용시 pinMode 설정해야 함. (플로팅 방지)
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}

void loop() {

}
```

- void setup에 모든 명령어가 위치
- ; (세미콜론)은 문장이 끝났음을 선언
- **처음 컴파일하는 경우 파일을 저장하는 절차가 수행되며, 이를 위해 파일 이름을 지정해주어야 함 **
- 주석문 사용 방법 (컴파일시 skip)
  - // ~~~~              1개의 라인만 주석문 처리 
  - /* ~~~~*/          여러개의 라인을 /** */ 안에 넣어서 주석문을 만들 수 있음

<br>

#### pinMode(13, OUTPUT);

*   13번 핀을 출력 모드로 설정 (※입력 모드로 사용하려면 OUTPUT 대신 INPUT or INPUT_PULLUP 사용)
*   pinMode는 digitalRead, digitalWrite를 사용하는 핀에만 선언
*   즉, 0과 1의 입출력에만 사용하는 핀에 선언하며, PWM사용핀은 pinMode 선언이 불필요하다.
*   INPUT은 입력핀으로 사용시, OUTPUT은 출력핀으로 사용시

<br>

#### digitalWrite(led, HIGH);

*   디지털 핀의 전압을 LOW(0의 값) 또는 HIGH(1의 값)로 설정
    *   LOW : 0V (전기가 통하지 않음)
    *   HIGH : 5V (전기가 통함)

<br>

#### delay(1000);

*   특정 시간 동안 아두이노를 멈추게 하는 명령 (ms 단위)
    *   1초 : 1000
    *   5초 : 5000

<br>

- 그러므로 위 예제는,
  - 아두이노 보드에 있는 13번 LED가 1초가 켜졌다가 꺼짐
  - void loop에서 수행할 반복 명령이 없으므로, LED가 꺼진 상태를 그대로 유지

<br>

<br>

### Exercise 2:

```C
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

- void setup
  - pinMode는 digitalWrite를 사용하는 pin을 설정하여 플로팅을 방지하는 선언이므로, 한번만 실행하면 됨
- void loop에 의해
  - 1초간 켜졌다가, 1초간 꺼지는 것을 반복

<br>

<br>

### Exercise 3: 변수 설정

```C
int led = 13;

void setup() {
	pinMode(led, OUTPUT);
}

void loop() {
  	digitalWrite(led, HIGH);
   	delay(1000);
   	digitalWrite(led, LOW);
   	delay(1000);
}
```

<br>

#### int led = 13;

*   led 라는 integer (정수) 변수를 선언
*   led 변수의 값을 13으로 지정

<br>

<br>

### Exercise 4: 상수로 설정하는 경우(1)

```C
#define led 13

void setup() {
	pinMode(led, OUTPUT);
}

void loop() {
  	digitalWrite(led, HIGH);
   	delay(1000);
   	digitalWrite(led, LOW);
   	delay(1000);
}
```

<br>

#### #define led 13

*   int led = 13; 을 사용하는 대신 #define으로 상수 선언을 해도 됨
*   상수 형태로 선언하면 컴파일시에 정의된 값을 참조하여 대체하므로 메모리를 차지하지 않음
*   **#define을 사용하는 경우, 문장 종료 기호인 ;(세미콜론)을 사용하지 않음!**

<br>

<br>

### Exercise 5: 상수로 설정하는 경우(2)

```C
const int led = 13;

void setup() {
	pinMode(led, OUTPUT);
}

void loop() {
  	digitalWrite(led, HIGH);
   	delay(1000);
   	digitalWrite(led, LOW);
   	delay(1000);
}
```

<br>

#### const int led = 13;

*   const int led = 13; 형태로 상수 선언을 해도 됨
*   단, **문장종료 기호인 ;(세미콜론)을 사용함!**

<br>

<br>

### Blink 예제
**파일**\> **예제**\> **01.Basics**\> **Blink**


```c
/*
   (주석문 생략)
*/

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
```

<br>

#### Exercise
1.  켜고 끄는 시간을 시간을 2초로 설정해본다.

<br>

<br>

### 신호등 LED

{{< figure src="/image/3led.png" width="50%" class="center" >}}

<br>

#### Exercise

빨간색 5초 → 노란색 1초 → 초록색 5초씩 번갈아가면서 점등되도록 만들어 보자.

<br>

<br>

## RGB LED

### RGB LED의 3색을 교대로 점멸하기

<br>

#### schematic
![](/image/arduino-10rgbled.png)

<br>

#### sketch: RGB LED 모듈의 핀이 **(GND,R,G,B)**형태로 구성되어 있는 경우

- digitalWrite를 사용하는 경우: HIGH 켜짐, LOW 꺼짐
- analogWrite를 사용하는 경우: 0 꺼짐, 255 켜짐

```c
int pin_ledR = 9; 
int pin_ledG = 10; 
int pin_ledB = 11; 

void setup() {
	pinMode(pin_ledR, OUTPUT);
	pinMode(pin_ledG, OUTPUT);
	pinMode(pin_ledB, OUTPUT);
}
    
void loop() {
	digitalWrite(pin_ledR, HIGH);
	delay(1000);
	digitalWrite(pin_ledR, LOW);
	digitalWrite(pin_ledG, HIGH);
	delay(1000);
	digitalWrite(pin_ledG, LOW);
	digitalWrite(pin_ledB, HIGH);
	delay(1000);
	digitalWrite(pin_ledB, LOW);
}
```

<br>
<br>

#### 주의사항: RGB LED 모듈의 핀이 **(VCC,R,G,B)형태**로 구성되어 있는 경우

- **255에서 각 Color 코드값을 뺀 값**으로 사용해야 한다!!! (주의할 것)

> - digitalWrite를 사용하는 경우
>
>   - HIGH 꺼짐
>   - LOW 켜짐
>
> - analogWrite를 사용하는 경우
>
>   - 원래 값이 "0"인 경우 LED가 꺼지는 것이 정상이지만, VCC/R/G/B LED의 경우는
>
>     255 - 0 = **255** 일때, LED가 꺼짐
>
>   - 원래 값이 "255"인 경우 LED가 켜지는 것이 정상이지만, VCC/R/G/B LED의 경우는
>
>     255 - 255 = **0** 일때 LED가 켜짐
>
>   - Red LED의 세기를 "153"으로 주고 싶을 경우, VCC/R/G/B LED에서는
>
>     255 - 153 = **102** 의 값을 주어야 함

<br>

#### (수정된) sketch: (**VCC**,R,G,B로 구성된 모듈의 경우)

```C
int pin_ledR = 9; 
int pin_ledG = 10; 
int pin_ledB = 11; 

void setup() {
	pinMode(pin_ledR, OUTPUT);
	pinMode(pin_ledG, OUTPUT);
	pinMode(pin_ledB, OUTPUT);
}
    
void loop() {
	digitalWrite(pin_ledR, LOW);
	delay(1000);
	digitalWrite(pin_ledR, HIGH);
	digitalWrite(pin_ledG, LOW);
	delay(1000);
	digitalWrite(pin_ledG, HIGH);
	digitalWrite(pin_ledB, LOW);
	delay(1000);
	digitalWrite(pin_ledB, HIGH);
}
```

<br>

<br>

## PWM

### Arduino PWM 출력

*   **analogWrite()** : 8bit를 사용하므로 **0~255** 범위에서 센서값을 출력
*    **GND**,R,G,B로 구성된 모듈의 경우
    *   analogWrite(pin_ledR, **0**);           pin_ledR에 연결된 LED를 **"켬"**
    *   analogWrite(pin_ledR, **255**);       pin_ledR에 연결된 LED를 **끔**
*   PWM 출력이 가능한 디지털핀(**3,5,6,9,10,11**)을 사용하여 출력
*   **pinMode 선언 불필요**
    *   예를들어, pinMode(9, OUTPUT); → 9번 핀으로 PWM 출력을 한다면 불필요한 선언임

<br>

#### sketch: (**GND**,R,G,B로 구성된 모듈의 경우)

```C
int pin_ledR = 9; 
int pin_ledG = 10; 
int pin_ledB = 11; 

void setup() {      // pinMode 필요없음
}
    
void loop() {
	analogWrite(pin_ledR, 255);
	delay(1000);
	analogWrite(pin_ledR, 0);
	analogWrite(pin_ledG, 255);
	delay(1000);
	analogWrite(pin_ledG, 0);
	analogWrite(pin_ledB, 255);
	delay(1000);
	analogWrite(pin_ledB, 0);
}
```

<br>

### 여러가지 색깔 만들어보기

#### 16진수 및 10진수 Color Table

![](/image/color_table01.png)

![](/image/color_table02.png)

![](/image/color_table03.png)

![](/image/color_table04.png)

※ 색깔이 미묘하게 다를 수 있다.

<br>

#### sketch: 006699 (R:000, G:102, B:153) 색깔 만들기

```C
int pin_ledR = 9; 
int pin_ledG = 10; 
int pin_ledB = 11; 

void setup() {
}
    
void loop() {
	analogWrite(pin_ledR, 0);
	analogWrite(pin_ledG, 102);
	analogWrite(pin_ledB, 153);
}
```

<br>

#### Exercise: 무지개 색깔 만들기

- 1초마다 빨-주-노-초-파-남-보 순서대로 색깔이 출력되도록 만들어 본다. (색상표에서 가장 비슷한 색깔 선택)

- 각 색깔을 출력한 뒤
  
- delay(1000); 을 추가하여야 1초간 해당 색깔이 유지된다.
  
  |              | 빨   | 주   | 노   | 초   | 파   | 남   | 보   |
  | ------------ | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
  | R color code |      |      |      |      |      |      |      |
  | G color code |      |      |      |      |      |      |      |
  | B color code |      |      |      |      |      |      |      |

<br>

### RGB Gradation: 그라데이션 효과를 주어 색깔 바꿔보기

- 빨간색 (R:255, G:0, B:0)에서 초록색 (R:0, G:255, B:0)으로 색깔 바꾸기
  - R값이 255에서 시작하여 0까지 감소하는 동안
  - G값은 0에서 시작하여 255까지 감소하면 된다.
  - B는 0 유지

<br>

#### for문 사용하기

- 기본 문법

  ```C
  for(초기값; 조건; 증감) {
      반복처리문;
  }
  ```

- 예를들어

  ```C
  for(R=255; R>=0; R--) {
      반복처리문;
  }
  ```

  - R값이 255부터
  - 0보다 크거나 같을 때(0)까지
  - R값을 1씩 감소시키면서
  - 반복처리문을 실행
  - 즉, 반복처리문을 256회 실행

<br>

#### Color값 변화시키기

- 먼저 변화하는 값을 저장할 변수를 설정하고, 초기값으로 0을 지정 (초기값은 지정하지 않아도 됨)

  ```C
  int R = 0;
  int G = 0;
  int B = 0;
  ```

- R값을 255부터 0까지 감소시키면서, G값은 0에서 255까지 감소시킴

  ```C
  for(R=255; R>=0; R--) {
      G = 255 - R;
  }
  ```

  

- 여기에 analogWrite를 추가하고, 색깔이 일정한 시간동안 나타난 뒤 바뀌도록 delay를 추가

  ```C
  for(R=255; R>=0; R--) {
  	G = 255 - R;
  	analogWrite(pin_ledR, R);
  	analogWrite(pin_ledG, G);
  	analogWrite(pin_ledB, 0);
  	delay(10);
  }
  ```

<br>

#### 빨간색>초록색 그라데이션 코드 완성하기

```C
int R = 0;
int G = 0;
int B = 0;

int pin_ledR = 9; 
int pin_ledG = 10; 
int pin_ledB = 11; 

void setup() {
}
    
void loop() {
	for(R=255; R>=0; R--) {
		G = 255 - R;
		analogWrite(pin_ledR, R);
		analogWrite(pin_ledG, G);
		analogWrite(pin_ledB, 0);
		delay(10);
	}
}
```

<br>

#### Exercise: 빨간색>초록색>파란색>(반복)>> 그라데이션

<br>

<br>

## Analog 신호의 처리

### 가변저항 값을 시리얼모니터에 출력하기

#### ANALOG IN(A0~A5) 핀의 역할

1.  아날로그 입력으로 사용 : analogRead()
    *   analogRead()는 pinMode 선언 불필요
    *   예를들어, pinMode(A0, INPUT); → 불필요한 선언임
2.  PWM을 사용하는 디지털 입력으로 사용 : 
3.  analogRead()
    *   analogRead() : 10bit를 사용하므로 0~1023 범위에서 센서값을 읽음

<br>

#### schematic

![](/image/arduino-11potentiometer.png)

<br>

#### sketch
```C
int value_potentiometer = 0;      // potentiometer value

void setup() {
	Serial.begin(9600); 
}

void loop() {
	value_potentiometer = analogRead(A0);       // 10bit (0~1023)
	Serial.println(value_potentiometer);
	delay(100);
}
```

<br>

<br>

### 가변저항 값에 따라 LED 밝기 조절하기

#### schematic
![](/image/arduino-12rgbled_potentiometer.png)

<br>

#### sketch
```c
int pin_ledB = 11;                // Blue LED for PWM
int value_potentiometer = 0;      // potentiometer value

void setup() {
	Serial.begin(9600);  
}

void loop() {
	value_potentiometer = analogRead(A0);                             // 10bit (0~1023)
	value_potentiometer = map(value_potentiometer, 0, 1023, 0, 255);  // 10bit → 8bit
    analogWrite(pin_ledB, value_potentiometer);
	Serial.print("illumination level: "); 
	Serial.println(value_potentiometer);
	delay(100);
}
```

<br>

<br>

## 시리얼 모니터 사용하기

```C
void setup() {
	Serial.begin(9600);         // 시리얼 모니터 사용 선언, 출력속도 지정 9600 Baud rate
}

void loop() {
    Serial.print("A");          // print   출력
    Serial.println("B");        // println 출력 후 줄바꾸기
    Serial.print("C");
    Serial.println("D");
    Serial.println();
    
    for(int i=1; i<11; i++) {
        Serial.println(i);      // 변수값 출력
    }
    delay(5000);
    
    Serial.println();
}
```

<br>

### Excercise 1.

* 시리얼 모니터에 출력해보기

```
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
```

```C
void setup() {
	Serial.begin(9600);         // 시리얼 모니터 사용 선언, 출력속도 지정 9600 Baud rate
}

void loop() {
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
	Serial.println("**********");
    delay(5000);
}
```

<br>

* for문을 사용하여 위 모양대로 출력해보기

```C
void setup() {
  Serial.begin(9600);         // 시리얼 모니터 사용 선언, 출력속도 지정 9600 Baud rate
}

void loop() {
  for(int i=1; i<=10; i++) {   // 1 ~ 10행
      Serial.println("**********");
  }
  Serial.println();
  delay(5000);
}
```

<br>

### Excercise 2.

* 시리얼 모니터에 출력해보기

```
*
**
***
****
*****
******
*******
********
*********
**********
```

```C
void setup() {
  Serial.begin(9600);         // 시리얼 모니터 사용 선언, 출력속도 지정 9600 Baud rate
}

void loop() {
  Serial.println("*");
  Serial.println("**");
  Serial.println("***");
  Serial.println("****");
  Serial.println("*****");
  Serial.println("******");
  Serial.println("*******");
  Serial.println("********");
  Serial.println("*********");
  Serial.println("**********");
  delay(5000);
  Serial.println();
}
```

<br>

* for문을 사용하여 위 모양대로 출력해보기

```C
void setup() {
  Serial.begin(9600);         // 시리얼 모니터 사용 선언, 출력속도 지정 9600 Baud rate
}

void loop() {
  for(int i=1; i<=10; i++) {   // 1 ~ 10행
    for(int j=1; j<=i; j++) {  // 1 ~ 10열
      Serial.print("*");
    }
    Serial.println();
  }
  delay(5000);
  Serial.println();
}
```

