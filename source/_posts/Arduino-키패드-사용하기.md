---
title: Arduino, 키패드 사용하기
categories:
  - arduino
date: 2018-09-07 13:23:00
tags:
---
# 4×4 매트릭스 키보드
키패드 입력값을 시리얼 모니터로 출력해보자.

<br>

## schematic
![](/image/keypad-01.jpg)

<br>

## Pin Map
| Arduino | Keypad | 일부 Keypad의 경우 |
| ------- | ------ | ------- |
| 2       | 1      | 8       |
| 3       | 2      | 7       |
| 4       | 3      | 6       |
| 5       | 4      | 5       |
| 6       | 5      | 4       |
| 7       | 6      | 3       |
| 8       | 7      | 2       |
| 9       | 8      | 1       |


> 주의 : Keypad 제조회사에 따라 통상적인 배선 순서와는 반대로 해야하는 경우도 있다. 키패드의 단자에 단자번호가 적혀있지 않으므로, 일단 통상적인 배선순서에 따라 연결해보고 시리얼 모니터를 통해 출력되는 값을 보고 확인해야 한다.

<br>


## 라이브러리 추가하기
Keypad 라이브러리는 아두이노 IDE에 기본으로 포함되어 있지 않으므로, 컴파일 전에 라이브러리를 추가한다.

1\. **스케치**\> **라이브러리 포함하기**\> **라이브러리 관리**\> **라이브러리 매니저**
*   검색창에서 keypad 검색
*   Keypad by Mark Stanley, Alexander Brevig 라이브러리 설치

2\. **스케치**\> **라이브러리 포함하기** 에서 Keypad를 선택하면
```C
#include <Keypad.h>
```
*   라이브러리가 스케치에 추가된다.

<br>

## sketch
```C
#include <Keypad.h>

const byte ROWS = 4;      //배열
const byte COLS = 4;      //배열

char keys[ROWS][COLS] = { //배열
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {9, 8, 7, 6}; //핀 지정
byte colPins[COLS] = {5, 4, 3, 2}; //핀 지정

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );

void setup(){
  Serial.begin(9600);  //시리얼 통신 9600
}

void loop(){
  char key = keypad.getKey();  //읽어온 값을 key에 저장
  if (key){
    Serial.println(key);  //key값을 시리얼 모니터에 출력한다
  }
}
```

<br>

**툴**\> **시리얼 모니터**(혹은 Ctrl-Shift-M) 에서 확인한다.

