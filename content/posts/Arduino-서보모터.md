---
title: "Arduino, 서보모터"
categories: ["arduino"]
date: 2018-09-08T17:57:00+09:00
toc: true
tags:
---
### 서보모터 SG-90
{{< figure src="/image/servo-01.png" width="50%" class="center" >}}

*   모터드라이버, 회전센서, 모터, 제어회로가 내장된 기어 박스를 포함하고 있는 형태의 모터로, 스텝모터보다 힘이 강함
*   보통 선이 3가닥이며, 회전수와 각도 등의 움직임 제어가 가능
*   아두이노에서 많이 다루는 SG90 제품의 경우 0~180˚ 제어가 가능
*   아두이노UNO의 USB 전류량이 500mA 정도가 한계이므로 별도의 전원을 사용하지 않으면 1~2개의 서보모터만 사용 가능

<br>

#### 라이브러리 추가하기
서보모터를 사용하기 위한 Servo 라이브러리는 아두이노 IDE에 기본으로 포함되어 있다.

*   스케치> 라이브러리 포함하기\> Servo 를 선택하면,
*   #include <servo.h> 라이브러리가 스케치에 추가 된다.

<br>

#### schematic
{{< figure src="/image/servo-02.jpg" width="75%" class="center" >}}

| SG90    | Brown | Red  | Orange |
| ------- | ----- | ---- | ------ |
| Arduino | GND   | 5V   | 10     |

<br>

#### sketch : 서보모터 180º 회전 왕복하기
```C
#include <Servo.h>

Servo servomotor;                                // servomotor 선언
int position = 0;

void setup() {
  servomotor.attach(10);                         // servomotor 핀 설정
}

void loop() {
  for(position = 0; position < 180; position++)
  {
    servomotor.write(position);                  // pos값의 위치로 이동
    delay(15);                       
  }                                 
  for(position = 180; position > 0; position--)  // 같은 방법으로 역회전
  {
    servomotor.write(position);
    delay(15);
  }
}
```

*   servomotor.write(숫자)를 사용할때, 숫자는 현재 위치에서의 ‘회전각’을 의미하는 것이 아니다!
*   초기 위치를 0º로 기준삼아, 표시된 숫자의 각도 위치로 이동하라는 의미이다. 예를들어서 servomotor.write(90)와 servomotor.write(30)을 연속으로 실행하면,
    *   90도를 회전한 뒤, 추가로 30도를 회전하여 120도 위치에 있다 → ×
    *   90도의 위치로 회전한 뒤, 역회전하여 (처음위치를 기준으로) 30도의 위치로 이동한다. → ○

- 단, servo.h 라이브러리를 사용하면, 스케치 내에서 analogWrite를 사용할 수 없다는 단점도 있다.

<br>

#### sketch: 시리얼모니터에서 각도값을 입력받아 회전시키기

```C
#include <Servo.h>
Servo servomotor;
int a = 0;

void setup() {
  servomotor.attach(10);
  Serial.begin(9600);                  // Serial 통신을 설정
  while(!Serial);
  Serial.println("Servor Mortor");
}

void loop() {
  if(Serial.available()){              // Serial 모니터창에 어떤 값이 들어오면 실행
    a = Serial.parseInt();             // Serial 모니터창에서 받은 값을 a에 넘겨줌
    if(a>=0 && a<=180)
    {
      Serial.print("angle : ");
      Serial.println(a);
      servomotor.write(a);             // a값에 해당하는 각도의 위치로 이동
      delay(15);
    }
  }
}
```

<br>

<br>

### 서보모터 SG-90: 라이브러리 없이 사용하기

#### for SG90 with Arduino

- Frequency of that signal should be 50hz.
- Its range is 544-2450 micro seconds for 0-180 degree angle.
- Again its a little complex.
- For example 0 degree signal will be something like 5 volts for 544 micro seconds and 0 volt for 19465.
- highDelay
  - the time in which we want to keep voltage high on pin 10 and this unit is in micro seconds.
- lowDelay
  - the time in which want to keep voltage zero across pin 10 again this unit is going to be in micro seconds
- only HIGH part of signal wont operate servo. we have to send complete HIGH and LOW signal to make servo work.
- deg_factor
  - signal range (2450 - 544) for SG90 divided by 180 which is equal to 10.6 something that we make 11 as an integer.
- Loop = 20000;
  - 20000 micro seconds or 20 milli seconds is signal cycle or u can say total signal should be equal to 20 milli seconds including HIGH and LOW input. (50Hz)

