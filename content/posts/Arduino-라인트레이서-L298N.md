---
title: "Arduino, 라인트레이서, L298N"
categories: ["arduino"]
date: 2019-10-28T22:48:56+09:00
toc: true
tags: ["rc"]
---

아두이노를 사용하여 검은색 라인을 따라 움직이는 라인트레이서 자동차를 만들어보자.

<br>

### TCRT5000 IR reflective sensor

라인트레이서 제작시 가장 널리 사용되는 IR 센서이다. 감지하는 부분이 검은색으로 되어 있는 부분이라면 IR이 모두 흡수되고, 흰색으로 되어 있는 부분에서는 모두 반사되는 원리를 이용한다.

{{< figure src="/image/LT-03.png" width="33%" class="center" >}}

*   장애물이 없는 경우: 1 반환
*   센서와 12mm이내의 거리에 밝은색이 위치하는 경우: 0 반환
*   센서와 12mm이내의 거리에 검은색이 위치하는 경우: 1 반환
*   검은색의 경우도 아주 가까이 가져가면 적외선 수신량이 증가하여 0의 값을 반환할 수 있으므로, 라인트레이서 구성시 감지하는 적당한 거리를 찾는 것이 중요합니다.
*   10~12mm 정도의 거리에서 측정하는 것을 추천
*   AO 단자를 이용할 경우 아날로그 신호로 처리도 가능

> (위 스펙과는 별도로) 라인트레이서 제작시에는 경험상 센서가 바닥면으로부터 2cm정도 떨어지도록 설치하는 것을 추천함

<br>

#### schematic

{{< figure src="/image/tcrt5000.png" width="50%" class="center" >}}

<br>

#### sketch

```C++
int i = 0;
int pin_sensor = 2;

void setup() {
  Serial.begin(9600);
  pinMode(pin_sensor, INPUT);
}

void loop() {
	i = digitalRead(pin_sensor)
    Serial.println(i);                 // 검은색(1), 밝은색(0) 출력
    delay(1000);
}
```

<br>

<br>

### 모터드라이버 L298N

대부분의 모터는 구동에 필요한 전력 소모량 커서 아두이노의 자체 출력으로는 구동이 불가능하다. 그러므로 건전지, SMPS 등의 외부 전원을 사용하여 모터에 충분한 전력을 공급하고, 이를 제어하기위한 모터드라이버를 반드시 사용해야 한다.

아두이노에서 사용하는 대표적인 모터드라이브는 L298N, TB6612FNG 등이 있으며, 여기서는 2CH의 2A출력이 가능한 L298N을 사용하여 간단한 라인트레이서를 제작한다.

{{< figure src="/image/LT-01.png" width="75%" class="center" >}}

<br>

#### Pinout

* 모터A 출력 : 왼쪽 모터를 연결한다.

* 모터B 출력 : 오른쪽 모터를 연결한다.

*   12V (입력) : 외부전원을 입력한다. (5~35V)
    
    *   12V 이상의 외부전원을 입력하는 경우, 레귤레이터 보호를 위해 5V 점퍼선을 제거해야 함
    
*   5V (입력/출력)
    *   점퍼핀이 연결되어 있는 경우 5V 출력 (단, 5V출력으로 사용하려면 외부전원을 12V이하로 주어야 하며, 그 이상의 전압을 인가하는 경우 레귤레이터가 손상됨)
    *   점퍼핀 없는 경우 5V 입력을 통해 L298N에 전원 인가
    
* Enable 모터A : 왼쪽 모터 PWM (점퍼를 제거하고, INPUT핀 양옆의 핀에 PWM신호 입력)

* Enable 모터B : 오른쪽 모터 PWM (점퍼를 제거하고, INPUT핀 양옆의 핀에 PWM신호 입력)

* PWM을 사용하는 경우 모터에 인가하는 전원이 6V(AA*4개)인 경우 PWM값이 낮으면 모터가 회전하지 않으므로 코딩시 주의한다.

