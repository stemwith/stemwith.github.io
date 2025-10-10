---
title: "ESP32, RC카"
categories: ["esp32"]
date: 2021-12-02T18:27:53+09:00
tags: ["rc"]
---

### 샤시 조립

#### 샤시 부품

| 번호 |                부품                |                             사진                             | 수량 |                       용도 및 참고사항                       |
| :--: | :--------------------------------: | :----------------------------------------------------------: | :--: | :----------------------------------------------------------: |
|  1   |            전륜 회전축             | {{< figure src="/image/r/ESP32-RC-Car-14.png" style="zoom: 67%;" class="center" >}} |  2   |                                                              |
|  2   |             베어링(대)             | {{< figure src="/image/r/ESP32-RC-Car-18.png" style="zoom: 80%;" class="center" >}} |  2   |                                                              |
|  3   |            스티어링 컵             |              ![](/image/r/ESP32-RC-Car-08.png)               |  2   |                                                              |
|  4   |           커플러 고정핀            |              ![](/image/r/ESP32-RC-Car-16.png)               |  2   |                                                              |
|  5   |             베어링(중)             |              ![](/image/r/ESP32-RC-Car-19.png)               |  2   |                                                              |
|  6   |         (전륜) 육각 커플러         | {{< figure src="/image/r/ESP32-RC-Car-15.png" width="80%" class="center" >}} |  2   |                                                              |
|  7   |                 휠                 |              ![](/image/r/ESP32-RC-Car-01.png)               |  4   |                                                              |
|  8   |          나이록 너트(M4)           |              ![](/image/r/ESP32-RC-Car-22.png)               |  2   |                                                              |
|  9   |          십자형 육각 복스          |              ![](/image/r/ESP32-RC-Car-17.png)               |  1   |                                                              |
|  10  |       볼 조인트 커넥팅 로드        |              ![](/image/r/ESP32-RC-Car-09.png)               |  1   |                     홀 간격 80.5mm 유지                      |
|  11  |       볼 조인트 커넥팅 로드        |              ![](/image/r/ESP32-RC-Car-35.png)               |  1   |                      홀 간격 51mm 유지                       |
|  12  |         서보모터<br>MG996R         | {{< figure src="/image/r/ESP32-RC-Car-54.png" style="zoom: 67%;" class="center" >}} |  1   |                                                              |
|  13  |        ㄴ자 서보모터 브라켓        |              ![](/image/r/ESP32-RC-Car-11.png)               |  2   |                                                              |
|  14  |          휠 베이스 고정판          |              ![](/image/r/ESP32-RC-Car-12.png)               |  2   |                                                              |
|  15  |              서보 혼               |              ![](/image/r/ESP32-RC-Car-25.png)               |  1   |                         (볼트 포함)                          |
|  16  |       나이록 너트<br>(M2.5)        |              ![](/image/r/ESP32-RC-Car-23.png)               |  1   |                                                              |
|  17  |             샤시 하판              |              ![](/image/r/ESP32-RC-Car-03.png)               |  1   |                                                              |
|  18  |       DC엔코더 모터 & 커넥터       |              ![](/image/r/ESP32-RC-Car-04.png)               |  2   |                                                              |
|  19  |            모터 브라켓             | {{< figure src="/image/r/ESP32-RC-Car-07.png" width="67%" class="center" >}} |  2   |                                                              |
|  20  |               샤프트               |              ![](/image/r/ESP32-RC-Car-10.png)               |  2   |                                                              |
|  21  |               써클립               |              ![](/image/r/ESP32-RC-Car-24.png)               |  2   |                                                              |
|  22  |           샤프트 베어링            |              ![](/image/r/ESP32-RC-Car-21.png)               |  4   |                                                              |
|  23  | 기어<br>(무두볼트(Set Screw) 포함) |              ![](/image/r/ESP32-RC-Car-05.png)               |  2   |                                                              |
|  24  |     육각 샤프트 커플링 커넥터      |              ![](/image/r/ESP32-RC-Car-06.png)               |  2   |                                                              |
|  25  |                범퍼                |              ![](/image/r/ESP32-RC-Car-02.png)               |  1   |                                                              |
|  26  |             샤시 상판              |              ![](/image/r/ESP32-RC-Car-34.png)               |  1   |                                                              |
|  27  |              락스위치              |              ![](/image/r/ESP32-RC-Car-20.png)               |  1   |                                                              |
|  28  |   황동 육각 스터드<br>(M3×22mm)    |              ![](/image/r/ESP32-RC-Car-26.png)               |  6   |            휠 베이스 고정용 4개, 상판 고정용 2개             |
|  29  |   황동 육각 스터드<br/>(M3×16mm)   |              ![](/image/r/ESP32-RC-Car-27.png)               |  2   |                       범퍼 고정용 2개                        |
|  30  |    볼트<br/>(Pan head, M4×6mm)     |              ![](/image/r/ESP32-RC-Car-32.png)               |  6   |              모터 브라켓과 샤시 하판 고정용 6개              |
|  31  | 볼트<br>(Bind-Washer head, M3×6mm) | ![](/image/r/ESP32-RC-Car-28.png)  ![](/image/r/ESP32-RC-Car-28.png) |  10  | 서보모터와 서보모터 브라켓 고정용 4개, 서보모터 브라켓과 샤시하판 고정용 4개, 범퍼 고정용 2개 |
|  32  |    볼트<br>(Bind head, M3×8mm)     | ![`](/image/r/ESP32-RC-Car-30.png)![](/image/r/ESP32-RC-Car-30.png)![](/image/r/ESP32-RC-Car-30.png)![](/image/r/ESP32-RC-Car-30.png) |  14  |           육각 스터드 고정용 12개, 범퍼 고정용 2개           |
|  33  |   볼트<br/>(Pan head, M2.5×10mm)   | ![](/image/r/ESP32-RC-Car-29.png)  ![](/image/r/ESP32-RC-Car-29.png) |  7   |         커넥팅 로드 연결용 3개, 휠 베이스 연결용 4개         |
|  34  |   볼트<br>(Flat head, M2.5×5mm)    |              ![](/image/r/ESP32-RC-Car-31.png)               |  4   |                    모터와 모터브라켓 고정                    |
|  35  |              육각렌치              |              ![](/image/r/ESP32-RC-Car-33.png)               |  1   |                       기어 무두볼트용                        |
|  36  |         저항<br>1K or 5.1K         |              ![](/image/r/ESP32-RC-Car-13.png)               |  2   |                  (선택사항) 인코더 풀업저항                  |
|  37  |   홀센서 칩<br>SH41F(SOT-23타입)   |                                                              |  2   | (선택사항) 홀 센서를 이중채널로 사용할 필요가 있는 경우에, 각 모터마다 1개씩 추가함 |
|  총  |                36종                |                                                              |      |                                                              |

<br>

#### 전륜 조향 휠 조립

사진 오른쪽부터 차례대로 8개의 부품을 끼워 휠을 조립한다. (왼쪽휠/오른쪽휠 각각 1개씩, 총 2개 조립)

![](/image/r/ESP32-RC-Car-36.png)

1. 먼저 검은색의 스티어링 컵에 큰 베어링을 삽입한다. (상당히 뻑뻑하므로 힘을 강하게 주면서 스티어링컵 안쪽 끝까지 밀어넣어야 한다.)

![](/image/r/ESP32-RC-Car-37.png)

2. 베어링이 장착된 스티어링 컵에 회전축을 끼운다. 이때, 회전축 중앙에 있는 작은 구멍이 (고정쇠를 끼울 수 있도록) 보여야 하며, 만약 구멍이 보이지 않으면, 이전 과정에서 베어링을 더 밀어넣어 스티어링 컵에 완전히 밀착시켜야 한다.

![](/image/r/ESP32-RC-Car-38.png)   ![](/image/r/ESP32-RC-Car-39.png)

3. 회전축이 나온 스티어링컵 밑바닥에 중간 크기의 베어링을 끼운다. 역시 뻑뻑하므로 강한 힘을 주어 밀어넣어야 한다. 

![](/image/r/ESP32-RC-Car-40.png)

4. 회전축 중앙의 작은 구멍에 커플러 고정핀를 끼워 넣는다.

![](/image/r/ESP32-RC-Car-41.png)

5. 커플러 고정핀 끼워 넣는 홈이 파인 육각 커플러를 준비한 뒤, 커플러 고정핀이 꼽혀있는 방향을 고려하여 스티어링컵에 끼운다.

![](/image/r/ESP32-RC-Car-42.png)   ![](/image/r/ESP32-RC-Car-43.png)

6. 스티어링컵에 끼운 육각 커플러를, 휠의 안쪽에 끼워 넣으면(이때, 육각 커플러가 휠의 육각 홈 안쪽까지 완전히 밀착되도록 강한 힘을 가하면서 끼운다.) 휠 바깥쪽면에 회전축의 나사산이 나온다.

![](/image/r/ESP32-RC-Car-44.png)  ![](/image/r/ESP32-RC-Car-45.png)

7. 바퀴 바깥쪽으로 빠져나온 회전축 나사를 나이록 너트(M4)를 끼워 고정한다. (십자형 육각 복스로 나이록 너트를 돌릴때 '딱딱'하는 소리가 몇번 날때까지 돌리면 고정이 된다.)

![](/image/r/ESP32-RC-Car-46.png)

8. 동일한 방법으로 하나를 더 만들어 2개의 휠을 완성한다.

![](/image/r/ESP32-RC-Car-47.png)

9. 짧은 커넥팅 로드 1개와 긴 커넥팅 로드 1개, M2.5*10mm 나사(Pan head) 3개를 준비한 뒤,

![](/image/r/ESP32-RC-Car-48.png)

10. **오른쪽 휠 컵** 암(Arm)에 있는 구멍 2개 중, 끝부분의 구멍(빨간색으로 표시된 부분)에 

![](/image/r/ESP32-RC-Car-51.png)

11. 준비한 볼트(M2.5*10mm (Pan head)) 1개를 이용하여 긴 커넥팅 로드를 고정한다. 이때, 볼트의 끝 부분을 **구멍 아래쪽에서 윗쪽으로** 넣듯이 하여 고정한다.

![](/image/r/ESP32-RC-Car-49.png)

​		또한, **볼트의 끝부분이 반대편 구멍 바깥쪽으로 튀어나오지 않도록** 조임의 정도를 조절한다.  

![](/image/r/ESP32-RC-Car-50.png)   ![](/image/r/ESP32-RC-Car-66.png)

12. 같은 방법으로 **왼쪽 휠 컵**의 구멍에 긴 커넥팅 로드의 반대편을 고정한다. (이때, 볼트의 끝부분이 반대편 구멍 바깥쪽으로 튀어나오지 않도록 조임의 정도를 조절한다. )

13. **오른쪽 휠 컵**의 구멍 2개 중, 파란색으로 표시된 부분에는 동일한 볼트를 사용하여 짧은 커넥팅 로드를 연결한다. (이때, 볼트의 끝부분이 반대편 구멍 바깥쪽으로 튀어나오지 않도록 조임의 정도를 조절한다. )

![](/image/r/ESP32-RC-Car-52.png)

14. 전륜 휠 베이스 완성된 모습

![](/image/r/ESP32-RC-Car-53.png)

<br>

#### 조향 서보모터 조립

1. MG996R 서보모터를 준비한 후,

![](/image/r/ESP32-RC-Car-54.png)

2. 아래 회로도와 스케치를 참고하여, 서보모터의 초기 위치를 90도 위치로 회전시켜 둔다.

   * schematic

     ![](/image/SG90.png)

     | MG996R | 갈색 | 빨간색 | 주황색  |
     | ------ | ---- | ------ | ------- |
     | ESP32  | GND  | 5V     | GPIO 15 |

   * sketch

     ```c++
     const int ledPin = 15;  // corresponds to GPIO 15
     
     // setting PWM properties
     const int ledChannel = 0;
     const int freq = 50;
     const int resolution = 16;
     
     void setup()
     {
       // PWM Setup
       ledcSetup(ledChannel, freq, resolution);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
       ledcAttachPin(ledPin, ledChannel);        // PWM CH0을 GPIO 15번으로 출력
     }
     
     void loop()
     {
       ledcWrite(ledChannel, 4910);              // 1638 ~ 8192 (90degree = 4910)
       delay(500);  
       }
     }
     ```

3. ㄴ자 서보모터 브라켓, 브라켓 고정용 볼트(Pan-Washer head, M3×6mm) 8개, 서보 혼(고정용 볼트 1개 포함)를 준비한다.

![](/image/r/ESP32-RC-Car-55.png)   ![](/image/r/ESP32-RC-Car-56.png)

4. 와셔볼트 4개를 사용하여 ㄴ자 브라켓을 고정하고, 서버 혼도 고정용 볼트를 사용하여 장착한다. (**아래 사진을 잘 보면서 MG996R 스티커의 글씨 방향, ㄴ자 브라켓이 고정된 방향, 서보 혼 방향(현재 사진에 보이는 서보 날개의 위치가 90도가 됨)에 유의하여 장착한다.**)

![](/image/r/ESP32-RC-Car-57.png)

5. 샤시 하판에 와셔볼트 4개를 사용하여 서보모터를 고정한다.

{{< figure src="/image/r/ESP32-RC-Car-58.png" width="80%" class="center" >}}

![](/image/r/ESP32-RC-Car-59.png)

<br>

#### 샤시 하판에 휠 베이스 고정하기

1. 준비물: 서보모터가 고정된 샤시 하판, 황동 육각 스터드 M3×22mm 4개, 볼트 M3*8mm 8개, M2.5×10mm 4개, 부채꼴 모양의 휠 베이스 고정판 2개

 ![](/image/r/ESP32-RC-Car-60.png)

2. (위 1번 사진의) 빨간색으로 표시된 부분에 육각 스터드 4개를 고정한다.

![](/image/r/ESP32-RC-Car-61.png)

3. (위 1번 사진의) 파란색으로 표시된 부분의 구멍에는, 다음 그림과 같이 긴 커넥팅 로드가 붙어있는 쪽의 휠 컵 구멍(아래 사진에서 파란색으로 표시된 부분)을 맞추어 볼트(M2.5×10mm)로 고정시킨다. (이때, 양쪽 휠 컵의 암(Arm) 부분이 차량 전면을 향하도록 한 상태에서 연결해야 한다.)

![](/image/r/ESP32-RC-Car-62.png)

4. 고정이 완료된 상태에서 밑면을 보면 다음과 같으며,

![](/image/r/ESP32-RC-Car-63.png)

​		위에서 바라본 모습은 다음과 같다.

![](/image/r/ESP32-RC-Car-64.png)

5. (파란색 원으로 표시된 부분) 부채꼴 모양의 휠 베이스 고정판을 양쪽 휠에 있는 육각 스터드와 스티어링 컵의 구멍에 고정한다. (볼트 M3×8mm 8개, M2.5×10mm 4개 사용)

   (빨간색 원으로 표시된 부분) M2.5*10mm 나사와 나이록 너트(M2.5)를 사용하여, 짧은 커넥팅 로드를 서보 혼에 고정한다. 이때, 십자형 육각 복스로 나이록 너트를 돌릴때 '딱딱'하는 소리가 몇번 날때까지 돌리면 고정이 된다.)

![](/image/r/ESP32-RC-Car-65.png)

​		아래 사진은 완성된 전륜 조향 휠 부분을 정면에서 바라본 모습이다.

![](/image/r/ESP32-RC-Car-67.png)

<br>

#### 후륜 모터 파트 조립

1. 25GA370 엔코더 모터에 모터 커넥터를 끼우고, 볼트 (Flat head, M2.5×5mm) 2개를 사용하여 모터 브라켓를 고정한다.

    ![](/image/r/ESP32-RC-Car-68.png)

2. 베어링 2개, 샤프트, 써클립, 기어, 육각 샤프트 커플링 커넥터, 써클립(Circlip)을 준비한다.

{{< figure src="/image/r/ESP32-RC-Car-69.png" style="zoom: 80%;" class="center" >}}

3. 샤프트 끝부분에 있는 홈에 써클립을 끼운다.

![](/image/r/ESP32-RC-Car-70.png)   ![](/image/r/ESP32-RC-Car-71.png)

4. 모터 브라켓 양쪽 끝에 있는 구멍에 베어링을 끼우고, 써클립을 끼운 샤프트를 밀어넣는다.

{{< figure src="/image/r/ESP32-RC-Car-72.png" style="zoom: 67%;" class="center" >}}

​		샤프트를 끼운 후, 모터를 앞쪽과 뒷쪽에서 보았을때의 모습

![](/image/r/ESP32-RC-Car-74.png)  ![](/image/r/ESP32-RC-Car-73.png)

5. 모터에 부착되어 있는 작은 황동 기어에 흰색 플라스틱으로 된 기어가 맞물려지도록 샤프트에 끼우고, 기어 측면에 있는 작은 무두볼트(Set Screw) 2개를 육각렌치를 사용하여 적절하게 분배하여 조여준다. 이때 **한쪽 무두볼트만 조여서 고정하면 기어에서 무두볼트가 빠지거나 고정이 되지 않을 수 있다.** 이를 고려하여 양쪽의 나사를 적절히 분배하여 조이도록 한다.  

![](/image/r/ESP32-RC-Car-75.png)   ![](/image/r/ESP32-RC-Car-76.png)

6. 육각 샤프트 커플링 커넥터를 준비하여 샤프트에 끼운 후, 커넥터 측면의 볼트를 돌려 고정한다. 이때, 고정하는 볼트의 끝부분이 샤프트의 편평한 면에 닿도록 조여준다.

{{< figure src="/image/r/ESP32-RC-Car-77.png" width="80%" class="center" >}}   {{< figure src="/image/r/ESP32-RC-Car-78.png" width="80%" class="center" >}}

7. 같은 방법으로 후면 왼쪽 모터도 조립한다.

8. 샤시 하판 뒷편 양쪽에 있는 삼각형 형태로 위치한 구멍에, 모터 브라켓을 올려놓고 볼트(Pan head, M4×6mm)를 사용하여 고정한다.

![](/image/r/ESP32-RC-Car-79.png)

​		오른쪽 모터를 샤시 후면에 고정한 모습이다. 같은 방법으로 왼쪽 후면 모터도 고정한다.

![](/image/r/ESP32-RC-Car-80.png)

<br>

#### 범퍼 조립

1. 육각 스터드(M3×16mm) 2개와 볼트 (Bind-Washer head, M3×6mm) 4개 준비

![](/image/r/ESP32-RC-Car-81.png)

2. 준비된 육각 스터드를 샤시 하판의 맨 앞쪽에 고정한다.

![](/image/r/ESP32-RC-Car-82.png)

3. 범퍼를 육각기둥에 끼운 후, 와셔볼트를 사용하여 고정한다.

 {{< figure src="/image/r/ESP32-RC-Car-83.png" width="80%" class="center" >}}   {{< figure src="/image/r/ESP32-RC-Car-84.png" width="80%" class="center" >}}

<br>

#### 샤시 상판 고정

1. 육각 스터드(M3×22mm) 2개를 서보모터와 DC엔코더모터 사이에 있는 구멍에 볼트(M3.0×8mm)로 고정한다. 

![](/image/r/ESP32-RC-Car-85.png)

​		육각 스터드를 고정한 모습이다.

![](/image/r/ESP32-RC-Car-86.png)

2. 샤시 상판의 보호필름을 떼어내고, 육각 스터드 홀에 맟춰 올린 뒤,

![](/image/r/ESP32-RC-Car-87.png)

3. 볼트(Bind head, M3.0×8mm) 2개를 사용하여 상판을 고정한다.

![](/image/r/ESP32-RC-Car-88.png)

​		상판의 오른쪽 하단에 락스위치를 꼽아 고정한 뒤에, 배터리의 (+)라인에 직렬로 배선할 수 있도록 준비한다.

<br>

#### 후륜 휠 장착

1. 육각 휠 너트 앞쪽에 있던 나사를 풀러낸 뒤,

![](/image/r/ESP32-RC-Car-89.png)

2. 바퀴를 끼우고, 풀러냈던 나사로 다시 고정한다.

![](/image/r/ESP32-RC-Car-90.png)

<br>

#### 샤시 완성

{{< figure src="/image/r/ESP32-RC-Car-91.png" style="zoom: 50%;" class="center" >}}

{{< figure src="/image/r/ESP32-RC-Car-92.png" width="50%" class="center" >}}

{{< figure src="/image/r/ESP32-RC-Car-93.png" width="50%" class="center" >}}

<br>

<br>

### ESP32 Parts

완성된 샤시의 상판과 하판을 이용하여 ESP32, 브레드보드, 모터드라이버, 배터리, 전원모듈 등을 장작한다.

<br>

#### for RC Car (ESP32 + nRF24L01 + TB6612FNG + 25GA370 + MG996R)

##### sketch

RC Car에 장착하는 ESP32에 업로드

```C++
#include <SPI.h>
#include <RF24.h>
RF24 radio(4, 5);