```C
int servoPin = 10;        // servo is connected to pin 10.
int initialDelay = 544;
int highDelay, lowDelay;

int deg;
int deg_factor = 10;      
int Loop = 20000;         

void setup() {
  pinMode (servoPin, OUTPUT);
}

void loop() {
  for (deg = 0;deg <= 180; deg++) {
    servoWrite(servoPin, deg);
  }
  for (deg = 180;deg >= 0; deg--) {
    servoWrite(servoPin, deg);
  }
}

void servoWrite(int servo, int duty)
{
  highDelay = initialDelay + (duty * deg_factor); // setting angle

  digitalWrite(servo, HIGH);
  delayMicroseconds(highDelay);
  
  lowDelay = Loop - highDelay;
  digitalWrite(servo, LOW);
  delayMicroseconds(lowDelay);

  delay(500);
}
```

<br>

#### 시리얼 모니터에 입력한 문자로 서보모터 회전시키기

```C
int servoPin = 10;        // servo is connected to pin 10.
int initialDelay = 544;
int highDelay, lowDelay;

int deg = 90;             // servo initial degree
int deg_factor = 10;      
int Loop = 20000;         

void setup() {
  Serial.begin(9600);
  pinMode (servoPin, OUTPUT);
}

void loop() {
  servoWrite(servoPin, deg);  
    
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
}

void servoWrite(int servo, int duty)
{
  highDelay = initialDelay + (duty * deg_factor); // setting angle

  digitalWrite(servo, HIGH);
  delayMicroseconds(highDelay);
  
  lowDelay = Loop - highDelay;
  digitalWrite(servo, LOW);
  delayMicroseconds(lowDelay);

  delay(500);
}
```

- l 을 입력하면, 5도 좌회전하며, ll을 입력하면 10도 좌회전한다.
- r 을 입력하면, 5도 우회전하며, rr을 입력하면 10도 우회전한다.

<br>

<br>

### 서보모터와 인터럽트 동시에 사용하기

서보모터가 180도 회전하는 동안, 스위치를 누르면 13번 LED가 토글되도록 만들어보자.

<br>

#### schematic

{{< figure src="/image/SG90_Interrupt01.png" width="75%" class="center" >}}

<br>

#### sketch

```C
int servoPin = 10;        // servo is connected to pin 10.
int initialDelay = 544;   
int highDelay, lowDelay;  

int deg;
int deg_factor = 10;
int Loop = 20000;

#define swPin 2
#define ledPin 13
#define debounceTime 500 // Set debounce Time (unit ms) 버튼을 누른 후 0.5sec 이내에는 버튼 체크하지 않음

boolean state = false;

void setup() {
  pinMode(servoPin, OUTPUT);
  pinMode(swPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(swPin), swInterrupt, FALLING);
}

void loop() {
  for (deg = 0;deg <= 180; deg++) {
    servoWrite(servoPin, deg);
  }
  for (deg = 180;deg >= 0; deg--) {
    servoWrite(servoPin, deg);
  }
}

void servoWrite(int servo, int duty)
{
  highDelay = initialDelay + (duty * deg_factor); // setting angle

  digitalWrite(servo, HIGH);
  delayMicroseconds(highDelay);
  
  lowDelay = Loop - highDelay;
  digitalWrite(servo, LOW);
  delayMicroseconds(lowDelay);

  delay (15);
}

void swInterrupt() {
  static unsigned long lastTime = 0;
  unsigned long now = millis();
  
  if((now-lastTime) > debounceTime) {
    state=!state;
  }
  lastTime = now;
  
  digitalWrite(ledPin, state);
}
```

- 스위치를 눌렀다 뗄 때, 물리적 요인에 의해 다시 스위치가 눌리는 효과가 나타나기도 함 (chattering)
- Chattering 효과를 방지하기 위해, 하드웨어적으로 콘덴서를 붙이거나, 소프트웨어적으로 debounce 시간을 만들어 해결해야 한다.

<br>

<br>

### 레이저 모듈 추가: 서보모터 날개에 부착

#### schematic

{{< figure src="/image/SG90_Interrupt02.png" width="75%" class="center" >}}

<br>

#### sketch

13번 핀에 레이저모듈을 연결하므로 위 스케치를 그대로 이용

<br>

<br>

### 조도센서 추가

반대편에 조도센서를 놓고, 레이저 모듈이 움직이는 동안 버튼을 눌러 조도센서를 정확하게 맞추면 점수가 올라가는 게임을 만들어보자.

<br>

<br>

### Keypad에서 값을 입력받아 회전시키기


#### schematic

{{< figure src="/image/servo-03.jpg" width="75%" class="center" >}}

<br>

#### sketch

