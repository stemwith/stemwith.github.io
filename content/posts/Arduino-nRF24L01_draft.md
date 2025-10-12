---
title: "Arduino, nRF24L01 무선통신"
categories: ["Arduino"]
date: 2021-10-10T18:27:53+09:00
draft: true
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

#### schematic: nRF24L01 receiver with Arduino Uno

{{< figure src="/image/n/UNO-nRF24L01-01.png" width="75%" class="center" >}}

※ nRF24L01 모듈에 따라 10uF 캐페시터가 없으면 통신이 안되는 경우가 있음. 이런 경우에만 사용할 것.

<br>

#### sketch: nRF24L01 receiver

```C
//Libraries for NRF24L01+ module.
#include <SPI.h>
#include <RF24.h>
 
//RF24 object with two pins defined with arguments. CE: 4, CSN: 5
RF24 radio(4, 5);
 
//Address of the pipe. 40 bit long, you can choose this freely.
//Remember to use different address in different projects.
long long address = 0x1234ABCDEFLL;
// float temphumi[2];
 uint16_t temphumi[2];

// for temperature, humidity sensor
#include "DHT.h"
#define DHTPIN    13         // data pin
#define DHTTYPE   DHT11      // change to DHT11 if you're using the DHT11
                             // AM2301(DHT21) -> DHT21, AM2302(DHT22) -> DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  //Start the radio
  Serial.begin(115200);
  radio.begin();

  //Open reading pipe with given address and start listening for incoming data
  radio.openReadingPipe(1, address);
  radio.startListening();
    
  dht.begin();
}
 
void loop() {
  //If data is available in radio's buffer
  if(radio.available()) {
    //While the data is available...
    while (radio.available()) {
      //Update temperature -variable with data from the radio module
      radio.read(&temphumi, sizeof(temphumi));
    }
    Serial.print("temperature: "); Serial.print(temphumi[0]);
    Serial.print(",  humidity: "); Serial.println(temphumi[1]);
  }
  delay(2000);
}
```

<br>

##### long long address = 0x1234ABCDEFLL;

* receiver와 transmitter의 페어링을 위한 파이프(주소)를 지정함. (receiver와 transmitter의 파이프(주소)는 동일해야 함)
* 주변 여러 사람이 동시에 nRF24L01 모듈을 사용할 경우, **서로 다른 고유의 파이프(주소)를 지정**하여야 한다.

<br>

##### uint16_t temphumi[2];

* 8-bit 기반 Arduino와 32-bit 기반 ESP32를 receiver와 transmitter로 혼용하여 사용할 경우, 아래와 같이 변수(혹은 배열)를 선언하면 문제가 발생함.

```
int temphumi[2];
```

* 8비트 아키텍처에서 int는 16비트이지만, 32비트 아키텍처에서는 32비트로 정의되기 때문이며,

* 이로 인해 radio.write 또는 radio.read를 할때 일부 데이터가 송신(혹은 수신)되지 않을 수 있다.

* 그러므로, arduino와 ESP32를 함께 사용할때에는, 변수(혹은 배열) 선언시 특정 비트의 변수로 제한하여 선언할 필요가 있다.
* 단, 송수신기로 Arduino만 사용하거나, 혹은 ESP32만 사용하는 경우에는 int를 사용해도 됨

<br>

#####  radio.openReadingPipe(1, address);

페어링 파이프(주소)를 오픈

<br>

<br>

#### sketch: nRF24L01 transmitter with ESP32

##### library for DHT11 or DHT22 sensor

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

##### long long address = 0x1234ABCDEFLL;

* receiver와 transmitter의 페어링을 위한 파이프(주소)를 지정함. (receiver와 transmitter의 파이프(주소)는 동일해야 함)
* 주변 여러 사람이 동시에 nRF24L01 모듈을 사용할 경우, **서로 다른 고유의 파이프(주소)를 지정**하여야 한다.

<br>

#####   radio.setPALevel(RF24_PA_LOW);

송신 전파 강도를 설정한다.

* RF24_PA_MIN
* RF24_PA_LOW
* RF24_PA_HIGH
* RF24_PA_MAX: 가장 강함 (전류소모도 큼) 

