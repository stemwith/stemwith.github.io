---
title: ESP32, DC모터, TB6612FNG
categories:
  - ESP32
date: 2021-11-01 18:27:53
tags:
  - rc
---

### DC모터 사용하기

아두이노의 경우와 마찬가지로 ESP32에서도 TB6612FNG 모터드라이버와 함께, 모터 및 아두이노 단독사용을 위하여 3.7V 18650 2개를 직렬로 연결한 외부전원을 사용한다.

<br>

#### TB6612FNG

##### 기본 핀 배열

| VM<br/>VCC<br/>GND(*)<br/>AOUT1<br/>AOUT2<br/>BOUT2<br/>BOUT1<br/>GND | <img src="/image/t/tb6612fng-01.png" style="zoom:50%;" />  | PWMA<br/>AIN2<br/>AIN1<br/>STBY<br/>BIN1<br/>BIN2<br/>PWMB<br/>GND |
| :----------------------------------------------------------: | :--------------------------------------------------------: | :----------------------------------------------------------: |
|                                                              | <img src="/image/t/tb6612fng-02.png" style="zoom: 42%;" /> |                                                              |

<br>

##### 핀 배열이 다른 경우

| GND<br/>VCC<br/>AOUT1<br/>AOUT2<br/>BOUT2<br/>BOUT1<br/>VM<br/>GND | <img src="/image/t/tb6612fng-03.png" style="zoom:75%;" />  | PWMA<br/>AIN2<br/>AIN1<br/>NC (=STBY)<br/>BIN1<br/>BIN2<br/>PWMB<br/>GND |
| :----------------------------------------------------------: | :--------------------------------------------------------: | :----------------------------------------------------------: |
|                                                              | <img src="/image/t/tb6612fng-04.png" style="zoom: 50%;" /> |                                                              |

* VM (모터 전압) = 15V max
* VCC (로직 전압) = 2.7 ~ 5.5V
* **GND**
  * TB6612FNG 모듈을 여러개 테스트한 결과, 기본 핀 배열을 가진 모듈의 **3번핀 GND**에 연결할 경우 **작동이 안되는** 몇몇 제품이 있었음
  * 그러므로 **8번핀, 9번핀의 GND 사용을 권장**함
* 출력전류: 정전류 1.2A (3.2A peak)까지 (모터 2개 사용시 합산 전류임)
* 모터 제어모드: CW, CCW, short-brake, STOP, stand-by
* 두개의 모터 출력을 개별 제어하며, **100kHz**의 PWM으로 속도 제어
* 써멀 셧다운 및 저전압 감지회로 내장

<br>

##### Pin의 사용

ESP32와 TB6612FNG모듈을 브레드보드를 통해 연결하기 쉽도록 핀을 구성한 Pinmap이므로, 필요에 따라 수정하여 사용할 수 있다. (아래표는 참고만 할 것!)

| 핀번호 | TB6612FNG 모터드라이브 (기본 핀 배열) | ESP32 DEVKIT_C V4 사용시 | ESP32 DEVKIT V1 사용시 | 외부전원                          | 모터 / 역할    |
| ------ | ------------------------------------- | ------------------------ | ---------------------- | --------------------------------- | -------------- |
| 1      | VM                                    |                          |                        | (+) (DC모터에 사용하는 전압 사용) |                |
| 2      | VCC                                   | +3.3V                    | +3.3V                  |                                   |                |
| 3      | GND (사용 비추천)                     |                          |                        |                                   |                |
| 4      | A_OUT1                                |                          |                        |                                   | 모터A          |
| 5      | A_OUT2                                |                          |                        |                                   | 모터A          |
| 6      | B_OUT2                                |                          |                        |                                   | 모터B          |
| 7      | B_OUT1                                |                          |                        |                                   | 모터B          |
| 8      | GND                                   |                          |                        | (-)                               |                |
| 9      | GND                                   | GND                      | GND                    |                                   |                |
| 10     | B_PWM                                 | 12                       | 13                     |                                   | 모터B 속도제어 |
| 11     | B_IN2                                 | 14                       | 12                     |                                   | 모터B 방향제어 |
| 12     | B_IN1                                 | 27                       | 14                     |                                   | 모터B 방향제어 |
| 13     | STBY                                  | 26                       | 27                     |                                   | 모터 상태신호  |
| 14     | A_IN1                                 | 25                       | 26                     |                                   | 모터A 방향제어 |
| 15     | A_IN2                                 | 33                       | 25                     |                                   | 모터A 방향제어 |
| 16     | A_PWM                                 | 32                       | 33                     |                                   | 모터A 속도제어 |

