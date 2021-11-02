---
title: Arduino 스위치, 풀다운저항, 풀업저항
categories:
  - arduino
date: 2018-09-01 16:01:00
tags:
---

### Tact Switch

![](/image/tact_switch.png)

<br>

### Pull-down

|                      | 동작 | Arduino |
| -------------------- | ---- | ------- |
| 스위치를 누르면      | ON   | HIGH    |
| 스위치에서 손을 떼면 | OFF  | LOW     |

<br>

#### schematic

**저항(10k 이상)을 GND에 연결**한 경우: Pull-down 회로

![](/image/switch01.png)

<br>

#### sketch

~~~C
const int switch_R = 2;

void setup() {
  pinMode(switch_R, INPUT);
  Serial.begin(9600);
}

void loop() {
    int i = digitalRead(switch_R);
    if(i == HIGH) {                  // 스위치를 누르면
        Serial.println("1");
    }
    else {                           // 스위치에서 손을 떼면
        Serial.println("0");
    }
}
~~~

<br>

### Pull-up

|                      | 동작 | Arduino |
| -------------------- | ---- | ------- |
| 스위치를 누르면      | OFF  | LOW     |
| 스위치에서 손을 떼면 | ON   | HIGH    |

<br>

#### schematic 

**저항(10k 이상)을 VCC(5V)에 연결**한 경우: Pull-up 회로

![](/image/switch02.png)

<br>

#### sketch

~~~C
const int switch_R = 2;

void setup() {
  pinMode(switch_R, INPUT);
  Serial.begin(9600);
}

void loop() {
    int i = digitalRead(switch_R);
    if(i == HIGH) {                  // 스위치를 누르면
        Serial.println("1");
    }
    else {                           // 스위치에서 손을 떼면
        Serial.println("0");
    }
}
~~~

<br>

<br>

### 스위치를 사용할 때, 풀다운 or 풀업 저항을 구성해야 하는 이유

#### Floating 문제

| 5V에 연결한 경우                                             | GND에 연결한 경우                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="/image/switch03.png" style="zoom:75%;" />          | <img src="/image/switch04.png" style="zoom:75%;" />          |
| 스위치를 누르면 HIGH, 스위치를 떼면 LOW ?                    | 스위치를 누르면 LOW, 스위치를 떼면 HIGH ?                    |
| 실제로는 스위치를 누른 상태에는 HIGH이지만, 스위치를 뗀 상태에는 **HIGH와 LOW가 섞여서 들어옵니다.** | 실제로는 스위치를 누른 상태에는 LOW이지만, 스위치를 뗀 상태에는 **LOW와 HIGH가 섞여서 들어옵니다.** |

즉, 스위치를 누른 상태에서는 어떤 값을 가져야 하는지 확실하지만, 스위치를 뗀 상태에서는 어떤 값을 가져야 하는지 불확실하기 때문에 이러한 문제가 발생하는 것입니다.

<br>

#### Floating의 해결과 또 다른 문제

* **(아래 그림대로 연결 절대 금지!)** 그렇다면 위 그림 2개를 조합하여, 회로를 만들어보면 어떨까요?

![](/image/switch05.png)

스위치를 누르면 HIGH, 스위치를 누르지 않으면 LOW ?

* (**그림대로 연결 절대 금지!**) 그렇지만 위 그림과 같이 연결하면 또다른 심각한 문제가 생깁니다.

![](/image/switch06.png)

* 스위치를 누르는 순간, 5V와 GND가 직접 연결되어 전기적으로 합선(쇼트)이 되기때문에 아두이노 보드가 망가지거나 심한 경우, 아두이노가 연결된 컴퓨터가 망가질 수도 있습니다.

* 이 그림은 마치 건전지 양극을 도선으로 그대로 연결한 것과 마찬가지인 상황이며, 실제 건전지에 이와 같은 방법으로 선을 연결하면 건전지가 과열되어 녹거나 심하면 불이 날수도 있습니다.

![](/image/switch07.png)

<br>

#### 문제 해결 방법

* 이런 문제를 해결하려면, 양극의 사이에 저항을 하나 넣어서 전류의 흐름을 방해하면 됩니다. 

![](/image/switch08.png)

<br>

* 이를 응용하여 스위치의 한쪽에 저항을 하나 추가로 연결하는 것이고, 이것이 바로 풀다운 저항 혹은 풀업 저항을 구성해야하는 이유가 됩니다.

<br>

<br>

### 아두이노 보드에 내장된 풀업저항 사용하기

* 스위치를 사용하는 경우 풀다운 저항 혹은 풀업 저항을 사용해야한다는 것을 배웠습니다. 스위치를 구성할 때마다 10k~100kΩ 정도의 저항을 별도로 준비해서 회로를 구성해야 하는 것이죠. 매우 중요한 문제이지만, 매우 귀찮기도 합니다.

* 그래서...친절하게도 아두이노 보드는 자체에 풀업 저항을 내장해두었습니다. 당연한 이야기이지만 아두이노 보드에 내장된 풀업 저항을 사용한다면, 별도의 저항을 준비하지 않아도 되기때문에 회로를 간단하게 구성할 수 있습니다.

- 기본적으로 **풀업** 회로이므로 **스위치가 눌리지 않은 상태가 HIGH**이며, **스위치가 눌린 상태에서 LOW**값을 갖습니다.

- pinMode 선언시, **INPUT_PULLUP**을 사용합니다.

  ~~~C
  pinMode (2, INPUT_PULLUP);
  ~~~

<br>

#### schematic

![](/image/switch04.png)

 <br>

#### sketch

~~~C
const int switch_R = 2;

void setup() {
  pinMode(switch_R, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
    int i = digitalRead(switch_R);
    if(i == LOW) {                  // 스위치를 누르면
        Serial.println("0");
    }
    else {                           // 스위치에서 손을 떼면
        Serial.println("1");
    }
}
~~~

<br>

<br>

### 스위치를 눌러 LED 켜기

위에서 구성한 풀업 회로에 RGB LED를 추가하여, 스위치를 누를 때 빨간색 LED가 점등되도록 구성해봅시다.

<br>

#### schematic

![](/image/switch10.png)

<br>

#### sketch

~~~C
const int switch_R = 2;
const int pin_ledR = 9;

void setup() {
  pinMode(switch_R, INPUT_PULLUP);
  pinMode(pin_ledR, OUTPUT);
  Serial.begin(9600);
}

void loop() {
    int i = digitalRead(switch_R);
    if(i == LOW) {                  // 스위치를 누르면
        Serial.println("0");
        digitalWrite(pin_ledR, HIGH);
    }
    else {                           // 스위치에서 손을 떼면
        Serial.println("1");
        digitalWrite(pin_ledR, LOW);
    }
}
~~~

