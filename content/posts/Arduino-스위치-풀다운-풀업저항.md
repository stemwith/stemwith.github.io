---
title: "Arduino 스위치, 풀다운저항, 풀업저항"
categories: ["arduino"]
date: 2018-09-01T16:01:00+09:00
toc: true
tags:
---

### Tact Switch

{{< figure src="/image/tact_switch.png" width="75%" class="center" >}}

<br>

### Pull-down

|                      | 동작 | Arduino |
| -------------------- | ---- | ------- |
| 스위치를 누르면      | ON   | HIGH    |
| 스위치에서 손을 떼면 | OFF  | LOW     |

<br>

#### schematic

**저항(10k 이상)을 GND에 연결**한 경우: Pull-down 회로

{{< figure src="/image/switch01.png" width="75%" class="center" >}}

<br>

#### sketch

```C
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
```

<br>

### Pull-up

|                      | 동작 | Arduino |
| -------------------- | ---- | ------- |
| 스위치를 누르면      | OFF  | LOW     |
| 스위치에서 손을 떼면 | ON   | HIGH    |

<br>

#### schematic 

**저항(10k 이상)을 VCC(5V)에 연결**한 경우: Pull-up 회로

{{< figure src="/image/switch02.png" width="75%" class="center" >}}

<br>

#### sketch

```C
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
```

<br>

<br>

### 스위치를 사용할 때, 풀다운 or 풀업 저항을 구성해야 하는 이유

출처: [풀업(Pull-up)저항,  풀다운(Pull-down)저항 (악보쓰는 프로그래머)](https://blog.xcoda.net/77)



#### Floating 문제

| 5V에 연결한 경우                                             | GND에 연결한 경우                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| {{< figure src="/image/switch03.png" width="75%" class="center" >}}          | {{< figure src="/image/switch04.png" width="75%" class="center" >}}          |
| 스위치를 누르면 HIGH, 스위치를 떼면 LOW ?                    | 스위치를 누르면 LOW, 스위치를 떼면 HIGH ?                    |
| 실제로는 스위치를 누른 상태에는 HIGH이지만, 스위치를 뗀 상태에는 **HIGH와 LOW가 섞여서 들어간다** | 실제로는 스위치를 누른 상태에는 LOW이지만, 스위치를 뗀 상태에는 **LOW와 HIGH가 섞여서 들어간다.** |

즉, 스위치를 누른 상태에서는 어떤 값을 가져야 하는지 확실하지만, 스위치를 뗀 상태에서는 어떤 값을 가져야 하는지 불확실하다는 문제가 발생하는데, 이것이 플로팅이다.

<br>

#### Floating의 해결과 또 다른 문제

* **(아래 그림대로 연결 절대 금지!)** 위 그림 2개를 조합하여, 회로를 만든다고 가정하면

{{< figure src="/image/switch05.png" width="50%" class="center" >}}

스위치를 누르면 HIGH, 스위치를 누르지 않으면 LOW ?

* (**그림대로 연결 절대 금지!**) 그러나 위 그림과 같이 연결하면 또다른 심각한 문제가 발생한다.

{{< figure src="/image/switch06.png" width="50%" class="center" >}}

* 스위치를 누르는 순간, 5V와 GND가 직접 연결되어 전기적으로 합선(쇼트)이 되기때문에 아두이노 보드가 망가지거나 심한 경우, 아두이노가 연결된 컴퓨터가 망가질 수도 있다.

* 이 그림은 마치 건전지 양극을 도선으로 그대로 연결한 것과 마찬가지인 상황이며, 실제 건전지에 이와 같은 방법으로 선을 연결하면 건전지가 과열되어 녹거나 심하면 불이 날수도 있다.

{{< figure src="/image/switch07.png" width="50%" class="center" >}}

<br>

#### 문제 해결 방법

* 이런 문제를 해결하려면, 양극의 사이에 저항을 하나 넣어서 전류의 흐름을 방해하면 된다. 

{{< figure src="/image/switch08.png" width="50%" class="center" >}}

<br>

* 이를 응용하여 스위치의 한쪽에 저항을 하나 추가로 연결하는 것이고, 이것이 바로 풀다운 저항 혹은 풀업 저항을 구성해야하는 이유이다.

<br>

<br>

### 아두이노 보드에 내장된 풀업저항 사용하기

* 스위치를 사용하는 경우, 풀다운 저항 혹은 풀업 저항을 사용해야 하므로. 스위치를 구성할 때마다 10k~100kΩ 정도의 저항을 별도로 준비해서 회로를 구성해야 한다. 매우 중요한 문제이지만, 매우 귀찮기도 하다.

* 그래서...친절하게도 아두이노 보드는 자체에 풀업 저항을 내장해두었다. 당연한 이야기이지만 아두이노 보드에 내장된 풀업 저항을 사용한다면, 별도의 저항을 준비하지 않아도 되기때문에 회로를 간단하게 구성할 수 있다.

- 기본적으로 **풀업** 회로이므로 **스위치가 눌리지 않은 상태가 HIGH**이며, **스위치가 눌린 상태에서 LOW**값을 갖습니다.

- pinMode 선언시, **INPUT_PULLUP**을 사용합니다.

  ```C
  pinMode (2, INPUT_PULLUP);
  ```

<br>

#### schematic

{{< figure src="/image/switch04.png" width="50%" class="center" >}}

 <br>

#### sketch

```C
const int switch_R = 2;

int R;

void setup() {
  pinMode(switch_R, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
    R = digitalRead(switch_R);
    if(R == LOW) {                   // 스위치를 누르면
        Serial.println("0");
    }
    else {                           // 스위치에서 손을 떼면
        Serial.println("1");
    }
}
```

<br>

<br>

### 스위치를 눌러 LED 켜기

위에서 구성한 풀업 회로에 RGB LED를 추가하여, 각 스위치에 연결된 LED가 점등되도록 구성해보자.

<br>

#### schematic

{{< figure src="/image/switch10.png" width="50%" class="center" >}}

<br>

#### sketch

```C
const int switch_R = 2;
const int switch_G = 3;
const int switch_B = 4;

const int pin_ledR = A0;
const int pin_ledG = A1;
const int pin_ledB = A2;

int R, G, B;

void setup() {
  pinMode(switch_R, INPUT_PULLUP);
  pinMode(switch_G, INPUT_PULLUP);
  pinMode(switch_B, INPUT_PULLUP);
  
  pinMode(pin_ledR, OUTPUT);
  pinMode(pin_ledG, OUTPUT);
  pinMode(pin_ledB, OUTPUT);
  
  Serial.begin(9600);
}

void loop() {
    R = digitalRead(switch_R);
    G = digitalRead(switch_G);
    B = digitalRead(switch_B);
    
    if(R == LOW) {                  // R 스위치를 누르면
        Serial.println("R=1");
        digitalWrite(pin_ledR, HIGH);
    }
    else {                          // R 스위치에서 손을 떼면
        Serial.println("R=0");
        digitalWrite(pin_ledR, LOW);
    }
    
    if(G == LOW) {                  // G 스위치를 누르면
        Serial.println("G=1");
        digitalWrite(pin_ledG, HIGH);
    }
    else {                          // G 스위치에서 손을 떼면
        Serial.println("G=0");
        digitalWrite(pin_ledG, LOW);
    }
    
    if(B == LOW) {                  // B 스위치를 누르면
        Serial.println("B=1");
        digitalWrite(pin_ledB, HIGH);
    }
    else {                          // B 스위치에서 손을 떼면
        Serial.println("B=0");
        digitalWrite(pin_ledB, LOW);
    }
}
```

