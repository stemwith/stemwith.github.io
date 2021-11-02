---
title: Arduino, IR 리모컨
categories:
  - arduino
date: 2018-09-06 11:12:00
tags:
---
# IR 리모컨
무선 신호를 통해 아두이노를 컨트롤하는 여러 방법 중, 가장 기본이면서 생활속에서 가장 밀접하게 쓰이는 IR(Infra Red, 적외선) 리모컨의 사용에 대해서 알아보겠습니다. 리모컨 작동을 위해서는 기본적으로 IR 신호를 내보내는 리모컨본체와 이 본체에서 내보내는 신호를 받아들이는 IR 리시버가 필요합니다.

<br>

## schematic
![](/image/remote.jpg)

위 그림에서 IR 리시버에 있는 핀은, IR모듈이 아닌 단일 부품형태의 리시버 일때 핀의 순서이다.

<br>

#### IR 리시버 모듈을 사용하는 경우

아두이노 학습용으로 판매하는 IR 리시버는 브레드보드에 바로 붙일 수 있도록 조그만 PCB가 달린 모듈의 형태로 판매되는 경우가 많으며, 이 경우에는 PCB보드에 써있는 글씨를 보고 각 핀에 맞게 아두이노에 연결해야한다. 문제는 PCB에 어느 핀인지를 나타내는 글자가 잘 안보인다는 것!

- Signal : PCB에 S라고 표기되어 있는 쪽
- VCC : 대부분 가운데에 있는 경우가 많았음
- GND : S라고 표기된 부분의 반대쪽이라고 생각하면 된다. (-) 마이너스 라고 표기가 아주 조그맣게 되어 있음

<br>

<br>

## Pin Map

| Arduino | IR Reciever 모듈 사용시 | IR Reciever 단일부품            |
| ------- | ----------------------- | ------------------------------- |
| 11      | S (Signal)              | (둥그런 모양을 마주보고) 왼쪽   |
| 5V      | 표기 되어 있지 않음     | (둥그런 모양을 마주보고) 오른쪽 |
| GND     | -                       | (둥그런 모양을 마주보고) 가운데 |

<br>

<br>

## 라이브러리 준비하기
1\. **스케치**\> **라이브러리 포함하기**\> **라이브러리 관리**\> **라이브러리 매니저**

*   검색어 irremote 입력
*   "IRremote by shirriff" 라이브러리 설치/업데이트

<br>

2\. **스케치**\> **라이브러리 포함하기**\> **IRremote** 를 선택하면, IR remote 기능을 사용하는데 필요한 2가지 라이브러리가 스케치에 include 된다.


```C
#include <IRremote.h>
#include <ir_lego_PF_BitStreamEncoder.h>
```

<br>

<br>

## IR 리모컨 버튼의 HEX값 알아내기
리모컨을 Arduino의 제어 장치로 사용하기 위해서, 리모컨 버튼마다 각기 다른 고유값(HEX)을 알아내야 한다.

1. 예제\> IRremote> IRreceiveDumpV2를 열고, 9번째 라인에 있는

```C
  int recvPin = 11; // 각 핀의 번호에 알맞게 변경
```

2. 시리얼 모니터 열고,

3. 리모컨버튼을 IR수신부를 향하여 누르면, 여러 복잡한 값들이 출력됨

4. 이때 맨 마지막 줄에 출력되는, unsigned int data값을 기록한다.

```C
  unsigned int data = **0xFF6897**;
```
여기서 "0xFF6897"이 현재 누른 버튼의 HEX값이므로 이것을 기록하면 된다. [다운로드](/attach/ir-remote-hex.pdf)

<br>

### HEX값만 추출하는 경우

혹은, 아래 스케치를 이용하면 간단하게 HEX값만 출력된다.

```C
#include <IRremote.h>
#include <ir_Lego_PF_BitStreamEncoder.h>

int RECV_PIN  = 11;                      // IR 리시버 핀 설정
IRrecv irrecv(RECV_PIN);                 // IR 리시버 선언
decode_results results;                  // 수신결과 저장

void setup() {
  Serial.begin(9600);
  irrecv.enableIRIn();                   // IR 리시버 시작
}

void loop() {
  if(irrecv.decode(&results)) {          // 리시버가 받은 값이 있으면
    Serial.print("0x");
    Serial.println(results.value, HEX);  // 버튼 HEX값을 콘솔에 출력
    delay(500);

    irrecv.resume();                     // 다음 값을 받기 위해 준비
  }
}
```

<br>

보유하고 있는 리모컨(XA5-14) 제품의 경우, 리모컨 타입은 NEC타입이며 각 버튼별 HEX값은 아래와 같다.


| Remote Button | unsigned int data |
| ------------- | ----------------- |
| 1             | 0xFFA25D          |
| 2             | 0XFF629D          |
| 3             | 0XFFE21D          |
| 4             | 0XFF22DD          |
| 5             | 0XFF02FD          |
| 6             | 0XFFC23D          |
| 7             | 0XFFE01F          |
| 8             | 0XFFA857          |
| 9             | 0XFF906F          |
| 0             | 0XFF9867          |
| *             | 0XFF6897          |
| #             | 0XFFB04F          |
| ▲             | 0XFF18E7          |
| ▼             | 0XFFA4B5          |
| ◀             | 0XFF10EF          |
| ▶             | 0XFF5AA5          |
| OK            | 0XFF38C7          |

<br>

<br>

## 스케치에서 리모컨 버튼 정의하기

각 버튼의 Code값을 알아냈으면 스케치에서 리모컨의 버튼을 정의한다. 예를 들어, 리모컨 버튼 중에서 "1"을 눌렀을 때, 출력되는 HEX값이 "0xFFA25D" 였다면,