<br>

#### schematic: nRF24L01 transmitter with ESP32

스케치를 업로드하고, 컴퓨터와 연결한 USB선을 분리한 뒤, 독립하여 동작하도록 외부 전원을 연결한다.

※ nRF24L01 모듈에 따라 10uF 캐페시터가 없으면 통신이 안되는 경우가 있음. 이런 경우에만 사용할 것.

{{< figure src="/image/n/ESP32-nRF24L01-03.png" width="100%" class="center" >}}

<br>

* ESP32를 외부전원을 통해 동작시키려면, ESP32의 5V/GND 단자를 사용하여 5~12V의 전압(최적 전압은 6~7V)을 공급하여야 한다.
* 여기서는 DC-DC 5V 승압회로를 사용하여 ESP32에 5V를 공급한다. (배터리는 18650 1개 (3.7V) 사용)

<br>

##### 18650을 사용하여 5V 외부 전원 만들기

* 18650 소켓에 F단자를 납땜하여 연결한다. (**M단자는 서로 맞닿을 경우 과열 위험이 있으므로 사용금지!**)

{{< figure src="/image/n/ESP32-nRF24L01-04.png" width="75%" class="center" >}}

<br>

* DC-DC 5V 승압 모듈에 아래 그림과 같이 납땜하여 연결한다. (USB단자는 사용하지 않음)

{{< figure src="/image/n/ESP32-nRF24L01-06.png" width="50%" class="center" >}}

<br>

※ USB단자가 있는 5V 승압 모듈을 사용하였지만, USB단자가 없는 승압모듈을 사용하면 더 깔끔하게 제작 가능하다.

{{< figure src="/image/n/ESP32-nRF24L01-05.png" width="50%" class="center" >}}

<br>

* 위 사진과 같이 납땜한 승압 모듈을 18650배터리와 ESP32에 연결한다.

| 승압 모듈       | ESP32 | 18650배터리 |
| --------------- | ----- | ----------- |
| 파란색 원 (GND) | GND   |             |
| 빨간색 원 (5V)  | 5V    |             |
| 노란색 원(IN+)  |       | (+)극       |
| 초록색 원(IN-)  |       | (-)극       |

<br>

#### result

{{< figure src="/image/n/ESP32-nRF24L01-07.png" width="75%" class="center" >}}

<br>

<br>

### nRF24L01 + dual joystick

2개의 조이스틱을 사용하여 x축, y축 좌표값을 받아보자.

<br>

#### schematic: nRF24L01 dual joystick transmitter with ESP32

하나의 조이스틱으로도 일반적인 조정이 가능하지만 시판되는 조정기의 경우 dual joystick(혹은 dual channel)을 사용하는 형태가 많으므로, 여기서도 이와 같은 형태의 transmitter를 만들어 보자.

{{< figure src="/image/n/ESP32-nRF24L01-08.png" width="100%" class="center" >}}

<br>

##### pinmap

| ESP32 | Joystick1 (x축) | Joystick2 (y축) |
| ----- | --------------- | --------------- |
| GND   | GND             | GND             |
| 5V    | 5V              | 5V              |
| 25    | VRX             |                 |
| 32    |                 | VRY             |

<br>

#### sketch

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

/*
void ResetData(){
  data.value_x = 2800;
  data.value_y = 2800;
}
*/

void setup() {
  Serial.begin(115200);
  
  radio.begin();
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MIN);
  radio.stopListening();
  //ResetData();   
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

* 2개의 joystick을 동시에 사용할때 동일한 ADC의 GPIO를 사용하면, 한쪽 joystick을 움직여 값을 변화시킬 경우 다른 한쪽 joystick을 움직이지 않았음에도 동시에 값이 일부 (소폭) 변화하는 현상이 나타났다.
* 이 문제를 해결하기 위해 각각의 joystick을 서로 다른 ADC에 연결한다.
  * ADC1: GPIO 36,39,32,33,34,35 중 1개 사용 (예제에서는 GPIO 32를 y축 joystick으로 사용)
  * ADC2:  GPIO 4,(0),(2),15,13,(12),14,27,25,26 중 1개 사용 (()안의 핀은 사용시 주의 필요)(예제에서는 GPIO 25를 x축 joystick으로 사용)
