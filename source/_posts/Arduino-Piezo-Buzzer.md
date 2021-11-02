---
title: Arduino, Piezo Buzzer
categories:
  - arduino
date: 2018-09-07 17:23:00
tags:
---
# Piezo Buzzer
<br>

### Buzzer의 종류

| Active Buzzer (능동형 부저)                                  | Passive Buzzer (수동형 부저)                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 有源蜂鸣器 (KY-012)                                          | 无源蜂鸣器 (KY-006)                                          |
| 회로가 내장되어 있어, 전원만 인가하면 소리가 나므로 프로그램 제어가 편리함 | 내부에 진동원이 없어, 스케치에 주파수를 지정하여야만 소리를 냄 |
| 원하는 주파수의 소리를 낼 수 없음                            | 원하는 주파수의 소리를 만들어낼 수 있음                      |
| 패시브 부저에 비해 비쌈 (모듈 1개 0.9위안)                   | 액티브 부저에 비해 저렴 (모듈 1개 0.8위안)                   |
| ![](/image/Buzzer-active.png)                                | ![](/image/Buzzer-passive.png)                               |
| ![](/image/Buzzer-active3.png)                               |                                                              |
| ![](/image/Buzzer-active1.png)                               |                                                              |
| ![](/image/Buzzer-active2.png)                               | ![](/image/Buzzer-passive2.png)                              |

- 모듈로 판매하는 제품의 경우 겉모양으로는 구별이 어렵다. Active Buzzer의 경우 초기 판매시 스티커를 붙여서 판매하지만, 스티커가 떨어져 나간 상태라면 Passive Buzzer와 구별하기 어렵다. 또한 반드시 스티커가 붙은 형태로 판매하는 것도 아니다.
- Active Buzzer의 경우 스티커로 사용전압을 표시하기도 한다. 빨간색은 3V, 파란색은 5V, 보라색은 12V용이다.
- Active Buzzer 모듈의 경우 低电平触发(혹은 Low Level) / 高电平触发(혹은 High Level) 2가지 형태로 표기가 되어 있다. **低电平触发은 DigitalWrite에서 HIGH**일 때 소리가 나며, **高电平触发은 LOW**일 때 소리가 난다.
- 모듈 형태가 아닌 단일 부품의 형태라면 연결 핀이 나와 있는 아랫면을 보면 구별할 수 있다. 일반적으로 Active Buzzer는 검은색 실리콘으로 밀폐되어 있으며, Passive Buzzer는 핀의 접합부위가 그대로 노출되어 있다.
- Active Buzzer와 Passive Buzzer를 구별하는 가장 좋은 방법은 사용전압에 해당하는 전압(낮은 전압의 건전지도 가능)의 건전지를 연결시켜보는 것이다. 소리가 나면 Active, 나지 않으면 Passive라고 생각하면 된다.

<br>

<br>

### 주파수: Passive Buzzer 사용시 사용

- 0옥타브(C0~B0): 16~31(Hz) (초저주파)
- 1옥타브(C1~B1): 33~62(Hz)
- 2옥타브(C2~B2): 65~123(Hz)
  - 중저음
- **3옥타브(C3~B3): 131~247(Hz)**
  - 기본 음계에 해당하는 옥타브
- 4옥타브(C4~B4): 262~494(Hz)
  - 일반적으로 고음이라고 불리는 영역
  - 일반적인 남자의 경우 G4~B4음이 최고음
  - 음악의 기준음인 **가온 라(A4)(440Hz)**가 속한 영역
- 5옥타브(C5~B5): 523~988(Hz)
  - 일반적인 여성의 경우 D5의 음까지는 낼 수 있고, 고음을 잘 내는 경우 E5까지는 무난함
- 6옥타브(C6~B6): 1047~1976(Hz)
- 7옥타브(C7~B7): 2093~3951(Hz)
- 8옥타브(C8~B8): 4186~7902(Hz)
- 9옥타브(C9~B9): 8372~15804(Hz)
- 10옥타브(C10~B10): 16744~31608(Hz) (초음파)

<br>

