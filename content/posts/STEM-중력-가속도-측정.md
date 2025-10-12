---
title: "ESP32, 중력 가속도 측정"
categories: ["science"]
date: 2020-10-06T17:57:00+09:00
mathjax: true
toc: true
tags:
---
### 중력(Gravitational Force)

뉴턴은 달의 운동과 케플러의 법칙을 통해, 달과 지구 사이에 작용하는 힘은 지구의 질량과 달의 질량의 곱에 비례하고 거리의 제곱에 반비례한다는 만유인력의 법칙을 밝혔다.
```katex
F = G \frac{Mm}{r^2} = m_i a = mg
```

지구의 질량 M
```katex
M=5.072 \times 10^{24}~kg
```

지구 반지름 r
```katex
r = 6371~km
```

만유인력 상수값은 다음과 같다. (캐번디시에 의해 측정된 G값은 6.674)
```katex
G = 6.67259 \times 10^{-11}~N \cdot m^2 /kg^2
```

만유인력이 지상의 물체에 작용되는 경우, 이때 작용하는 힘을 중력이라고 한다. 

<br>

#### 중력 가속도(Gravitational Acceleration)

위 식에서 관성 질량(m_i)과 중력 질량(m)이 같다는 등가원리를 적용하면 중력 가속도는 작은 물체의 질량 m에 무관하게 된다.
```katex
a = g = G \frac{M}{r^2}
```

지구의 질량 M과 지구 반지름 R은 지표면의 물체에 비해 매우 크고, 거의 구에 가까우므로, 위 식을 사용하여 지구 표면에서의 중력 가속도 g값을 구할 수 있다.
```katex
g = 9.80665~m/s^2
```

<br>

#### 등가속도 직선 운동

가속도의 크기와 방향이 일정한 직선 운동으로, 속도가 일정하게 증가하거나 감속하는 직선 운동을 의미한다. 자유낙하의 경우 초기속도가 0인 물체를 중력장에 낙하시킬 때 중력가속도를 받으며 낙하하는 물체의 운동이며, 공기의 저항이 없다고 가정할 경우 등가속도 직선 운동이 된다.

등가속도 직선 운동과 관련된 공식은 다음과 같다.
```katex
v = v_0 + at~~~\cdots~~~①
```

```katex
s=v_0t + \frac{1}{2}at^2~~~\cdots~~~②
```

```katex
2as = v^2 - v_0^2~~~\cdots~~~③
```

이 3가지 기본 공식을 통해 다양한 형태의 공식을 유도할 수도 있다.

①, ②식을 조합하면
```katex
s = \frac{1}{2}(v_0+v)t~~~\cdots~~~④
```
③식에서 초기속도(V<sub>0</sub>)가 0인 경우
```katex
v=\sqrt{2as}~~~\cdots~~~⑤
```
②식을 변형하면
```katex
a=\frac{2(s-v_0t)}{t^2}~~~\cdots~~~⑥
```
③식을 변형하면
```katex
a=\frac{v^2-v_0^2}{2s}~~~\cdots~~~⑦
```
<br>

<br>

### 자유낙하를 이용한 중력 가속도 측정 실험

- 실험 목적: 중력 가속도를 측정하는 방법은 여러 가지가 있지만, 본 실험은 자유 낙하를 통해 중력 가속도를 측정하고자 한다. 자유낙하 운동이 중력을 가장 쉽게 표현할 수 있는 운동이라 판단하였기 때문이다. 정밀한 값의 측정보다는, 자유낙하 운동을 통해 중력 가속도를 이해하고 이를 실험을 통해 확인하는 것이 이번 실험의 목적이다. 보다 정밀한 중력 가속도를 측정하기 위해서는 진자의 운동 주기를 이용하는 것이 좋다. 

- 이번 실험에서는 2m 길이의 파이프에 25cm 간격으로 센서를 배치하고, 낙하하는 물체가 센서를 지날때마다 시간을 기록할 것이다. 변위와 시간을 측정할 수 있으므로 초기속도(V<sub>0</sub>)값만 알면 ⑥을 이용하여 중력 가속도를 계산할 수 있다.


