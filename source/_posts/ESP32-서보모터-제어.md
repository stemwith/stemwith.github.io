---
title: esp32 서보모터 PWM제어
categories:
  - esp32
date: 2020-10-19 23:41:02
tags:
---

### SG90, MG90S,  MG966R 서보모터

#### datasheet

![](/image/SG90_Datasheet.jpg)

<br>

#### 사용법

1. ESP32는 16개의 PWM채널이 있으므로, 최대 16개의 서보모터를 동시에 제어할 수 있다.

2. 대부분의 서보모터(**SG90, MG90S, MG966R** 등 포함)는 위의 그림처럼 20ms가 1주기가 되므로, PWM frequency를 50Hz로 설정한다.

3. 20ms가 1주기이고, HIGH 펄스가 2ms 지속될 때 180º 회전을 한다.

4. 그러므로, 전체 펄스 폭의 1/10만큼 HIGH 펄스가 주어지면 180º 회전을 한다.

5. Resolution이 16비트라면 65535의 1/10에 해당하는 ~~6554~~의 값이 duty값으로 주어지면 서보모터는 180º 회전을 한다.

6. ~~16비트 해상도에서 duty값에 따른 회전 각도~~

   *   ~~3277 → 0º~~
   *   ~~4915 → 90º~~
   *   ~~6554 → 180º~~
   *   ~~duty = (deg × 18.2) + 3277~~

   라고 생각했으나, 실제로는 이와 달랐다....즉, 16비트 해상도에서 duty값에 따른 회전 각도는

   * 1638 → 0º
     4915 → 90º
     8192 → 180º

- 그러므로, map 함수를 사용하여 각도를 조절한다.

  duty = map(deg, 0, 180, 1638, 8192);

* delay(15);
  * 서보 회전 속도를 조절하며, 숫자가 작을 수록 빠르게 회전한다.
  * (전류가 약하면) delay(15) 값을 더 줄일경우 180도 회전을 완성하지 못할 수도 있다.
  * 전류가 충분하면 delay값을 줄여도 됨

<br>

<br>

### Servo 라이브러리를 이용하지 않는 경우

일반적으로 아두이노에서 서보모터를 사용하는 경우 아두이노 IDE에 기본적으로 포함되어 있는 <Servo.h> 라이브러리를 사용하면 되지만 이 라이브러리는 ESP32에서 사용할 수 없다. 그러므로 ESP32에 맞는 별도의 Servo.h 라이브러리를 다운로드 받아 사용해야하는 불편함이 있다.

여기서는 라이브러리를 사용하지 않고 PWM을 사용하여 ESP32로 SG90 서보모터를 제어해보고자 한다. 

<br>

#### schematic

![](/image/SG90.png)

<br>

#### sketch
```C
const int ledPin = 19;  // corresponds to GPIO 19

// setting PWM properties
const int ledChannel = 0;
const int freq = 50;
const int resolution = 16;

int deg, duty;

void setup()
{
  // PWM Setup
  ledcSetup(ledChannel, freq, resolution);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin, ledChannel);        // PWM CH0을 GPIO 19번으로 출력
}

void loop()
{
  for (deg = 0;deg <= 180; deg++) {
  servoWrite(ledChannel, deg);
  }
  for (deg = 180;deg >= 0; deg--) {
  servoWrite(ledChannel, deg);
  }
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    duty = map(deg, 0, 180, 1638, 8192);
    ledcWrite(ch, duty);
    delay(15);                             // delay를 줄이면 180도가 완전히 돌지 않음
}
```

<br>

#### sketch: 시리얼 모니터에 입력한 문자로 서보모터 회전시키기

~~~C
const int ledPin = 19;  // corresponds to GPIO 19

// setting PWM properties
const int ledChannel = 0;
const int freq = 50;
const int resolution = 16;

int deg = 90;
int duty;

void setup() {
  Serial.begin(9600);
    
  // PWM Setup
  ledcSetup(ledChannel, freq, resolution);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin, ledChannel);        // PWM CH0을 GPIO 19번으로 출력

  servoWrite(ledChannel, deg);
}

void loop()
{
  while(Serial.available() > 0) 
  {
    char flag=Serial.read();
    delay(2);
      
    if(flag=='l') {
        deg = deg - 5;
        if(deg < 0) {
            deg = 0;
        }
    }
    
    if(flag=='r') {
        deg = deg + 5;
        if(deg > 180) {
            deg = 180;
        }
    }      
  servoWrite(ledChannel, deg);
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    duty = map(deg, 0, 180, 1638, 8192);
    ledcWrite(ch, duty);
    delay(15);                             // delay를 줄이면 180도가 완전히 돌지 않음
}
~~~

<br>

<br>

### 2축 서보모터 거치대 조립 및 테스트

#### 거치대 조립

첫번째 단계로 서보모터 거치대를 조립하고 서보모터 2개를 장착한다.

SG90 서보 2개를 준비하고

<img src="/image/servo-01.png" style="zoom:50%;" />

니퍼로 아래 빨간 동그라미로 표시한 부분의 크기에 맞추어, **서보모터 날개를 잘라낸 뒤**

![](/image/servo-04.png)

아래 형태대로 조립한다.

![](/image/servo-02.png)

![](/image/servo-03.png)

날개를 나사로 조인 부분에 순간접착제를 살짝 뿌려, 완전히 고정시킨다. (단, 서보모터의 회전축 부분에는 접착제가 뭍지 않도록 주의한다.)

<br>

#### schematic

![](/image/servo-05.png)

<br>

#### sketch: 두개의 서보모터를 180도 회전시키기

~~~C
// for horizontal Servo PWM properties
const int ledPin_hori = 19;  // corresponds to GPIO 19
const int ledChannel_hori = 1;
const int freq_hori = 50;
const int resolution_hori = 16;

// for vertical Servo PWM properties
const int ledPin_vert = 18;  // corresponds to GPIO 18
const int ledChannel_vert = 0;
const int freq_vert = 50;
const int resolution_vert = 16;

int deg_hori, deg_vert, duty;

void setup()
{
  // PWM Setup
  ledcSetup(ledChannel_hori, freq_hori, resolution_hori);  // PWM CH1, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_hori, ledChannel_hori);             // PWM CH1을 GPIO 19번으로 출력
  ledcSetup(ledChannel_vert, freq_vert, resolution_vert);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_vert, ledChannel_vert);             // PWM CH0을 GPIO 18번으로 출력
}

