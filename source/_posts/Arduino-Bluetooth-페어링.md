---
title: Arduino, Bluetooth 페어링
categories:
  - arduino
date: 2019-10-26 23:24:07
tags:
---

아두이노에서 블루투스를 이용하는 방법을 알아보겠습니다.

<br>

## Bluetooth module 선택
* **아이폰** : MLT-BT05(AT-09) BLE 모듈 사용 (이 모듈은 안드로이도에서도 사용 가능)

  HC-06, HC-05는 아이폰에서 SPP(Serial Port Profile) 통신이 지원하지 않는 이유로 사용할 수 없습니다. 그러므로 아이폰으로 블루투스 통신을 하기 위해서는 MLT-BT-BT05, AT-09, CC2541, HM-10, HC-02, RN-42 같은 BLE(Bluetooth Low Energy) 모듈을 사용합니다. 연결방법이나 AT명령어 세트는 HC-06과 비슷해요. 주의 할 점은, 시리얼 모니터에서 **Both NL & CR** 모드를 선택해주어야 하는 것입니다.

![](/image/BT-01.jpg)

*   **안드로이드** : HC-06(or HC-05) 블루투스 모듈 사용 (이 모듈은 아이폰에서 사용 불가)

![](/image/BT-02.jpg)

>※ 요즘은 잘 사용하지 않지만, HC-05를 사용하기도 합니다. 생김새가 거의 비슷하지만, 몇가지 차이점이 있는데요. 보통 HC-06과 구별하기 위하여, HC-05에는 칩 위에 V형태로 체크를 해두거나, 화이트로 하얀색 점을 찍어두는 경우가 많습니다. 그리고, 가장 큰 차이점은 HC-05의 경우 6개의 핀이 모두 존재해요.
>
>![](/image/BT-05.jpg)

>※ 예전에는 HC-05는 Master, HC-06은 Slave로 나누어 쓰는 경우가 많았지만, HC-06의 버전이 1.7이상인 경우 Master, Slave를 선택하여 사용할 수 있게 되면서 HC-05는 잘 사용하지 않게 되었습니다.

<br>

## MLT-BT05, HC-06을 사용하는 경우

<br>

### Pin Map

|      |       |                         | Arduino Uno |
| ---- | ----- | :---------------------: | ----------- |
| 1    | STATE | (실제 핀 없거나 미사용) |             |
| 2    | RXD   |   Receive Data (수신)   | 3           |
| 3    | TXD   |  Transmit Data (송신)   | 2           |
| 4    | GND   |           GND           | GND         |
| 5    | VCC   |           +5V           | +5V         |
| 6    | KEY   | (실제 핀 없거나 미사용) |             |

<br>

### schematic
![](/image/BT-03.jpg)

<br>

### sketch
```C
#include <SoftwareSerial.h>

SoftwareSerial BTSerial(2, 3); //Connect MLT-BT05 or HC-06 TX,RX 

void setup()  
 {
   Serial.begin(9600);
   Serial.println("Hello!");

  // set the data rate for the BT port
   BTSerial.begin(9600);
 }

void loop()
{
  if (BTSerial.available())
    Serial.write(BTSerial.read());
  if (Serial.available())
    BTSerial.write(Serial.read());
}
```

<br>

## HC-05를 사용하는 경우

<br>

### Pin Map

| HC-05 Pin |              |                           | Arduino Uno |
| --------- | ------------ | :-----------------------: | ----------- |
| 1         | STATE        |                           |             |
| 2         | RXD          |       Receive Data        | 3           |
| 3         | TXD          |       Transmit Date       | 7           |
| 4         | GND          |            GND            | GND         |
| 5         | VCC          |            +5V            | +5V         |
| 6         | KEY (ENABLE) | AT command 진입을 위한 핀 | 8           |

>※ TXD로 UNO의 7번핀을 사용했으나, HC-06처럼 2번핀을 사용해도 됩니다. 단, schematic과 sketch도 2번 핀에 맞추어 수정해주세요.

<br>

### schematic
![](/image/BT-04.jpg)

<br>

### sketch

```C
    #include <SoftwareSerial.h>
    #define KEY 8
    SoftwareSerial BTSerial(7, 3); //Connect HC-05 TX,RX 
    
    void setup()  
     {
       pinMode(KEY, OUTPUT);       //for HC-05
       digitalWrite(KEY, HIGH);
       Serial.begin(9600);
       Serial.println("Hello!");
    
      // set the data rate for the BT port
       BTSerial.begin(38400);
     }
    
    void loop()
     {
       if (BTSerial.available())
         Serial.write(BTSerial.read());
       if (Serial.available())
         BTSerial.write(Serial.read());
     }
```

