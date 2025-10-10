---
title: "드론 Part1 기체 조립"
categories: ["drone"]
date: 2021-08-01T18:27:53+09:00
toc: true
tags:
---

<br>

### 드론 조립

#### S500 기체 조립

{{< figure src="/image/d/drone1_01.png" width="75%" class="center" >}}

* 전원부: 아래 3가지 방법중 1가지 방법을 선택하여 구성 
  * S500 기판 오른쪽에 있는 (+), (-) 단자에 납을 크게 먹인 뒤, AWG12 와이어를 붙이고, 반대쪽 끝은 (사용할 LiPo 배터리의 단자 형태를 고려하여) XT60 Male 혹은 Deans (T plug) 단자를 납땝하여 연결한다.
  * (사용할 LiPo 배터리의 단자가 XT60인 경우) S500 기판 하단에 있는 단자 구멍 중 오른쪽 부분에 XT60 Male 단자를 직접 붙인다.
  * (사용할 LiPo 배터리의 단자가 Deans인 경우) S500 기판 하단에 있는 단자 구멍 중 왼쪽 부분에 Deans (T plug) Male 단자를 직접 붙인다.
* 1번, 2번 모터
  * CCW회전을 해야 함 → 매장에서 모터 구입시 **CW모터** 구입
  * S500 기판의 1번, 2번 위치의 (+), (-) 단자에 납을 크게 먹인 뒤, ESC의 (+), (-) 선을 납땜하여 연결한다.
  *  방향표시가 없는 모터를 구입한 경우
    * ESC의 (+)와 연결되어 있는 단자(위 그림에서는 ESC의 C단자)에 모터의 (-)선을 연결
    * ESC의 (-)와 연결되어 있는 단자(위 그림에서는 ESC의 A단자)에 모터의 (+)선을 연결

* 3번, 4번 모터

  * CW회전을 해야 함 → 매장에서 모터 구입시 **CCW모터** 구입

  * S500 기판의 3번, 4번 위치의 (+), (-) 단자에 납을 크게 먹인 뒤, ESC의 (+), (-) 선을 납땜하여 연결한다.

  * 방향표시가 없는 모터를 구입한 경우
    * ESC의 (+)와 연결되어 있는 단자(위 그림에서는 ESC의 C단자)에 모터의 (+)선을 연결
    * ESC의 (-)와 연결되어 있는 단자(위 그림에서는 ESC의 A단자)에 모터의 (-)선을 연결

* ESC의 signal선
  * 1번 모터의 ESC signal: 픽스호크 뒷면의 1번 채널핀에 연결 (이때, 흰색선은 S, 회색선은 (-)에 연결)
  * 2~4번 모터의 ESC signal도 동일한 방법으로 픽스호크 뒷면에 연결

<br>

* 드론 날개에 모터 조립

{{< figure src="/image/d/drone1_02.png" style="zoom: 25%;" class="center" >}}

* 모터에 ESC를 연결한 후, 케이블타이를 이용하여 선을 정리한다.

{{< figure src="/image/d/drone1_03.png" style="zoom: 25%;" class="center" >}}

* (위 그림에서는 하지 않았으나) 길이를 맞춰 짧게 자른 뒤 연결하는 것이 좋음. ESC와 모터선을 짧게 잘라 재연결하는 경우, 아래와 같은 3.5파이 바나나잭을 사용한다. 일반적으로 모터에 바나나잭 male 단자를 사용하며, ESC에는 female 단자를 사용한다.

{{< figure src="/image/d/drone1_05.png" style="zoom: 50%;" class="center" >}}

* 이후에 드론 지지대와 랜딩스키드를 설치한다.

{{< figure src="/image/d/drone1_04.png" style="zoom: 100%;" class="center" >}}

{{< figure src="/image/d/drone1_06.png" style="zoom: 33%;" class="center" >}}

* 배터리 설치 가이드 부착 (짐벌이 없으면 중앙에 설치하고, 짐벌을 설치할 예정이면 뒤쪽에 설치)

{{< figure src="/image/d/drone1_07.png" class="center" >}}

<br>

#### 수신기 연결

* 수신기를 기체에 고정 (FrSky X8R의 경우 송수신기 바인딩에 사용하는 버튼이 수신기 윗면에 위치하므로, 바인딩을 먼저 한 후 설치하는 것을 추천!)

{{< figure src="/image/d/drone1_08.png" width="150%" class="center" >}}

* FrSky X8R의 S.Bus를 이용하는 경우
  * 아래 그림과 같이 픽스호크의 RC단자에 순서대로 연결한다. (※SB단자를 사용하는 것이 아님)

{{< figure src="/image/d/drone1_09.png" width="150%" class="center" >}}

