---
title: "Arduino, IR 리모컨"
categories: ["arduino"]
toc: true
date: 2018-09-06T11:12:00+09:00
tags:
---
생활속에서 가장 밀접하게 쓰이는 IR(Infra Red, 적외선) 리모컨의 사용에 대해서 알아본다. 리모컨 작동을 위해서는 기본적으로 IR 신호를 내보내는 리모컨본체와 이 본체에서 내보내는 신호를 받아들이는 IR 리시버가 필요하다.

<br>

### 기본 사용법

#### schematic

{{< figure src="/image/remote.png" width="80%" class="center" >}}       {{< figure src="/image/remote-controller.png" style="zoom: 67%;" class="center" >}}

위 그림에서 IR 리시버에 있는 핀은, IR모듈이 아닌 단일 부품형태의 리시버 일때 핀의 순서이다.

<br>

##### IR 리시버 모듈을 사용하는 경우

아두이노 학습용으로 판매하는 IR 리시버는 브레드보드에 바로 붙일 수 있도록 조그만 PCB가 달린 모듈의 형태로 판매되는 경우가 많으며, 이 경우에는 PCB보드에 써있는 글씨를 보고 각 핀에 맞게 아두이노에 연결해야한다. 문제는 PCB에 어느 핀인지를 나타내는 글자가 잘 안보인다는 것!

- Signal : PCB에 S라고 표기되어 있는 쪽
- VCC : 대부분 가운데에 있는 경우가 많았음
- GND : S라고 표기된 부분의 반대쪽이라고 생각하면 된다. (-) 마이너스 표기가 작게 되어 있음

<br>

#### Pin Map

| Arduino | IR Reciever 모듈 사용시 | IR Reciever 단일부품          |
| ------- | ----------------------- | ----------------------------- |
| 2       | S (Signal)              | (둥근 모양을 마주보고) 왼쪽   |
| 5V      | 표기 되어 있지 않음     | (둥근 모양을 마주보고) 오른쪽 |
| GND     | -                       | (둥근 모양을 마주보고) 가운데 |

<br>

#### 라이브러리 준비하기
* **스케치**\> **라이브러리 포함하기**\> **라이브러리 관리**\> **라이브러리 매니저**

  *   검색어 irremote 입력

  *   "IRremote by Armin Joachimsmeyer" 라이브러리 설치/업데이트


![](/image/remote-library.png)

* **스케치**\> **라이브러리 포함하기**\> **IRremote** 를 선택하면, IR remote 기능을 사용하는데 필요한 라이브러리가 스케치에 include 된다.


```C++
#include <IRremote.h>
```

<br>

#### 리모컨 버튼의 고유값 알아내기

* old MSB-first 32bit IR data code
* new LSB-first 32bit IR data code

리모컨 코드값은 위의 2가지 형태로 구분된다. 여기서는 기본적으로 MSB-first 방식을 사용하도록 한다. 아래 스케치를 이용하면 간단하게 MSB-first code 값만 출력된다. (시리얼 모니터 Baudrate 115200)

<br>

##### sketch

```C
#include <IRremote.h>

int RECV_PIN  = 2;                       // IR 리시버 핀 설정
IRrecv irrecv(RECV_PIN);                 // IR 리시버 선언
decode_results results;                  // 수신결과 저장

void setup() {
  Serial.begin(115200);
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

##### serial monitor

![](/image/remote-hex2.png)

출력값 중에서 앞부분의 **0x**를 제외한 6자리의 값(아래 그림에서 **FFA25D**)이 방금 누른 버튼의 고유 값이다.

<br>

##### 리모컨 고유값

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

### 리모컨 버튼값 시리얼모니터에 출력하기

#### 스케치에서 리모컨 버튼 정의하기

각 버튼의 Code값을 알아냈으면 스케치에서 리모컨의 버튼을 정의한다. 예를 들어, 리모컨 버튼 중에서 "1"을 눌렀을 때, 출력되는 HEX값이 "0xFFA25D" 였다면,

```C
#define BTN_1 0xFFA25D
```

리모컨에 있는 모든 버튼을 위와 같은 방법으로 정의한다. 버튼이 보통 10~20개 정도 되므로 상당히 귀찮은 작업이지만 사용하려는 버튼은 모두 정의를 해야한다. 배열을 통해 정의할 수도 있다. 또한 별도의 리모컨이 없으면 집에서 사용하는 리모컨을 사용해도 된다.

<br>

#### sketch

```C++
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

