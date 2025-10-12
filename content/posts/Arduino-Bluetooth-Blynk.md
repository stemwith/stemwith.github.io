---
title: "Arduino, Bluetooth, Blynk"
date: 2019-10-20T23:10:53+09:00
categories: ["arduino"]
toc: true
tags: ["iot"]
---
### Blynk 설정

#### Blynk 라이브러리 설치
1.  docs.blynk.cc 접속 – Downloads – Blynk Library
2.  https://github.com/blynkkk/blynk-library/releases/tag/v0.6.1
    *   Blynk\_Release\_v0.6.1.zip 다운로드
3.  압축을 풀면 libraries, tools 폴더가 보임
4.  이 두 폴더를 아두이노IDE의 기본 스케치북 위치로 복사하여 붙여넣기 함
    *   기존의 libraries 폴더와 합쳐짐
    *   기본 스케치북 위치 확인 방법
        *   아두이노IDE – 파일 – 환경설정 – 설정탭 – 스케치북 위치

<br>

#### 스마트폰에 Blynk App 다운로드 하여 설치하기
*   아이폰 : 애플 앱스토어
*   안드로이드 : 구글 플레이스토어

<br>

<br>

### 버튼 위젯을 이용한 LED On/Off 하기

#### Blynk 계정생성 및 Auth Token 받기

1.  Blynk App 실행
2.  Create New Account : 주로 사용하는 e-mail을 사용하여 계정 생성
3.  Blynk에서 New Project 생성
    *   아이폰용 MLT-BT05의 경우
        *   Project Name 설정: BLE Test
        *   CHOOSE DEVICE: Arduino UNO
        *   CONNECTION TYPE: BLE
        *   설정 후 Create 버튼
    *   안드로이드용 HC-06의 경우
        *   Project Name 설정: HC-06 Test
        *   CHOOSE DEVICE: Arduino UNO
        *   CONNECTION TYPE: Bluetooth
        *   설정 후 Create 버튼
4.  Auth Token 확인
    *   가입시 지정한 이메일로 로그인하여 토큰 확인
    *   (매우 복잡한 형태의) 토큰을 복사하여 코딩시 사용할 것이므로, 컴퓨터로 확인!
    *   스마트폰으로 확인하는 것은 무의미함

<br>

#### Blynk 위젯 설정
1.  아이폰용 MLT-BT05를 사용할 경우
    *   생성된 프로젝트(BLE Test) 바탕화면으로 진입하면 Blynk App 상단의 초록색 메뉴바의 이름이 BLE Test로 바뀜
    *   여기서 ⊕버튼 터치한 후 Button위젯과 BLE위젯 추가
    *   추가된 BUTTON 위젯 선택 후 설정
        *   OUTPUT: Select pin: Digital D13 / MODE: SWITCH
2.  안드로이드용 HC-06를 사용할 경우
    *   생성된 프로젝트(HC-06 Test) 바탕화면으로 진입하면 Blynk App 상단의 초록색 메뉴바의 이름이 HC-06 Test로 바뀜
    *   여기서 ⊕버튼 터치한 후 Button위젯과 Bluetooth위젯 추가
    *   추가된 BUTTON 위젯 선택 후 설정
        *   OUTPUT: Select pin: Digital D13 / MODE: SWITCH

<br>

#### Blynk 연결하기
1.  아두이노 스케치 예제 불러오기
    *   파일 – 예제 – Blynk – Boards\_USB\_Serial – Arduino_SoftwareSerial 선택
    *   예제의 char auth\[\] = "YourAuthToken"; 부분을 찾아서 쌍따옴표 사이의 YourAuthToken을 지운 뒤, 이메일에서 복사한 AuthToken 붙여넣기
2.  아두이노 UNO에 스케치 업로드
3.  스마트폰의 블루투스 기능을 키고,
    *   아이폰용 MLT-BT05의 경우
        *   Bluetooth 모듈 설정에서 설정한 모듈ID 디바이스를 연결(예를 들어 MLT-BT05-**T**) (디폴트 연결PIN 123456)
        *   Blynk App에서 BLE버튼(블루투스 아이콘 모양) 터치 후 Connect BLE device 버튼을 누른 뒤,
        *   연결할 디바이스 MLT-BT05-T를 찾은 후 OK버튼 누름
        *   MLT-BT05-T connected 메시지가 나오면 연결 완료된 것임
    *   안드로이드용 HC-06의 경우
        *   Bluetooth 모듈 설정에서 설정한 모듈ID 디바이스를 연결(예를 들어 HC-06-**T** 디바이스를 연결 (디폴트 연결PIN 1234)
        *   Blynk App에서 Bluetooth버튼(블루투스 아이콘 모양) 터치 후 Connect Bluetooth device 버튼을 누른 뒤,
        *   연결할 디바이스 HC-06-T를 찾은 후 OK버튼 누름
        *   HC-06-T connected 메시지가 나오면 연결 완료된 것임
4.  Blynk App 상단의 뒤로 돌아가기 버튼을 누른 뒤, App 오른쪽 상단의 ▷(플레이버튼)버튼을 누름
    *   App상단에 빨간색 숫자1이 보이면 아직 연결이 되지 않았다는 것을 의미함
    *   잠시 기다리면 빨간색 숫자1이 사라지고, 이 상태가 작동 준비가 완료된 것을 의미함
5.  BUTTON 아이콘을 눌러 ON/OFF → 아두이노 Built-in LED ON/OFF
6.  Blynk App 오른쪽 상단의 □(정지버튼)을 누른 뒤, ⊕버튼 터치한 후 Text Input 위젯 추가

<br>

<br>


### 슬라이더 위젯을 이용한 LED 밝기 제어
Built-in LED가 사용하는 13번핀은 PWM이 지원되지 않으므로, 11번핀을 사용한다.

{{< figure src="/image/BT-19.jpg" width="75%" class="center" >}}

<br>

#### sketch
아두이노 스케치는 그대로 사용 (위의 "Blynk 연결하기" 부분 스케치 참고)

<br>

#### Blynk 앱 설정
1.  버튼 위젯을 삭제: 버튼 위젯을 누르고 맨아래쪽으로 내려가서 Delete
2.  Slider 위젯 추가: OUTPUT D11
3.  Slider 위젯의 위치/크기 조절: Slider 위젯 아이콘을 1초이상 누르면 위치/크기를 조절할 수 있음 (가로 크기를 최대로 늘림)
4.  App 오른쪽 상단의 ▷(플레이버튼)버튼을 누름
5.  슬라이드를 조절하여 LED의 밝기 조절 확인

<br>

<br>

### 과제
3색 RGB LED를 zeRGBa 위젯으로 조정하여 여러 가지 색깔 만들어보기 (스케치는 위의 스케치를 그대로 사용)