```C
#define BTN_1 0xFFA25D
```

리모컨에 있는 모든 버튼을 위와 같은 방법으로 정의한다. 버튼이 보통 10~20개 정도 되므로 상당히 귀찮은 작업이지만 사용하려는 버튼은 모두 정의를 해야한다. 배열을 통해 정의할 수도 있다. 또한 별도의 리모컨이 없으면 집에서 사용하는 리모컨을 사용해도 된다.

<br>

<br>

## 리모컨 버튼값 시리얼모니터에 출력하기

```C
#include <IRremote.h>
#include <ir_Lego_PF_BitStreamEncoder.h>

#define BTN_CH_M       0xFF6897  // CH- Button
#define BTN_CH         0xFFB04F  // CH Button
#define BTN_CH_P       0xFF18E7  // CH+ Button
#define BTN_PREV       0xFF4AB5  // PREV Button
#define BTN_NEXT       0xFF10EF  // NEXT Button
#define BTN_PLAY_PAUSE 0xFF5AA5  // PLAY PAUSE Button
#define BTN_M          0xFF38C7  // - (VOL-) Button
#define BTN_P          0xFF38C8  // + (VOL+) Button
#define BTN_EQ         0xFF38C9  // EQ Button
#define BTN_100P       0xFF38CA  // 100+ Button
#define BTN_200P       0xFF38CB  // 100- Button

#define BTN_0 0xFF9867
#define BTN_1 0xFFA25D
#define BTN_2 0xFF629D
#define BTN_3 0xFFE21D
#define BTN_4 0xFF22DD
#define BTN_5 0xFF02FD
#define BTN_6 0xFFC23D
#define BTN_7 0xFFE01F
#define BTN_8 0xFFA857
#define BTN_9 0xFF906F

int recvPin = 13;
IRrecv irrecv(recvPin);

void setup() {
  Serial.begin(9600);
  irrecv.enableIRIn();
}

void loop() {
  decode_results results;
  
  if(irrecv.decode(&results)) {
    switch(results.value) {
      case BTN_CH_M :
        Serial.println("CH-");
        break;
      case BTN_CH :
        Serial.println("CH");
        break;
      case BTN_CH_P :
        Serial.println("CH+");
        break;
      case BTN_PREV :
        Serial.println("PREV");
        break;
      case BTN_NEXT :
        Serial.println("NEXT");
        break;
      case BTN_PLAY_PAUSE :
        Serial.println("PLAY/PAUSE");
        break;
      case BTN_M :
        Serial.println("-");
        break;

      case BTN_P :
        Serial.println("+");
        break;
      case BTN_EQ :
        Serial.println("EQ");
        break;
      case BTN_100P :
        Serial.println("100+");
        break;
      case BTN_200P :
        Serial.println("200+");
        break;

      case BTN_0 :
        Serial.println("0");
        break;
      case BTN_1 :
        Serial.println("1");
        break;
      case BTN_2 :
        Serial.println("2");
        break;
      case BTN_3 :
        Serial.println("3");
        break;

      case BTN_4 :
        Serial.println("4");
        break;
      case BTN_5 :
        Serial.println("5");
        break;
      case BTN_6 :
        Serial.println("6");
        break;
      case BTN_7 :
        Serial.println("7");
        break;

      case BTN_8 :
        Serial.println("8");
        break;
      case BTN_9 :
        Serial.println("9");
        break;
    }
    delay(500);
    irrecv.resume();
  }
}
```

<br>

## 과제: 리모컨 계산기 만들기

<br>

<br>

# 리모컨으로 서보모터 회전시키기
3개의 리모컨 버튼을 정의하여 각 버튼을 통해 서버모터를 회전시켜 본다.

*   Left 버튼을 누르면 5도 감소
*   Right 버튼을 누르면 5도 증가
*   OK 버튼을 누르면 0도 위치로 이동

<br>

## schematic

![](/image/remote-servo.jpg)

<br>

## sketch

```C
#include <Servo.h>
Servo servomotor;
int servomotorPin = 10;
int a = 0;

#include <IRremote.h>
#include <ir_Lego_PF_BitStreamEncoder.h>

#define BTN_1 0xFFA25D
#define BTN_2 0xFF629D
#define BTN_3 0xFFE21D
#define BTN_4 0xFF22DD
#define BTN_5 0xFF02FD
#define BTN_6 0xFFC23D
#define BTN_7 0xFFE01F
#define BTN_8 0xFFA857
#define BTN_9 0xFF906F
#define BTN_0 0xFF9867
#define BTN_A 0xFF6897  // * Asterisk Button
#define BTN_P 0xFFB04F  // # Pound Button
#define BTN_U 0xFF18E7  // Up Button
#define BTN_D 0xFF4AB5  // Down Button
#define BTN_L 0xFF10EF  // Left Button
#define BTN_R 0xFF5AA5  // Right Button
#define BTN_O 0xFF38C7  // OK Button

int recvPin = 11;       // IR signal 핀
IRrecv irrecv(recvPin);

void setup() {
  servomotor.attach(servomotorPin);
  irrecv.enableIRIn();
}

void loop() {
  decode_results results;
  
  if(irrecv.decode(&results)) {
    switch(results.value) {
      case BTN_O :       // OK버튼을 누르면 0도 위치로
        a = 0;
        break;
      case BTN_L :
        if(a > 5) {
          a = a - 5;     // L버튼을 누르면 서버모터 5도씩 감소
        }
        else
        {
          a = 0;
        }
        break;
      case BTN_R :
        if(a < 175) {
          a = a + 5;     // R버튼을 누르면 서버모터 5도씩 증가
        }
        else
        {
          a = 180;
        }
        break;
    }
    servomotor.write(a);
    delay(500);
    irrecv.resume();
  }
}
```