* Devo RX701과 PWM to PPM encoder를 이용하는 경우 (선 색깔은 제품별로 다를 수 있음)

{{< figure src="/image/d/drone1_10.png" width="150%" class="center" >}}

​		

| 커넥터                       | 수신기 RX701 | 색깔   | 픽스호크 |
| ---------------------------- | ------------ | ------ | -------- |
| (CH1에 붙어있는 제품도 있음) | GND          | 검     |          |
| (CH1에 붙어있는 제품도 있음) | VCC          | 적     |          |
| CH1                          | AILE         | 흰     |          |
| CH2                          | ELEV         | 주     |          |
| CH3                          | THRO         | 노     |          |
| CH4                          | RUDD         | 초     |          |
| CH5                          | GEAR         | 파     |          |
| Ch6                          | AUX1         | 보     |          |
| CH7                          | AUX2         | 갈     |          |
| CH8                          | (없음)       | 회     |          |
| PPM                          |              | 검적흰 | RC IN    |

<br>

#### 상판 조립

* 상판을 올려 조립하고

{{< figure src="/image/d/drone1_11.png" class="center" >}}

* FC (픽스호크 등) 및 댐퍼를 설치한다. (댐퍼 크기가 제조사마다 달라서 나사로 고정이 안되는 경우가 있으며, 이럴 경우 케이블 타이를 사용하여 고정하여야 함)

{{< figure src="/image/d/drone1_12.png" class="center" >}}

* GPS 지지대를 이용하여 GPS 설치

{{< figure src="/image/d/drone1_13.png" width="150%" class="center" >}}

* 부저 연결

{{< figure src="/image/d/drone1_15.png" style="zoom: 33%;" class="center" >}}

* 스위치 연결

{{< figure src="/image/d/drone1_16.png" width="33%" class="center" >}}

* 픽스호크 상단 커넥터에 각 장치(전원, GPS(I2C&GPS 커넥터), 스위치, 부저 등)들을 연결한다.

{{< figure src="/image/d/drone1_14.png" class="center" >}}

<br>

<br>

### 픽스호크 핀아웃

※참고: https://ardupilot.org/copter/docs/common-pixhawk-overview.html

#### 후면 (수신기 및 ESC signal 연결)

{{< figure src="/image/d/drone1_17.png" width="150%" class="center" >}}

* Ⅰ : RC (Radio Control receiver input) ; 수신기 연결

* Ⅱ : SB (S.Bus output)  ※주의:S.Bus 수신기의 Input으로 사용하는 것이 아님!

* Ⅲ : Main output ; ESC 연결 (ESC의 ground와 signal만 연결하며 power rail은 연결하지 않음)

* Ⅳ : Auxiliary output

* Ground rail

* Power rail: servo power rail voltage, 5V (7V, up to 9.9V)

* Signal rail 

* 현재 운용중인 픽스호크의 후면 결선한 모습 (X8R 수신기: 파란색(-), 보라색(+), 초록색(signal))

{{< figure src="/image/d/drone1_18.png" style="zoom: 33%;" class="center" >}}

<br>

#### 상단

{{< figure src="/image/d/drone1_19.png" width="150%" class="center" >}}

* 1 Spektrum DSM receiver

* 2 Telemetry (OSD, on-screen display)

* 3 Telemetry (radio telemetry)

* 4 USB

* 5 SPI (serial peripheral interface) Bus

* **6 Power module**

* **7 Safety switch button**

* **8 Buzzer**

* 9 Serial

* **10 GPS module**

* 11 CAN (controller area network) Bus

* **12 I2C: GPS(Compass) module** or I2C splitter (I2C 포트 부족시 splitter 연결 가능)

{{< figure src="/image/d/drone1_20.png" width="150%" class="center" >}}

* 13 ADC (AnalogtoDigitalconverter6.6V)

* 14 ADC (AnalogtoDigitalconverter3.3V)

* 15 LED indicator

<br>

#### 측면

{{< figure src="/image/d/drone1_21.png" class="center" >}}

* 1 Input/Output reset button

* 2 SD card

* 3 Flight management reset button

* 4 microUSB port

<br>

<br>

### 프롭 설치

#### 프롭 회전 방향

{{< figure src="/image/d/drone1_22.png" width="125%" class="center" >}}               {{< figure src="/image/d/drone1_23.png" width="125%" class="center" >}}

<br>

#### 프롭 단면에서의 공기 흐름과 양력

* 프롭의 높은쪽으로 회전하는 경우: **양력 발생 (상승)**

 {{< figure src="/image/d/drone1_24.png" width="150%" class="center" >}}

* 프롭의 낮은쪽으로 회전하는 경우: **양력 감소 (하강)**

