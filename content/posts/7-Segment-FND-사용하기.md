---
title: "7 Segment (FND) 사용하기"
date: 2018-10-01T11:21:00+09:00
categories: ["arduino"]
toc: true
tags:
---
## FND의 종류
* FND는 Anode형과 Cathode형으로 분류되며, 이 중 Anode형이 주로 사용되고 있는데요. Anode형은 중앙핀이 VCC이며, Cathode형은 GND입니다. 우리가 사용하는 것은 5611BH로 Common Anode형입니다.

* 7 Segment (FND)는 숫자나 문자를 표현하는 7개의 LED와 소수점을 표현하는 1개의 LED가 포함되어 있는 부품을 의미합니다. FND는 16X2 LCD와 비교할 때 표현할 수 있는 문자의 개수가 제한되고, 각 문자의 표현을 위하여 총 8개의 LED를 하나씩 조절해주어야 하는 등 사용이 복잡하다는 단점이 있습니다. 그렇지만, 전력소모가 적고 크기가 큰 Segment를 선택하면 비교적 큰 문자도 표현할 수 있다는 장점이 있어 다양한 용도로 사용되고 있습니다.

<br>

## 숫자표시 방법
{{< figure src="/image/7segment-01.jpg" width="25%" class="center" >}}
{{< figure src="/image/7segment-02.jpg" width="50%" class="center" >}}

<br>

| Num  | DP   | G    | F    | E    | D    | C    | B    | A    | 2진수      | 16진수 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---------- | ------ |
| 0    | 1    | 1    | 0    | 0    | 0    | 0    | 0    | 0    | 0b11000000 | 0xC0   |
| 1    | 1    | 1    | 1    | 1    | 1    | 0    | 0    | 1    | 0b11111001 | 0xF9   |
| 2    | 1    | 0    | 1    | 0    | 0    | 1    | 0    | 0    | 0b10100100 | 0xA4   |
| 3    | 1    | 0    | 1    | 1    | 0    | 0    | 0    | 0    | 0b10110000 | 0xB0   |
| 4    | 1    | 0    | 0    | 1    | 1    | 0    | 0    | 1    | 0b10011001 | 0x99   |
| 5    | 1    | 0    | 0    | 1    | 0    | 0    | 1    | 0    | 0b10010010 | 0x92   |
| 6    | 1    | 0    | 0    | 0    | 0    | 0    | 1    | 0    | 0b10000010 | 0x82   |
| 7    | 1    | 1    | 1    | 1    | 1    | 0    | 0    | 0    | 0b11111000 | 0xF8   |
| 8    | 1    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0b10000000 | 0x80   |
| 9    | 1    | 0    | 0    | 1    | 0    | 0    | 0    | 0    | 0b10010000 | 0x90   |


>10진수 숫자와의 구분을 위해 2진수 앞에는 0b, 16진수 앞에는 0x를 표기하고
>16진수 표현에 있어서, 각 숫자에 소수점을 포함시키는 경우에는 80을 빼주면 됩니다. 예를 들어,


* 0． → 0xC0 - 0x80 = 0x40
* 1． → 0xF9 - 0x80 = 0x79
* 2． → 0xA4 - 0x80 = 0x24
* 3． → 0xB0 - 0x80 = 0x30
* 4． → 0x99 - 0x80 = 0x19
* 5． → 0x92 - 0x80 = 0x12
* 6． → 0x82 - 0x80 = 0x12
* 7． → 0xF8 - 0x80 = 0x78
* 8． → 0x80 - 0x80 = 0x00
* 9． → 0x90 - 0x80 = 0x10

<br>

## Pin Map
| 7 Segment | Arduino |
| --------- | ------- |
| A         | 2       |
| B         | 3       |
| C         | 4       |
| D         | 5       |
| E         | 6       |
| F         | 7       |
| G         | 8       |
| DP        | 9       |

<br>

## schematic
아래 회로에서는 330Ω 저항 1개를 VCC에 직접 연결하여 사용하였습니다. 상단부와 하단부 중앙핀은 서로 연결이 되어 있으므로, 둘 중 하나만 +5V에 연결하여 사용합니다.
{{< figure src="/image/7segment-03.jpg" width="75%" class="center" >}}

<br>