- ⑥을 단순화 시키기 위해서는 **초기 속도가 0이 되도록 하기 위해 첫번째 센서를 파이프의 입구(최상단)에 배치**하는 것이다. 단, 이렇게 할 경우 실험 과정에서 낙하시킬 물체를 놓을 때 물체를 잡고 있는 손가락의 영향을 제거하기 어려우며, 이 문제에 기인하는 오차는 큰 편이라고 할 수 있다.


- 위 문제 해결을 위해 첫번째 센서를 최상단으로부터 12.5cm 정도 아래로 내려 설치한다. 이를 통해 센서가 측정하는 시간은 온전히 자유낙하하는 상태에서 측정되므로 비교적 정확하게 측정할 수 있다. 문제는 **첫번째 센서 위치에서의 초기 속도(V<sub>0</sub>)값**이 0이 아니므로 이 값을 별도로 계산하여야 한다.


- 이 값은 ③으로부터 계산할 수 있는데, 

```katex
2as = v^2 - v_0^2~~~\cdots~~~③
```
- 파이프 입구에서의 **초기 속도(V<sub>0</sub>)를 0으로 가정**하면, 12.5cm만큼 낙하하여 첫번째 센서에 반응할 때의 속도(v)값은 ⑤로 부터 구할 수 있다.

```katex
v=\sqrt{2as} = \sqrt{2\times9.80665\times0.125}=1.5658~m/s
```
- 이 값이 12.5cm 위치에 첫번째 센서를 설치한 실험기구를 사용하는 경우, **⑥에서의 초기 속도(V<sub>0</sub>)값**이 된다. 파이프에 설치한 센서의 번호를 n이라고 하면, ⑥은 다음과 같이 쓸 수 있다.

```katex
a_n=\frac{2(s_n-1.5658t_n)}{t_n^2}
```
- s는 **첫번째 센서 ~ 각 센서가 위치한 곳**까지 물체가 이동한 변위이며, 8개의 센서를 사용하여 낙하하는 물체가 센서와 반응하는 시간(t<sub>n</sub>)을 측정하고, 이를 ⑥에 대입하면 가속도(a<sub>n</sub>)를 계산할 수 있다. 각 지점에서의 가속도를 평균계산하여 중력가속도를 구한다.


| 센서    | 입구 ~ 0 | 0 ~ 1 | 0 ~ 2 | 0 ~ 3 | 0 ~ 4 | 0 ~ 5 | 0 ~ 6 | 0 ~ 7 |
| ------- | -------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| s_n (m) | 0.125    | 0.25  | 0.50  | 0.75  | 1.00  | 1.25  | 1.50  | 1.75  |
| t_n     |          |       |       |       |       |       |       |       |
| a_n     |          |       |       |       |       |       |       |       |

<br>

#### 이 실험의 한계

- 이 실험의 목적은 자유 낙하하는 물체를 통해 중력 가속도를 측정하는 것이다. 그런데, 중력 가속도를 계산하는 중간 과정에서, ⑤를 이용하기 위한 초기 속도(V<sub>0</sub>=1.5658m/s) 값을 계산하기 위해 (실험 목적값인) 중력 가속도 9.80665m/s²를 사용한 것은 이 실험을 행하는 본질을 벗어나는 것이라고 볼 수 있다.
- 그렇지만, 여기서는 각 센서를 통해 측정되는 값으로 계산해낸 중력 가속도의 평균 값이 어느 정도되는지 확인해보고, 실제값과 어느 정도의 오차를 보이는지를 확인하는 교육 목적을 갖고 사용하는 것임을 감안할 필요가 있다. 이를 근거로 중력 가속도 값을 이용하여 계산한 첫번째 센서위치에서의 초기 속도 값을 기본 보정값의 개념으로 사용하고자 한다.
- 이러한 방법이 합당하지 않다고 생각한다면, 위에서 언급한 것 처럼 초기 속도(V<sub>0</sub>)가 0이 되도록 센서를 파이프의 입구(최상단)에 배치하고, 물체가 손에서 떨어짐과 동시에 첫번째 센서에 반응하도록 낙하시키는 위치를 정확하게 조절하며 실험해야 한다.

<br>

<br>

#### 실험 장치 만들기 

##### 파이프 준비