long long address = 0x1234ABCDEFLL;

struct Value{
  uint16_t value_x;   // servo motor pwm
  uint16_t value_y;   // DC motor pwm
};

Value data;

int angle_x = 90;     // servo initial position (0~180)
int velo_y = 0;       // DC motor inital velocity
int direction_y = 0;  // DC motor direction
int i = 0;            // joystick center position calculation counter
int center_x = 0;     // joystick initial center_x 
int center_y = 0;     // joystick initial center_y
int ref_xl, ref_xr, ref_ya, ref_yb;    // Servo & DC rotation reference value from center position value

//servo setting
const int PIN_SERVO = 15;             // servo pwm pin
const int CH_SERVO = 2;               // servo pwm channel
const int servoFrequency = 50;        // servo pwm frequency (Hz)
const int servoResolution = 16;       // servo pwm resolution (bit) (12bit: 0~4095)

// RecvTime
unsigned long lastRecvTime = 0;

void centerData() {
  while(i < 100) {
    if(radio.available()){
      radio.read(&data, sizeof(Value));
      center_x = center_x + data.value_x;
      center_y = center_y + data.value_y;
      i++;
    }
  }
  center_x = center_x / 100;         // x축 조이스틱 센터값 (평균)
  center_y = center_y / 100;         // y축 조이스틱 센터값 (평균)

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

/*
// TB6612FNG right side & ESP32-WROOM-32D DEVKIT_C V4 left side pin order
const int PIN_PWMA = 32;  
const int PIN_INA1 = 33;
const int PIN_INA2 = 25;
const int PIN_STBY = 26;
const int PIN_INB1 = 27;
const int PIN_INB2 = 14;
const int PIN_PWMB = 12;
*/

// TB6612FNG right side & ESP32-WROOM-32 left side pin order
const int PIN_PWMA = 33;
const int PIN_AIN2 = 25;
const int PIN_AIN1 = 26;
const int PIN_STBY = 27;
const int PIN_BIN1 = 14;
const int PIN_BIN2 = 12;
const int PIN_PWMB = 13;

// channel setting (GPIO pin, channel)
// if STBY(CH0) = LOW, Standby states.
// if STBY(CH0) = HIGH, and INA1&INA2 have different value
// and PWMA has some value, CW or CCW rotation is made.

// Channel      CW   CCW  Stanby Stop Brake1 Brake2 Brake3
// PIN_STBY (0) HIGH HIGH LOW    HIGH  HIGH  HIGH   HIGH
// PIN_INA1 (1) HIGH LOW  *      LOW   HIGH  LOW    HIGH
// PIN_INA2 (2) LOW  HIGH *      LOW   HIGH  HIGH   LOW
// CH_PWMA  (3) PWM  PWM  *      HIGH  *     LOW    LOW

// PWM Channel setup
const int CH_PWMA = 0;
const int CH_PWMB = 1;
// PWM frequency and bit resolution setup
const int pwmFrequency = 10000;  // Hz
const int bitResolution = 8;     // pwm value: 0~255

// led setup
const int PIN_LED = 2;
int ledstate;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();

  // Servo PWM Setup
  ledcSetup(CH_SERVO, servoFrequency, servoResolution);  // PWM CH2, Frequncy 50 Hz, 12bit resolution
  ledcAttachPin(PIN_SERVO, CH_SERVO);                    // PWM CH2을 GPIO 15번으로 출력

  // center value
  centerData();
  
  pinMode(PIN_LED, OUTPUT);

  // tb6612fng setting
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT);
  pinMode(PIN_BIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT);
  
  // motor output(PWM) setting (channel, frequency, bit)
  ledcSetup(CH_PWMA, pwmFrequency, bitResolution);
  ledcSetup(CH_PWMB, pwmFrequency, bitResolution);
  ledcAttachPin(PIN_PWMA, CH_PWMA);
  ledcAttachPin(PIN_PWMB, CH_PWMB);
}

