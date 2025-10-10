---
title: "STEM, Solar Tracker"
categories: ["science"]
toc: true
date: 2020-11-22T01:41:00+09:00
tags:
---

### Solar Tracker 만들기

팬(도리도리) & 틸트(끄덕끄덕)가 가능한 2축 서보모터 거치대와 2개의 서보모터를 사용하여 Solar Tracker를 만들어 보자.

<br>

#### 단계1: Solar Tracker Frame 3D Printing

![](/image/SolarTracker01.png)

[.stl 파일](/attach/Sun_Tracker_Gnomon_B.stl)  [.gcode 파일](/attach/Sun_Tracker_Gnomon_B.gcode)

3D 프린팅 후, 조도센서를 설치할 4곳에 1mm 드릴을 이용하여 각각 2개씩 구멍을 뚫는다 (총 8개). 

<br>

<br>

#### 단계2: 조도센서 조립하기

##### 조도센서 삽입

![](/image/SolarTracker02.png)

조도센서의 다리를 위에서 뚫은 구멍을 통해 넣은 뒤, 

![](/image/SolarTracker03.png)

뒤쪽에 글루건을 쏘아 고정시킨다. (조도센서는 극성을 구분할 필요가 없으므로, 서로 선이 맞닿지만 않으면 된다.)

4개의 조도 센서를 위와 같은 방식으로 고정한다.

<br>

##### 10kΩ 저항 연결

아래 그림과 같이 연결한다.

![](/image/SolarTracker04.png)

- 각 조도센서에 연결된 2개의 선 중 하나를 골라 10k 저항을 연결하고 한 뒤, 저항의 다른 쪽 끝을 모두 맞붙여서 GND에 연결한다.
- 조도센서의 다른 한쪽 끝을 모두 맞붙여서 ESP32의 3.3V에 연결한다.

![](/image/SolarTracker05.png)

- GND와 3.3로 연결되는 선들이 서로 붙지 않도록 절연테이프를 붙여준다.

  ![](/image/SolarTracker06.png)

- 각 조도센서와 10k 저항의 사이에 ESP32에 연결할 GPIO선을 하나씩 납땜하여 연결한다.


![](/image/SolarTracker07.png)

- ESP32의 3.3V와 GND에 연결할 선도 함께 납땜하여 연결한다.

  ![](/image/SolarTracker08.png)

- 선 모양을 잡아 정리한다. (위 사진에는 하트 모양처럼 양 옆으로 선이 나와 있지만, 추후 거치대 장착을 위해서는 아래 사진처럼 모두 오무려주어야 한다.)

  ![](/image/SolarTracker09.png)

<br>

<br>

#### 단계3: 2축 서보모터 거치대에 장착하기

![](/image/SolarTracker10.png)

<br>

##### schematic

![](/image/SolarTracker11.png)

<br>

##### sketch