> **주의** : 위 회로에서는 간단한 회로 구성을 위해 VCC에 저항을 직접 연결하여 사용하였으나, 이것이 좋은 방법은 아닙니다. FND의 각 LED가 직렬이 아닌 병렬로 연결되어 있는데, 이렇게 구성하는 경우 동일한 전류로 “1”를 표시할때는 2개의 Segment만 켜고, “8”을 표시할때는 7개의 Segment를 모두 키므로, 각 숫자마다 밝기의 차이가 생기길 수 있기 때문이죠. 실제 LED의 밝기에 미세한 변화가 생기는 것을 볼 수 있습니다.


>이러한 문제를 해결하기 위해서는 각 LED마다 저항을 따로 사용하여야 합니다. 아래 그림과 같이 220~330Ω 저항 8개를 사용하는 것이 원칙이며, 이렇게 하면 밝기를 고르게 유지할 수 있습니다.


{{< figure src="/image/7segment-04.jpg" width="75%" class="center" >}}

<br>

## sketch : 0~9까지 차례대로 표시하기
```c
const int A = 2;
const int B = 3;
const int C = 4;
const int D = 5;
const int E = 6;
const int F = 7;
const int G = 8;
const int DP = 9;
int dt = 1000;

void setup() {
pinMode(A, OUTPUT);
pinMode(B, OUTPUT);
pinMode(C, OUTPUT);
pinMode(D, OUTPUT);
pinMode(E, OUTPUT);
pinMode(F, OUTPUT);
pinMode(G, OUTPUT);
pinMode(DP, OUTPUT);

// 7 Segment Ready
digitalWrite (A,HIGH);
digitalWrite (B,HIGH);
digitalWrite (C,HIGH);
digitalWrite (D,HIGH);
digitalWrite (E,HIGH);
digitalWrite (F,HIGH);
digitalWrite (G,HIGH);
digitalWrite (DP,HIGH);
}

void loop() {

// digit 0
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,LOW);
digitalWrite (F,LOW);
digitalWrite (G,HIGH);
digitalWrite (DP,HIGH);
delay(dt);

// digit 1
digitalWrite (A,HIGH);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,HIGH);
digitalWrite (E,HIGH);
digitalWrite (F,HIGH);
digitalWrite (G,HIGH);
digitalWrite (DP,HIGH);
delay(dt);

// digit 2
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,HIGH);
digitalWrite (D,LOW);
digitalWrite (E,LOW);
digitalWrite (F,HIGH);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 3
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,HIGH);
digitalWrite (F,HIGH);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 4
digitalWrite (A,HIGH);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,HIGH);
digitalWrite (E,HIGH);
digitalWrite (F,LOW);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 5
digitalWrite (A,LOW);
digitalWrite (B,HIGH);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,HIGH);
digitalWrite (F,LOW);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 6
digitalWrite (A,LOW);
digitalWrite (B,HIGH);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,LOW);
digitalWrite (F,LOW);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 7
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,HIGH);
digitalWrite (E,HIGH);
digitalWrite (F,HIGH);
digitalWrite (G,HIGH);
digitalWrite (DP,HIGH);
delay(dt);

// digit 8
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,LOW);
digitalWrite (F,LOW);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 9
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,HIGH);
digitalWrite (F,LOW);
digitalWrite (G,LOW);
digitalWrite (DP,HIGH);
delay(dt);

// digit 0.
digitalWrite (A,LOW);
digitalWrite (B,LOW);
digitalWrite (C,LOW);
digitalWrite (D,LOW);
digitalWrite (E,LOW);
digitalWrite (F,LOW);
digitalWrite (G,HIGH);
digitalWrite (DP,LOW);
}
```

<br>

## sketch : 배열을 사용하여 숫자 출력하기
```c
int numArray[11][8] = {
  {0,0,0,0,0,0,1,1}, // 0
  {1,0,0,1,1,1,1,1}, // 1
  {0,0,1,0,0,1,0,1}, // 2
  {0,0,0,0,1,1,0,1}, // 3
  {1,0,0,1,1,0,0,1}, // 4
  {0,1,0,0,1,0,0,1}, // 5
  {0,1,0,0,0,0,0,1}, // 6
  {0,0,0,1,1,1,1,1}, // 7
  {0,0,0,0,0,0,0,1}, // 8
  {0,0,0,0,1,0,0,1}, // 9
  {0,0,0,0,0,0,1,0}  // 0.
};
int pins[] = {2, 3, 4, 5, 6, 7, 8, 9};
 
void setup() {
  for (int r = 0; r < 8; r++) {
    pinMode(pins[r], OUTPUT);
    digitalWrite(pins[r], 1); // 7 Segment Ready
  }

  // 8 출력
  for (int r = 0; r < 8; r++) {
    digitalWrite(pins[r], numArray[8][r]); // numbers[8][r]이면 8을 출력
  }
  delay(1000);
}
 
void loop()
{
  for (int num = 0; num < 11; num++) {
    for (int r = 0; r < 8; r++) {
      digitalWrite(pins[r], numbers[num][r]); // num의 값을 출력
    }
    delay(1000);
  }
}
```