- 한 옥타브 내려가면 주파수가 1/2배, 올라가면 2배가 되고, 한 음계 올라가면 2^(1/12) 배가 된다.

- 0옥타브 중간쯤(20Hz)부터나, 10옥타브 중간쯤(20kHz)부터는 소리가 들리지 않는다. 사람의 가청 영역을 벗어나기 때문. 이를 각각 초저주파, 초음파라고 한다. 어릴 수록 고음이 잘 들리기 때문에, "선생님은 못 듣는 벨소리"같은 것을 만들수 있다.

|       | 0    | 1    | 2     | 3    | 4       | 5     | 6      | 7      | 8    |
| ----- | ---- | ---- | ----- | ---- | ------- | ----- | ------ | ------ | ---- |
| C(도) | 16   | 33   | 65    | 131  | 262     | 523   | 1046.5 | 2093   | 4186 |
| C♯    | 17   | 35   | 69    | 139  | 277     | 554   | 1109   | 2217.5 | 4435 |
| D(레) | 18   | 37   | 73    | 147  | 294     | 587   | 1175   | 2349   | 4699 |
| D♯    | 20   | 39   | 78    | 156  | 311     | 622   | 1244.5 | 2489   | 4978 |
| E(미) | 21   | 41   | 82    | 165  | 330     | 659   | 1318.5 | 2637   | 5274 |
| F(파) | 22   | 44   | 87    | 175  | 349     | 698.5 | 1397   | 2794   | 5588 |
| F♯    | 23   | 46   | 92.5  | 185  | 370     | 740   | 1480   | 2960   | 5920 |
| G(솔) | 25   | 49   | 98    | 196  | 392     | 784   | 1568   | 3136   | 6272 |
| G♯    | 26   | 52   | 104   | 208  | 415     | 831   | 1661   | 3322.5 | 6645 |
| A(라) | 28   | 55   | 110   | 220  | **440** | 880   | 1760   | 3520   | 7040 |
| A♯    | 29   | 58   | 116.5 | 233  | 466     | 932   | 1865   | 3729   | 7459 |
| B(시) | 31   | 62   | 123.5 | 247  | 494     | 988   | 1975.5 | 3951   | 7902 |

<br>

## schematic
![](/image/Buzzer01.png)

<br>

## Pin Map
| Arduino | Active Buzzer | Passive Buzzer |
| ------- | ------ | ------- |
| 11    | S     | S      |
| 5V     | 표기없음  | 표기없음 |
| GND    | (-)   | (-)    |

<br>

<br>

## sketch : Active Buzzer

~~~C
void setup () {
  pinMode (11, OUTPUT);        // 11번 핀을 출력으로 설정
}

void loop () {
  digitalWrite (11, HIGH);     // 11번 핀 부저 ON
  delay (1000);
  digitalWrite (11, LOW);      // 11번 핀 부저 OFF
  delay (1000);
}
~~~

<br>

<br>

## sketch : Passive Buzzer
<br>

### tone() 사용방법

- tone 함수는 3개의 매개변수(핀, 주파수, 음길이)를 사용하며, 마지막 매개변수(음길이)는 생략 가능하다.

  ~~~C
  tone(11, 262, 500);   // 11번 핀에 연결된 부저에 C3음을 0.5초 연주
  ~~~

  

- 마지막 매개변수를 사용하지 않고 tone을 연속으로 사용하는 경우 주의가 필요하다. 예를들어,

  ~~~C
  tone(11, 262);   // 11번 핀에 연결된 부저에 C3음을 0.5초 연주
  tone(11, 294);   // 11번 핀에 연결된 부저에 D3음을 0.5초 연주
  ~~~

  이렇게 tone을 연속으로 사용하면 C3음을 소리낸 이후에, D4음을 내는 것이 아니라 C3음이 계속되므로, noTone함수를 사용하여 소리 출력을 멈추어야 한다.

  ~~~C
  tone(11, 262);   // 11번 핀에 연결된 부저에 C3음을 0.5초 연주
  noTone(11);
  tone(11, 294);   // 11번 핀에 연결된 부저에 D3음을 0.5초 연주
  ~~~