* INPUT : IN1, IN2, IN3, IN4

  | Direction       | IN1  | IN2  | IN3  | IN4  |
  | --------------- | ---- | ---- | ---- | ---- |
  | Go              | HIGH | HIGH | LOW  | LOW  |
  | Back            | LOW  | LOW  | HIGH | HIGH |
  | Brake           | LOW  | LOW  | LOW  | LOW  |
  | Left_Turn       | HIGH | LOW  | LOW  | LOW  |
  | Right_Turn      | LOW  | HIGH | LOW  | LOW  |
  | Left_Back_Turn  | LOW  | LOW  | HIGH | LOW  |
  | Right_Back_Turm | LOW  | LOW  | LOW  | HIGH |

<br>

#### Jumper

*   Enable 모터A
    *   점퍼를 연결시키지 않으면 PWM사용
    *   점퍼 연결시 왼쪽 모터에 5V (즉, PWM을 사용하지 않는 경우에만 연결)
*   Enable 모터B
    *   점퍼를 연결시키지 않으면 PWM사용
    *   점퍼 연결시 오른쪽 모터 5V (즉, PWM을 사용하지 않는 경우에만 연결)
*   5V (※ Pinout의 5V 부분 참고)

<br>

<br>

### 전원

*   대부분의 초보자를 위한 4WD 제작 키트는 AA건전지 4개를 직렬연결할 수 있는 전지소켓을 포함하여 판매하는 경우가 많지만
*   But, 제작 경험으로 볼 때 AA건전지 4개로 얻을 수 있는 전력만으로는 원활한 구동이 되지 않는 경우가 많다.
*   AA건전지 6개를 직렬로 연결하여 9V정도를 공급하거나 (사용시간 10~15분정도 가능)
*   18650 리튬이온전지 2개를 연결하여 7.4V를 공급하는 것을 추천한다.

<br>

<br>

### 모터

아두이노 기초 실습용으로 많이 쓰이는 이름없는 중국산 모터이다.

{{< figure src="/image/LT-02.jpg" width="50%" class="center" >}}

| 기어비 48:1 | RPM(무부하) | 전류 mA (무부하) | 토크(kg·cm) |
| ----------- | ----------- | ---------------- | ----------- |
| 3V          | 120         | 40               | 3.2         |
| 6V          | 240         | 70               | 5.5         |

<br>

<br>

### 프레임 조립

#### 준비물
{{< figure src="/image/LT-04.png" width="75%" class="center" >}}

<br>


#### 조립과정

1. 모터 4개와 M-F형태의 8가닥 리드선을 준비하고 모터에 리드선을 납땜할 준비를 합니다.

{{< figure src="/image/LT-05.jpg" width="75%" class="center" >}}

<br>

2. DC모터를 보면 양쪽에 (+)(-)극을 연결하는 단자가 있습니다.

{{< figure src="/image/LT-06.jpg" width="75%" class="center" >}}

<br>

3. 준비한 8가닥의 M-F리드선을 2가닥씩 묶어 4갈래로 전체 길이의 1/2의 길이만큼 나누어 준비한뒤,

{{< figure src="/image/LT-07.jpg" width="75%" class="center" >}}

<br>

4. 2개의 가닥 중 한 부분을 모터의 (+)(-)단자에 끼우고,

{{< figure src="/image/LT-08.jpg" width="75%" class="center" >}}

<br>

5. 각각을 납땜합니다. 총 4개의 모터를 납땜하여 아래 모습처럼 만듭니다.

{{< figure src="/image/LT-09.jpg" width="75%" class="center" >}}

<br>

  ※ (주의) 납땜시, 아래 그림처럼 리드선이 모터의 본체에 닿으면 안됩니다.

{{< figure src="/image/LT-10.jpg" width="75%" class="center" >}}

<br>

​     처음 납땜할 때부터 닿지 않도록 하는 것이 좋지만, 납땜을 이미 진행한 후에 리드선이 본체에 닿아 있다면 아래의 그림처럼 끝 부분을 살짝 휘어두거나, 니퍼로 잘라내도록 합니다.

{{< figure src="/image/LT-11.jpg" width="75%" class="center" >}}

<br>

