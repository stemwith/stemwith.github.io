---
title: ESP32, 스텝모터
categories:
  - ESP32
date: 2021-09-24 18:27:53
tags:
---

### 스텝 모터, 28BYJ-48

#### Specification

![](/image/Step-Motor-02.png)

* 정격전압: 5VDC

* 기어비: 1/64
  $$
  \frac {32}{9} \times \frac {22}{11} \times \frac {26}{9} \times \frac {31}{10} = 63.68395 \fallingdotseq 64
  $$
  

<img src="/image/Step-Motor-01.png" style="zoom:80%;" />

* 스트라이드 각도
  * **스펙상 5.625º / 64** = 0.087890625
    * 그러므로,  360º / 0.087890625 = 4096 스텝
  * **실제로는 11.25º / 64** = 0.17578125
    * 그러므로,  360º / 0.17578125 = **2048 스텝으로 1회전**
* Frequency: 100Hz
* 토크: 34.3mN,m

<br>

### 모터드라이브 ULN2003

<img src="/image/Step-Motor-03.png" style="zoom:67%;" />

<br>

<br>

### 스텝 모터의 구동

#### schematic

![](/image/Step-Motor-04.png)

<br>

#### Pin Map

| 모터드라이브 | 아두이노 |
| ------ | ---- |
| INT1   | 11   |
| INT2   | 10   |
| INT3   | 9    |
| INT4   | 8    |
| GND    | GND  |
| VCC    | VCC  |

※ 모터드라이브에 연결하는 전원(VCC)는 **외부전원 5V를 사용**한다. (ESP32의 5V는 전류가 부족하여 ESP32와 연결한 노트북에 영향을 줄 수 있으므로, 사용하지 않는 것이 좋다.)

<br>

#### 스텝업 모듈

![](/image/Stepup-Module-01.png)

* 입력전압: 0.9~5V
* 출력전압: 5V
* 출력전류: 500~600mA
* 최대효율: 96%

<br>

#### sketch

~~~
#include <Stepper.h>

const int stepsPerRevolution = 2048;  // change this to fit the number of steps per revolution

// ULN2003 Motor Driver Pins
#define IN1 19
#define IN2 18
#define IN3 5
#define IN4 17

// initialize the stepper library
Stepper myStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

void setup() {
  // set the speed at 5 rpm
  myStepper.setSpeed(5);
  // initialize the serial port
  Serial.begin(115200);
}

void loop() {
  // step one revolution in one direction:
  Serial.println("clockwise");
  myStepper.step(stepsPerRevolution);
  delay(1000);

  // step one revolution in the other direction:
  Serial.println("counterclockwise");
  myStepper.step(-stepsPerRevolution);
  delay(1000);
}
~~~

* setSpeed(5);

  * 외부 전원의 전력에 따라 최대값이 달라짐. 

  * 5V 전원 사용시 16이 최대값인 경우가 있었고. 그 이상은 안정적으로 회전이 안되며, 17을 넣으면 한바퀴 돌고 정지. 18을 넣으면 돌지 않음.
  
  * 7.4V 전원 사용시 22가 최대값인 경우가 있었고, 그 이상은 안정적으로 회전이 안됨. (23을 넣으면 시계방향 회전 후, 반시계방향 회전이 안됨. 24를 넣으면 돌지 않음)
  
  * 전압에 따라 수치가 고정된 것은 아닌 듯 하며, 외부 전원의 상태에 따라 달라질 수 있으므로 테스트가 필요함.
  
    