- 마지막 매개변수를 사용할 때, 중간에 음을 멈추는 구간을 만들려면, delay를 사용한다.

  ~~~C
  tone(11, 262, 500);   // 11번 핀에 연결된 부저에 C3음을 0.5초 연주
  delay(600);
  tone(11, 294, 500);   // 11번 핀에 연결된 부저에 D3음을 0.5초 연주
  ~~~

  C3음을 0.5초 소리낸 후 delay(600) 에 의해 0.6초를 쉬는 것이 아니라, delay(600) 의 시간 중, 0.5초는 C3음을 소리내는 데 사용하고, 나머지 0.1초를 쉰다.

<br>
<br>

### 도레미파솔라시도

~~~C
const int BUZZER_PIN = 11;
 
const int C_4 = 261;   // 도
const int D_4 = 294;   // 레
const int E_4 = 330;   // 미
const int F_4 = 349;   // 파
const int G_4 = 392;   // 솔
const int A_4 = 440;   // 라
const int B_4 = 494;   // 시
 
void setup() {
}
 
void loop() {
  tone(BUZZER_PIN, C_4);
  delay(500);
 
  tone(BUZZER_PIN, D_4);
  delay(500);
 
  tone(BUZZER_PIN, E_4);
  delay(500);
 
  tone(BUZZER_PIN, F_4);
  delay(500);
 
  tone(BUZZER_PIN, G_4);
  delay(500);
 
  tone(BUZZER_PIN, A_4);
  delay(500);
 
  tone(BUZZER_PIN, B_4);
  delay(500);
 
  noTone(BUZZER_PIN);
}
~~~

<br>

<br>

### 노래 연주: 학교종이 땡땡땡

~~~C
const int BUZZER_PIN = 11;
 
const int C_4 = 261;   // 도
const int D_4 = 294;   // 레
const int E_4 = 330;   // 미
const int F_4 = 349;   // 파
const int G_4 = 392;   // 솔
const int A_4 = 440;   // 라
const int B_4 = 494;   // 시
 
typedef struct  { 
  int tone;
  unsigned long delay;
} TAD;//Tone And Delay
 
TAD music[] =
  {
    {G_4, 100}, {G_4, 100}, {A_4, 100}, {A_4, 100}, {G_4, 100}, {G_4, 100}, {E_4, 200},
    {G_4, 100}, {G_4, 100}, {E_4, 100}, {E_4, 100}, {D_4, 200}, {G_4, 100}, {G_4, 100},
    {A_4, 100}, {A_4, 100}, {G_4, 100}, {G_4, 100}, {E_4, 200}, {G_4, 100}, {E_4, 100},
    {D_4, 100}, {E_4, 100}, {C_4, 200}
  };
 
int musicLen;
 
void setup() {
  musicLen = sizeof(music) / sizeof(TAD);
}
 
void loop() {
  for(int i = 0; i < musicLen; i++) {
    tone(BUZZER_PIN, music[i].tone);
    delay(music[i].delay * 5);
 
    noTone(BUZZER_PIN);
    delay(30);
  }
 
  noTone(BUZZER_PIN);
  delay(1000);
}
~~~

<br>

<br>

### 노래 연주: Super Mario Theme

~~~C
/* Arduino Mario Bros Tunes With Piezo Buzzer and PWM
 
             by : ARDUTECH
  Connect the positive side of the Buzzer to pin 11,
  then the negative side to a 1k ohm resistor. Connect
  the other side of the 1 k ohm resistor to
  ground(GND) pin on the Arduino.
  */
  

#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978

#define melodyPin 11

//Mario main theme melody
int melody[] = {
  NOTE_E7, NOTE_E7, 0, NOTE_E7,
  0, NOTE_C7, NOTE_E7, 0,
  NOTE_G7, 0, 0,  0,
  NOTE_G6, 0, 0, 0,

  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,

  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0,

  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,

  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0
};

//Mario main theme tempo
int tempo[] = {
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  9, 9, 9,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  9, 9, 9,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
};