- 길이 2m 투명 아크릴 파이프(내경 3.5cm)에 **구간 거리가 0.25m(=25cm)** 가 되도록 일정하게 IR LED를 배치하고 고정한다.

{{< figure src="/image/Gravitational-Acceleration01.png" width="33%" class="center" >}}

<br>

##### 센서 장착

- 맨 위쪽과 아래쪽에는 12.5cm정도 띄우고 IR LED와 Phototransistor를 배치함
  - 손에서 낙하물을 놓을 때, 낙하물이 바닥에 닿을 때, 낙하시간에 영향을 주는 요소를 제거하기 위함
- IR LED와 Phototransistor가 서로 정확하게 마주 볼 수 있는 위치에 유성펜을 사용하여 표시한다.
  


- 드릴을 이용하여 아크릴 파이프에 지름 5mm의 구멍을 뚫는다.
  - 아크릴이 파손되지 않도록 유의한다. 이를 위해 먼저 작은 지름(1~2mm)의 드릴비트를 이용하여 작은 구멍을 뚫은 뒤, 그 구멍에 5mm 드릴비트를 사용하여 LED가 들어갈 구멍을 다시 뚫는 것이 좋다.

- IR LED와 Phototransistor를 구멍에 넣고 글루건을 사용하여 고정한다.
  - 글루건이 IR LED와 Phototransistor의 앞부분에 뭍지 않도록 주의
  - 글루건이 손에 뭍으면 화상을 입을 수 있으므로 주의

<br>

##### 배선

- 각 센서 층마다 저항과 전원선과 데이터선을 다음과 같이 연결한다.


{{< figure src="/image/Gravitational-Acceleration02.png" width="75%" class="center" >}}

<br>

- IR LED

  - 부품번호 및 제조회사가 표기되어 있지 않아 정확히 어떤 제품인지 알 수 없어, Everlight사의 IR333-A (940nm, 직경5mm)의 Datasheet를 참고하였다.

  - Forward Current 100mA, Forward Voltage 1.5V

  - 5V를 전원으로 사용하는 경우
    ```katex
    R = \frac{(5-1.5)V}{0.1A} = 35~Ω
    ```
    그러므로 35Ω보다 약간 큰 47Ω저항을 연결한다. 100Ω정도의 저항도 사용할 수 있으나, 너무 큰 저항을 사용할 경우 IR의 세기가 작아지게 되므로, 실험이 잘 안될 수 있다.

  - 실외에서는 태양광에 포함된 적외선의 영향도 받게 되므로 사용장소가 실내로 제한된다.

   <br>

- Phototransistor

  - 적외선이 닿으면 전류를 흐르게 하는 스위치 역할을 한다.
  - 콜렉터(Collector)의 역할을 하는 긴다리와 에미터(Emitter)의 역할을 하는 짧은 다리, 총 2개의 다리가 붙어가 있지만 적외선 빛이 베이스(Base)의 역할을 하는 트렌지스터이다. 

  - 스위치의 역할을 하므로, 1MΩ의 풀업 저항을 긴다리에 부착한다. 10k옴을 써도 무방하지만 센서의 감도가 떨어지게 됨

<br>

#### schematic

- 8세트의 IR LED와 Phototransistor를 사용하기 위해 아날로그 입력이 총 8개 필요하다. 그러므로 여기서는 많은 아날로그 입력핀을 갖고 있는 **ESP32**를 사용하도록 한다. 장치의 특성상, 최종 사용시에는 USB선을 분리한 상태에서 사용할 수 있도록 하는 것이 좋으므로, 18650 배터리 홀더가 내장된 ESP32를 사용하는 것도 좋은 방법이다. 

{{< figure src="/image/Gravitational-Acceleration03.png" width="75%" class="center" >}}

<br>

※ 아두이노 UNO의 경우 아날로그 입력이 총 6개이고, 여기에 SDA, SCL과 같은 I2C 통신포트를 사용한다면 실제 사용가능한 아날로그 포트가 4개밖에 남지 않는다. 아두이노 UNO를 사용해야한다면 CD4051BE와 같은 멀티플렉서 IC를 추가로 사용하여야 한다. 혹은 아날로그 입력 포트를 많이 가지고 있는 아두이노 MEGA를 사용한다.

<br>

#### sketch: 센서 테스트