6. 외부 전원으로 사용할 건전지소켓을 준비합니다. (사진상에는 1.5V AA건전지 4개가 직렬로 연결되는 건전지소켓을 사용하였지만, 4개의 모터를 구동하기 위해서는 1.5V AA건전지를 6개 직렬로 연결하여 9V 전압을 사용하는 것을 추천합니다. 단, 9V사각전지(6F22) 1개로 사용하는 것은 전류가 약하므로 사용불가!)

{{< figure src="/image/LT-12.jpg" width="75%" class="center" >}}

<br>

​    건전지소켓에 나와있는 리드선의 끝부분을 스트리퍼를 사용하여 피복을 조금더 벗겨냅니다. 또한 빨간색과 검은색 점퍼선 2개를 별로로 준비한뒤, 한쪽 단자를 잘라내고, 스트리퍼로 피복을 벗겨냅니다.

<br>

7. 건전지소켓의 리드선과 점퍼선을 붙여 떨어지지 않도록 단단히 납땜한 후,

{{< figure src="/image/LT-13.jpg" width="75%" class="center" >}}

<br>

8. 합선되지 않도록 절연테이프나 열수축튜브로 각각을 잘 감싸둡니다.

{{< figure src="/image/LT-14.jpg" width="75%" class="center" >}}

<br>

9. 이제 아크릴판을 준비합니다.

{{< figure src="/image/LT-15.jpg" width="75%" class="center" >}}

<br>

10. 아래 그림의 Step1~2과정과 같이 모터를 고정할 아크릴 조각을 끼울 것입니다.

{{< figure src="/image/LT-16.png" width="75%" class="center" >}}

<br>

​    우선, 모터를 고정할 아크릴 조각 2개를 고정할 위치를 확인합니다. 총 4개의 모터를 고정할 것이므로 아크릴 조각 8개가 필요합니다.

{{< figure src="/image/LT-17.jpg" width="75%" class="center" >}}

<br>

11. 모터고정 아크릴 조각을 아래 사진처럼 끼웁니다. 하나는 구멍에 집어 넣고, 나머지 하나는 측면의 홈에 살짝 걸쳐둡니다.

{{< figure src="/image/LT-18.jpg" width="75%" class="center" >}}

<br>

12. 이제 모터를 설치하겠습니다.

{{< figure src="/image/LT-19.png" width="75%" class="center" >}}

<br>

{{< figure src="/image/LT-20.png" width="75%" class="center" >}}

<br>

​    나사와 너트를 2개씩 준비한 후

{{< figure src="/image/LT-21.jpg" width="75%" class="center" >}}

<br>

​    아크릴 조각 2개 사이에 모터를 위치시킨 후, 모터 몸체이 있는 나사 구멍에 나사 2개를 통과시켜

{{< figure src="/image/LT-22.jpg" width="75%" class="center" >}}

<br>

​    아래 사진 같이 고정합니다.

{{< figure src="/image/LT-23.jpg" width="75%" class="center" >}}

<br>

13\. 모터를 고정한 후, 바퀴축의 안쪽 부분에 바퀴의 균형을 잡아줄 동그란 아크릴 조각을 끼워줍니다.

{{< figure src="/image/LT-24.jpg" width="75%" class="center" >}}

<br>

​     4개의 모터를 같은 방법으로 고정시켜 아래와 같은 형태를 만듭니다. 주의할 것은 모터의 단자가 위치한 은색부분의 모터본체 부분이 서로 맞닿는 형태로 조립을 해야 합니다.

{{< figure src="/image/LT-25.jpg" width="50%" class="center" >}}

<br>

14. 바퀴를 끼웁니다.

{{< figure src="/image/LT-26.png" width="75%" class="center" >}}

<br>

15. 금속기둥을 세우고 상판을 덮습니다. (아크릴상판이 없는 경우는 생략 가능)

{{< figure src="/image/LT-27.png" width="75%" class="center" >}}

<br>

{{< figure src="/image/LT-28.png" width="75%" class="center" >}}

<br>

16. 기판 아래면에 모터가 위치하도록 위아래를 뒤집은 후에, 기판 윗면에 TCRT5000 IR Reflective Sensor, 아두이노, 브레드보드, L298N 모터드라이브, 9V 전지소켓을 차례대로 올리고 나사볼트와 절연테이프 등으로 고정합니다. 대략 아래 사진과 비슷하게 고정하면 됩니다.