//Underworld melody
int underworld_melody[] = {
  NOTE_C4, NOTE_C5, NOTE_A3, NOTE_A4,
  NOTE_AS3, NOTE_AS4, 0,
  0,
  NOTE_C4, NOTE_C5, NOTE_A3, NOTE_A4,
  NOTE_AS3, NOTE_AS4, 0,
  0,
  NOTE_F3, NOTE_F4, NOTE_D3, NOTE_D4,
  NOTE_DS3, NOTE_DS4, 0,
  0,
  NOTE_F3, NOTE_F4, NOTE_D3, NOTE_D4,
  NOTE_DS3, NOTE_DS4, 0,
  0, NOTE_DS4, NOTE_CS4, NOTE_D4,
  NOTE_CS4, NOTE_DS4,
  NOTE_DS4, NOTE_GS3,
  NOTE_G3, NOTE_CS4,
  NOTE_C4, NOTE_FS4, NOTE_F4, NOTE_E3, NOTE_AS4, NOTE_A4,
  NOTE_GS4, NOTE_DS4, NOTE_B3,
  NOTE_AS3, NOTE_A3, NOTE_GS3,
  0, 0, 0
};

//Underwolrd tempo
int underworld_tempo[] = {
  12, 12, 12, 12,
  12, 12, 6,
  3,
  12, 12, 12, 12,
  12, 12, 6,
  3,
  12, 12, 12, 12,
  12, 12, 6,
  3,
  12, 12, 12, 12,
  12, 12, 6,
  6, 18, 18, 18,
  6, 6,
  6, 6,
  6, 6,
  18, 18, 18, 18, 18, 18,
  10, 10, 10,
  10, 10, 10,
  3, 3, 3
};

void setup(void)
{
  pinMode(melodyPin, OUTPUT);  // buzzer
  pinMode(13, OUTPUT);         // led indicator when singing a note

}

void loop()
{
  //sing the tunes
  sing(1);
  sing(1);
  sing(2);
}

int song = 0;

void sing(int s) {
  // iterate over the notes of the melody:
  song = s;
  if (song == 2) {
    Serial.println(" 'Underworld Theme'");
    int size = sizeof(underworld_melody) / sizeof(int);
    for (int thisNote = 0; thisNote < size; thisNote++) {

      // to calculate the note duration, take one second
      // divided by the note type.
      //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
      int noteDuration = 1000 / underworld_tempo[thisNote];

      buzz(melodyPin, underworld_melody[thisNote], noteDuration);

      // to distinguish the notes, set a minimum time between them.
      // the note's duration + 30% seems to work well:
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);

      // stop the tone playing:
      buzz(melodyPin, 0, noteDuration);

    }

  } else {

    Serial.println(" 'Mario Theme'");
    int size = sizeof(melody) / sizeof(int);
    for (int thisNote = 0; thisNote < size; thisNote++) {

      // to calculate the note duration, take one second
      // divided by the note type.
      //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
      int noteDuration = 1000 / tempo[thisNote];

      buzz(melodyPin, melody[thisNote], noteDuration);

      // to distinguish the notes, set a minimum time between them.
      // the note's duration + 30% seems to work well:
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);

      // stop the tone playing:
      buzz(melodyPin, 0, noteDuration);
    }
  }
}

void buzz(int targetPin, long frequency, long length) {
  digitalWrite(13, HIGH);
  long delayValue = 1000000 / frequency / 2; // calculate the delay value between transitions
    
  //// 1 second's worth of microseconds, divided by the frequency, then split in half since
  //// there are two phases to each cycle
    
  long numCycles = frequency * length / 1000; // calculate the number of cycles for proper timing
    
  //// multiply frequency, which is really cycles per second, by the number of seconds to
  //// get the total number of cycles to produce
    
  for (long i = 0; i < numCycles; i++) { // for the calculated length of time...
    digitalWrite(targetPin, HIGH); // write the buzzer pin high to push out the diaphram
    delayMicroseconds(delayValue); // wait for the calculated delay value
    digitalWrite(targetPin, LOW); // write the buzzer pin low to pull back the diaphram
    delayMicroseconds(delayValue); // wait again or the calculated delay value
  }
  digitalWrite(13, LOW);
}
~~~



<br>

<br>

### 과제

원하는 노래 만들어보기

