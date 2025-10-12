---
title: "Arduino, Geiger Counter"
categories: ["science"]
date: 2020-08-23T17:57:00+09:00
toc: true
tags:
---
※ SAT Subject Chemistry: Pactice Test
```
Used to detect radioactivity.
① Calorimeter
② Geiger Counter
③ Burette
④ Funnel
⑤ Bunsen Burner
```

<br>

### 가이거 계수기

* 방사선을 측정할 수 있는 관으로  방사능 입자 하나하나를 셀 수 있다. 1908년 러더퍼드의 제자 요하네스 한스 빌헬름 가이거(Johannes Hans Wilhelm Geiger)가 알파선을 감지할 수 있는 감지기를 개발하였으며, 그 후 1928년 가이거와 가이거의 제자인 발터 뮐러가 함께 개량하여 모든 전리방사선을 감지할 수 있도록 만든 것이 현재의 가이거-뮐러 튜브(GM Tube)이다.
* 원리: 튜브는 비활성 기체가 충전된 상태이며  중심 전극(+극, anode)과 관의 내벽(-극, cathode, 금속이나 흑연으로 코팅)으로 구성되어 있다. 여기에 수백V의 전압을 걸면, 관 안에 걸린 높은 전기장 때문에 이온은 음극을 향해 가속되고, 전자는 양극을 향해 가속되며 운동에너지를 얻게 되며 이동 중에 충돌한 기체분자도 함께 전이된다. 이렇게 가스 안에 하전입자의 붕괴가 일어나면 음극에서 양극을 향해 짧고 강한 펄스전류가 순간적으로 나타나 흐르게 된다. 이 펄스전류가 '스피커'를 지날때 반응음으로 가이거 계수기 특유의 '틱티티틱'하는 소리가 만들어지는데, 이것이 '방사선이 존재한다'는 상황을 알려주는 소리이다. 그리고 이 소리 1개음이 방사능 입자 1개에 대한 대응 신호가 된다.  오래된 방식이지만 오늘날에도 큰 변화 없이 이 원리를 응용하여 방사선을 측정하고 있다.
* 단점: 상당히 큰 펄스신호를 얻을 수 있지만, 이 전류의 강도는 방사선이 가진 에너지와 비례관계를 나타내는 것은 아니기때문에, 방사선이 가진 에너지를 측정하는 것은 불가능하다. (방사선의 에너지를 알기 위해서는 비례계수관을 사용해야 한다.) 또한 고준위 방사선의 경우에는 전류가 연속적으로 흐르게 되어 펄스의 횟수를 계수할 수 없게 되는 경우도 있다. (주로 500cps 이상의 경우) 이것을 막기 위해 전자의 흐름을 제어하는 별도의 장치를 부착하거나, 신틸레이터(scintillator)나 이온화 챔버 같은 다른 검출기로 계측한다.
* 가이거 카운터에 사용하는 튜브관은 여러 종류가 제조되고 있다. 대부분의 GM관은 감마선과 2.5MeV 이상의 베타선을 검출한다. 감마선의 검출 감도는 좋지는 않다. GM관 안의 가스밀도가 낮아서, 투과력이 높은 감마선은 상호작용을 일으키기 어렵기 때문이다. 중성자선은 가스로부터 전리하지 않기때문에 검출하지 못한다. 하지만, 관 안쪽을 붕소로 코팅하거나, 삼불화붕소 아니면 ³He가스를 충전하면 중성자선에도 반응하는 GM관을 만들 수 있다. 중성자는 붕소원자핵과 반응하여 알파선을 생성하거나,  ³He원자와 반응하여 수소와 트리튬이온과 전자를 생성하므로 이 전하입자들이 붕괴를 발생시킨다. 각 튜브마다 검출하는 입자가 다르기 때문에, CPM(Count Per Minute) 단위를 uSv/h(Sieverts Per Hours) 단위로 바꾸기 위한 Conversion Factor가 모두 다르다. 그러므로 사용하는 튜브관이 어떤 것인지 정확하게 알아두어야 한다. 
* GM관은 하드웨어 난수발생기로서 이용할 수도 있다.
* Background Radiation: 자연적으로 존재하는 자연 방사선, 즉 Background Radiation의 경우 J305β 튜브관을 사용할때 평균 15.6 CPM이 측정된다. (주변 상황에 따라 조금씩 달라짐)

