---
title: 4WD Bluetooth
categories:
  - arduino
date: 2019-10-30 18:27:53
tags:
  - rc
---

지금까지 배운 RC카, 블루투스 모듈 사용법, 컨트롤러 사용법을 종합하여 Bluetooth로 조종하는 4WD를 만들어 보겠습니다. IR리모트를 사용한 RC카를 베이스로 하여 IR수신부를 빼고, 블루투스 모듈인 HC-06만 연결하면 됩니다.

<br>

## schematic

![](/image/4wd-bt-17.png)

<br>

## Bluetooth Serial Controller 설정

여기서는 4WD를 블루투스로 조종하기 위한 콘트롤러를 만들어 봅니다.

<br>

1. 먼저 Bluetooth Serial Controller를 실행시키세요. (블루투스 페어링이나 앱 설치방법은 이전의 글을 참고하세요.)  아래화면은 TERMINAL Mode인 상태입니다. 여기서 스페너 모양 아이콘을 눌러 PREFERCE로 진입하세요.

![](/image/4wd-bt-01.png =432x768)

<br>

2. PREFERENCE 화면에서 아무곳이나 누른 뒤, 위로 스크롤하여

![](/image/4wd-bt-02.png =432x768)

<br>

3. 9 BUTTON MODE를 활성화 시키고, TERMINAL MODE를 꺼주세요.

![](/image/4wd-bt-03.png =432x768)

<br>

4. 그러면 이런 화면이 나타납니다. 이제 각각의 버튼을 정의해보겠습니다.

![](/image/4wd-bt-04.png =432x768)

<br>

5. 다시 스페너 모양 아이콘을 눌러 PREFERENCE로 들어간 뒤, BUTTON-Name을 선택합니다.

![](/image/4wd-bt-05.png =432x768)

<br>

6. button2, button4, button5, button6, button8을 각각 누른 뒤, 각 버튼 별로 '전진', '왼쪽', '정지', '오른쪽', '후진'이라고 이름을 붙여줍니다.

![](/image/4wd-bt-06.png =432x768)

<br>

7. 다시 PREFERENCE에서 Command를 누르세요.

![](/image/4wd-bt-07.png =432x768)

<br>

8. Command에서 정의해주는 값이 제일 중요한데요. 각 버튼을 누를때, 아두이노로 전달되는 값을 정의해주는 것이기 때문입니다. button2, button4, button5, button6, button8을 각각 누른 뒤, 각 버튼 별로 'F', 'L', 'O', 'R', 'B'이라고 입력값을 넣어주세요. 이 값은 스케치 작성시 사용해야 하므로 꼭 기억해두어야 합니다.

![](/image/4wd-bt-08.png =432x768)

<br>

9. 이제 Visibility로 갑니다.

![](/image/4wd-bt-09.png =432x768)

<br>

10. 여기서는 필요없는 버튼을 지워줄 수 있어요. 실제 사용되는 버튼에만 체크하고, 나머지 버튼은 체크 해제합니다.

![](/image/4wd-bt-10.png =432x768)

<br>

11. 그러면, 아래와 같은 멋진 블루투스 컨트롤러가 나타납니다.

![](/image/4wd-bt-11.png =432x768)

<br>

12. 이 상태에서 돋보기 모양 아이콘을 눌러 HC-06에 접속해 봅니다. 여기서부터는 블루투스 페어링 과정에서 설명했던 부분과 똑같습니다. 

![](/image/4wd-bt-12.png =432x768)

<br>

13. 모듈ID인 SKS100을 누르면 페어링을 시도하고요.

![](/image/4wd-bt-13.png =432x768)

<br>

14. 만일 페어링할 모듈이 나타나지 않으면, Scan for devices로 모듈을 찾아 페어링을 해봅니다.

![](/image/4wd-bt-14.png =432x768)

<br>

15. 페어링을 시도하는 중이네요.

![](/image/4wd-bt-15.png =432x768)

<br>

16. 페어링 완료! 이제 컨트롤러 사용을 위한 모든 준비과정이 완료되었습니다.


![](/image/4wd-bt-16.png =432x768)

<br>

<br>

## 4WD 블루투스 초음파센서 자동차

위 회로에 초음파 센서 하나만 덧붙여봅니다. 50cm 이내에 물체가 접근하면 후진했다가 정지하도록 되어있습니다. (실제로는 50cm보다 훨씬 짧은 거리내에서 후진을 시작하네요.)

<br>

### schematic

![](/image/4wd-bt-18.png)

<br>

### sketch

~~~ C
//Initialize Bluetooth
#include <SoftwareSerial.h>
SoftwareSerial BTSerial(7, 3);  // HC-06 TX,RX

// Initialize TB6612FNG Motor drive
int STBY = 10;  // STBY pin on TB6612FNG. Must be HIGH to enable motor
int A_PWM = 5;  // Left motor speed control using analogWrite() function. Value between 0 - 255
int A_IN1 = 9;  // Left motor - LOW should go forward
int A_IN2 = 8;  // Left motor - HIGH should go forward
int B_PWM = 6;  // Right motor speed control using analogWrite() function. Value between 0 - 255
int B_IN1 = 11; // Right motor - LOW should go forward
int B_IN2 = 12; // Right motor - HIGH should go forward

int L_MaxSpeed = 255;   //set motor speed to max speed
int R_MaxSpeed = 255;   //set motor speed to max speed
int L_TurnSpeed = 128;  //set motor speed to max speed
int R_TurnSpeed = 128;  //set motor speed to max speed

