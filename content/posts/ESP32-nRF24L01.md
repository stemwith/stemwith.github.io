---
title: "ESP32, nRF24L01 무선통신"
categories: ["esp32"]
date: 2021-10-10T18:27:53+09:00
toc: true
tags:
---

### nRF24L01

#### library

**스케치**> **라이브러리 포함하기**> **라이브러리 관리**> **nRF24L01** 검색한 후, **RF24 by TMRh20, Avamander** 설치

{{< figure src="/image/n/ESP32-nRF24L01-02.png" width="75%" class="center" >}}

<br>

#### schematic: nRF24L01 receiver with ESP32

{{< figure src="/image/n/ESP32-nRF24L01-01.png" width="75%" class="center" >}}

※ nRF24L01 모듈에 따라 10uF 캐페시터가 없으면 통신이 안되는 경우가 있음. 이런 경우에만 사용할 것.

<br>

##### pinmap: (안테나를 위로 향하게 두고, 모듈을 위에서 내려다 볼때의 핀배열)

| ESP32                  | 3V3        | IO5     | IO23     | None     |
| ---------------------- | ---------- | ------- | -------- | -------- |
|                        | ↑          | ↑       | ↑        | ↑        |
| nRF24L01               | VCC + 10uF | CSN     | MOSI     | IRQ      |
| (위에서 보이는 핀배열) | GND + 10uF | CE      | SCK      | MISO     |
|                        | ↓          | ↓       | ↓        | ↓        |
| **ESP32**              | **GND**    | **IO4** | **IO18** | **IO19** |

<br>

#### sketch: 1:1 Chat Room

* 양방향 송수신을 위하여 위 회로도를 보고 2개의 모듈을 만든 뒤, 다음 스케치를 업로드한다.
* 시리얼 모니터를 띄운 뒤, 메세지를 전송해본다.

```C++
//Libraries for NRF24L01+ module.
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
 
//RF24 object with two pins defined with arguments. CE: 4, CSN: 5
RF24 radio(4, 5);
 
//Address of the pipe. 40 bit long, you can choose this freely.
//Remember to use different address in different projects.
long long address = 0x1234ABCDEFLL;

int count = 0;
char stext[32] = "";
int spos = 0;
char rtext[32] = "";
int rpos = 0;

void sendText(char * text, int tlen)
{
  radio.stopListening();
  radio.openWritingPipe(address);
  radio.write(stext, tlen);

  Serial.print("SEND: ");
  Serial.println(text);    

  memset(stext, 0x00, 32);

  radio.openReadingPipe(0, address);
  radio.startListening();
}

void setup() {
  //Start the radio
  Serial.begin(115200);
  radio.begin();

  //Open reading pipe with given address and start listening for incoming data
  radio.openReadingPipe(0, address);
  radio.setPALevel(RF24_PA_MIN); 
  radio.startListening();
}
 
void loop() {
  while(0 < Serial.available()) {
    stext[spos] = Serial.read();
    
    if(stext[spos] == 0x0a) {
      sendText(stext, spos);
      spos = 0;
    }
    else {
      spos += 1;
    }
  }

  if (radio.available()) {
    while (radio.available()) {
      radio.read(rtext, 32);
    }
    Serial.print("RECV: ");
    Serial.println(rtext);
  }
}
```

<br>

#### sketch: 1:1 Chat Room

다음은 처음 실행 후 시리얼모니터에 입력한 ID를 이용하여 Chat Room을 만드는 코드이다. 