<br>

#### 라이브러리 추가하기
*   Wire : 기본 내장 라이브러리
*   LiquidCrystal I2C (by Frank de Brabander) 검색하여 설치

<br>

#### schematic (for standalone)
{{< figure src="/image/Geiger-Counter.png" width="100%" class="center" >}}

| GM Monule    | GND  | 5V   | VIN  |       |      |      |           |
| ------------ | ---- | ---- | ---- | ----- | ---- | ---- | --------- |
| Arduino      | GND  | 5V   | D2   | VIN   | A4   | A5   | PowerJack |
| 1602 LCD I2C | GND  | VCC  |      | (VCC) | SDA  | SCL  |           |
| 9V battery   |      |      |      |       |      |      | (+)(-)    |

* 외부로 들고 다니면서 측정할 수 있도록 9V 배터리 1개를 추가하여 Arduino, 1602 LCD, GM Molule을 모두 작동시킬 수 있도록 하였다.

<br>

#### sketch
```C
/* --------------------------------------------------------------------------------------
* WHAT IS CPM?
* CPM (counts per minute) is events quantity from Geiger Tube you get during one minute.
* Usually it used to calculate a radiation level.  
* Different GM Tubes has different quantity of CPM for background.
* Some tubes can produce about 10-50 CPM for normal background,
* other GM Tube models produce 50-100 CPM or 0-5 CPM for same radiation level.
* Please refer your GM Tube datasheet for more information. 
* Just for reference here, SBM-20 can generate about 10-50 CPM for normal background.
* --------------------------------------------------------------------------------------*/

// This Sketch counts the number of pulses a minute.
// Connect the GND on Arduino to the GND on the Geiger counter.
// Connect the 5V on Arduino to the 5V on the Geiger counter.
// Connect the VIN on the Geiger counter to the D2 on Arduino.

// For I2C 1602 LCD : VCC-5V / GND-GND / SDA-A4 / SCL-A5
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// I2C address: 0x20~0x27 or 0x3F
LiquidCrystal_I2C lcd(0x27, 16, 2);  

int cpm;
float sievertshour; // for converting from cpm to sieverts/hour
//float sieverts; // for converting from cpm to sieverts  
unsigned long counts; //variable for GM Tube events
unsigned long previousMillis; //variable for measuring time

#define LOG_PERIOD 60000 // count rate (1 minute)
#define CONV_FACTOR 0.008120 // for GM tube of J305beta type

void setup() { //setup
  counts = 0;
  Serial.begin(9600);
  pinMode(2, INPUT);

  lcd.init();               // lcd 초기화
  lcd.backlight();
  
  attachInterrupt(digitalPinToInterrupt(2), impulse, FALLING); //define external interrupts
}

void loop() {
  lcd.setCursor(0,0);
  lcd.print("CPM:");
  lcd.setCursor(9,0);
  lcd.print(" #:");
  lcd.setCursor(12,0);
  lcd.print(counts);
  lcd.setCursor(0,1);
  lcd.print("uSv/h:");
  //lcd.print("uSv  :");
  
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis > LOG_PERIOD) {   //every 1 minute
    previousMillis = currentMillis;

    lcd.clear();
    lcd.setCursor(5, 0);
    cpm = counts;
    lcd.print(cpm); //Display CPM
    Serial.println(cpm);
    sievertshour = cpm * CONV_FACTOR;
    //sieverts = sievertshour * 356 * 24;
    lcd.setCursor(7,1);
    lcd.print(sievertshour);
    //lcd.print(sieverts);
     
    counts = 0;
  }
}

void impulse() { // called every time there is a FALLING signal at pin 2
  counts++;
}
```

<br>

#### sketch : for ESP8266 (Geigerzaehler-LCD-ESP.ino)