```C
#include <Servo.h>
#include <Keypad.h>

Servo servomotor;
int pos = 0;

const byte ROWS = 4;                          // 키패드 배열 선언
const byte COLS = 4;

char keys[ROWS][COLS] = {                     // 키패드 정의
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'},
};

byte rowPins[ROWS] = {9, 8, 7, 6};            // 키패드 연결 핀 설정
byte colPins[COLS] = {5, 4, 3, 2};

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );

void setup() {
  servomotor.attach(10);
}

void loop() {
  char keyValue = keypad.getKey();
  
  if(keyValue) {
     switch(keyValue) {
      case '0' :                    // 시리얼 모니터에 0을 입력하면
        servomotor.write(0);       // 0도 위치로 이동
        delay(15);
        break;
      case '1' :                    // 시리얼 모니터에 1을 입력하면
        servomotor.write(15);       // 15도 위치로 이동
        delay(15);
        break;
      case '2' :
        servomotor.write(30);       // 30도 위치로 이동
        delay(15);
        break;
      case '3' :
        servomotor.write(45);       // 45도 위치로 이동
        delay(15);
        break;
      case '4' :
        servomotor.write(60);       // 60도 위치로 이동
        delay(15);
        break;
      case '5' :
        servomotor.write(75);       // 75도 위치로 이동
        delay(15);
        break;
      case '6' :
        servomotor.write(90);       // 90도 위치로 이동
        delay(15);
        break;
      case '7' :
        servomotor.write(120);       // 120도 위치로 이동
        delay(15);
        break;
      case '8' :
        servomotor.write(150);       // 150도 위치로 이동
        delay(15);
        break;
      case '9' :
        servomotor.write(180);       // 180도 위치로 이동
        delay(15);
        break;
      default :
        break;
     }
  }
  delay(10);
}
```

<br>

<br>

### 비밀번호 확인하여 서보모터 회전시키기

서보모터의 날개를 금고의 개폐장치로 사용하여, 비밀번호 금고를 만들어 보자.

<br>

#### sketch

```C
#include <Keypad.h>
#include <Servo.h>

int tru=0;                        // 비밀번호가 맞는지 확인
int count=0;                      // 4자리수 카운트
char PW[4]={'1','2','3','A'};     //비밀번호

Servo servomotor;

// 키패드 설정 시작
const byte ROWS = 4;
const byte COLS = 4;

byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};

char keys[ROWS][COLS] = {
  {'1','2','3', 'A'},
  {'4','5','6', 'B'},
  {'7','8','9', 'C'},
  {'*','0','#', 'D'}
};

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );
// 키패드 설정 끝

void setup() {
  Serial.begin(9600);
  servomotor.attach(10);          // 서보모터 핀 설정
}

void loop() {
  char key = keypad.getKey();     // 키패드 입력 변수

  if (key) {
    Serial.println(key);
    if(key==PW[count]) {          // 입력번호와 비밀번호가 맞으면
        count++;                  // 자리수 카운트 1증가
        tru++;                    // 맞은수 값 1증가
     }
     else if(key!=PW[count]) {    // 입력번호와 비밀번호가 틀리면
        count++;                  // 자리수 카운트 값만 1증가
     }

     if(key=='#')                 // #을 누르면
        re();                     // 초기화
     if(count==4) {               // 4자리 입력받은 값이
        if(tru==4)                // 모두 맞으면
          Su();                   // 성공
        else                      // 그렇지 않으면(4자리는 입력했는데, 모두 맞지는 않았으면)
          Fa();                   // 실패
        tru=0;                    // tru, count값 초기화
        count=0;
      }
   }
}

void Su() {                          // 성공했을 때 실행
  servomotor.write(90);              // 90도 돌려서 도어락 열림
  Serial.println("open the door");
}

void Fa() {                        // 실패한 경우는 도어락 잠금 유지
  servomotor.write(0);
  Serial.println("close the door");
}

void re() {                        // 비밀번호 입력중 #을 입력하면 초기화하고 도어락 잠금 유지
  tru=0;
  count=0;
  servomotor.write(0);
  Serial.println("password reset");
}
```

<br>

<br>

### Joystick을 사용하여 2개의 서보모터 제어하기

#### schematic

{{< figure src="/image/SG90_Joystick01.png" width="75%" class="center" >}}

<br>

#### sketch

```C
#define JSTICKPIN A0      // joystick is connected to pin 11

int servoPin = 10;        // servo is connected to pin 10
int initialDelay = 544;
int highDelay, lowDelay;

int deg, Jstick, duty;
int deg_factor = 10;      
int Loop = 20000;

void setup() {
  pinMode (servoPin, OUTPUT);
}

void loop() {
  PrintValue();
    
  Jstick = analogRead(JSTICKPIN);          
  deg = map(Jstick, 0, 1023, 0, 180);     
  servoWrite(servoPin, deg);
}

void servoWrite(int servo, int duty)
{
  highDelay = initialDelay + (duty * deg_factor); // setting angle

  digitalWrite(servo, HIGH);
  delayMicroseconds(highDelay);

  lowDelay = Loop - highDelay;
  digitalWrite(servo, LOW);
  delayMicroseconds(lowDelay);

  delay (15);
}

void PrintValue() {
    Serial.print(analogRead(JSTICKPIN));
    Serial.println (" Joystick Value");
}
```