{{< figure src="/image/LT-29.jpg" width="75%" class="center" >}}

<br>

<br>


### 아두이노 연결하기

#### schematic

{{< figure src="/image/LT-30.png" width="100%" class="center" >}}

<br>

#### 회로 연결

##### 모터 ↔ 모터드라이버

|            | L/F 모터 U단자 | L/F 모터 D단자 | L/R 모터 U단자 | L/R 모터 D단자 | R/F 모터 U단자 | R/F 모터 D단자 | R/R 모터 U단자 | R/R모터 D단자 |
| ---------- | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- | ------------- |
| L298N OUT1 |                | ○              |                | ○              |                |                |                |               |
| L298N OUT2 | ○              |                | ○              |                |                |                |                |               |
| L298N OUT3 |                |                |                |                |                | ○              |                | ○             |
| L298N OUT4 |                |                |                |                | ○              |                | ○              |               |

<br>

##### 모터드라이버 ↔ 전지소켓 ↔ 아두이노

|           | 전지소켓 (+) | 전지소켓(-)    | 아두이노 |
| --------- | ------------ | -------------- | -------- |
| L298N 12V | ○            |                | Vin      |
| L298N GND |              | GND (아두이노) | GND      |
| L298N 5V  |              |                | 5V       |

<br>

##### 모터드라이브 ENABLE & INPUT ↔ 아두이노

|             | 아두이노 |
| ----------- | -------- |
| L298N EN(A) | 5        |
| L298N IN1   | 8        |
| L298N IN2   | 9        |
| L298N IN3   | 10       |
| L298N IN4   | 11       |
| L298N EN(B) | 6        |

<br>

##### TCRT5000 Sensor ↔ 아두이노

|                 | 아두이노 |
| --------------- | -------- |
| #1 TCRT5000 VCC | 5V       |
| #1 TCRT5000 GND | GND      |
| #1 TCRT5000 DO  | 2        |
| #1 TCRT5000 AO  | –        |
| #2 TCRT5000 VCC | 5V       |
| #2 TCRT5000 GND | GND      |
| #2 TCRT5000 DO  | 3        |
| #2 TCRT5000 AO  | –        |

<br>

#### sketch