```C++
//Libraries for NRF24L01+ module.
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
 
//RF24 object with two pins defined with arguments. CE: 4, CSN: 5
RF24 radio(4, 5);
 
//Address of the pipe. 40 bit long, you can choose this freely.
//Remember to use different address in different projects.
long long address = 0x1234ABCDEFLL;

String username = "";
String dataInput;
char dataToSend[32];
char dataReceived[32];

void setup() {
  //Start the radio
  Serial.begin(115200);
  delay(2000);
  Serial.println("Enter username: ");
  radio.begin();
  radio.setRetries(3, 5);
  //Open reading pipe with given address and start listening for incoming data
  radio.openWritingPipe(address);
  radio.openReadingPipe(0, address);
  radio.setPALevel(RF24_PA_MIN); 
}

void loop() {

  //set username
  while(username == "") {
    if(Serial.available()) {
      username = Serial.readStringUntil('\n');
      Serial.print("Welcome ");
      Serial.println(username);
    }
  }

  radio.startListening();

  if(radio.available()) {
    radio.read(&dataReceived, sizeof(dataReceived));
    Serial.println(dataReceived);
  }
  
  if(Serial.available()) {
    radio.stopListening();

    dataInput = "[" + username + "] " + Serial.readStringUntil('\n');
    Serial.println(dataInput);
    dataInput.toCharArray(dataToSend, 32);

    radio.write(&dataToSend, sizeof(dataToSend));
  }
}
```



<br>

<br>

### nRF24L01을 이용한 센서값 전송

#### for Receiver

##### schematic

{{< figure src="/image/n/ESP32-nRF24L01-01.png" width="75%" class="center" >}}

<br>

##### sketch

###### long long address = 0x1234ABCDEFLL;

* receiver와 transmitter의 페어링을 위한 파이프(주소)를 지정함. (receiver와 transmitter의 파이프(주소)는 동일해야 함)
* 주변 여러 사람이 동시에 nRF24L01 모듈을 사용할 경우, **서로 다른 고유의 파이프(주소)를 지정**하여야 한다.

<br>

###### uint16_t temphumi[2];

* 8-bit 기반 Arduino와 32-bit 기반 ESP32를 receiver와 transmitter로 혼용하여 사용할 경우, 아래와 같이 **int를 사용하여 변수(혹은 배열)를 선언하면 문제가 발생**함.

  ```C++
  int temphumi[2];
  ```

  8비트 아키텍처에서 int는 16비트이지만, 32비트 아키텍처에서는 32비트로 정의되기 때문이며,

* 이로 인해 radio.write 또는 radio.read를 할때 일부 데이터가 송신(혹은 수신)되지 않을 수 있다.

* 그러므로, arduino와 ESP32를 함께 사용할때에는, 아래와 같은 형태로 변수(혹은 배열) 선언시 특정 비트의 변수로 제한하여 선언할 필요가 있다.

  ```C++
  uint16_t temphumi[2];
  ```

* 단, 송수신기로 Arduino만 사용하거나, 혹은 ESP32만 사용하는 경우에는 int를 사용해도 됨

<br>

######  radio.openReadingPipe(1, address);

페어링 파이프(주소)를 오픈

<br>

#### for Transmitter

##### schematic

스케치를 업로드하고, 컴퓨터와 연결한 USB선을 분리한 뒤, 독립하여 동작하도록 외부 전원을 연결한다.

※ nRF24L01 모듈에 따라 10uF 캐페시터가 없으면 통신이 안되는 경우가 있음. 이런 경우에만 사용할 것.

{{< figure src="/image/n/ESP32-nRF24L01-03.png" width="75%" class="center" >}}

<br>

##### 18650을 사용하여 5V 외부 전원 만들기

* ESP32를 외부전원을 통해 동작시키려면, ESP32의 5V/GND 단자를 사용하여 5~12V의 전압(최적 전압은 6~7V)을 공급하여야 한다.
* 18650 소켓에 F단자를 납땜하여 연결한다. (**M단자는 서로 맞닿을 경우 과열 위험이 있으므로 사용금지!**)

{{< figure src="/image/n/ESP32-nRF24L01-04.png" width="75%" class="center" >}}

<br>

* DC-DC 5V 승압 모듈에 아래 그림과 같이 납땜하여 연결한다. (USB단자는 사용하지 않음)

{{< figure src="/image/n/ESP32-nRF24L01-06.png" width="75%" class="center" >}}

<br>

※ USB단자가 있는 5V 승압 모듈을 사용하였지만, USB단자가 없는 승압모듈을 사용하면 더 깔끔하게 제작 가능하다.

{{< figure src="/image/n/ESP32-nRF24L01-05.png" width="75%" class="center" >}}

<br>

* 위 사진과 같이 납땜한 승압 모듈을 18650배터리와 ESP32에 연결한다.

