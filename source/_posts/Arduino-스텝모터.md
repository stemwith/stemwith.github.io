---
title: Arduino, 스텝모터
categories:
  - arduino
date: 2018-09-08 18:27:53
tags:
---

### 스텝모터 (Step Motor)

* 펄스 모양의 전압에 의해 일정 각도(스텝 수) 만큼 회전하는 모터.
* 회전 각도는 입력 펄스 신호의 수에 비례하고, 회전 속도는 입력 펄스 신호의 주파수에 비례한다.

<br>

#### 스텝모터 28BYJ-48

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
    * 그러므로,  360º / 0.17578125 = **2048 스텝으로 1회전** (이 값이 중요함!)
* Frequency: 100Hz
* 토크: 34.3mN,m

<br>

#### 모터드라이브 ULN2003

<img src="/image/Step-Motor-03.png" style="zoom:67%;" />

<br>

#### schematic

![](/image/s/UNO-step-01.png)



#### Pin Map

| 모터드라이브 | 아두이노 |
| ------------ | -------- |
| INT1         | 11       |
| INT2         | 10       |
| INT3         | 9        |
| INT4         | 8        |
| GND          | GND      |
| VCC          | 5V       |

<br>

#### sketch: 예제1

~~~C++
#include <Stepper.h>

// 2048:한바퀴(360도), 1024:반바퀴(180도)...
// datasheet를 통해 스트라이드 각도를 계산한 값을 사용
const int stepsPerRevolution = 2048;

// 모터 드라이브에 연결된 핀 IN1, IN3, IN2, IN4
Stepper myStepper(stepsPerRevolution, 11, 9, 10, 8);

void setup() {
  myStepper.setSpeed(14); 
}

void loop() {
  // 시계 반대 방향으로 한바퀴 회전
  myStepper.step(stepsPerRevolution);
  delay(500);

  // 시계 방향으로 한바퀴 회전
  myStepper.step(-stepsPerRevolution);
  delay(500);
}
~~~

* Stepper myStepper(stepsPerRevolution, 11, 9, 10, 8);
  * 모터 드라이브에 연결되는 순서에 유의한다! (**IN1, IN3, IN2, IN4** 순서임!)
* myStepper.setSpeed(14);
  * 아두이노 보드의 5V 전원 사용시 16이 최대값.
  * 16 이상은 안정적으로 회전이 안되며, 17을 넣으면 한바퀴 돌고 정지. 18을 넣으면 돌지 않음

<br>

#### sketch: 예제2

~~~C++
#include <Stepper.h>

// 2048:한바퀴(360도), 1024:반바퀴(180도), 64:11.25도
const int stepsPerRevolution = 64;

// 모터 드라이브에 연결된 핀 IN1, IN3, IN2, IN4
Stepper myStepper(stepsPerRevolution, 11, 9, 10, 8);

void setup() {
  myStepper.setSpeed(16);
}

void loop() {
  
  // 시계 반대 방향으로 한바퀴 회전
  // 64 * 32 = 2048 한바퀴 => 11.25도씩 32번 회전 (360도)
  for(int i=0; i<32; i++) {  
    myStepper.step(stepsPerRevolution);
  }
  delay(500);

  // 시계 방향으로 한바퀴 회전
  // -64 * 32 = 2048 한바퀴 => -11.25도씩 32번 회전 (-360도)
  for(int i=0; i<32; i++) {
    myStepper.step(-stepsPerRevolution);
  }
  delay(500);
}
~~~