- 모든 센서의 배선이 완료되면, 센서가 잘 작동하는지 테스트하기 위한 스케치를 업로드하여 센서를 점검한다.

```C
// Potentiometer is connected to GPIO 34 (Analog ADC1_CH6) 
const int ir_Pin[8] = {36, 39, 34, 35, 32, 33, 4, 2};

// variable for storing the potentiometer value
int ir_Value[8] = {0, 0, 0, 0, 0, 0, 0, 0};

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Print the header:
  Serial.println("Y0\tY1\tY2\tY3\tY4\tY5\tY6\tY7");
  Serial.println("---\t---\t---\t---\t---\t---\t---\t---");
}

void loop() {
  // Loop through all eight pins.
  for (byte pin=0; pin<=7; pin++) {
    ir_Value[pin] = analogRead(ir_Pin[pin]);
    Serial.print(String(ir_Value[pin]) + "\t");
  }

  Serial.println();
  delay(2);
}
```

- 센서값이 4095으로 출력되는 센서는 배선 자체의 연결에 문제가 있는 것이므로, 배선이 연결되어야 하는 부분에 정확하게 연결이 되었는지 우선 점검한다.
-  초기 상태의 센서값이 모두 0에 근접하는 값으로 표시될 수 있도록 하는 것이 좋으며, 초기값이 0에서 많이 벗어나는 경우에는 LED와 Phototransistor가 서로 정확하게 마주 볼 수 있도록 조절해준다. 조절 후에도 센서값이 0이 되지 않을 수 있다. 이때는 0에 가장 가까운 값이 만들어지도록 최대한 조절한다. 이 상태에서 물체를 떨어뜨려 모든 센서가 물체에 반응하는지 살펴본 뒤, 물체에 반응하는 센서값의 최소값을 점검한다.

<br>

#### sketch

- 테스트 sketch를 통해 센서의 반응 정도를 파악한 뒤에, 메인 스케치를 업로드 한다.
- 업로드 전에 아래 부분을 찾아, 각 센서에 따라으로 물체에 반응하는 센서의 최소값(센서 테스트시 점검할 것!)으로 바꿔준다.  민감도의 범위는 0~4095이며, 값이 작을 수록 떨어지는 물체에 민감하게 반응한다. 기본값은 모두 100으로 설정되어 있다.

~~~C
// The smaller the value, the more sensitive (0~4095)
const int min_Sensitive[8] = {100, 100, 100, 100, 100, 100, 100, 100};
~~~

<br>

##### 메인 스케치