| 승압 모듈       | ESP32 | 18650배터리 |
| --------------- | ----- | ----------- |
| 파란색 원 (GND) | GND   |             |
| 빨간색 원 (5V)  | 5V    |             |
| 노란색 원(IN+)  |       | (+)극       |
| 초록색 원(IN-)  |       | (-)극       |

<br>

> (transmitter의 경우, 많은 전류를 사용하지 않으므로) 위 그림처럼 ESP32에 DC컨버터를 사용하여 전원을 공급하는 형태보다는, **TTGO T-Energy** 사용을 추천함

| TTGO T-Energy                                                |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {{< figure src="/image/n/TTGO-T-Energy03.png" width="67%" class="center" >}} | {{< figure src="/image/n/TTGO-T-Energy04.png" width="67%" class="center" >}} |

<br>

##### sketch: DHT22 temperature and humidity Sensor

###### library for DHT11 or DHT22 sensor

먼저 온습도 센서 데이터를 보내기 위해 온습도 센서 라이브러리를 설치 

**스케치**> **라이브러리 포함하기**> **라이브러리 관리**> **DHT** 검색

* 먼저 **DHT sensor library (by Adafruit)**를 검색하여 **설치**를 누르면,

  {{< figure src="/image/dht22-03.png" width="75%" class="center" >}}

- **Dependencies for library DHT sensor library** 창이 나오면 **Install all**을 클릭하여 2개의 라이브러리를 동시에 설치

  {{< figure src="/image/dht22-04.png" width="75%" class="center" >}}

<br>

```C
//Libraries for NRF24L01+ module.
#include <SPI.h>
#include <RF24.h>
 
//RF24 object with two pins defined with arguments. CE: 4, CSN: 5
RF24 radio(4, 5);
 
//Address of the pipe. 40 bit long, you can choose this freely.
//Remember to use different address in different projects.
long long address = 0x1234ABCDEFLL;

// for temperature, humidity sensor
#include "DHT.h"
#define DHTPIN    13         // data pin
#define DHTTYPE   DHT22      // change to DHT11 if you're using the DHT11
//float temphumi[2];         // AM2301(DHT21) -> DHT21, AM2302(DHT22) -> DHT22
uint16_t temphumi[2];
DHT dht(DHTPIN, DHTTYPE);


void setup() {
  //Start the radio
  Serial.begin(115200);

  radio.begin();
  radio.openWritingPipe(address);
  //RF24_PA_MIN, RF24_PA_LOW, RF24_PA_HIGH and RF24_PA_MAX
  //NRF24L01: -18dBm, -12dBm,-6dBM, and 0dBm
  radio.setPALevel(RF24_PA_LOW);
  radio.stopListening();
    
  dht.begin();
}
 
void loop() {
  //Get temperature from the sensor
  uint16_t t = dht.readTemperature();
  uint16_t h = dht.readHumidity();

  temphumi[0] = t;
  temphumi[1] = h;

  //Send the temperature wirelessly, print error if failed
  if (!radio.write(&temphumi, sizeof(temphumi))) {
    Serial.println(F("Sending temperature failed"));
      
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
  return;
  }
  delay(2000);
  } 
}
```

<br>

* long long address = 0x1234ABCDEFLL;

  * receiver와 transmitter의 페어링을 위한 파이프(주소)를 지정함. (receiver와 transmitter의 파이프(주소)는 동일해야 함)

  * 주변 여러 사람이 동시에 nRF24L01 모듈을 사용할 경우, **서로 다른 고유의 파이프(주소)를 지정**하여야 한다.


<br>

* radio.setPALevel(RF24_PA_LOW);
  * RF24_PA_MIN
  * RF24_PA_LOW
  * RF24_PA_HIGH
  * RF24_PA_MAX: 가장 강함 (전류소모도 큼) 

<br>

#### result

{{< figure src="/image/n/ESP32-nRF24L01-07.png" width="75%" class="center" >}}

<br>

<br>

### nRF24L01 + Dual Joystick

2개의 조이스틱을 사용하여 x축, y축 좌표값을 받아보자.

<br>

#### for Transmitter

##### schematic: nRF24L01 transmitter with ESP32, Dual Joystick

