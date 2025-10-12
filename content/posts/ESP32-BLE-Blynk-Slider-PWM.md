---
title: "esp32 BLE, Blynk Slider (PWM)"
categories: ["esp32"]
date: 2019-10-22T23:55:21+09:00
toc: true
tags: ["iot"]
---

### ESP32와 Blynk에서의 PWM 사용

Blynk app에서 Slider 위젯을 사용하여 App → ESP32로 PWM 신호를 보내 LED의 밝기를 조절해본다.

*   Blynk에서 Slider는 Virtual pin을 사용해야한다. (Digital핀을 선택하는 것이 불가능)
*   Virtual pin을 사용하기 위해 BLYNK_WRITE(Vpin)을 사용한다.
*   ESP32에서 PWM을 사용하기 위한 절차에 따라 코딩을 진행한다.

<br>

#### schematic

{{< figure src="/image/blynk-pwm-01.png" width="75%" class="center" >}}

※ LED모듈을 사용하는 경우 저항이 필요없다.

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
char auth[] = "rc77E7UrbQHhoLE-LV1Ajxz20k8eLBrk";

// setting PWM properties
#define LEDC_FREQ        5000 // Hz
#define LEDC_CHANNEL_0   0
#define LEDC_RESOLUTION  12   // 10bit (0~1023) 12bit(0~4095) 16bit(0~65535)

// led Pin
const int pin_ledR = 19;
    
BLYNK_WRITE(V5)           // widget virtual pin5 -> ESP32
{
  int value_V5 = param.asInt();
  ledcWrite(LEDC_CHANNEL_0, value_V5);
  Serial.print("V5 value: "); Serial.println(value_V5);
}

void setup()
{
  // Debug console
  Serial.begin(115200);
  Serial.println("Waiting for connections...");

  // configure LED PWM functionalitites
  ledcSetup(LEDC_CHANNEL_0, LEDC_FREQ, LEDC_RESOLUTION);
  
  // attach the same channel to the GPIO to be controlled
  ledcAttachPin(pin_ledR, LEDC_CHANNEL_0);

  // for Blynk 
  Blynk.setDeviceName("Blynk-t");
  Blynk.begin(auth);
}

void loop()
{
  Blynk.run();
}
```

<br>

#### sketch 분석

Button 위젯 사용을 위해 사용하였던 예제 sketch에 다음의 라인을 추가하여야 한다.

<br>

1. LED가 연결되어 있는 ESP32 핀

```C
const int pin_ledR = 19;
```

<br>

2. Blynk App에서 ESP32로 신호를 보내는 Virtual 핀

```C
BLYNK_WRITE(V5) {                          // widget virtual pin(V5) -> ESP32
  int value_V5 = param.asInt();            // V5로 지정된 위젯의 값을 읽고
  ledcWrite(LEDC_CHANNEL_0, value_V5);     // PWM 채널0으로 보냄
  Serial.print("V5 value: "); Serial.println(value_V5);     // 시리얼모니터에 출력
}
```

<br>

3. LED에 PWM 신호 출력 (밝기 조절)

```C
  // configure LED PWM functionalitites
  ledcSetup(LEDC_CHANNEL_0, LEDC_FREQ, LEDC_RESOLUTION);
  
  // attach the same channel to the GPIO to be controlled
  ledcAttachPin(pin_ledR, LEDC_CHANNEL_0);
```

<br>

### Blynk App 설정

1. Button 위젯을 삭제한다. (그냥 두어도 관계없음)

{{< figure src="/image/blynk-pwm-02.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-pwm-03.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-pwm-04.png" width="33%" class="center" >}}

<br>

2. 프로젝트 바탕화면에서 ⊕버튼을 누른 후, Slider 위젯을 추가한다.

{{< figure src="/image/blynk-pwm-05.png" width="33%" class="center" >}}

<br>

3. 프로젝트 바탕화면의 Slider 위젯을 누른다.

{{< figure src="/image/blynk-pwm-06.png" width="33%" class="center" >}}

<br>

4. Slider 설정화면이 나오면,

{{< figure src="/image/blynk-pwm-07.png" width="33%" class="center" >}}

<br>

PIN을 누르고 사용할 Virual 핀을 선택한 뒤 OK버튼을 누른다. (여기서는 V5선택)

{{< figure src="/image/blynk-pwm-08.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-pwm-09.png" width="33%" class="center" >}}

<br>

5. 다음 3가지를 추가로 설정한다.
   - OUTPUT 범위 : 0 ~ 4095 (12bit 사용시)
   - SEND ON RELEASE : OFF (OFF 선택시 Slide를 조절하는 즉시 실시간으로 출력값 반영되며, ON 선택시 Slide에서 손가락을 떼면 출력값이 반영된다.)
   - WRITE INTERVAL : SEND ON RELEASE를 OFF로 선택시 나타나며, 100ms가 가장 작은 값이다.

<br>

{{< figure src="/image/blynk-pwm-10.png" width="33%" class="center" >}}

<br>

설정을 모두 마치면 상단의 뒤로가기 화살표를 눌러 프로젝트 바탕화면으로 돌아간다.

<br>

6. Slider 위젯을 1초이상 누르고 있으면 위젯의 위치와 크기를 조절할 수 있다. 위젯의 위치를 아래로 내리고 가로폭의 크기를 늘려본다.

{{< figure src="/image/blynk-pwm-11.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-pwm-12.png" width="33%" class="center" >}}

<br>

7. 이제 플레이(▷) 버튼을 누르고 Slide를 조절해본다.

{{< figure src="/image/blynk-pwm-13.png" width="33%" class="center" >}}

<br>

Slide값에 따라 LED의 밝기가 조절된다.

{{< figure src="/image/blynk-pwm-14.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-pwm-15.png" width="33%" class="center" >}}

<br>

8. Slider를 조절하는 동안 Arduino IDE의 시리얼 모니터값을 확인해볼 수 있다.

{{< figure src="/image/blynk-pwm-16.png" width="75%" class="center" >}}