int LR_Direct = 0;      //for Direction (0:clockwise, 1:count-clockwise)

// Initialize Ultrasonic Sensor
#define TRIG 2
#define ECHO 4

char val;
long val_distance;

void setup() {
  pinMode(A_PWM, OUTPUT);                        // Motor
  pinMode(A_IN1, OUTPUT);
  pinMode(A_IN2, OUTPUT);
  pinMode(B_PWM, OUTPUT);
  pinMode(B_IN1, OUTPUT);
  pinMode(B_IN2, OUTPUT);
  pinMode(STBY, OUTPUT);
  
  pinMode(TRIG, OUTPUT);                         // Ultrasonic Sensor
  pinMode(ECHO, INPUT);
  
  Serial.begin(9600);
  BTSerial.begin(9600);                          // Start Bluetooth

  while (!BTSerial.available()) {                // 처음 입력이 있을때까지
  stop();                                        // 정지
  }
}

void loop() {
  distance();                                    // 거리 측정
  Serial.println(val_distance);                 // 거리 출력

  if (BTSerial.available()) {                    // Check for Bluetooth input
    val = BTSerial.read();                       // 입력값 val에 저장
    Serial.println(val);                        // 입력값 출력
  }
  
  if (val_distance > 50) {  // 거리가 50cm 이상이면 입력값 실행
    parseCommand(val);                           // parse the input
  } else {                                       // 거리가 50cm 이내이면 
    stop();
    delay(20);
    b_stop();                                    // 거리가 50cm 이상이 될 때까지 후진 후, 정지
  }
  delay(50);
}

void parseCommand(char input) {
  switch (input) {

    case 'F':
      go_forward();
      break;
      
    case 'B':  
      go_backward();
      break;
      
    case 'L':  
      if(LR_Direct==0) {
        go_f_left();
      } else if(LR_Direct==1) {
        go_b_left();
      }     
      break;
      
    case 'R':
      if(LR_Direct==0) {
        go_f_right();
      } else if(LR_Direct==1) {
        go_b_right();
      }
      break;
      
    case 'O':
      stop();
      break;
  }  
  delay(50);
}

void distance() {
  digitalWrite(TRIG, LOW);                       // Start Ultrasonic sensor
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  val_distance = pulseIn(ECHO, HIGH) / 58.2;     // 거리 측정
}       

// Move specific motor at speed and direction
// motor: A(Left) -> 0, B(Right) -> 1
// speed: 0 is off, and 255 is full speed
// direction: 0 clockwise, 1 counter-clockwise

void move(int motorLR, int speed, boolean inPin1, boolean inPin2) {
  digitalWrite(STBY, HIGH);        // Disable Standby

  if (motorLR == 0) {
    analogWrite(A_PWM, speed);
    digitalWrite(A_IN1, inPin1);
    digitalWrite(A_IN2, inPin2);   
  }

  if (motorLR == 1) {
    analogWrite(B_PWM, speed);
    digitalWrite(B_IN1, inPin1);
    digitalWrite(B_IN2, inPin2);
  }
}

void go_forward() {
  Serial.println("F");
  move(0, L_MaxSpeed, 0, 1);  // Left motor, Left Speed, forward(0,1)
  move(1, R_MaxSpeed, 0, 1);  // Right motor, Right Speed, forward(0,1)
  LR_Direct = 0;              // Forward
  delay(100);
}

void go_backward() {
  Serial.println("B");
  move(0, L_MaxSpeed, 1, 0);  // Left motor, Left Speed, backward(1,0)
  move(1, R_MaxSpeed, 1, 0);  // Right motor, Right Speed, backward(1,0)
  LR_Direct = 1;              // Backward
  delay(100);
}

void go_f_left() {
  Serial.println("F_L");
  move(0, L_TurnSpeed, 0, 1); // Left motor, Left Speed, forward(0,1)
  move(1, R_MaxSpeed, 0, 1);  // Right motor, Right Speed, forward(0,1)
  delay(100);
}

void go_b_left() {
  Serial.println("B_R");
  move(0, L_TurnSpeed, 1, 0); // Left motor, Left Speed, backward(1,0)
  move(1, R_MaxSpeed, 1, 0);  // Right motor, Right Speed, backward(1,0)
  delay(100);
}

void go_f_right() {
  Serial.println("F_R");
  move(0, L_MaxSpeed, 0, 1);  // Left motor, Left Speed, forward(0,1)
  move(1, R_TurnSpeed, 0, 1); // Right motor, Right Speed, forward(0,1)
  delay(100);
}

void go_b_right() {
  Serial.println("B_R");
  move(0, L_MaxSpeed, 1, 0);  // Left motor, Left Speed, backward(1,0)
  move(1, R_TurnSpeed, 1, 0); // Right motor, Right Speed, backward(1,0)
  delay(100);
}

void b_stop() {
  Serial.println("B_STOP");
  while (val_distance < 50) {                    // 거리가 50cm 이내인 경우 반복
    go_backward();                               // 후진
    delay(100);
    distance();                                  // 거리를 다시 측정
    delay(10);
  }
  while (!BTSerial.available()) {                // 입력이 없으면
    stop();                                      // 정지상태 유지
  }
  LR_Direct = 0;                                 // 앞으로 갈 준비
}

void stop() {
  Serial.println("STOP");
  digitalWrite(STBY, LOW);                       // Enable Standby
}
~~~