{{< figure src="/image/d/drone1_25.png" width="150%" class="center" >}}

* 프롭의 형태

  | CW프롭 (3,4번에 사용)                                  | CCW프롭 (1,2번에 사용)                                 |
  | ------------------------------------------------------ | ------------------------------------------------------ |
  | {{< figure src="/image/d/drone1_26.png" width="67%" class="center" >}} | {{< figure src="/image/d/drone1_27.png" width="67%" class="center" >}} |

* 모터, 프롭, 캡너트 사용방법

{{< figure src="/image/d/drone1_28.png" class="center" >}}

|                  | 1,2번                                       | 3,4번                                        |
| ---------------- | ------------------------------------------- | -------------------------------------------- |
| 모터             | CW 표기 모터 구입                           | CCW 표기 모터 구입                           |
| 프롭             | (위에서 내려다 볼 때) CCW 회전              | (위에서 내려다 볼 때) CW 회전                |
| 캡너트 고정할 때 | CW로 돌려 잠궈야만 프롭회전 시 풀리지 않음! | CCW로 돌려 잠궈야만 프롭회전 시 풀리지 않음! |
| 캡너트 풀때      | 캡너트를 CCW로 돌려서 풀어냄                | 캡너트를 CCW로 돌려서 풀어냄                 |

※ 캡너트를 풀어낼 때 → (위에서 내려다 볼 때의) 프롭 회전방향과 같은 방향으로 돌린다!

<br>

#### 단발 프롭 비행기

{{< figure src="/image/d/drone1_29.png" width="67%" class="center" >}}

<br>

* 매장에서 모터를 판매할 때는 캡너트가 나사산을 따라 조여지는 방향으로 표기하기 때문에, 블레이드 회전 방향과 정반대로 표기되어 있다. 즉, CCW 회전하는 1번/2번모터는 CW 모터로 표기하여 판매하고, CW 회전하는 3번/4번 모터는 CCW 모터로 표기하여 판매한다.

* 이렇게 방향을 반대로 쓰게 된 이유는 옛날부터 사용해왔던 단발 프롭 비행기로부터 유래한다. 예를 들어, 비행기 조종사가 조종석에 앉아 앞쪽의 프롭을 바라볼 때 프롭이 CCW로 돌고 있는 상황이 있다고 하자. 이 상태에서 프롭이 빠지지 않게 하려면, 프롭을 비행기에 끼우는 사람 입장에서도 모터캡(프롭너트)을 CCW로 돌려서 끼워 넣어야 했을 것이다. 그런데, 프롭을 끼우고 보니 프롭이 실제 돌아가는 방향을 보니 CW이다. 조종사는 프롭이 CCW로 돈다고 이야기하고, 프롭을 끼운 사람은 CW로 돌아가도록 고정시켰다고 이야기를 하고 있으니 같은 상황을 서로 반대로 보고 있는 것이다.

* 이와 같은 상황을 프롭 위쪽에서 드론을 내려다 보는 관찰자의 입장에 대입해보면 다음과 같다. CCW 회전하는 프롭의 경우, 이러한 움직임을 만들어 내기 위해 프롭을 돌리는 모터축은 CW로 회전을 해야 한다. 모터축이 CW로 회전을 할 때, 모터축에 끼워지는 프롭은 나사산을 따라 CW로 돌려져야만 프롭이 회전할수록 풀리지 않고 더욱 꽉 조여지게 된다.

* 이러한 이유로, 보유하고 있는 4개 모터의 나사산 방향이 모두 같다면 다음의 방법으로 문제를 해결해야 한다. 첫째, 나사산 방향이 반대인 프롭어댑터를 2개 구입하거나, 둘째, 나이록(niloc, nilon)너트 혹은 나이록후렌지 너트를 사용하여 고정시켜야 한다.

<br>

<br>

### BEC

#### 픽스호크용 BEC

{{< figure src="/image/d/drone1_30.png" width="150%" class="center" >}}

* 입력전압: 2S~6S(최대 28V)

* 출력전압: 5.3V

* 최대전류: 3A

* 최대측정전류: 90A

* 배터리 커넥터 규격: XT60

* 커넥터

  | Pin     | Signal  | V     |
  | ------- | ------- | ----- |
  | 1 (red) | VCC     | +5V   |
  | 2 (blk) | VCC     | +5V   |
  | 3 (blk) | Current | +3.3V |
  | 4 (blk) | Voltage | +3.3V |
  | 5 (blk) | GND     | GND   |
  | 6 (blk) | GND     | GND   |

<br>

<br>

### 배터리

LiPo 4S 14.8V 4200mAh 90C / XT60

{{< figure src="/image/d/drone1_31.png" class="center" >}}
