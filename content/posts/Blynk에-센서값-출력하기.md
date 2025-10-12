---
title: "Blynk에 센서값 출력하기"
date: 2019-10-18T23:46:21+09:00
categories: ["arduino"]
toc: true
tags: ["iot"]
---

원문: http://help.blynk.cc/en/articles/512056-how-to-display-any-sensor-data-in-blynk-app

<br>

센서값을 Blynk로 출력하기 위해서는 Blynk가 연결되지 않은 상태에서 시리얼모니터에 센서값들을 출력할 수 있어야 한다. ​센서값을 출력하는 코드가 완성되면, 그 다음으로 Blynk에 센서값을 보내는 작업을 시작하는 것이 좋다.

Blynk앱에 센서값을 표시하는 방법에는 크게 두가지 방법이 있으며, 진행중인 프로젝트에 따라 적절한 방법을 선택하면 된다.

<br>

### PULL

*   이 경우에 블링크는 앱이 열려있는 동안에만 Blynk에서 값을 받는다.
*   앱에서 센서값을 표시하는 가장 간단한 방법이며, Blynk 앱의 Virtual Pins이 구동중일때 센서값을 가져온다. (Blynk를 닫거나 백그라운드에서 실행될때 데이타는 요청되지 않는다.) 타이머를 사용할 필요가 없으므로 코딩이 단순한 편이지만, 데이터가 서버에 저장되지 않으므로 히스토리 그래프를 볼 수 없다는 단점이 있다.

<br>

#### Blynk 앱 설정

1.  새 프로젝트를 만든다. (새로운 Auth Token값이 당신의 이메일에 전송된다)
2.  Value Display 위젯을 추가한다.
3.  위젯 세팅으로 가서 PIN 항목을 Virtual Pin V5로 설정한다.
4.  Reading Rate를 3초로 설정한다.

<br>

#### sketch

1.  Analog Pin에서 값을 (간단하게) 읽어들이는 경우에는 코드를 쓸 필요가 없다. 단지 예제파일을 오픈하여 하드웨어와 커넥션만 변경한다.
2.  e-mail을 체크하여 Auth Token을 확인하고, 스케치에 Auth Token을 수정입력한다.
3.  하드웨어에 코드를 업로드한다.
4.  Blynk에서 플레이버튼을 누른다.
5.  값이 표시되는 것을 볼 수 있다.


```C
BLYNK_READ(V5) { //Blynk app has something on V5
  sensorData = analogRead(A0); //reading the sensor on A0
  Blynk.virtualWrite(V5, sensorData); //sending to Blynk
}
```


이 코드는 매시간마다 Blynk가 `_READ` 요청을 Virtual Pin V5에 보내도록 한다. A0핀에서 센서값을 읽은 후, Blynk에서 Virtual Pin V5에 되돌려 준다.

<br>

<br>

### PUSH

* 이 경우 하드웨어(아두이노 or ESP32 등)는 Blynk가 오프라인 상태일때도 센서값을 Blynk 서버에 저장하고, 앱을 열어 온라인 상태가 되면 앱으로 전송하여 센서값을 보여준다.

* Virtual Pin을 통하여 일정 주기로 하드웨어로부터 센서값을 전송하고, 이때마다 Blynk가 값을 받아들인다.

{{< figure src="/image/blynk-sensor.png" width="75%" class="center" >}}

<br>

#### 주의할 점

void loop() 에서는 센서 값을 보낼 수 없다!!!

만약 void loop()문 내에 어떤 값을 넣게 되면 MCU가 아주 짧은 시간 간격으로 무한 반복하여 실행하게 되는데, Blynk는 인터넷을 통하여 값을 전송할 것이므로 Blynk 클라우드가 하드웨어로부터 오는 계속적인 데이터를 받게 될 것이다. Blynk 클라우드가 이러한 상황을 감지하면 자동적으로 접속을 끊게 된다.

그러므로 데이타를 일정 간격으로 보내야하며, 이를 위해 타이머를 사용하는 방법을 취한다. 일정간격으로 데이타를 보내는 방법에는 여러가지가 있지만, 가장 간단한 방법으로 BlynkTimer의 사용을 권장한다. BlynkTimer는 Blynk 라이브러리 패키지안에 포함되어 있으므로, Blynk 라이브러리만 제대로 설치되었다면 별도의 라이브러리를 설치하지 않아도 된다.

<br>

#### Blynk 앱 설정

1.  새 프로젝트를 만든다. (새로운 Auth Token값이 당신의 이메일에 전송된다)
2.  Value Display 위젯을 추가한다.
3.  위젯 세팅으로 가서 PIN 항목을 Virtual Pin V5로 설정한다.
4.  Frequency를 PUSH로 설정한다.

<br>

#### Example
1. timer라고 하는 BlynkTimer 오브젝트를 만든다.
```C
BlynkTimer timer; // Announcing the timer
```

<br>


2. 그 다음으로 일정 간격으로 실행하게 될 함수를 만든다. 이 함수는 A0에 연결된 센서로부터 값을 Virtual Pin V5를 통하여 전송한다.
```C
void myTimerEvent() {
  sensorData = analogRead(A0);
  Blynk.virtualWrite(V5, sensorData);
}
```

<br>


3. setup()문에서, 서브함수 myTimerEvent()가 매 1000ms, 즉 1초 간격으로 실행되도록 선언할 것이다.
```C
void setup() {
  ...
  ...
  ...
  timer.setInterval(1000L, myTimerEvent);
}
```

<br>


4. loop문은 다음과 같이 설정한다.
```C
void loop() {
  Blynk.run();
  timer.run(); // running timer every second
}
```