void loop()
{
  for (deg_hori = 0;deg_hori <= 180; deg_hori++) {
  servoWrite(ledChannel_hori, deg_hori);
  }
  for (deg_vert = 0;deg_vert <= 180; deg_vert++) {
  servoWrite(ledChannel_vert, deg_vert);
  }
  for (deg_hori = 180;deg_hori >= 0; deg_hori--) {
  servoWrite(ledChannel_hori, deg_hori);
  }
  for (deg_vert = 180;deg_vert >= 0; deg_vert--) {
  servoWrite(ledChannel_vert, deg_vert);
  }
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    duty = map(deg, 0, 180, 1638, 8192);
    ledcWrite(ch, duty);
    delay(15);                             // delay를 줄이면 180도가 완전히 돌지 않음
}
~~~

<br>

<br>

### Joystick 1개를 사용하여 2개의 서보모터 제어하기

#### schematic

![](/image/ESP32_Joystick_2Servo.png)

<nr>

#### sketch

~~~C
// for horizontal Servo PWM properties
const int ledPin_hori = 19;       // corresponds to GPIO 19
const int ledChannel_hori = 1;
const int freq_hori = 50;
const int resolution_hori = 16;

// for vertical Servo PWM properties
const int ledPin_vert = 18;       // corresponds to GPIO 18
const int ledChannel_vert = 0;
const int freq_vert = 50;
const int resolution_vert = 16;

const int Jstick_LR_pin = 26;           // Left_Right GPIO26
const int Jstick_UD_pin = 27;           // Up_Down GPIO27

int Jstick_LR, Jstick_UD, deg_hori, deg_vert, duty;          
 
void setup() {
  Serial.begin(115200);

  // Servo PWM Setup
  ledcSetup(ledChannel_hori, freq_hori, resolution_hori);  // PWM CH1, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_hori, ledChannel_hori);             // PWM CH1을 GPIO 19번으로 출력
  ledcSetup(ledChannel_vert, freq_vert, resolution_vert);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_vert, ledChannel_vert);             // PWM CH0을 GPIO 18번으로 출력
}


void loop(){
    PrintValue();
    
    Jstick_LR = analogRead(Jstick_LR_pin);          
    deg_hori = map(Jstick_LR, 0, 4095, 0, 180);     
    servoWrite(ledChannel_hori, deg_hori);
                             
    Jstick_UD = analogRead(Jstick_UD_pin);           
    deg_vert = map(Jstick_UD, 0, 4095, 0, 180);     
    servoWrite(ledChannel_vert, deg_vert); 
                              
    delay(15);                                  
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    duty = map(deg, 0, 180, 1638, 8192);
    ledcWrite(ch, duty);
    delay(15);                             // delay를 줄이면 180도가 완전히 돌지 않음 (최소값 15)
}

void PrintValue(){
    Serial.print(analogRead(Jstick_LR));
    Serial.print (" - "); 
    Serial.print(analogRead(Jstick_UD));
    Serial.println (" Joystick Value");
}
~~~

<br>

<br>

### ESP32Servo 라이브러리 사용시

#### library for ESP32

**스케치**> **라이브러리 포함하기**> **라이브러리 관리** 에서 "**esp32servo**" (by Kevin Harrington) 검색 후 설치

![](/image/esp32-nRF24L01-servo-01.png)

<br>

#### schematic

![](/image/s/ESP32-2servo-01.png)

<br>

#### sketch

~~~C++
#include <ESP32Servo.h>

Servo servo_x;  // create servo object to control a servo
Servo servo_y;  // 16 servo objects can be created on the ESP32

int pos = 0;    // variable to store the servo position

// Recommended PWM GPIO pins on the ESP32 include 2,4,12-19,21-23,25-27,32-33 
int servo_xPin = 25;
int servo_yPin = 32;

void setup() {
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
  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    servo_x.write(pos);    // tell servo to go to position in variable 'pos'
    servo_y.write(180-pos);
    delay(5);             // waits 5ms for the servo to reach the position
  }
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    servo_x.write(pos);    // tell servo to go to position in variable 'pos'
    servo_y.write(180-pos);
    delay(5);             // waits 5ms for the servo to reach the position
  }
}
~~~