```C
/*************ARDUINO SKETCH FOR GEIGER COUNTER******************
Author: RH Electronics www.radiohobbystore.com / www.mygeiger.org
*****************************************************************
This sketch can be used with DIY Geiger Counter board. It allow
to receive CPM data during minute. You can modify the sketch
for your needs.
*****************************************************************
LCD I2C Connection:
LCD SDA -> D10  =  1
LCD SCL -> D9   =  3
VCC to +3,3V and ground
****************************************************************/

// include the library code:
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <Wire.h>

#define LOG_PERIOD 15000  //Logging period in milliseconds, recommended value 15000-60000.
#define MAX_PERIOD 60000  //Maximum logging period without modifying this sketch
#define PERIOD 60000.0 // (60 sec) one minute measure period

volatile unsigned long CNT; // variable for counting interrupts from dosimeter
unsigned long counts;     //variable for GM Tube events
unsigned long cpm;        //variable for CPM
unsigned int multiplier;  //variable for calculation CPM in this sketch
unsigned long previousMillis;  //variable for time measurement
unsigned long dispPeriod; // variable for measuring time
unsigned long CPM; // variable for measuring CPM

const int inputPin = 4;  // pin D2 is VIN on geiger counter

// initialize the library with the numbers of the interface pins
LiquidCrystal_I2C lcd(0x3F,20,4);

void setup() {               // setup
Wire.begin(1,3);
lcd.begin(20, 4);
lcd.init();
// Turn on the backlight.
lcd.backlight();

CNT = 0;
CPM = 0;
dispPeriod = 0;
attachInterrupt(digitalPinToInterrupt(inputPin), GetEvent, FALLING); // Define interrupt D2 on falling edge
}

void loop() {           // main loop
lcd.setCursor(0,0);
lcd.print("Berlin-Siemensstadt");
lcd.setCursor(0,1);
lcd.print("   Geiger Counter ");
lcd.setCursor(0,2); // print text and CNT on the LCD
lcd.print("CPM:");
lcd.setCursor(0,3);
lcd.print("CNT:");
lcd.setCursor(5,3);
lcd.print(CNT);
if (millis() >=dispPeriod + PERIOD) { // If one minute is over
cleanDisplay(); // Clear LCD
// Do something about accumulated CNT events....
lcd.setCursor(5, 2);
CPM = CNT;
lcd.print(CPM); //Display CPM
CNT = 0;
dispPeriod = millis();
}
}

void GetEvent(){           // Get Event from Device
CNT++;
}

void cleanDisplay (){      // Clear LCD routine
lcd.clear();
lcd.setCursor(0,0);
lcd.setCursor(0,0);
}
```

(출처: rhelectronics.net)

<br>

<br>

### Conversion Index & Background Radiation

CPM값은 사용하는 GM tube의 종류에 따라 다르게 측정된다. 왜냐하면, GM tube의 종류에 따라 감지할 수 있는 방사능의 종류가 다르기 때문이다. 그러므로 제조회사에서 제공하는 Conversion Index 값을 사용하여 CPM값을 Sieverts 단위로 바꿔주어야 한다.

예를들어, 위 sketch에서 사용한 J305β tube관은 CONV_FACTOR값이 0.008120이다. 이 값의 유도과정은 다음과 같다.

* 제조사에서 제공하는 J305β 스펙 :  **65 cps/µR/s for 60Co** (cps: count per second, µR = microRem)
* 이것은 1µR/s = **65cps** 임을 뜻한다. (즉 1mR/s = **65000cps**)
* 1mR/h = 65000cps / (60 × 60) = 18.06cps
* 18 cps/mR/h = 18 × 60 cpm/mR/h  = 1080 / 8.77 cpm/µSv/h = 123.14 cpm/µSv/h (※1mR = 8.77μSv)
* ∴ Conversion Index = 123.14 
* 123CPM = 1μSv/h   →   1CPM = 0.008120 μSv/h
* ∴ CONV_FACTOR = 0.008120
* CPM × CONV_FACTOR  = μSv/h

<br>

이 CONV_FACTOR값에 24*365를 곱하면 Sv 단위의 값을 만들어 낼 수도 있다.  

* 만일 어떤 지역에서 J305β tube를 사용하여 측정한 CPM값이 20이라면,
* 20×0.008120 = 0.1624μSv/h 에 해당하는 방사선이 검출되는 것이며
* 이는 0.1624 × 24 × 365 = 1422.6 μSv를 뜻한다. 방사능 생활척도를 통해 일반적인 배경복사보다는 다소 낮은 수준이라는 것을 알 수 있다.

<br>

| tube    | Conversion Index | CONV_FACTOR | Background Radiation (CPM) |
| ------- | ---------------- | ----------- | -------------------------- |
| J305β   | 123.14           | 0.008120    | 15.6                       |
| SBM-20  | 175.4            | 0.0057      | 23.4                       |
| M4011   | 153.8            | 0.006502    |                            |
| LDN-712 |                  | 0.01        |                            |

