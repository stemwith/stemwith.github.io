---
title: "esp32 BLE, Blynk Button"
categories: ["esp32"]
date: 2019-10-21T23:12:58+09:00
toc: true
tags: ["iot"]
---
### Blynk를 처음 사용하는 경우


#### Blynk 라이브러리 설치하기

1.  docs.blynk.cc 접속 – Downloads – Blynk Library
2.  [https://github.com/blynkkk/blynk-library/releases/tag/v0.6.1](https://github.com/blynkkk/blynk-library/releases/tag/v0.6.1)
    *   Blynk\_Release\_v0.6.1.zip 다운로드
3.  압축을 풀면 libraries, tools 폴더가 보임
4.  이 두 폴더를 아두이노IDE의 기본 스케치북 위치로 복사하여 붙여넣기 함
    *   기존의 libraries 폴더와 합쳐짐
    *   기본 스케치북 위치 확인 방법
        *   아두이노IDE – 파일 – 환경설정 – 설정탭 – 스케치북 위치

<br>

#### 스마트폰에 Blynk App 설치하기

*   아이폰 : 애플 앱스토어
*   안드로이드 : 구글 플레이스토어

<br>

<br>

### 버튼 위젯을 이용한 LED On/Off 하기


#### schematic
![](/image/blynk-01.png)

※ RGB LED 모듈을 사용하는 경우에는 저항을 연결하지 않는다.

<br>

#### Blynk 설정

1. Blynk App 실행

{{< figure src="/image/blynk-02.png" width="33%" class="center" >}}

<br>

2. Create New Account : 주로 사용하는 e-mail을 사용하여 계정 생성 (계정이 이미 생성되어 있는 경우에는 Log In)

{{< figure src="/image/blynk-03.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-04.png" width="33%" class="center" >}}

<br>

3. New Project 생성 : ESP32_LED

{{< figure src="/image/blynk-05.png" width="33%" class="center" >}}

<br>

*   프로젝트명 : ESP32_LED
*   CHOOSE DEVICE : ESP32 Dev Board
*   CONNECTION TYPE : BLE

<br>

{{< figure src="/image/blynk-06.png" width="33%" class="center" >}}

<br>

4. Create를 누르면 Blynk 가입시 계정으로 사용한 이메일로 Auth Token 발송된다.

{{< figure src="/image/blynk-07.png" width="33%" class="center" >}}

<br>

5. OK버튼을 누르면 프로젝트가 생성된다.

{{< figure src="/image/blynk-08.png" width="33%" class="center" >}}

<br>

6. 컴퓨터를 사용하여 이메일 계정에 로그인 한 후, Auth Token을 복사한다. (복잡한 형태의 토큰을 코딩시 사용할 것이므로, 스마트폰인 아닌 컴퓨터에서 확인하여 복사하는 것이 좋다.)

![](/image/blynk-09.png)

<br>

7. Blynk 위젯 설정 : 생성된 프로젝트(ESP32\_LED) 바탕화면으로 진입하면 Blynk App 상단의 초록색 메뉴바의 이름이 "ESP32\_LED"로 바뀐다.

{{< figure src="/image/blynk-10.png" width="33%" class="center" >}}

<br>

만약, 아래와 같이 초록색 메뉴바의 이름이 "Blynk"로 되어있다면, 프로젝트 바탕화면으로 진입하지 못한 것이다. 이때에는 검은색 바탕화면의 "ESP32\_LED"프로젝트명을 확인한 후 터치하면 해당프로젝트로 진입할 수 있다. 기존에 다른 프로젝트를 만들어 둔 적이 있다면 검은색 바탕화면의 프로젝트명이 "ESP32\_LED"가 아닐 수도 있다. 이런 경우에는 스마트폰 화면을 좌우로 스크롤하여 프로젝트명을 변경한 후 진입한다.

{{< figure src="/image/blynk-11.png" width="33%" class="center" >}}

<br>

8. 프로젝트 바탕화면에서 ⊕버튼을 누른 후, Button 위젯과 BLE 위젯을 눌러 추가한다.

{{< figure src="/image/blynk-12.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-13.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-14.png" width="33%" class="center" >}}

<br>

9. 프로젝트 바탕화면에 두개의 위젯이 표시된다.

{{< figure src="/image/blynk-15.png" width="33%" class="center" >}}

<br>

10. BUTTON 위젯을 누르면 Buttom Settings 화면이 나타난다. 여기서 PIN부분을 누른다.

{{< figure src="/image/blynk-16.png" width="33%" class="center" >}}

<br>

11. LED를 연결한 PIN을 선택한다. 여기서는 Digital GP19를 선택하였다.

{{< figure src="/image/blynk-17.png" width="33%" class="center" >}}

<br>

12. OK버튼을 누르면 OUTPUT 버튼이 GP19로 설정된다. Mode는 SWITCH로 설정한다.

{{< figure src="/image/blynk-18.png" width="33%" class="center" >}}

<br>

13. Blynk App 상단의 뒤로가기 버튼을 누른뒤 프로젝트 바탕화면으로 간다.

{{< figure src="/image/blynk-19.png" width="33%" class="center" >}}

<br>

#### Blynk 연결하기

1. Arduino IDE에서 예제를 로드한다. **파일**\> **예제**\> **Blynk**\> **Boards_Bluetooth**> **ESP32_BLE**

![](/image/blynk-20.png)

<br>

2. 예제의 char auth\[\] = “YourAuthToken”; 부분을 찾아서 쌍따옴표 사이의 YourAuthToken을 지운 뒤, 이메일에서 복사한 AuthToken 붙여넣은 뒤, 다른 이름으로 저장한다.

![](/image/blynk-21.png)

<br>

![](/image/blynk-22.png)

<br>

3. 예제의 **Blynk.setDeviceName("Blynk");** 부분을 찾아 따옴표 안의 BLE Device 이름을 적당한 이름으로 바꿔준다. (※이름을 바꿔주지 않으면 주변의 다른 기기와 중복되어 오작동할 소지가 있으므로 반드시 다른 이름으로 바꿔주어야 한다.)

![](/image/blynk-23.png)

<br>

Device Name을 "Blynk-t"로 수정하였다.

![](/image/blynk-24.png)

<br>

4. ESP32에 스케치를 업로드한다. (업로드 시간이 Arduino에 비해 오래 걸림)

```C
#define BLYNK_PRINT Serial
#define BLYNK_USE_DIRECT_CONNECT

#include <BlynkSimpleEsp32_BLE.h>
#include <BLEDevice.h>
#include <BLEServer.h>

// You should get Auth Token in the Blynk App.
// Go to the Project Settings (nut icon).
char auth[] = "rc77E7UrbQHhoLE-LV1Ajxz.........";    // Edit Your Auth Token!!

void setup()
{
  // Debug console
  Serial.begin(115200);
  Serial.println("Waiting for connections...");

  Blynk.setDeviceName("Blynk-t");                     // Edit Your ESP32 Name!!!
  Blynk.begin(auth);
}

void loop()
{
  Blynk.run();
}
```

<br>

![](/image/blynk-25.png)

<br>

5. 이제 스마트폰의 Bluetooth기능을 키고, 위의 코드에서 수정한 Device Name을 찾아 연결한다.

{{< figure src="/image/blynk-26.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-27.png" width="33%" class="center" >}}

<br>

6. Blynk App에서 BLE버튼(블루투스 아이콘 모양)을 누른다.

{{< figure src="/image/blynk-28.png" width="33%" class="center" >}}

<br>

7. Connect BLE device 버튼을 누른다.

{{< figure src="/image/blynk-29.png" width="33%" class="center" >}}

<br>

8. 연결할 Device(여기서는 Blynk-t)를 선택하고 OK를 누른다.

{{< figure src="/image/blynk-30.png" width="33%" class="center" >}}

<br>

9. Connected 메세지가 나오면 연결 설정이 완료된 것이다.

{{< figure src="/image/blynk-31.png" width="33%" class="center" >}}

<br>

10. Blynk App 상단의 뒤로 돌아가기 버튼을 눌러 프로젝트 바탕화면으로 돌아간다.

{{< figure src="/image/blynk-32.png" width="33%" class="center" >}}

<br>

11. App 오른쪽 상단의 ▷(플레이버튼)버튼을 누른다.

{{< figure src="/image/blynk-33.png" width="33%" class="center" >}}

<br>

플레이버튼을 눌렀을 때, App상단에 빨간색 숫자1이 보이면 아직 연결이 되지 않았다는 것을 의미한다. 잠시 기다리면 빨간색 숫자1이 사라지고, 이 상태가 작동 준비가 완료된다.

{{< figure src="/image/blynk-34.png" width="33%" class="center" >}}

<br>

12. 현재 Button은 OFF 되어 있으며, 이에 따라 GPIO 19에 연결되어 있는 LED도 OFF되어 있다.

{{< figure src="/image/blynk-35.png" width="33%" class="center" >}}

<br>

13. Button을 누르면 ON 상태로 바뀌면서, LED가 ON 상태로 점등된다.

{{< figure src="/image/blynk-36.png" width="33%" class="center" >}}

<br>

14. 다시 Button을 누르면 OFF 상태로 바뀌면서, LED가 OFF 상태로 소등된다.

{{< figure src="/image/blynk-37.png" width="33%" class="center" >}}

<br>

15. 정지버튼을 누르면 플레이상태가 정지상태로 바뀌면서 프로젝트 바탕화면으로 돌아간다.

{{< figure src="/image/blynk-38.png" width="33%" class="center" >}}

<br>

{{< figure src="/image/blynk-39.png" width="33%" class="center" >}}