<br>

| ESP32 DEVKIT V4 사용시 | ![](/image/t/ESP32-RC-04.png) |
| ---------------------- | ----------------------------- |
| ESP32 DEVKIT V1 사용시 | ![](/image/t/ESP32-RC-05.png) |

<br>

### 모터 1개 컨트롤하기

| (기어박스를 포함한) 일반 DC모터                   | (엔코더 모듈을 포함한) 엔코더 DC모터                      |
| ------------------------------------------------- | --------------------------------------------------------- |
| 아두이노를 사용한 스마트카 실습용으로 많이 사용됨 | Hall sensor를 통해 회전수를 정밀하게 측정가능             |
| (+)와 (-), 2P 단자가 있음                         | 5P or 6P 단자가 있음 (여기서는 (+)와 (-) 2P만 사용)       |
| <img src="/image/4wd-01.jpg" style="zoom:80%;" /> | <img src="/image/t/ESP32-RC-07.png" style="zoom: 67%;" /> |

<br>

#### schematic

##### ESP32와 컴퓨터를 USB선으로 연결하여 사용할 경우

![](/image/t/ESP32-RC-01.png)

<br>

##### ESP32와 컴퓨터의 연결없이 외부전원을 사용하여 단독으로 사용할 경우

* 18650 2S 외부전원(7.4V)을 DC컨버터 모듈에 연결

  * 입력: 8~36V
  * 출력: 1.25~32V 및 USB 5V 출력
  * 75W내 사용 권장, 전류량 최대 5A (4.5A 이내 사용 권장)

  ![](/image/t/ESP32-RC-03.png)

* 여기서는 서보모터 추가 연결을 위해서, 왼쪽 가변 저항을 사용하여 출력 전압을 5V로 세팅하여 사용

* USB 출력단자는 ESP32의 microUSB 단자에 연결

![](/image/t/ESP32-RC-02.png)

<br>

#### sketch

~~~C++
// TB6612FNG right side & ESP32-WROOM-32D DEVKIT_C V4 left side pin order
const int PWMA = 32;  
const int INA1 = 33;
const int INA2 = 25;
const int STBY = 26;
const int INB1 = 27;
const int INB2 = 14;
const int PWMB = 12;

/*
// TB6612FNG right side & ESP32-WROOM-32 left side pin order
const int PWMA = 33;
const int AIN2 = 25;
const int AIN1 = 26;
const int STBY = 27;
const int BIN1 = 14;
const int BIN2 = 12;
const int PWMB = 13;
*/

// PWM Channel setup
const int CH_STBY = 0;
const int CH_AIN1 = 1;
const int CH_AIN2 = 2;
const int CH_PWMA = 3;
const int CH_BIN1 = 4;
const int CH_BIN2 = 5;
const int CH_PWMB = 6;
// PWM frequency and bit resolution setup
const int pwmFrequency = 10000;  // Hz
const int bitResolution = 8;     // pwm value: 0~255

const int ledPin = 2;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

  // tb6612fng setting
  pinMode(STBY,OUTPUT);
  pinMode(AIN1,OUTPUT);
  pinMode(AIN2,OUTPUT);
  pinMode(PWMA,OUTPUT);
  pinMode(BIN1,OUTPUT);
  pinMode(BIN2,OUTPUT);
  pinMode(PWMB,OUTPUT);

  /*
  //digital output initial test
  digitalWrite(STBY, HIGH);
  digitalWrite(AIN1, HIGH);
  digitalWrite(AIN2, LOW);
  digitalWrite(PWMA, LOW);
  digitalWrite(BIN1, HIGH);
  digitalWrite(BIN2, LOW);
  digitalWrite(PWMB, LOW);
  delay(1000);
  */
  
  // motor output(PWM) setting (channel, frequency, bit)
  ledcSetup(CH_STBY, pwmFrequency, bitResolution);
  ledcSetup(CH_AIN1, pwmFrequency, bitResolution);
  ledcSetup(CH_AIN2, pwmFrequency, bitResolution);
  ledcSetup(CH_PWMA, pwmFrequency, bitResolution);
  ledcSetup(CH_BIN1, pwmFrequency, bitResolution);
  ledcSetup(CH_BIN2, pwmFrequency, bitResolution);
  ledcSetup(CH_PWMB, pwmFrequency, bitResolution);
  
  // channel setting (GPOI pin, channel)
  //                                Channel  CW  CCW Stanby Stop Brake1 Brake2 Brake3
  ledcAttachPin(STBY, CH_STBY);  // STBY (0) 255 255 0      255  255    255    255
  ledcAttachPin(AIN1, CH_AIN1);  // INA1 (1) 255 0   *      0    255    0      255
  ledcAttachPin(AIN2, CH_AIN2);  // INA2 (2) 0   255 *      0    255    255    0
  ledcAttachPin(PWMA, CH_PWMA);  // PWMA (3) PWM PWM *      255  *      0      0
  ledcAttachPin(BIN1, CH_BIN1);  //
  ledcAttachPin(BIN2, CH_BIN1);  // if STBY(CH0) = 0, Standby states.
  ledcAttachPin(PWMB, CH_PWMB);  // if STBY(CH0) = 255, and INA1&INA2 have different value
}                                // and PWMA has some value, CW or CCW rotation is made.