하나의 조이스틱으로도 일반적인 조정이 가능하지만, 시판되는 조정기의 경우 dual joystick(혹은 dual channel)을 사용하는 형태가 많으므로, 여기서도 이와 같은 형태의 transmitter를 만들어 보자.

{{< figure src="/image/n/ESP32-nRF24L01-08.png" width="75%" class="center" >}}

* 위 그림에서는 18650을 DC 컨버터를 사용하여 5V핀에 입력하고 있음.

* (transmitter의 경우, 많은 전류를 사용하지 않으므로) 위 그림처럼 ESP32에 DC컨버터를 사용하여 전원을 공급하는 형태보다는, TTGO T-Energy 사용을 추천함

  | TTGO T-Energy                                                |                                                              |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | {{< figure src="/image/n/TTGO-T-Energy03.png" width="67%" class="center" >}} | {{< figure src="/image/n/TTGO-T-Energy04.png" width="67%" class="center" >}} |

<br>

###### pinmap

| ESP32 | Joystick1 (x축) | Joystick2 (y축) |
| ----- | --------------- | --------------- |
| GND   | GND             | GND             |
| 5V    | 5V              | 5V              |
| 25    | VRX             |                 |
| 32    |                 | VRY             |

<br>

##### sketch: nRF24L01 transmitter with ESP32, Dual Joystick

```c
#include <SPI.h>
#include <RF24.h>
RF24 radio(4, 5);

long long address = 0x1234ABCDEFLL;

// for no interference, two joysticks must be used with each other ADC!  
// one joystick use ADC1: GPIO 36,39,32,33,34,35
// the other must use ADC2: GPIO 4,0,2,15,13,12,14,27,25,26
const int Jstick_x_pin = 25;           // Left_Right GPIO25
const int Jstick_y_pin = 32;           // Forward_Back GPIO32

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;


void setup() {
  Serial.begin(115200);
  
  radio.begin();
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MIN);
  radio.stopListening();
}

void loop() {
  data.value_x = Jstick(Jstick_x_pin);
  delay(10);
  data.value_y = Jstick(Jstick_y_pin);
  delay(10);
  radio.write(&data, sizeof(Value));

  //Serial.print("x: "); Serial.print(data.value_x);
  //Serial.print(", y: "); Serial.println(data.value_y);
}

uint16_t Jstick(int Jstick_Pin){
  return analogRead(Jstick_Pin);
}
```

<br>

##### Joystick GPIO의 선정

```C
// for no interference, two joysticks must be used with each other ADC! 
// one joystick use ADC1: GPIO 36,39,32,33,34,35
// the other must use ADC2: GPIO 4,0,2,15,13,12,14,27,25,26
const int Jstick_x_pin = 25;           // Left_Right GPIO25
const int Jstick_y_pin = 32;           // Forward_Back GPIO32
```

* 2개의 joystick을 동시에 사용할때 동일한 ADC의 GPIO를 사용하면, **한쪽 joystick을 움직여 값을 변화시킬 경우 다른 한쪽 joystick을 움직이지 않았음에도 동시에 값이 일부 (소폭) 변화하는 현상**이 생긴다.
* 이 문제를 해결하기 위해 각각의 joystick을 서로 다른 ADC에 연결한다.
  * ADC1: GPIO 36,39,32,33,34,35 중 1개 사용 (예제에서는 GPIO 32를 y축 joystick으로 사용)
  * ADC2:  GPIO 4,(0),(2),15,13,(12),14,27,25,26 중 1개 사용 (()안의 핀은 사용시 주의 필요) (예제에서는 GPIO 25를 x축 joystick으로 사용)
* 단, ESP32의 wifi 기능을 이용하면 ADC1핀 중에서 wifi 기능에 공유되는 핀의 사용에 제한을 받게 되므로 주의가 필요하다.
* 그밖에도 사용하는 ADC의 noise를 제거하기 위해 다음과 같은 방법을 쓰는 것이 좋다.
  * GPIO와 GND에 100nF 케패시터를 연결하여 사용
  * 10여회 정도의 값을 받아 평균값으로 사용

<br>

#### for Receiver

##### schematic: nRF24L01 receiver with ESP32