```C
/****** ESP32 SKETCH FOR GRAVITATIONAL ACCELERATION ******
   Author: K. Jun, Lee
   Blog: https://stemwith.github.io         2020-10-06
*********************************************************/

// GPIO of connecting with 8 Phototransistors
const int ir_Pin[8] = {36, 39, 34, 35, 32, 33, 4, 2};

// variable for storing the potentiometer value
int ir_Value[8] = {0, 0, 0, 0, 0, 0, 0, 0};

// variable for IR Phototransistors' sensitivity
int ir_Sensitivity[8] = {0, 0, 0, 0, 0, 0, 0, 0};

// The smaller the value, the more sensitive (0~4095)
const int min_Sensitive[8] = {100, 100, 100, 100, 100, 100, 100, 100};

// for recording of sensing time by micros()
unsigned long nowTime[8] = {0, 0, 0, 0, 0, 0, 0, 0};

// for recording of interval time by micros()
unsigned long intervalTime[8] = {0, 0, 0, 0, 0, 0, 0, 0};

/*
// for distance of 8 sensors in micrometer unit
// (12.5cm - 25cm - 25cm - 25cm - 25cm - 25cm - 25cm - 25cm)
unsigned long ir_Distance[8] = {125000, 250000, 250000, 250000, 250000, 250000, 250000, 250000};
*/

// for testing distance of 8 sensors in micrometer unit
// (1.4cm - 2.54cm - 2.54cm - 2.54cm - 2.54cm - 2.54cm - 2.54cm - 2.54cm)
unsigned long ir_Distance[8] = {14000, 25400, 25400, 25400, 25400, 25400, 33300, 25400};

// for displacemence of 8 sensors in micrometer unit
unsigned long ir_Displacemence[8] = {0, 0, 0, 0, 0, 0, 0, 0};

// for interval acceleration
float acceleration[8] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};

// for times number
int t = 0;

// Gravitational Acceleration & Initial Velocity
float g = 9.80665; // 9.80665 m/s^2 = 0.00000980665 um/us^2
float initVelocity = sqrt(2*g*((float)ir_Distance[0]/1000000)); // in m/s unit

void setup() {
  Serial.begin(115200);
  delay(1000);

// Setup Displacemence
  for (byte pin=1; pin<8; pin++) {
      ir_Displacemence[pin] = ir_Displacemence[pin-1] + ir_Distance[pin];
  }
}

void loop() {

  // Print the header:;
  t++;
  float sum_Accel = 0.0;
  unsigned long initTime = 0;
  Serial.println();
  Serial.print("Experiment #"); Serial.println(t);
  Serial.println("\t\tY0\t\tY1\t\tY2\t\tY3\t\tY4\t\tY5\t\tY6\t\tY7");
  Serial.println("\t\t---\t\t---\t\t---\t\t---\t\t---\t\t---\t\t---\t\t---");

  // Initializing 8 IR Phototransistors' Sensitivity:
  for (int s=0; s<101; s++) {
    for (byte pin=0; pin<=7; pin++) {
      ir_Sensitivity[pin] = ir_Sensitivity[pin] + analogRead(ir_Pin[pin]);
    }
  }
  // Average of Initial Senser value
  Serial.print("IR_Sensivitity\t");
  for (byte pin=0; pin<8; pin++) {
    ir_Sensitivity[pin] = ir_Sensitivity[pin] / 100;
    Serial.print(String(ir_Sensitivity[pin]) + "\t\t");
  }
  Serial.println();

  // Loop through #0~7 pins.
  Serial.print("IR_Value\t");
  for (byte pin=0; pin<8; pin++) {
    while (ir_Value[pin] <= ir_Sensitivity[pin] + min_Sensitive[pin]) {
      if(pin==0) {
        initTime = micros();
      }
      nowTime[pin] = micros() - initTime;
      ir_Value[pin] = analogRead(ir_Pin[pin]);
    }
    Serial.print(String(ir_Value[pin]) + "\t\t");
  }
  Serial.println();

  Serial.print("Now Time(us)\t");
  for (byte pin=0; pin<8; pin++) {
    Serial.print(String(nowTime[pin]) + "\t\t");
    ir_Value[pin] = 0;
    ir_Sensitivity[pin] = 0;
  }
  Serial.println();

  Serial.print("Interval(s)\t");
  for (byte pin=1; pin<8; pin++) {
    intervalTime[pin] = nowTime[pin] - nowTime[pin-1];
    float f_intervalTime = (float)intervalTime[pin] / 1000000.0;
    Serial.print("     " + String(f_intervalTime, 6) + "\t");
  }
  Serial.println();

  Serial.print("Distance(m)\t");
  for (byte pin=1; pin<8; pin++) {
    float f_Distance = (float)ir_Distance[pin] / 1000000.0;
    Serial.print("     " + String(f_Distance, 4) + "\t");
  }
  Serial.println();

  Serial.print("Displace.(m)\t");
    for (byte pin=1; pin<8; pin++) {
      float f_Displacemence = (float)ir_Displacemence[pin] / 1000000.0;
      Serial.print("     " + String(f_Displacemence, 4) + "\t");
    }
  Serial.println();

  // using a = 2(s - v_0*t) / t^2
  Serial.print("Accel.(m/s^2)\t");
  for (byte pin=1; pin<8; pin++) {
    //Serial.print("     " + String(initVelocity, 4) + "\t");
    float f_numerator = 2*(ir_Displacemence[pin]-(initVelocity*nowTime[pin]));
    //Serial.print("     " + String(f_numerator) + "\t");
    unsigned long l_numerator = (unsigned long)f_numerator;
    //Serial.print("     " + String(l_numerator) + "\t");
    float f_denominator = pow(nowTime[pin], 2) * pow(10, -6);
    //Serial.print("     " + String(f_denominator) + "\t");
    unsigned long l_denominator = (unsigned long)f_denominator;
    //Serial.print("     " + String(l_denominator) + "\t");
    acceleration[pin] = (float)l_numerator/(float)l_denominator;
    Serial.print("     " + String(acceleration[pin]) + "\t");
  }
  Serial.println();

  for (byte pin=1; pin<8; pin++) {
    sum_Accel = sum_Accel + acceleration[pin];
  }
  float ave_Accel = sum_Accel / 7.0;
  Serial.print("Gravitational Acceleration = ");
  Serial.print(ave_Accel); Serial.println(" m/s^2");
  Serial.println();  Serial.println();
  delay(1500);
}
```