```C
/************ ESP32 SKETCH FOR SOLAR TRACKER ***************************************
   Author: K. Jun, Lee
   Blog: https://stemwith.github.io         2020-12-04

// Use 3.3V for LDR sensor VCC
// Edit your sensor sensitivity: tolh, tolv
// Edit your sensor GPIO pin: ldr_lt, ldr_rt, ldr_ld, ldr_rd
// Edit initial sensor calibration value: avlt_cali, avrt_cali, avld_cali, avrd_cali 
***********************************************************************************/

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

int deg_hori = 90; // default horizon
int deg_vert = 45; // default vertical
int duty;

// LDR sensor pin
int ldr_lt = 32; // Left_Top LDR pin
int ldr_rt = 33; // Right_Top LDR pin
int ldr_ld = 34; // Left_Down LDR pin
int ldr_rd = 35; // Right_Down LDR pin

// LDR sensor value
int lt[10];
int rt[10];
int ld[10];
int rd[10];

// Sensitivity (tolerance)
int tolh = 150;              // horizon tolerance
int tolv = 150;              // vertical tolerance

// initial sensor correction value 
int avlt_cali = 0;       // 초기값 보정
int avrt_cali = 350;     // (센서에 밝은 빛을 직접 가하여 최대값을 측정한 뒤 편차를 사용)
int avld_cali = 330;
int avrd_cali = 430;


void setup() {
  Serial.begin(115200);

  // Servo PWM Setup
  ledcSetup(ledChannel_hori, freq_hori, resolution_hori);  // PWM CH1, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_hori, ledChannel_hori);             // PWM CH1을 GPIO 19번으로 출력
  ledcSetup(ledChannel_vert, freq_vert, resolution_vert);  // PWM CH0, Frequncy 50 Hz, 16bit resolution
  ledcAttachPin(ledPin_vert, ledChannel_vert);             // PWM CH0을 GPIO 19번으로 출력
}

void loop() {

  int avlt = 0;
  int avrt = 0;
  int avld = 0;
  int avrd = 0;

  for (int i=0; i<10; i++) {
    lt[i] = analogRead(ldr_lt); // Left Top
    avlt = avlt + lt[i] - avlt_cali;  
    rt[i] = analogRead(ldr_rt); // Right Top
    avrt = avrt + rt[i] - avrt_cali;
    ld[i] = analogRead(ldr_ld); // Left Down
    avld = avld + ld[i] - avld_cali;
    rd[i] = analogRead(ldr_rd); // Right Down
    avrd = avrd + rd[i] - avrd_cali;
  }

  avlt = avlt / 10;
  avrt = avrt / 10;
  avld = avld / 10;
  avrd = avrd / 10;
  
  int avt = (avlt + avrt) / 2;    // Average of Top value
  int avd = (avld + avrd) / 2;    // Average of Down value
  int avl = (avlt + avld) / 2;    // Average of Left value
  int avr = (avrt + avrd) / 2;    // Average of Right value.

  int dvert = avt - avd;      // Difference Top, Down
  int dhoriz = avl - avr;     // Difference Left, Right

  Serial.println("LT\tRT\tLD\tRD\tav.T\tav.D\tav.L\tav.R\td.ver\td.hor");
  Serial.print(avlt);Serial.print("\t");Serial.print(avrt);Serial.print("\t");
  Serial.print(avld);Serial.print("\t");Serial.print(avrd);Serial.print("\t");
  Serial.print(avt);Serial.print("\t");Serial.print(avd);Serial.print("\t");
  Serial.print(avl);Serial.print("\t");Serial.print(avr);Serial.print("\t");
  Serial.print(dvert);Serial.print("\t");Serial.print(dhoriz);Serial.println("\t\n");

  if (abs(dvert) > tolv) {      // sensitivity
    if (avt < avd) {            // 아래쪽 센서가 더 밝으면
      deg_vert = ++deg_vert;
      if (deg_vert > 90) {
        deg_vert = 90;
      }
    }
    else if (avt > avd) {       // 윗쪽 센서가 더 밝으면,
      deg_vert = --deg_vert;
      if (deg_vert < 0) {
        deg_vert = 0;
      }
    }
    servoWrite(ledChannel_vert, deg_vert);
  }

  if (abs(dhoriz) > tolh) {     // sensitivity
    if (avl > avr) {            // 왼쪽 센서가 더 밝으면
      deg_hori = --deg_hori;
      if (deg_hori < 0) {
        deg_hori = 0;
      }
    }
    else if (avl < avr) {       // 오른쪽 센서가 더 밝으면
      deg_hori = ++deg_hori;
      if (deg_hori > 180) {
        deg_hori = 180;
      }
    }
    else if (avl == avr) {
      // nothing
    }
    servoWrite(ledChannel_hori, deg_hori);
  }
  delay(500);
}

// deg는 0~180도 까지
void servoWrite(int ch, int deg)
{
    duty = map(deg, 0, 180, 1638, 8192);
    ledcWrite(ch, duty);
    delay(50);                  // delay를 줄이면 180도가 완전히 돌지 않음 (최소값 15)
}
```

<br>

<br>

### 태양광 패널의 전압 측정하기

MPPT모듈을 만들기 전, 태양광패널에서 만들어지는 전기의 전압을 측정해본다. ESP32의 경우 내부전압 3.3V, 12bit ADC이므로

```C
// ESP32 3.3V -> 3.21 , Arduino 5.0V -> 4.89
const float referenceVolts = 3.21;
```

```C
// ESP32 12bit_ADC (4095.0), Arduino 10bit_ADC (1023.0)
float volts = (referenceVolts/4095.0)*val*1000;
```

를 사용한다.

<br>

#### schematic
![](/image/SolarMPPT01.png)

<br>

#### sketch
```C
// ESP32 3.3V -> 3.21 , Arduino 5.0V -> 4.89
const float referenceVolts = 3.21; 

void setup() {
  Serial.begin(9600);
}

void loop() {
  float volts_sum = 0;
  for (int i=0; i<=10; i++) {
    int val = analogRead(32);
      
    // ESP32 12bit_ADC (4095.0), Arduino 10bit_ADC (1023.0)
    float volts = (referenceVolts/4095.0)*val*1000; 
    volts_sum = volts_sum + volts;
    delay(100);
  }
  
  volts_sum = volts_sum / 10;
  Serial.print("V = ");
  Serial.print(volts_sum);
  Serial.println(" mV");
  delay(100);
}
```

<br>