<br>

## 블루투스 모듈을 처음 사용하는 경우

모듈을 처음 사용한다면, AT 명령어 세트를 사용하여 세팅을 해주어야 합니다. 또한 이전에 사용한 경험이 있더라도 블루투스 모듈ID, 페어링 암호 등을 새롭게 세팅할 필요가 있는 경우에도 동일합니다.

<br>

### MLT-BT05(AT-09)의 AT Command

| 명령어        | Serial Monitor 출력 결과 | 의미                                                 |
| ------------- | :----------------------: | ---------------------------------------------------- |
| AT            |            OK            | 접속상태 확인                                        |
| AT+NAMESKS100 |        OKsetname         | 블루투스 모듈ID 지정 (default MLT-BT05)              |
| AT+PIN        |      PASSWORD 출력       | 패스워드 확인                                        |
| AT+PIN1234    |         OKsetPIN         | 페어링 암호 설정 (default: **123456**)               |
| AT+BAUD4      |          OK9600          | 통신속도 설정 (4 → 9600bps) (default: 0 → 115200bps) |
| AT+VERSION    |      OKVERSION=4.0       | MLT-BT05 버전 확인                                   |
| AT+LADDR      |   +LADDR=(MAC Address)   | MAC Address 확인                                     |
| AT+ROLE=0     |        OK+ROLE:0         | SLAVE mode (default)                                 |
| AT+ROLE=1     |        OK+ROLE:1         | MASTER mode                                          |
| AT+ROLE=2     |        OK+ROLE:2         | sensor mode                                          |
| AT+ROLE=3     |        OK+ROLE:3         | iBeacon mode                                         |
| AT+ROLE=4     |        OK+ROLE:4         | WeChat mode                                          |
| AT+ROLE       |         OK+ROLE:         | Role 확인                                            |

※ [AT Command set 다운로드](/attach/MLT-BT05.pdf)

<br>

### HC-06의 AT Command

| 명령어        | Serial Monitor 출력 결과 | 의미                                               |
| ------------- | :----------------------: | -------------------------------------------------- |
| AT            |            OK            | 접속상태 확인                                      |
| AT+NAMESKS100 |        OKsetname         | 블루투스 모듈ID 지정 (SKS100)                      |
| AT+PIN        |       PASSWORD출력       | 패스워드 확인                                      |
| AT+PIN1234    |         OKsetPIN         | 페어링 암호 설정 (default: **1234**)               |
| AT+BAUD4      |          OK9600          | 통신속도 설정 (4 → 9600bps) (default: 4 → 9600bps) |
| AT+VERSION    |       OKlinvorV1.8       | HC-06 버전 확인                                    |
| AT+ROLE=S     |        OK+ROLE:S         | SLAVE 역할                                         |
| AT+ROLE=M     |        OK+ROLE:M         | MASTER 역할 (v1.7 이상만 가능)                     |
| AT+ROLE       |         OK+ROLE:         | MASTER/SLAVE 확인                                  |

<br>

### HC-05의 AT Command

>※ HC-05는 AT Command를 사용하는 경우, KEY(Enable) 핀을 연결해주어야 합니다. (schematic 참고)


| 명령어        | Serial Monitor 출력 결과 | 의미                          |
| ------------- | :----------------------: | ----------------------------- |
| AT            |            OK            | 접속상태 확인                 |
| AT+NAMESKS100 |        OKsetname         | 블루투스 모듈ID 지정 (SKS100) |
| AT+PSWD=0000  |         OKsetPIN         | 페어링 암호 설정 (0000)       |
| AT+BAUD6      |          OK9600          | 통신속도 설정 (6 → 38400bps)  |
| AT+VERSION    |       OKlinvorV1.8       | HC-06 버전 확인               |
| AT+ROLE=0     |        OK+ROLE:0         | SLAVE 역할                    |
| AT+ROLE=1     |        OK+ROLE:1         | MASTER 역할                   |
| AT+ROLE=?     |         OK+ROLE:         | MASTER/SLAVE 확인             |

<br>

<br>

# 스마트폰과의 페어링 과정

<br>