<br>

## sketch : 2진수나 16진수를 이용하여 표시하기
```c
int numArray[10] = {
  0b11000000,   // 0
  0b11111001,   // 1
  0b10100100,   // 2
  0b10110000,   // 3
  0b10011001,   // 4
  0b10010010,   // 5
  0b10000010,   // 6
  0b11111000,   // 7
  0b10000000,   // 8
  0b10010000    // 9
};
// int numArray[10] = { 0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8, 0x80, 0x90 };
// 16진수를 사용해도 됨
// 소수점 포함 int numArray[10] = { 0x40, 0x79, 0x24, 0x30, 0x19, 0x12, 0x02, 0x78, 0x00, 0x10 };

int segPins[7] = {2, 3, 4, 5, 6, 7, 8};
int i, j;

void setup() {                
  for (i=0; i < 8; i++) {
    pinMode(segPins[i], OUTPUT);
  }
}

void loop() {
  for (i=0; i < 10; i++)
  {
    segLED(i);                         // i=1이면 1을 출력
    delay(1000);
  }
}

void segLED(int num) {                 // num값을 넘겨받아
  int data = numArray[num];            // num번째 배열값을 data로 지정
  
  for (j = 0; j < 8; j++)
  {                                    // 2진수 배열 8비트를 &연산자로 가장 오른쪽11 비트값부터 검사
    if(data & 0x01) {                  // 1이면
      digitalWrite(segPins[j], HIGH);  // HIGH(끄고)
    }
    else {
      digitalWrite(segPins[j], LOW);   // 1이 아니면(0이면)
    }                                  // LOW(킨다)
  data >>= 1;                          // data값을 1비트씩 오른쪽으로 쉬프트한 후
  }                                    // 7번 추가 실행 (총 8번 실행)
}
```

<br>

## sketch : 시리얼모니터에서 값을 입력받아 출력하기
```c
int numArray[10] = { 0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8, 0x80, 0x90 };
// 소수점 포함 int numArray[10] = { 0x40, 0x79, 0x24, 0x30, 0x19, 0x12, 0x02, 0x78, 0x00, 0x10 };
int segPins[7] = {2, 3, 4, 5, 6, 7, 8};
int i, j;

void setup() { 
  Serial.begin(9600); 
  for (i=0; i < 8; i++) {
    pinMode(segPins[i], OUTPUT);
  }
}

void loop() {
  Serial.println("Press any number!(0~9)"); 
  delay(1000); 

  if (Serial.available()) {
  int number = Serial.read();
    if(number < 10) {
	  Serial.println(number");  
	  segLED(number);                  // i=1이면 1을 출력
	  delay(1000);
    }
    else {
      Serial.println("Please input a lower number than 10!")
    }
  }
}

void segLED(int num) {                 // num값을 넘겨받아
  int data = numArray[num];            // num번째 배열값을 data로 지정
  
  for (j = 0; j < 8; j++)
  {                                    // 2진수 배열 8비트를 &연산자로 가장 오른쪽11 비트값부터 검사
    if(data & 0x01) {                  // 1이면
      digitalWrite(segPins[j], HIGH);  // HIGH(끄고)
    }
    else {
      digitalWrite(segPins[j], LOW);   // 1이 아니면(0이면)
    }                                  // LOW(킨다)
  data >>= 1;                          // data값을 1비트씩 오른쪽으로 쉬프트한 후
  }                                    // 7번 추가 실행 (총 8번 실행)
}
```

<br><br>

# 2개의 7 Segment를 사용하여 2자리 숫자 나타내기

1개의 7 Segment를 사용하는데 8개의 Digital Pin이 필요하므로, 2개 이상의 7 Segment를 사용하려면 16개의 Digital Pin이 필요합니다. 핀의 개수로만 보면 Arduino Uno로는 표현할 수 없겠지요. 그러므로 2개의 7 Segment를 전원부 제어를 통해 빠른 시간동안 on/off를 반복함으로써 우리 눈에 나타나는 잔상효과를 이용하는 방법으로 여러개의 FND를 사용하는 Dynamic 구동 방식을 사용합니다.