void loop() {
  ledstate = 0;
  unsigned long now = millis();

  if( now - lastRecvTime > 5){    // 5ms 마다 서보출력
    recvData();
    rotate_xy();

    move(1, velo_y, direction_y);               // motor A(right wheels), velo_y speed, moving direction
    move(2, velo_y, direction_y);               // motor B(left wheels), velo_y speed, moving direction

    if(ledstate > 0) {
      digitalWrite(PIN_LED, HIGH);
    }
    else {
      digitalWrite(PIN_LED, LOW);
    }
  }
}


void move(int motor, int speed, int direction) {   //Move specific motor at speed and direction
//motor: A(Right) -> 1, B(Left) -> 2
//speed: 0 is off, and 255 is full speed
//direction: 0 clockwise, 1 counter-clockwise

  digitalWrite(PIN_STBY, HIGH);         // move

  boolean inPin1 = HIGH;                // Defalut(direction=0) - Clockwise
  boolean inPin2 = LOW;

  if(direction == 1) {                  // Count-clockwise
    inPin1 = LOW;
    inPin2 = HIGH;
  }

  if(motor == 1){                       // if motor == 1, right wheel
    digitalWrite(PIN_AIN1, inPin1);
    digitalWrite(PIN_AIN2, inPin2);
    ledcWrite(CH_PWMA, speed);
  }
  else {                                // if motor is not 1, left wheel
    digitalWrite(PIN_BIN1, inPin1);
    digitalWrite(PIN_BIN2, inPin2);
    ledcWrite(CH_PWMB, speed);
  }
}