{{< figure src="/image/n/ESP32-nRF24L01-01.png" width="75%" class="center" >}}

<br>

##### sketch

```c++
#include <SPI.h>
#include <RF24.h>
RF24 radio(4 ,5);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;


void setup() {
  Serial.begin(115200);
  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();
}

unsigned long lastRecvTime = 0;

void recvData(){
  while( radio.available()){
    radio.read(&data, sizeof(Value));
    lastRecvTime = millis();  
  }
}

void loop() {
    unsigned long now = millis();
  
  if( now - lastRecvTime > 1000){
	recvData();
  }

  Serial.print("x: "); Serial.print(data.value_x);
  Serial.print(", y: "); Serial.println(data.value_y); 
}
```

<br>

#### result

{{< figure src="/image/n/ESP32-nRF24L01-09.png" width="75%" class="center" >}}

<br>

<br>

### nRF24L01 + Dual Joystick + Dual Servomotors

#### for Receiver

##### schematic: nRF24L01 receiver with ESP32, Dual Joystick 

{{< figure src="/image/n/ESP32-nRF24L01-10.png" width="75%" class="center" >}}

* MG996R과 같이 전류 사용량이 큰 서보 모터를 2개 이상 사용하는 경우, ESP32의 5V pin에서 공급하는 전류량이 부족하여 서보모터 동작이 원활치 않을 수 있다. 이런 경우에는 아래와 같이 외부 전원을 사용하여야 한다.

<br>

###### pinmap

| ESP32 | servo_x  | servo_y  |
| ----- | -------- | -------- |
| GND   | GND (갈) | GND (갈) |
| 5V    | 5V (빨)  | 5V (빨)  |
| 25    | VRX (주) |          |
| 32    |          | VRY (주) |

<br>

##### schematic: nRF24L01 receiver with ESP32, Dual Joystick, External Power (standalone)

{{< figure src="/image/n/esp32-nRF24L01-servo-02.png" width="75%" class="center" >}}

<br>

##### 외부 전원의 구성

* 18650 리튬이온 전지 2개를 사용하여 7.4V를 공급 (혹은 18650 3개를 사용하여 11.1V로 구성)

* XL4015E1칩을 사용한 HW-514 DC-DC regulator를 사용하여,  7.4V → 5V로 전압을 낮춘다. (유사한 형태의 모듈 사용 가능)

  | HW-514 HC v0.2                                               | Specification                                                |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | {{< figure src="/image/n/esp32-nRF24L01-servo-03.png" width="75%" class="center" >}} | Input voltage: 5-36V (6.5V 미만 입력시 디스플레이 동작안됨) <br/><br/>Output voltage: 1.25-32V continuously adjustable<br/>Output current: adjustable, up to 5A (4.5A 이내 권장)<br/>Output power: 75W max (50W 이내 권장)<br/> <br/>Conversion efficiency: up to 96%<br/> <br/>Working frequency: 180KHz<br/>Short circuit protection: yes<br/>Over-temperature protection<br/>Input reverse polarity protection: None,<br/>(필요시 고전류 다이오드를 입력단에 사용)<br/> <br/>Module Size: 68.2 * 38.8 * 15 (mm) |

  * 왼쪽 가변저항으로 출력 전압을 5V 조정 (오른쪽 가변저항은 출력 전류를 조정)

  * 2P 출력단자는 모터에 직접 연결
  * USB포트는 USB-A to microUSB 케이블을 사용하여 ESP32에 연결 (이런 이유로 USB단자가 있는 모듈을 사용하는 것이 편함)

* 아래와 같은 mini360, mini560 등의 소형 컨버터를 사용하면,

  | {{< figure src="/image/n/regulator-mini560.png" width="67%" class="center" >}} | {{< figure src="/image/n/regulator-mini360.png" width="47%" class="center" >}} |
  | :----------------------------------------------------------: | :----------------------------------------------------------: |

  * SG90 서보모터는 정상적으로 동작
  * MG996R 서보모터를 연결한 경우에는 컨버터 자체가 불안정하여 모터 동작이 멈춤

<br>

##### ※ 외부 전원 구성시 주의할 점!

