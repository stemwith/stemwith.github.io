---
title: "esp32 BLE, Blynk Gauge"
categories: ["esp32"]
date: 2019-10-23T21:33:48+09:00
toc: true
tags: ["iot"]
---
### ESP32에서 Blynk로 센서값 보내기 

Blynk App의 GAUGE 위젯을 사용하여 ESP32에 연결된 Potentiometer의 저항값을 읽어 Blynk App에 전압(V), 저항(㏀) 값을 표시해본다. (ESP32 → Blynk App)

*   ESP32의 Potentiometer 값을 읽기 위해 BLYNK_READ(Vpin)을 사용한다.
*   새로운 프로젝트를 만드는 경우, 새로운 auth token을 받아서 사용해야 한다.

<br>

#### schematic

{{< figure src="/image/blynk-adc-01.png" width="75%" class="center" >}}

<br>

#### sketch

```C
#define BLYNK_PRINT Serial
#define BLYNK_USE_DIRECT_CONNECT

#include <BlynkSimpleEsp32_BLE.h>
#include <BLEDevice.h>
#include <BLEServer.h>

// You should get Auth Token in the Blynk App.
// Go to the Project Settings (nut icon).
char auth[] = "WUAeS6P57T3XNaIGyLK1-OUv........";

// Potentiometer Pin
#define PIN_POTENTIOMETER A0                       // Potentiometer GPIO 36

// Resist, Voltage
int value_Potentiometer; 
int value_R;
float value_V;

void setup()
{
  // Debug console
  Serial.begin(115200);
  Serial.println("Waiting for connections...");

  // for Blynk 
  Blynk.setDeviceName("Blynk-t");
  Blynk.begin(auth);
}

void loop()
{
  value_Potentiometer = analogRead(PIN_POTENTIOMETER);  // 12bit ADC (0~4095)
  value_V = map(value_Potentiometer, 0, 4095, 3300, 0); // 0~3300mV
  value_R = map(value_V, 0, 3300, 10000, 0);            // 0~10kΩ
  
  Blynk.run();
  
  Serial.print("Resist : "); Serial.print(value_R); Serial.println("Ω");
  Serial.print("Voltage: "); Serial.print(value_V); Serial.println("mV");
  
  delay(1000);
}

BLYNK_READ(V1)           // ESP32 -> widget virtual pin1
{
  Blynk.virtualWrite(V1, value_R);
}

BLYNK_READ(V2)           // ESP32 -> widget virtual pin1
{
  Blynk.virtualWrite(V2, value_V);
}
```

*   Blynk에서 2개의 Gauge를 사용하기 위해 BLYNK)READ(Vpin)을 2번 사용한다.
*   Blynk.virtualWrite(Vpin, value)를 통해 Blynk App의 Gauge 위젯에서 지정한 virtual pin에 value값을 표시한다.

<br>

<br>

### Blynk 설정

1. 새로운 프로젝트를 생성한다.
   - NAME : ESP32_Potentiometer
   - CHOOSE DEVICE : ESP32 Dev Board
   - CONNECTION TYPE : BLE

{{< figure src="/image/blynk-adc-02.png" width="33%" class="center" >}}

<br>

2. 이메일로 발송된 토큰을 복사한다.

{{< figure src="/image/blynk-adc-03.png" width="33%" class="center" >}}

<br>

3. +버튼을 눌러 위젯을 추가할 수 있는 화면으로 진입한다.

{{< figure src="/image/blynk-adc-04.png" width="33%" class="center" >}}

<br>

4. 먼저 BLE 위젯을 선택하여 ESP32와 Blynk간의 통신 방법을 지정한다.

{{< figure src="/image/blynk-adc-05.png" width="33%" class="center" >}}

<br>

5. 블루투스 모양의 위젯 버튼을 눌러 Blynk와의 통신을 준비한다.

{{< figure src="/image/blynk-adc-06.png" width="33%" class="center" >}}

<br>

6. Connect BLE device

{{< figure src="/image/blynk-adc-07.png" width="33%" class="center" >}}

<br>

7. 연결하고자 하는 BLE 장비를 선택하면,

{{< figure src="/image/blynk-adc-08.png" width="33%" class="center" >}}

<br>

8. 연결 확인!

{{< figure src="/image/blynk-adc-09.png" width="33%" class="center" >}}

<br>

9. +버튼을 눌러 출력 위젯 2개를 추가한다. (Gauge, Labeled value)

{{< figure src="/image/blynk-adc-10.png" width="33%" class="center" >}}

<br>

10. 먼저 Gauge 위젯을 선택한다.

{{< figure src="/image/blynk-adc-11.png" width="33%" class="center" >}}

<br>

11. Gauge 위젯이 추가되면 육각형 모양의 아이콘을 눌러 GAUGE Setting 화면으로 진입한다.

{{< figure src="/image/blynk-adc-12.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-adc-13.png" width="33%" class="center" >}}

<br>

12. 설정화면에서 다음 4가지를 설정한다.
    - NAME : 저항
    - INPUT : V1, 0~1000
    - LABEL : (단위를 표시하기 위해) x10 Ohm 을 적는다.
    - READING RATE : 1sec (PUSH 위젯은 실행되지 않음)

{{< figure src="/image/blynk-adc-14.png" width="33%" class="center" >}}

<br>

13. Labeled Value 위젯을 추가하고, 다음과 같이 설정한다.
    - NAME : 저항
    - INPUT : V2, 0~3300
    - LABEL : (단위를 표시하기 위해) mV 를 적는다.
    - READING RATE : 1sec (PUSH 위젯은 실행되지 않음)

{{< figure src="/image/blynk-adc-15.png" width="33%" class="center" >}}

<br>

14. 상단의 뒤로가기 화살표를 눌러 프로젝트 바탕화면으로 돌아간다.

{{< figure src="/image/blynk-adc-16.png" width="33%" class="center" >}}

<br>

15. 여기서 플레이버튼을 누르면,

{{< figure src="/image/blynk-adc-17.png" width="33%" class="center" >}}

<br>

저항과 전압의 측정이 시작된다. (시리얼 모니터에서도 관찰 가능)

{{< figure src="/image/blynk-adc-18.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-adc-19.png" width="33%" class="center" >}}

<br>

16. 가변 저항을 돌릴 때마다 저항과 전압이 바뀐다.

{{< figure src="/image/blynk-adc-20.png" width="33%" class="center" >}}