void stop() {
  digitalWrite(PIN_STBY, LOW);         // stand-by = stop
}

void rotate_xy() {
  Serial.print("x: "); Serial.print(data.value_x);
  Serial.print(", y: "); Serial.println(data.value_y);

  //x축 서보 구동 조건 설정
  if(data.value_x < ref_xl) {     
    if(angle_x > 55) {                 // servo 55~125 degree
      angle_x--;
    }
    else {
      angle_x = 55;
    }
    ledstate++;
  }
  else if(data.value_x > ref_xr) {
    if(angle_x < 125) {
      angle_x++;
    }
    else {
      angle_x = 125;
    }
    ledstate++;
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
  //servo_x.write(angle_x);
  servoWrite(CH_SERVO, angle_x);
  delay(5);                    // delay를 더 줄이면 서보 모터 기어에 무리가 감

  //y축 DC 구동 조건 설정
  if(data.value_y > ref_ya) {
    if(direction_y == 0) {
      if(velo_y < 255) {
        velo_y++;
      }
      else {
        velo_y = 255;
      }
    }
    if(direction_y == 1) {
      if(velo_y > 0) {
        velo_y--;
      }
      else {
        direction_y = 0;
        velo_y = 0;
      }
    }
    ledstate++;
  }
  else if(data.value_y < ref_yb) {
    if(direction_y == 1) {
      if(velo_y < 255) {
        velo_y++;
      }
      else {
        velo_y = 255;
      }
    }
    if(direction_y == 0) {
      if(velo_y > 0) {
        velo_y--;
      }
      else {
        direction_y = 1;
        velo_y = 0;
      }
    }
    ledstate++;
  }
  else {
    if(velo_y > 0) {
      velo_y--;
    }
    else {
      velo_y = 0;
    }
  }
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    int servoPWM = map(deg, 0, 180, 2720, 8191);  // 16bit (PWM 4.15% ~ 12.5%)
    ledcWrite(ch, servoPWM);
}
```

<br>

##### schematic

![](/image/r/ESP32-RC-Car-94.png)

<br>

##### 16P & 4P jumper block 사용

RC카를 제작해보면 프레임 조립 후 여러가지 구동을 위한 부품을 넣어야 하는데, 큰 브레드보드를 장착하기에는 공간이 좁아 조립이 어려울 수 있다. 그러므로 브레드보드를 제거하고 16P & 4P의 점퍼 블록을 사용해 RC카에 장착해본다. 

<br>

16P 점퍼블록과 4P 점퍼블록, 그리고 2개의 와이어핀을 준비한다.

![](/image/so1.png)

<br>

2개의 와이어핀을 4P 점퍼블록의 중앙에 꼽아넣음으로써, 4개의 핀소켓이 모두 연결되어 있는 상태가 되도록 만든다. (1개의 와이어만 넣어도 연결은 되지만, 헐거워 고정이 안되기 때문에 2개를 사용하는 것임)

![](/image/so2.png)

<br>

16P 점퍼블록을 사용하여 ESP32 DevkitC V4 보드와 TB6612FNG 모터드라이브를 다음과 같이 연결한다. 

| ![](/image/so3.png) | 32 - PWMA<br>33 - AIN2<br>25 - AIN1<br>26 - NC<br>27 - BIN1<br>14 - BIN2<br>12 - PWMB<br> GND - GND                                                              <br> |
| ------------------- | ------------------------------------------------------------ |

<br>

ESP32의 5V핀에는 4P 점퍼블록을 꼽아, 5V핀을 3개 사용할 수 있도록 만들어준다. 제작 후 위에서 바라본 모습은 다음과 같다.

![](/image/so4.png)

<br>

<br>

#### for Remote Controller (ESP32 + nRF24L01 + Dual Joystick)

##### sketch

* 리모트 컨트롤러로 사용할 TTGO T-energy(ESP32)에 업로드한다.
* TTGO T-energy를 컴퓨터와 연결하여 사용할 경우에는 반드시 18650 배터리를 제거하거나 스위치를 OFF상태로 두어야 한다.
* 그러므로 **스케치 업로드 시에는 안전한 사용을 위해 18650 배터리를 제거**한 뒤 아래의 스케치를 업로드하도록 한다.

```C++
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

##### schematic

![](/image/r/ESP32-RC-Car-95.png)

<br>

* TTGO T-energy 에는 5V 단자가 1개 있음.
* 2개의 조이스틱에 5V가 각각 입력되어야 하므로, TTGO T-energy의 5V 단자를 2개로 분기할 수 있는 Y자형 케이블을 제작하여 사용하도록 한다.

![](/image/r/ESP32-RC-Car-96.png)

​      위 형태는 (오른쪽) 1개의 (F)단자를 (왼쪽) 3개의 (F)단자로 분기하는 형태의 케이블이다.

​      이를 참고하여 1개의 단자를 2개의 단자로 나눠주는 케이블을 제작하면 된다.