```C
/* L298N - 2CH Motor Driver
Direction         IN1    IN2    IN3    IN4
-------------------------------------------
GO                HIGH   HIGH   LOW    LOW
BACK              LOW    LOW    HIGH   HIGH
BRAKE             LOW    LOW    LOW    LOW
LEFT_TURN         HIGH   LOW    LOW    LOW
RIGHT_TURN        LOW    HIGH   LOW    LOW
LEFT_BACK_TURN    LOW    LOW    HIGH   LOW
RIGHT_BACK_TURN   LOW    LOW    LOW    HIGH

PWM: 6V시 최소값 200이상은 되야 바퀴회전 가능 (너무 낮은 전압에서 회전 안됨)
*/

// 모터_전진컨트롤
int Left_motor_IN1 = 8;       // IN1
int Right_motor_IN2 = 9;      // IN2

// 모터_후진컨트롤
int Left_motor_IN3 = 10;      // IN3
int Right_motor_IN4 = 11;     // IN4

// 모터_속도컨트롤
int Left_PWM = 5;               // 왼쪽모터 속도
int Right_PWM = 6;              // 오른쪽모터 속도

// IR Sensor
const int Left_Sensor = 2;    // 왼쪽센서
const int Right_Sensor = 3;   // 오른쪽센서

int Left_Sensor_Value;        // 검은색:1
int Right_Sensor_Value;       // 흰색:0

void setup()
{
  pinMode(Left_motor_IN1, OUTPUT);      // PIN 8
  pinMode(Right_motor_IN2, OUTPUT);     // PIN 9
  
  pinMode(Left_motor_IN3, OUTPUT);      // PIN 10
  pinMode(Right_motor_IN4, OUTPUT);     // PIN 11

  pinMode(Left_PWM, OUTPUT);            // PIN 5
  pinMode(Right_PWM, OUTPUT);           // PIN 6
  
  pinMode(Left_Sensor, INPUT);          // 왼쪽센서
  pinMode(Right_Sensor, INPUT);         // 오른쪽센서
}

// 전진
void go() {
  digitalWrite(Left_motor_IN1, HIGH);   // 왼쪽모터   전진_정지
  digitalWrite(Right_motor_IN2, HIGH);  // 오론쪽모터 전진_정지
  
  digitalWrite(Left_motor_IN3, LOW);    // 왼쪽모터   후진_회전
  digitalWrite(Right_motor_IN4, LOW);   // 오른쪽모터 후진_회전
  
  analogWrite(Left_PWM, 255);           // PWM값(0~255), 모터 회전속도 조절
  analogWrite(Right_PWM, 255);          // PWM값(0~255), 모터 회전속도 조절
  delay(5);
}

// 후진
void back() {
  digitalWrite(Left_motor_IN1, LOW);    // 왼쪽모터   전진_정지
  digitalWrite(Right_motor_IN2, LOW);   // 오론쪽모터 전진_정지
  
  digitalWrite(Left_motor_IN3, HIGH);   // 왼쪽모터   후진_회전
  digitalWrite(Right_motor_IN4, HIGH);  // 오른쪽모터 후진_회전
  
  analogWrite(Left_PWM, 255);           // PWM값(0~255), 모터 회전속도 조절
  analogWrite(Right_PWM, 255);          // PWM값(0~255), 모터 회전속도 조절
  
}

// 정지
void brake() {
  digitalWrite(Left_motor_IN1, LOW);    // 왼쪽모터   전진_정지
  digitalWrite(Right_motor_IN2, LOW);   // 오론쪽모터 전진_정지
  
  digitalWrite(Left_motor_IN3, LOW);    // 왼쪽모터   후진_정지
  digitalWrite(Right_motor_IN4, LOW);   // 오른쪽모터 후진_정지
  delay(5);  
}

// 좌회전
void turn_left(){
  digitalWrite(Left_motor_IN1, LOW);    // 왼쪽모터   전진_정지
  digitalWrite(Right_motor_IN2, HIGH);  // 오론쪽모터 전진_회전
  
  digitalWrite(Left_motor_IN3, LOW);    // 왼쪽모터   후진_정지
  digitalWrite(Right_motor_IN4, LOW);   // 오른쪽모터 후진_정지

  analogWrite(Right_PWM, 255);           // PWM값(0~255), 모터 회전속도 조절
  delay(5);
}

// 우회전
void turn_right() {
  digitalWrite(Left_motor_IN1, HIGH);   // 왼쪽모터   전진_회전
  digitalWrite(Right_motor_IN2, LOW);   // 오론쪽모터 전진_정지
  
  digitalWrite(Left_motor_IN3, LOW);    // 왼쪽모터   후진_정지
  digitalWrite(Right_motor_IN4, LOW);   // 오른쪽모터 후진_정지

  analogWrite(Left_PWM, 255);           // PWM값(0~255), 모터 회전속도 조절
  delay(5);
}

void loop()
{
  while(1)
  {

  //신호가 있으면(흰색) LOW,  신호가 없으면(검은색) HIGH
  Right_Sensor_Value = digitalRead(Right_Sensor);
  Left_Sensor_Value = digitalRead(Left_Sensor);

  // 전진: 왼쪽센서 검은색, 오른쪽센서 검은색
  if (Left_Sensor_Value == HIGH && Right_Sensor_Value == HIGH)
    go();

  // 좌회전: 왼쪽센서 검은색, 오른쪽센서 흰색
  else if (Left_Sensor_Value == HIGH & Right_Sensor_Value == LOW)
    turn_left();

  // 우회전: 왼쪽센서 흰색, 오른쪽센서 검은색
  else if (Left_Sensor_Value == LOW & Right_Sensor_Value == HIGH) 
    turn_right();

  // 정지: 왼쪽센서 흰색, 오른쪽센서 흰색
  else
    brake();
  }
}
```

<br>

##### 센서 감도 조정

*   센서 반응을 살피면서 TCRT5000 모듈에 붙어 있는 감도조절기를 십자드라이버로 돌려 라인트레이싱에 가장 최적인 감도를 찾아야 한다.