<br>

<br>


### 방사능 생활척도

밀리시버트(mSv)는 X선, PET, CT 등과 같은 의료 검진시 발생하는 유효 노출을 측정하는 경우 사용된다. 일상생활에서 노출되는 방사선량은 다음과 같다. (출처: 위키피디아)

- 10 μSv – 오늘받은 평균 방사선

- 0.02 ~ 0.04 mSv = 20 ~ 40 μSv – 흉부 X-레이

- 40 μSv – 뉴욕에서 L.A.까지 비행기를 타면받는 방사선

- 100 μSv – 치과 용 X- 레이 동안받는 방사선

- 0.24 mSv – 해수면에 도달하는 우주입자선 (연간) 

- 0.28 mSv – 지하로부터 나오는 지상 방사선 (연간) 

- 800 μSv – 사고 기간 동안 Three-Mile Island의 총 방사선 량

- 2 mSv – 미국 가정의 연 평균 라돈 방사선 양

- 3000 μSv – 유방 조영술의 방사선 량

- 3650 μSv (= 10 μSv per day = 0.081 μSv/h) = 2.5 ~ 3.5 mSv – 일반적인 배경복사 (장소에 따른 편차가 큼)

  ​                        ※ 호주 1.5 mSv, 미국 3 mSv, 이란, 인도, 유럽의 연간 배경 방사선 양 : 50 mSv

- 0.8 ~ 5 mSv – 뇌 CT 스캔

- 6 ~ 18 mSv – 흉부 CT 스캔

- 6.2 mSv – 미국인 연 평균 방사선 노출량

- 9 mSv – 뉴욕-동경간 항공 승무원이 받는 연간 방사선 양

- 14 mSv – 내장기관 X-레이

- 20 mSv – 핵관련 종사자 연간 허용치

- 50000 μSv – 연간 최대 허용 직업 선량

  ​                       ※ 시간당 최대 방사능 = 50000 μSv / (24 * 365) = 5.70 μSv/h

- 100000 μSv – 암 위험 증가와 관련이 있을 가능성이 높은 연간 최저 용량

- 80~160 mSv – 하루 담배 1.5갑씩 1년을 필 때

- 350 mSv – 체르노빌 사태 후 이주를 결정한 근거 (매년)

- 1 Sv = 1000000 μSv – 약간의 혈액 변화 유발

- 2 Sv = 2000000 μSv – 심각한 방사선 중독 (때로는 치명적)

- 2 ~ 5 Sv = 2000000 ~ 5000000 μSv – 메스꺼움, 탈모, 출혈을 유발, 많은 경우 사망

- 6 Sv = 6000000 μSv – 2개월 이내에 80% 이상 사망

<br>

#### Radiation Cartooon

{{< figure src="/image/RADIATION-Poster-Cartoon.jpg" width="75%" class="center" >}}

<br>

<br>

### Electrical Information for GM Tubes

| Tube          | Working Voltages | Nominal Voltage | Anode Resistor | Dead Time μs | Detection  |
| ------------- | ---------------- | --------------- | -------------- | ------------ | ---------- |
| SBM-20        | 350 ~ 450V       | 400V            | 4M7            | 100 ~ 190    | β, γ       |
| SBM-19        | "                | "               | 4M7            | 125 ~ 250    | β, γ       |
| SBT-10        | "                | "               | 4M7            | 65           | β, γ       |
| SI29BG        | "                | "               | 4M7            | 95           | β, γ       |
| SI21BG        | "                | "               | 10M            | 30           | β, γ       |
| SBT-9         | "                | 380V            | 4M7            | 50 ~ 100     | α, β, γ    |
| SBT-11A       | "                | 390V            | 3M3 ~ 4M7      | 75           | α, β, γ    |
| SI-22G        | "                | 400V            | 10M            |              | γ          |
| SI180G        | "                | "               | 4M7            |              | γ          |
| LND-712       | 450 ~ 650V       | 500V            | 10M            | 90           | α, β, γ    |
| LND-7317      | 475 ~ 675V       | "               | 4M7            | 40           | α, β, γ    |
| Philips 18504 | 425 ~ 675V       | "               | 10M            | 100          | α, β, γ, n |

(출처: rhelectronics.net)