아래 회로를 예로들면 아두이노의 Digital 2~9번핀이 각각 두개의 FND로 병렬연결 되어 있고, 10번핀은 10의 자리를 나타내는 FND1에, 11번 핀은 1의 자리를 나타내는 FND2에 연결되어 있는 것을 볼 수 있습니다. 이 회로를 통해 10번핀을 LOW, 11번핀을 HIGH로 두면 FND1이 작동하고, 마찬가지로 10번핀을 HIGH, 11번핀을 LOW로 두면 FND2가 작동하게 되죠. 이러한 방식으로 2개의 FND를 10개의 핀으로 작동할 수 있게 되는 것입니다.


{{< figure src="/image/7segment-05.jpg" width="75%" class="center" >}}

<br>

## sketch
```C
int numArray[10] = {
  0b01000000,   // 0
  0b01111001,   // 1
  0b00100100,   // 2
  0b00110000,   // 3
  0b00011001,   // 4
  0b00010010,   // 5
  0b00000010,   // 6
  0b01111000,   // 7
  0b00000000,   // 8
  0b00010000    // 9
};
// int numArray[10] = { 0x40, 0x79, 0x24, 0x30, 0x19, 0x12, 0x02, 0x78, 0x00, 0x10 };
// 16진수를 사용해도 됨

const int segPins[] = { 2, 3, 4, 5, 6, 7, 8, 9 };  // Segment핀 번호
const int segNum = 2;                              // Segment 개수 (숫자 자리수)
const int vccPins[segNum] = { 10, 11 };            // 10, 11번 핀을 통해 seg#1, seg#2의 전원 인가

void setup() {
  for (int i = 0; i < 8; i++) {
    pinMode(segPins[i], OUTPUT);                   // Segment핀 설정
  } 
  for (int i = 0; i < segNum; i++) {
    pinMode(vccPins[i], OUTPUT);                   // seg#0, seg#1의 전원인가 핀 설정
  }
}

void loop() {
  for (int i = 0; i < 100; i++) {                  // 0~99까지 숫자를 표시
    for (int n = 0; n < 10; n++) {                 // 빠르게 카운트할 경우 모든 LED가 켜져 있는 것처럼 보여 
      showNumber(i);                               // 숫자를 구분할 수 없으므로, 빠르게 10번씩 점멸시키면서 표시
    }  
  }                                  
}                                    

void showNumber(int number) {
  if (number == 0) {
    showDigit(number, 0);                         // 0의 경우 (1의 자리수) Segment에만 0을 출력
  }
  else {
    for (int j = 0; j < segNum; j++) {            // 10의 자리, 1의 자리 출력을 위해 2번 실행
      if (number > 0) {                           // 출력값이 0보다 큰 경우에만 실행
        showDigit(number % 10, j);                // 1의 자리 숫자(%10)를 seg#0(j=0)에 출력 (if 10의 자리 숫자 = (number % 100) / 10))
        number = number / 10;                     // ※ 숫자를 10으로 나눠 10의 자리 숫자를 1의 자리 숫자로 만듦
      }                                           // if 처음에 주어진 숫자가 한 자리 수였으면,
      delay(5);                                   //    → 10으로 나눈 후에는 1의 자리값이 0이 되어, 0보다 큰 값이 안되므로 10의 자리 출력하지 않음
    }                                             // if 처음에 주어진 숫자가 두 자리 수였으면
  }                                               //    → 10으로 나눈 후 10의 자리 숫자가 1의 자리 수가 되므로, 10이 자리수를 seg#1(j=1)에 출력 
}

void showDigit(int num, int digit) {              // num값과 digit(0→1의 자리수에 표시, 1→10의 자리수에 표시)을 넘겨받아
  int data = numArray[num];                       // num번째 배열값을 digit자리수에 표시할 data로 지정

  digitalWrite(vccPins[0], HIGH);                 // vcc핀에 전원 인가
  digitalWrite(vccPins[1], HIGH);                 // [0] = Arduino Pin10, [1] = Arduino Pin11

  for (int segLED = 0; segLED < 7; segLED++)      // 숫자 2진수의 7세그먼트 ON, OFF
  {
    if (data & 0x01) {                            // 1이면
      digitalWrite(segPins[segLED], HIGH);        // HIGH(끄고)                  
    }
    else {                                        // 1이 아니면(0이면)
      digitalWrite(segPins[segLED], LOW);         // LOW(끈다)               
    }
    data >>= 1;                                   // data값을 1비트씩 오른쪽으로 쉬프트한 후
  }
  digitalWrite(vccPins[digit], LOW);              // 숫자 LED 한 자리 ON
}
```