<br>

※ 스케치 내부에서 사용하는 시간과 거리의 단위는 소수 자리수 계산의 편의를 위해 microsecond, micrometer를 사용하며, 출력시에 second, meter 단위로 변환한다. 

<br>

<br>

#### 실험 결과

##### 예비 실험

예비 실험은 파이프 없이 브레드 보드를 사용한 프로토 타입으로 실시하였다. 센서 간격이 원래의 계획보다 작기 때문에 아래와 같이 설정하였다. 입구부터 첫번째 센서까지의 거리 1.4cm, 각 센서간의 거리는 2.54cm이며, 6번째~7번째 센서의 간격만 3.33cm 이다.

~~~Arduino
// for testing distance of 8 sensors in micrometer unit
unsigned long ir_Distance[8] = {14000, 25400, 25400, 25400, 25400, 25400, 33300, 25400};
~~~

<br>

브레드 보드에 배선을 하고 수직으로 세운 뒤, IR LED와 Phototansistor 사이에 스티로폼 공과 쇠구슬을 차례로 낙하시킨다. 질량이 다른 물체의 낙하 속도를 비교할 수 있다. 

{{< figure src="/image/Gravitational-Acceleration07.jpg" width="75%" class="center" >}}

<br>

스티로폼 공은 집에 있는 스티로폼을 커터칼로 적당히 구 형태로 잘라낸 뒤, 손바닥과 바닥 사이에 놓고 손바닥에 살짝 힘을 주어 누르면서 돌돌 굴리면 스티로폼 공 형태를 쉽게 만들 수 있다.

{{< figure src="/image/Gravitational-Acceleration08.png" width="75%" class="center" >}}

<br>

##### 결과

스티로폼 공과 쇠구슬 2종류를 사용하였고, 몇 차례 시도한 결과 다음과 같은 결과가 나왔다.

| 센서                | Y<sub>0</sub>   | Y<sub>1</sub>       | Y<sub>2</sub>       | Y<sub>3</sub>       | Y<sub>4</sub>       | Y<sub>5</sub>       | Y<sub>6</sub>       | Y<sub>7</sub>       |
| ------------------- | ---- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| NowTime(us)         | 1    | 35232    | 62407    | 81854    | 100329   | 117774   | 141384   | 141428   |
| Interval(s)         |      | 0.035231 | 0.027075 | 0.019547 | 0.018475 | 0.017445 | 0.023610 | 0.000044 |
| Distance(m)         |      | 0.0254   | 0.0254   | 0.0254   | 0.0254   | 0.0254   | 0.0254   | 0.0254   |
| Displace.(m)        |      | 0.0254   | 0.0508   | 0.0762   | 0.1016   | 0.1270   | 0.1603   | 0.1857   |
| Acceleration(m/s^2) |      | 11.18    | 9.35     | 9.94     | 9.74     | 9.41     | 8.63     | 11.16    |

∴ Gravitational Acceleration = 9.92 m/s²

<br>

#### 문제점 및 해결 방법

언제나 중력 가속도 9.81 m/s² 에 근접한 값이 나오는 것은 아니다. 

- 낙하시키는 물체가 센서나 브레드보드에 닿지 않도록 조심스럽게 낙하시켜야 한다. 조금이라도 충돌이 일어나면 가속도 값이 전혀 다른 값으로 출력된다.
  - 파이프를 사용하면 문제를 보완할 수 있을 것이다.

- 처음 물체를 잡고 낙하시키는 위치를 셋팅된 값과 일치시켜야 한다.
  - 셋팅값보다 멀리서(위에서) 낙하시키면 중력 가속도 값이 커지고, 반대로 가까이서(아래에서) 낙하시키면 중력 가속도 값이 작아진다. 