## 시리얼모니터에서
HC-06과의 페어링 과정을 보도록 하겠습니다. (다른 블루투스 모듈도 유사하게 진행하면 됩니다.)

<br>

1) 먼저 아두이노IDE의 시리얼 모니터를 엽니다.

>※ 이때, 주의할 점이 있는데요. **시리얼 모니터를 열기 전에 스마트폰과 HC-06의 블루투스 연결은 해제된 상태**여야 합니다. 기존에 HC-06과 스마트폰을 연결한 적이 있다면, 자기도 모르게 블루투스 연결이 자동으로 되어 있을 수 있는데요. 이런 경우에는 시리얼 모니터가 열리지 않아요.

*   **MLT-BT05**: 시리얼모니터의 하단에 “**Both NL & CR**”, “9600 보드레이트” 선택
*   **HC-06**: 시리얼창의 하단에 “**line ending 없음**”, “9600 보드레이트 선택
*   **HC-05**: 시리얼창의 하단에 “**Both NL & CR**”, “9600 보드레이트” 선택

<br>

2) 위 스케치를 **사용하는 모듈에 맞게 선택하여** 아두이노에 업로드 한 상태에서 시리얼 모니터를 열면, Hello! 라는 글자가 뜹니다. (업로드한 스케치에 따라 Hello!는 안나올 수도 있음)
![](/image/BT-06.jpg)

<br>

3) AT를 입력하고,
![](/image/BT-07.jpg)

<br>

4) 전송을 누르면 OK가 뜹니다. 이것은 아두이노IDE를 통해 블루투스 모듈과 연결이 정상적으로 되었음을 의미해요.
![](/image/BT-08.jpg)

<br>

5) 블루투스 모듈ID를 설정해보겠습니다. SKS100이라는 ID로 지정하기 위해 **AT+NAMESKS100**이라고 입력한 뒤, 전송을 누릅니다. (모듈ID는 본인이 사용할 이름으로 바꾸어 지정합니다.)
![](/image/BT-09.jpg)

<br>

6) 그러면 OKsetname이라고 출력이 되면서, 블루투스 모듈ID가 SKS100으로 셋팅이 됩니다.
![](/image/BT-09-1.jpg)

<br>

7) 이번에는 페어링 암호 설정입니다. AT+PIN0000을 입력하고 전송을 누르면
![](/image/BT-10.jpg)

<br>

8) OKsetPIN이 출력되면서 페어링 암호가 0000으로 설정됩니다.
![](/image/BT-11.jpg)

<br>

9) 통신속도 설정입니다. HC-06은 주로 9600bps를 사용하며, 이를 위해 AT+BAUD4를 입력한 뒤 전송을 누릅니다. (HC-06의 경우 default 속도가 9600bps이므로 이 과정은 생략 가능하며, 다른 모듈을 사용하는 경우에는 각 모듈의 AT Command를 확인하여 통신속도를 변경해주어야 합니다.)
![](/image/BT-12.jpg)

<br>

10) OK9600이 출력되요.
![](/image/BT-13.jpg)

<br>

여기까지 진행하면 대체적으로 HC-06을 사용할 준비가 된 것입니다.

<br>

## 스마트폰에서

1) 이제 스마트폰에서 블루투스 모드를 켜세요. (아래 화면은 스마트폰 기종마다 조금은 다를 수 있습니다. 화면이 다르더라도 거의 비슷할 거에요.) 그리고 새로고침을 통해 블루투스 기기를 찾습니다.
![](/image/BT-14.png =432x768)

<br>

2) ‘거의 이용하지 않는 기기’ 하나를 찾았네요. 그곳을 누르면 조금전에 설정한 블루투스 모듈ID인 SKS100이 보입니다. 여기를 누르세요.
![](/image/BT-15.png =432x768)

<br>

3) 블루투스 모듈과 페어링을 하기 위한 암호 입력화면이 나오고, 여기에 AT명령어를 통해 입력한 암호를 넣어줍니다.
![](/image/BT-14-1.png =432x768)

<br>

4) 그러면 스마트폰이 SKS100 모듈에 페어링을 시도합니다.
![](/image/BT-16.png =432x768)

<br>

5) 거의 이용하지 않는 블루투스 기기 부분을 누르면
![](/image/BT-17.png =432x768)

<br>

6) 페어링된 기기 목록에 SKS100이 뜹니다. 여기까지 진행하면, 스마트폰과 블루투스 모듈이 페어링 완료된 거에요.
![](/image/BT-18.png =432x768)