<br><br>

# 4 FND
4개의 FND를 Dynamic 방식으로 구동하기 위해서는 8개의 데이터 핀과 4개의 전원부 핀이 필요합니다.
{{< figure src="/image/7segment-06.jpg" width="75%" class="center" >}}

<br>

## schematic
{{< figure src="/image/7segment-07.jpg" width="75%" class="center" >}}

<br>

## Pin Map
| FND  | Arduino | Segment | 자리수         |
| ---- | ------- | ------- | -------------- |
| 1    | 6       | E       |                |
| 2    | 5       | D       |                |
| 3    | 13      | DP      |                |
| 4    | 4       | C       |                |
| 5    | 8       | G       |                |
| 6    | 9       | S1      | 1의 자리 수    |
| 7    | 3       | B       |                |
| 8    | 10      | S2      | 10의 자리 수   |
| 9    | 11      | S3      | 100의 자리 수  |
| 10   | 7       | F       |                |
| 11   | 2       | A       |                |
| 12   | 12      | S4      | 1000의 자리 수 |

<br>

## sketch
```C
// Segment_X - Arduino Pin // FND Pin
#define SEG_A 2 // 11
#define SEG_B 3 // 7
#define SEG_C 4 // 4
#define SEG_D 5 // 2
#define SEG_E 6 // 1
#define SEG_F 7 // 10
#define SEG_G 8 // 5

// FND_num - Arduino Pin // FND Pin
#define FND1 9  // 6
#define FND2 10 // 8
#define FND3 11 // 9
#define FND4 12 // 12

void seglight(byte number);
byte numbers[] = {
  B0111111,  // MSB   --  LSB
  B0000110,
  B1011011,
  B1001111,
  B1100110,
  B1101101,
  B1111101,
  B0000111,
  B1111111,
  B1101111
};

int FND[] = {SEG_A, SEG_B, SEG_C, SEG_D, SEG_E, SEG_F, SEG_G };
int FND_NO[] = {FND1, FND2, FND3, FND4};

void setup() {
  for (int i = 0 ; i < 7; i++) {
    pinMode(FND[i], OUTPUT);
  }
  for (int i = 0 ; i < 4; i++) {
    pinMode(FND_NO[i], OUTPUT);
    digitalWrite(FND_NO[i], HIGH);
  }
}

int ON = OUTPUT;
int intCnt = 0 ;

void loop() {

  if(intCnt < 10000) {
    intCnt++;
  } else {
    intCnt = 0;
  }
    
  unsigned long start = millis();
  for (unsigned long j = 0 ; j < 10 ; j = millis() - start) { // 600 밀리초 마다 실행

    // Dynamic 구동
    digitalWrite(FND1, LOW);                 // 1의 자리 켜기
    seglight(numbers[intCnt % 10]);
    delay(5);                                // 5ms 유지 후
    digitalWrite(FND1, HIGH);                // 끄기
    
    digitalWrite(FND2, LOW);                 // 10의 자리 켜기
    seglight(numbers[(intCnt / 10) % 10]);
    delay(5);                                // 5ms 유지 후
    digitalWrite(FND2, HIGH);                // 끄기
 
    digitalWrite(FND3, LOW);                 // 100의 자리 켜기
    seglight(numbers[(intCnt / 100) % 10]);
    delay(5);                                // 5ms 유지 후 
    digitalWrite(FND3, HIGH);                // 끄기

    digitalWrite(FND4, LOW);                 // 1000의 자리 켜기
    seglight(numbers[(intCnt / 1000) % 10]);
    delay(5);                                // 5ms 유지 후
    digitalWrite(FND4, HIGH);                // 끄기
  }
}

// Bit값으로 FND 각 LED 점등
void seglight(byte number) {
  for (int i = 0 ; i < 7 ; i++) {
    int bit = bitRead(number, i) ;
    digitalWrite(FND[i], bit);
  }
}
```