- 손에서 놓는 과정에서 발생하는 초기 속도의 오차는 지속적으로 발생한다.
  - 되도록이면 낙하 물체를 살짝 잡은 상태에서 낙하시키도록 한다.
  - 쇠구슬인 경우 전자석을 이용하거나, 솔레노이드 밸브 등의 사용을 고려할 필요가 있다. 

<br>

#### 실제 측정 장치

이민O 학생과 황정O 학생이 제작한 측정 장치의 외형이다.

{{< figure src="/image/Gravitational-Acceleration09.png" width="75%" class="center" >}}

각 센서부를 보호하고 외형을 돋보이게 하는 틀을 3D프린터를 사용하여 직접 제작한 뒤 덧붙인 모습이다. 중앙에 18650 배터리를 내장한 ESP32를 덧붙여 제작하였다.  

<br>

<br>

#### 대체 가능 센서

이 실험에서 사용한 IR LED와 Phototransistor의 조합은 여러가지 장점이 많지만, 배선이 복잡하다는 것은 제작하는 입장에서는 (특히 학생들이 제작을 한다면) 난감할 수 있다. 이럴 경우 다른 형태의 센서들로 대체할 수 있다.

|      | IRLED + <br>Phototransistor                                  | 포토 인터럽터                                                | 금속 감지기                                                  |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 가격 | 저렴, 쉽게 구할 수 있음. 타오바오에서 1세트당 0.1~0.5위안 (약 20원-100원) | 센서 간격 3~5cm인 제품은 가격이 비쌈 (타오바오에서 25-45위안) | 구경 3cm인 제품의 경우 타오바오에서 18위안 (단, 3cm 초과 제품은 매우 비쌈) |
| 종류 | 낙하물의 종류, 재질의 영향이 없다. <br>(고정이 가능하면 파이프를 사용하지 않아도 되므로) 낙하물이 크기가 큰 경우에도 가능 | 낙하물의 종류, 재질의 영향이 없다.<br>낙하물체의 길이가 5cm를  넘어가면 불가능 | 금속 낙하물만 가능<br>낙하물체의 직경이 3cm 이내 추천        |
| 전류 | 사용 전류가 작으므로 배터리홀더가 내장된 ESP32를 사용할 경우, 별도의 전원장지 없이도 (컴퓨터와 연결하지 않고) 독립적으로 사용할 수 있다. | 좌동                                                         | 개당 전류값이 0.3A로 큰 편이다.                              |
| 배선 | 저항을 2개 붙여야 하고, 배선이 복잡                          | 간편                                                         | 간편                                                         |
| 실외 | 불가                                                         | 불가                                                         | 가능                                                         |
| 기타 |                                                              | 크기가 작은 것은 본 실험에 부적합<br>구하기 어려움(단종여부 확인) |                                                              |

<br>

##### 포토 인터럽터

| TT Electronics OPB819Z                       | 泰邦工控 TBGK E3S-GS30                       |
| -------------------------------------------- | -------------------------------------------- |
| {{< figure src="/image/Gravitational-Acceleration04.png" width="75%" class="center" >}} | {{< figure src="/image/Gravitational-Acceleration05.png" width="75%" class="center" >}} |



##### 금속 감지기

{{< figure src="/image/Gravitational-Acceleration06.png" width="50%" class="center" >}}

위 제품은 [环形接近开关金属感应传感器](https://detail.tmall.com/item.htm?spm=a1z0d.6639537.1997196601.4.77eb7484HSzCG2&id=620286916175#)이라는 이름으로 타오바오에서 판매하고 있는 금속감지센서이다. 구경 3cm (30mm孔径, NPN型) 정도인 제품까지는 저렴한 가격(18위안, 약 3,000원)에 구입할 수 있다. 생김새만 보아서는 가장 쉽게 제작할 수 있을 것 같다. 단, 낙하물은 금속을 사용해야하며, 적당한 크기의 금속 구슬을 사용하면 될 것 같다. 외경 3cm 투명 아크릴 파이프에 일정한 간격으로 테이프를 두껍게 감은 뒤 감지기를 끼우는 형태로 설치하면 될 것 같다. 