* 단, ESP32의 wifi 기능을 이용하면 ADC1핀 중에서 wifi 기능에 공유되는 핀의 사용에 제한을 받게 되므로 주의가 필요하다.
* 그밖에도 사용하는 ADC의 noise를 제거하기 위해 다음과 같은 방법을 쓰는 것이 좋다.
  * GPIO와 GND에 100nF 케패시터를 연결하여 사용
  * 10여회 정도의 값을 받아 평균값으로 사용

<br>

#### schematic: nRF24L01 receiver with ESP32

{{< figure src="/image/n/ESP32-nRF24L01-01.png" width="75%" class="center" >}}

<br>

#### schematic: nRF24L01 receiver with Arduino UNO

위에서 사용한 Arduino UNO receiver와 동일함

{{< figure src="/image/n/UNO-nRF24L01-01.png" width="75%" class="center" >}}

<br>

#### sketch

```C
#include <SPI.h>
#include <RF24.h>
RF24 radio(9 ,10);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;

/*
void ResetData(){
  data.value_x = 2800;
  data.value_y = 2800;
}
*/

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
  recvData();
  unsigned long now = millis();
  
  if( now - lastRecvTime > 1000){
    //ResetData();
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

### nRF24L01 + dual joystick + dual Servomotors

#### schematic: nRF24L01 dual joystick receiver with ESP32

{{< figure src="/image/n/ESP32-nRF24L01-10.png" width="75%" class="center" >}}

<br>

##### pinmap



<br>

#### schematic: nRF24L01 dual joystick receiver with Arduino

{{< figure src="/image/n/UNO-nRF24L01-02.png" width="75%" class="center" >}}

<br>

##### pinmap



<br>

#### schematic: nRF24L01 dual joystick receiver with ESP32 (standalone)

{{< figure src="/image/n/esp32-nRF24L01-servo-02.png" width="75%" class="center" >}}

<br>

##### pinmap



<br>

#### schematic: nRF24L01 dual joystick receiver with Arduino (standalone)

{{< figure src="/image/n/UNO-nRF24L01-03.png" width="75%" class="center" >}}

<br>

##### pinmap



<br>

#### sketch: nRF24L01 dual joystick receiver with Arduino (standalone)

```C
#include <SPI.h>
#include <RF24.h>
RF24 radio(9 ,10);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;

void ResetData(){
  data.value_x = 2800;
  data.value_y = 2800;
}

#include <Servo.h>

Servo servo_x;
Servo servo_y;

int servo_pin_x = 5;
int servo_pin_y = 6;

int angle_x = 90;
int angle_y = 90;

void setup() {
  Serial.begin(115200);
  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();

  servo_x.attach(servo_pin_x, 500, 2400);
  servo_y.attach(servo_pin_y, 500, 2400);
  servo_x.write(10);
  servo_y.write(10);
}

unsigned long lastRecvTime = 0;

void recvData(){
  while( radio.available()){
    radio.read(&data, sizeof(Value));
    lastRecvTime = millis();  
  }
}

void loop() {
  recvData();
  unsigned long now = millis();
  
  if( now - lastRecvTime > 1000){
    ResetData();
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

#### sketch: for ESP32

##### library for ESP32

**스케치**> **라이브러리 포함하기**> **라이브러리 관리** 에서 "**esp32servo**" 검색 

{{< figure src="/image/n/esp32-nRF24L01-servo-01.png" width="75%" class="center" >}}

<br>

##### sketch

```C
#include <SPI.h>
#include <RF24.h>
RF24 radio(4 ,5);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;
  uint16_t value_y;
};

Value data;

/*
void ResetData(){
  data.value_x = 2800;
  data.value_y = 2800;
}
*/

//Servo motor library for ESP32
#include <ESP32Servo.h>

Servo servo_x;  // create servo object to control a servo
Servo servo_y;  // 16 servo objects can be created on the ESP32

int angle_x, angle_y;

// Recommended PWM GPIO pins on the ESP32 include 2,4,12-19,21-23,25-27,32-33 
int servo_xPin = 25;
int servo_yPin = 32;

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