* 외부 전원을 ESP32의 5V or 3.3V 핀에 직접 연결하지 않도록 한다.
* **외부 전원을 DC 컨버터를 사용하여 5V or 3.3V로 만든 경우에도 5V or 3.3V 핀에 직접 연결하면 안된다.**
* ESP32의 스펙상 5V or 3.3V 핀을 사용하여 외부 전원을 구성해도 된다고 나와 있지만, 실제로는 모터 등의 모듈이 작동하지 않거나, 심할 경우 ESP32 보드가 망가질 수 있으므로 이와 같은 구성은 지양한다.
* (경험상) ESP32의 microUSB포트를 통해 전원을 공급하는 것이 가장 안정적으로 동작하였음!

<br>

##### sketch: nRF24L01 receiver with ESP32, Dual Joystick , External Power (standalone)

###### library for ESP32

**스케치**> **라이브러리 포함하기**> **라이브러리 관리** 에서 "**esp32servo**" 검색 

{{< figure src="/image/n/esp32-nRF24L01-servo-01.png" width="75%" class="center" >}}

<br>

###### sketch

```C
#include <SPI.h>
#include <RF24.h>
RF24 radio(4, 5);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;

//Servo motor library for ESP32
#include <ESP32Servo.h>

Servo servo_x;  // create servo object to control a servo
Servo servo_y;  // 16 servo objects can be created on the ESP32

int angle_x, angle_y;

// Recommended PWM GPIO pins on the ESP32 include 2,4,12-19,21-23,25-27,32-33 
int servo_xPin = 15;
int servo_yPin = 2;

// RecvTime
unsigned long lastRecvTime = 0;

void recvData(){
  while( radio.available()){
    radio.read(&data, sizeof(Value));
    lastRecvTime = millis();  
  }
}

void setup() {
  Serial.begin(115200);
  
  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();
  
  // Allow allocation of all timers
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo_x.setPeriodHertz(50);    // standard 50 hz servo
  servo_y.setPeriodHertz(50);
  servo_x.attach(servo_xPin, 500, 2500); // attaches the servo on pin 25 & 32 to the servo object
  servo_y.attach(servo_yPin, 500, 2500);
  // using default min/max of 1000us and 2000us
  // different servos may require different min/max settings
  // for an accurate 0 to 180 sweep
}

void loop() {
  recvData();
  unsigned long now = millis();
  
  if( now - lastRecvTime > 1000){
    //ResetData();
  }
  
  rotate_xy();
}

void rotate_xy() {
  Serial.print("x: "); Serial.print(data.value_x);
  Serial.print(", y: "); Serial.println(data.value_y);
  angle_x = map(data.value_x, 0, 4095, 0, 180);
  angle_y = map(data.value_y, 0, 4095, 0, 180);
  servo_x.write(angle_x);
  servo_y.write(angle_y);  
  delay(10); 
}

```

<br>

<br>

#### 조이스틱 중립 조정

* 2개의 조이스틱을 중립에 두고, 시리얼 모니터를 통해 센서값을 확인했을때, x축 서보모터는 2700정도, y축 서보모터는 2800 정도의 값을 나타내었다. 

* 이를 기준으로 조이스틱의 값에 따른 대략적인 형태를 생각해보면 (아래의 원 그림에 2개의 조이스틱 값을 모두 나타냄)

  {{< figure src="/image/s/ESP32-2servo-02.png" width="75%" class="center" >}}

* x축 조이스틱 값이

  * 1350~3400 일때: 중립 (서보모터는 90도 위치로 이동)
  * 0~1350 일때: 서보모터 1도씩 감소 (0도 위치가 될때까지)
    * 단, 자동차 조향 시스템에 적용할 경우 **55~90도** 사이에서만 움직이도록 조정
  * 3400~4095 일때: 서보모터 1도씩 증가 (180도 위치가 될때까지) 
    * 단, 자동차 조향 시스템에 적용할 경우 **90~125도** 사이에서만 움직이도록 조정

* y축 조이스틱 값이

  * 1400~3350 일때: 중립 (서보모터는 90도 위치로 이동)
  * 0~1400 일때: 서보모터 1도씩 감소 (0도 위치가 될때까지) (자동차에 적용시 브레이크 역할)
  * 3350~4095 일때: 서보모터 1도씩 증가 (180도 위치가 될때까지) (자동차에 적용시 액셀레이터 역할)