void loop() {
 
  // Motor A : CW
  ledcWrite(CH_STBY, 255); // STBY
  ledcWrite(CH_AIN1, 255); // AIN1
  ledcWrite(CH_AIN2, 0);   // AIN2
  ledcWrite(CH_PWMA, 255); // PWMA
  // Motor B : CW
  ledcWrite(CH_BIN1, 255); // BIN1
  ledcWrite(CH_BIN2, 0);   // BIN2
  ledcWrite(CH_PWMB, 255); // PWMB
  delay(3000);

  // Motor : Stand-by
  ledcWrite(CH_STBY, 0); // STBY
  //delay(1000);

  //LED Blink
  digitalWrite(ledPin, LOW);
  delay(3500);
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  
  // Motor A : CCW
  ledcWrite(CH_STBY, 255); // STBY
  ledcWrite(CH_AIN1, 0);   // AIN1
  ledcWrite(CH_AIN2, 255); // AIN2
  ledcWrite(CH_PWMA, 255); // PWMA
  // Motor B : CCW
  ledcWrite(CH_BIN1, 0);   // BIN1
  ledcWrite(CH_BIN2, 255); // BIN2
  ledcWrite(CH_PWMB, 255); // PWMB
  delay(3000);

  // Motor : Stand-by
  ledcWrite(CH_STBY, 0); // STBY
  //delay(1000);

  //LED Blink
  digitalWrite(ledPin, LOW);
  delay(3500);
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
}
~~~

<br>

#### Troubleshooting

##### 스케치 중간에 있는 stand-by가 있거나 없거나 동일한 운동을 보일 것 같지만, 실제로는 완전히 다르다.

* stand-by가 있는 경우

  * 3초간 CW회전 후 정지 → 3.5초 대기 → 0.5초 LED켜졌다가 꺼짐 → 3초간 CCW회전 후 정지→ 3.5초 대기 → 0.5초 LED켜졌다가 꺼짐
* stand-by가 없는 경우:

  * 모터
    * 모터의 delay 시간(회전시간)이 3초로 되어 있어도 stand-by 상태로 들어가지 않으므로, **실제로는 7초간 회전** 후 방향을 바꿈 
    * 7초간 CW회전 후 → (정지하지 않고) 곧바로 7초간 CCW회전 (반복)
  * LED
    * 꺼짐: 6.5초간 꺼져있다가 (모터의 delay 시간 3초 + led low delay 시간 3.5초)
    * 켜짐:  0.5초간 켜짐 (반복)
* 그러므로, 각 상황에 따라 stand-by를 걸어야 할지, 말아야할지를 결정해야 함.
  * stand-by를 걸지 않은 상태에서 멈추려면 PWMA or PWMB를 0으로 주면 됨.

<br>

##### 회전 방향이 (생각했던 방향과) 반대로 회전하는 경우

AIN1핀과 AIN2 핀의 번호를 바꿔준다. 즉, 위 스케치에서

~~~C++
const int AIN2 = 25;
const int AIN1 = 26;
~~~

부분을

~~~C++
const int AIN2 = 26;
const int AIN1 = 25;
~~~

로 바꿔준다.

<br>

### 모터 2개 컨트롤하기

![](/image/t/ESP32-RC-06.png)<br>

#### sketch

위의 ''모터 1개 컨트롤하기'' 스케치와 동일함.

<br>
