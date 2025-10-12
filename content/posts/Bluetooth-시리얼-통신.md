---
title: "Bluetooth Serial Controller 앱"
categories: ["arduino"]
date: 2019-10-17T18:27:53+09:00
toc: true
tags: ["iot"]
---

### Bluetooth 시리얼 통신

Bluetooth Serial Controller 앱을 통하여 아두이노와 스마트폰 간의 간단한 시리얼 통신을 해보겠습니다. 이를 위해서는 먼저 [Bluetooth 페어링](2018/10/09/Arduino-Bluetooth-페어링) 문서를 참고하여 블루투스 모듈과 스마트폰을 페어링 해두어야 합니다. 페어링이 완료된 후 시리얼 통신을 진행합니다.

<br>

#### schematic

{{< figure src="/image/BT-03.jpg" width="75%" class="center" >}}

<br>

#### sketch

```C
#include <SoftwareSerial.h>
SoftwareSerial BTSerial(2, 3); //Connect HC-06 TX,RX 

void setup()  
 {
   Serial.begin(9600);
   Serial.println("Hello!");

  // set the data rate for the BT port
   BTSerial.begin(9600);
 }

void loop()
 {
   if (BTSerial.available())
     Serial.write(BTSerial.read());
   if (Serial.available())
     BTSerial.write(Serial.read());
 }
```

<br>

<br>

### 스마트폰에 Bluetooth Serial Controller 앱 설치하기

1. 이제 Google Playstore를 통해서 스마트폰에 Bluetooth Serial Controller 앱을 설치합니다. (iOS는 유사한 프로그램으로 설치)

{{< figure src="/image/BTserialapp-01.png" width="33%" class="center" >}}

​    비슷한 역할을 하는 수많은 앱들이 있는데, 여러 앱을 설치하고 사용해본 결과, 이 앱이 사용하기에 유연함을 갖고 있는 것 같더군요.

<br>

​    설치되었습니다.

{{< figure src="/image/BTserialapp-02.png" width="33%" class="center" >}}

<br>

2. 설치 후 처음 실행을 하면, LANDSCAPE 모드(가로모드)로 실행이 되는데요. 그대로 사용해도 무방하지만 PORTRAIT 모드(세로 모드)로 바꿔보겠습니다. 먼저 PREFERENCE를 누르세요.

{{< figure src="/image/BTserialapp-03.png" width="75%" class="center" >}}

<br>

3. 그러면 아래 화면이 뜹니다. 아무곳이나 누르고 위로 스크롤을 하면 아래에 숨겨져 있는 메뉴가 나타나게 되는데요.

{{< figure src="/image/BTserialapp-04.png" width="75%" class="center" >}}

<br>

4. OPTION - Orientation을 선택한 뒤,

{{< figure src="/image/BTserialapp-05.png" width="75%" class="center" >}}

<br>

5. PORTRAIT를 누릅니다.

{{< figure src="/image/BTserialapp-06.png" width="75%" class="center" >}}

<br>

6. 이제 세로모드로 나타나요. 이제 HC-06모듈과 스마트폰과의 Serial 통신을 해보도록 하겠습니다. 다시 PREFERENCE를 누르고, TERMINAL MODE를 활성화 시키세요.

{{< figure src="/image/BTserialapp-07.png" width="33%" class="center" >}}

<br>

7. 아래 화면이 TERMINAL Mode 화면입니다. 여기서 돋보기 모양을 누르고,

{{< figure src="/image/BTserialapp-08.png" width="33%" class="center" >}}

<br>

8. Paired Devices 목록에서 SKS100을 선택하세요. 그러면 TERMINAL이 HC-06에 접속하여, 서로간 통신할 수 있는 상태가 됩니다. 

{{< figure src="/image/BTserialapp-09.png" width="33%" class="center" >}}

<br>

​    만일, 아래와 같이 Paired Devices 목록이 없으면, Scan for devices를 눌러 HC-06을 찾아보세요.

{{< figure src="/image/BTserialapp-10.png" width="33%" class="center" >}}

<br>

9. TERMINAL이 SKS100에 접속을 시도합니다.

{{< figure src="/image/BTserialapp-11.png" width="33%" class="center" >}}

<br>

10. 접속 완료!

{{< figure src="/image/BTserialapp-12.png" width="33%" class="center" >}}

<br>

<br>

### 터미널과 Serial 통신하기

1. 이제 터미널 창에 Test를 입력하고 SEND를 눌러보세요.

{{< figure src="/image/BTserialapp-13.png" width="33%" class="center" >}}

<br>

2. 그러면 화면에 Test가 출력됨과 동시에,

{{< figure src="/image/BTserialapp-14.png" width="33%" class="center" >}}

<br>

​     시리얼 모니터에 Test가 출력됩니다. 즉, TERMINAL에서 입력한 Test라는 글자가 HC-06을 통해, 아두이노와 연결되어 있는 컴퓨터의 시리얼 모니터에 출력된 것이에요.

{{< figure src="/image/BTserialapp-15.jpg" width="75%" class="center" >}}

<br>

3. 이번에는 반대로 시리얼 모니터에 Good morning! 을 입력하고 전송을 누르면

{{< figure src="/image/BTserialapp-16.png" width="33%" class="center" >}}

<br>

​    스마트폰의 TERMINAL에 Good morning! 이 출력됩니다.

{{< figure src="/image/BTserialapp-17.jpg" width="75%" class="center" >}}