* 위 그림에 나타낸 값은 모든 조이스틱에 적용되는 절대적인 값이 아니며, 조이스틱마다 중립을 나타내는 센서값이 다르므로, 초기값을 100번 읽은 후 평균값을 만들어 사용한다.

<br>

##### sketch

```C++
#include <SPI.h>
#include <RF24.h>
RF24 radio(4 ,5);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;

//Servo motor library for ESP32
#include <ESP32Servo.h>

Servo servo_x;  // create servo object to control a servo
Servo servo_y;  // 16 servo objects can be created on the ESP32

int angle_x = 90;
int angle_y = 90;
int i = 0;
int center_x = 0;
int center_y = 0;
int ref_xl, ref_xr, ref_ya, ref_yb;    // Servo rotation reference value 

// for no interference, each joysticks must be used with other ADC! (* not recommended)
// one joystick use ADC1: GPIO 36,39,32,33,34,35
// the other must use ADC2: GPIO 4,0*,2,15,13,12,14,27,25,26
int servo_xPin = 15;
int servo_yPin = 2;

// RecvTime
unsigned long lastRecvTime = 0;

void centerData(){
  while(i < 100) {
    if(radio.available()){
      radio.read(&data, sizeof(Value));
      center_x = center_x + data.value_x;
      center_y = center_y + data.value_y;
      i++;
    }
  }
  center_x = center_x / 100;         // x축 조이스틱 센터값
  center_y = center_y / 100;         // y축 조이스틱 센터값

  ref_xl = center_x / 2;             // 좌회전 동작 기준값
  ref_xr = (4095 + center_x) / 2;    // 우회전 동작 기준값
  ref_ya = (4095 + center_y) / 2;    // accelator 동작 기준값
  ref_yb = center_y / 2;             // brake 동작 기준값
}

void recvData(){
  while(radio.available()){
    radio.read(&data, sizeof(Value));
    lastRecvTime = millis();  
  }
}

void setup() {
  Serial.begin(115200);
  
  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();
  
  // Allow allocation of all timers
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo_x.setPeriodHertz(50);    // standard 50 hz servo
  servo_y.setPeriodHertz(50);
  servo_x.attach(servo_xPin, 500, 2500); // attaches the servo on pin 25 & 32 to the servo object
  servo_y.attach(servo_yPin, 500, 2500);
  // using default min/max of 1000us and 2000us
  // different servos may require different min/max settings
  // for an accurate 0 to 180 sweep

  // center value
  centerData();
}

void loop() {
  unsigned long now = millis();
  
  if( now - lastRecvTime > 5){    // 5ms 마다 서보출력
    recvData();
    rotate_xy();
  }
}

void rotate_xy() {
  //Serial.print("x: "); Serial.print(data.value_x);
  //Serial.print(", y: "); Serial.println(data.value_y);

  //x축 서보 구동 조건 설정
  if(data.value_x < ref_xl) {
    if(angle_x > 0) {
      angle_x--;
    }
    else {
      angle_x = 0;
    }
  }
  else if(data.value_x > ref_xr) {
    if(angle_x < 180) {
      angle_x++;
    }
    else {
      angle_x = 180;
    }
  }
  else {
    if(angle_x < 90) {
      angle_x++;
    }
    else if(angle_x > 90) {
      angle_x--;
    }
    else {
      angle_x = 90;
    }
  }

 //y축 서보 구동 조건 설정
 if(data.value_y < ref_yb) {
    if(angle_y > 0) {
      angle_y--;
    }
    else {
      angle_y = 0;
    }
  }
  else if(data.value_y > ref_ya) {
    if(angle_y < 180) {
      angle_y++;
    }
    else {
      angle_y = 180;
    }
  }
  else {
    if(angle_y < 90) {
      angle_y++;
    }
    else if(angle_y > 90) {
      angle_y--;
    }
    else {
      angle_y = 90;
    }
  }
  
  servo_x.write(angle_x);
  servo_y.write(angle_y);
  delay(5);                    // delay를 더 줄이면 서보 모터 기어에 무리가 감
}
```