int recvPin = 2;
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

#### 과제: 리모컨 계산기 만들기

<br>

<br>

### 리모컨으로 서보모터 회전시키기
3개의 리모컨 버튼을 정의하여 각 버튼을 통해 서버모터를 회전시켜 본다.

*   초기 위치 90도
*   Left 버튼을 누르면 5도 감소
*   Right 버튼을 누르면 5도 증가
*   OK 버튼을 누르면 90도 위치로 이동

<br>

#### schematic

![](/image/remote-servo.png)

<br>

#### sketch

```C
#include <Servo.h>
Servo servomotor;
int servomotorPin = 9;
int a = 90;

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

int recvPin = 2;       // IR signal 핀
IRrecv irrecv(recvPin);

void setup() {
  servomotor.attach(servomotorPin);
  irrecv.enableIRIn();
}

void loop() {
  decode_results results;
  
  if(irrecv.decode(&results)) {
    switch(results.value) {
      case BTN_O :       // OK버튼을 누르면 90도 위치로
        a = 90;
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

<br>

<br>

### LSB-first 32bit IR data code를 사용하려면

LSB-first 형태의 디코더 데이터를 사용해야하는 경우에는 라이브러리에서 제공하는 설명서([IRremote: IRremote Arduino Library](https://arduino-irremote.github.io/Arduino-IRremote/index.html))를 우선 숙지하여 사용토록한다. 여기서는 간단한 사용방법만 덧붙인다.

1. 예제\> IRremote> SimpleReceiver를 선택하여 파일을 불러온다.
   * SimpleReceiver.ino의 앞부분에, 사용하려는 리모컨의 프로토콜 타입을 선택할 수 있는 부분이 있다.
   * 아두이노 실습용으로 판매되는 리모컨은 대부분 NEC타입이므로 **변경할 필요가 없다.**
   * 삼성이나 LG 등 집에서 사용하는 리모컨의 HEX값을 알아내려면, 사용하려는 제품의 제조사에 따라 주석처리되는 부분을 적절히 수정한다.

```C
//#define DECODE_DENON        // Includes Sharp
//#define DECODE_JVC
//#define DECODE_KASEIKYO
//#define DECODE_PANASONIC    // the same as DECODE_KASEIKYO
//#define DECODE_LG
#define DECODE_NEC          // Includes Apple and Onkyo
//#define DECODE_SAMSUNG
//#define DECODE_SONY
//#define DECODE_RC5
//#define DECODE_RC6

//#define DECODE_BOSEWAVE
//#define DECODE_LEGO_PF
//#define DECODE_MAGIQUEST
//#define DECODE_WHYNTER

//#define DECODE_DISTANCE     // universal decoder for pulse width or pulse distance protocols
//#define DECODE_HASH         // special decoder for all protocols
```

2. SimpleReceiver을 열면 PinDefinitionsAndMore.h가 동시에 열린다.
   * 이 파일은 사용하는 보드에 따라 Signal핀을 연결하는 핀 번호를 정의하고 있다.
   * 아두이노 UNO의 경우 DEFAULT/AVR 플랫폼으로 정의되어 있으므로 IR Input핀은 2번을 사용한다. (아래 3번과정 참고: 시리얼 모니터를 열면, 연결된 보드에 따라 몇번 핀에 연결해야하는지 출력이 되므로, 이 과정에서 Signal을 어디에 연결해야하는지 확인할 필요는 없다.)
   * ESP32의 경우 IR Input이 GPIO 15번으로 지정되어 있다.

![](/image/remote-pindefinitionandmore.png)

3. 스케치를 업로드 한 후, 시리얼 모니터를 열고 Baud rate를 115200으로 설정한다. (Signal이 연결된 핀의 번호가 맞는지 확인)

![](/image/remote-serialmonitor.png)

4. 리모컨의 버튼을 IR수신부를 향하여 누르면, 3줄이 출력됨
   * 첫번째 라인에 출력되는 Raw-Data 부분에서 앞부분의 **0x**를 제외한 8자리의 값(아래 그림에서 **BA45FF00**)이 방금 누른 버튼의 고유 값이다.
   * 각 버튼을 차례대로 누르면서 버튼의 고유값을 기록한다. [다운로드](/attach/ir-remote-hex.pdf)

![](/image/remote-hex.png)

