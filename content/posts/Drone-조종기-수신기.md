---
title: "드론 Part2 조종기 FrSky TaranisQ X7 수신기 FrSky X8R"
categories: ["drone"]
date: 2021-08-02T18:27:53+09:00
toc: true
tags:
---

<br>

### 조종기 FrSky TaranisQ X7

#### Button

{{< figure src="/image/d/drone2_01.png" width="75%" class="center" >}}

<br>

#### 펌웨어 업데이트

① 펌웨어 다운로드: https://www.open-tx.org

- Installation> News>에서 최신 버전 OpenTX 클릭

* Download> SDCard> opentx-x7 클릭한 뒤, 최신버전의 zip파일 다운로드 후 압축해제

* Download> 본인 PC의 OS Companion 다운로드 (펌웨어 버전에 맞는 Companion 선택해야 함)

② Yaw, Roll 트림을 동시에 서로 안쪽으로 민 상태로 전원버튼을 누르면, Bootloader로 진입함

{{< figure src="/image/d/drone2_02.png" width="75%" class="center" >}}

③ TaranisQ X7 하단커버을 열고 miniUSB포트를 이용하여 PC와 연결하면,

{{< figure src="/image/d/drone2_03.png" width="75%" class="center" >}}

* Taranis 드라이브와 USB 드라이브 폴더가 열림 (USB 드라이버는 조정기에 삽입되어 있는 miniSD카드를 의미)

④ [한글 음성 파일 업데이트]

* 다운로드 경로: https://drive.google.com/file/d/1GVKBr7kgxWDjCjIttx5D6jugeeoedwVM/
* 1.의 과정에서 다운로드 한 새로운 펌웨어의 SOUND폴더의 en폴더에, 다운로드 한 한글 음성 파일 폴더(en)을 덮어씌운다.

⑤ USB 드라이브(조정기의 miniSD카드) 포맷 (오래 걸림)

* 파일시스템 FAT32

⑥ SOUND파일이 업데이트 된 새로운 펌웨어 파일 전체를 USB 드라이브에 복사한다. (오래 걸림)

⑦ 컴퓨터에 다운로드 받은 Companion 설치 후 실행

* [Radio Profile]

  Profile Name: My Profile (임의 지정)

  Radio Type: Taranis X7/X7S 선택

  Menu Language: en

  Build Option: noheli & lua 선택

* [Application Setting]

  Splash Screen Library: Show user and companion splash Images 선택

  (조정기를 킬 때 나타나는 이미지를 companion 제공 이미지로 바꿀 수 있음)

⑧ 좌측메뉴 두 번째의 Read Models and Settings from Radio 클릭 {{< figure src="/image/d/drone2_04.png" width="10%" class="center" >}}

* 기존에 입력해두었던 수신기 리스트 백업

⑨ 상단메뉴의 Download 클릭 {{< figure src="/image/d/drone2_05.png" width="10%" class="center" >}}

* 다운로드 경로 지정한 뒤 확인

⑩ 다운로드가 완료되면 확인

{{< figure src="/image/d/drone2_06.png" width="75%" class="center" >}}

⑪ 좌측메뉴 밑에서 세 번째 Write Firmware to Radio 클릭 {{< figure src="/image/d/drone2_07.png" width="10%" class="center" >}}

{{< figure src="/image/d/drone2_08.png" width="50%" class="center" >}}

⑫ 업데이트 하려는 범위에 버전이 맞는 지 확인 한 후, Write to TX 클릭. Flashing Done 이 표시되면 Close

{{< figure src="/image/d/drone2_09.png" width="75%" class="center" >}}

⑬ 좌측메뉴 밑에서 세 번째 Write Firmware to Radio 클릭 {{< figure src="/image/d/drone2_10.png" width="10%" class="center" >}}

{{< figure src="/image/d/drone2_11.png" width="50%" class="center" >}}

* Check Firmware compatibility 체크한 후 Write to RX 클릭 (백업했던 기존 수신기 등록자료 업데이트)

⑭ USB선 제거

{{< figure src="/image/d/drone2_12.png" width="50%" class="center" >}}

* 스크린에 업데이트한 펌웨어 버전이 표시되면 완료
* 다이얼을 돌려 Exit 선택 후 Enter 버튼
* 이때 EEPROM warning 이 표시될 수 있음 (Enter 버튼을 1~2회 누르면 됨)

<br>

#### Calibration

① 펌웨어 업데이트 후 Calibration을 먼저 진행한다.

② 메뉴 길게> Page 5차례 눌러서 6페이지에 Hardware> Calibration 선택 후 Enter

③ SET STICKS MIDPOINT

* 스틱을 모두 중립에 두고 Enter

④ MOVE STICKS/POTS

* 각 스틱을 4개의 모서리로 이동시키며 돌려줌

* 상단의 다이얼 돌려주고 중간에 위치시킨 뒤 (여러번 시행 후) Enter

⑤ Exit & Exit

<br>

#### Radio Setup

메뉴 길게> Page 2번 눌러서 3페이지에 Radio Setup

* Batt.range: 6.5-8.4 (2S배터리 이용시) (Enter와 다이얼 이용하여 설정)

* Alarms> Battery low: 6.5V

* Backlight> Duration: 30s

* Backlight> Brightness: 75

* Splash Screen: ---

* RX channel ord: **AERT**

* Mode 2

<br>

### 수신기 FrSky X8R

| X8R                                                     | 핀레일 (위:S, 중간:+, 아래:-)                          |
| ------------------------------------------------------- | ------------------------------------------------------ |
| {{< figure src="/image/d/drone2_13.png" width="75%" class="center" >}} | {{< figure src="/image/d/drone2_14.png" width="67%" class="center" >}} |

<br>

#### 조종기에 수신기 이름 설정

① 조종기 전원을 켜기(LCD 위쪽의 전원 버튼 5초간 누르기) (스로틀은 아래쪽으로 두어야 함)

{{< figure src="/image/d/drone2_15.png" width="75%" class="center" >}}

② 메뉴 버튼(≡) 짧게 누르기

{{< figure src="/image/d/drone2_16.png" width="75%" class="center" >}}

③ Page 버튼을 한번 누르고,

{{< figure src="/image/d/drone2_17.png" width="75%" class="center" >}}

④ Enter 버튼을 누른 뒤

⑤ 다이얼을 돌려 알파벳이나 숫자를 골른 뒤, 엔터 버튼을 눌러 모델 이름을 한글자씩 정해준다. 소문자를 고른 뒤 엔터 버튼을 길게 누르면, 대문자가 나타남

{{< figure src="/image/d/drone2_18.png" width="75%" class="center" >}}

<br>

#### 수신기 바인딩 & X8R 16채널 사용 설정

① Mode 4(D16) 설정 → 1-8ch S-bus, 9-16ch (1-8번 포트를 통한) Conventional Channel out

{{< figure src="/image/d/drone2_19.png" width="75%" class="center" >}}

② CH1&CH2, CH3&CH4 signal 핀을 아래 사진와 같이 점퍼를 사용하여 쇼트시킨다.

{{< figure src="/image/d/drone2_20.png" width="75%" class="center" >}}

③ 조종기의 SETUP 메뉴에서 다이얼을 돌려 Internal RF 메뉴가 나올 때까지 아래쪽으로 내려감

④ Internal RF> Mode> XJT D16 선택

* 펌웨어 2.3.1 이상부터 XJT 선택 가능 (낮은 펌웨어에서는 D16만 나타남)

* D8: XM 수신기를 사용할 경우
* D16: XM+ 이상급 (X8R, R-XSR 포함)

⑤ Internal RF> Ch.Range>

* CH1-8 전송속도 9ms (※ 8채널만 사용하면 CH1-8 선택 추천)

* CH1-16 선택시 전송속도 18ms

{{< figure src="/image/d/drone2_21.png" width="75%" class="center" >}}

⑥ Internal RF> RxNum (or Receiver)

* 수신기마다 다른 번호를 지정    ex) 첫 번째 바인딩할 수신기는 01로 지정

* [Bnd] 누르면 텔레메트리 선택창이 나옴

{{< figure src="/image/d/drone2_22.png" width="75%" class="center" >}}

* Ch9-16 Telem ON 선택하면, “띠리릭” 소리가 나면서 바인딩을 준비함

⑦ X8R 수신기 ‘F/S’ 버튼을 누르고 있는 상태에서,

{{< figure src="/image/d/drone2_23.png" width="50%" class="center" >}}

⑧ X8R에 전원을 연결

- 수신기가 이미 드론에 연결된 상태일 경우, 드론 FC에 메인 배터리 연결

* 혹은 4-10V 외부 배터리를 X8R (+),(-)에 연결 (중간 레일 (+)극, 아래쪽 레일 (-)극)

{{< figure src="/image/d/drone2_24.png" width="75%" class="center" >}}

⑨ F/S 버튼 아래쪽의 LED 녹색빨간색이 점멸 (이 상태는 조종기와 연결이 되었음을 의미)

* 누르고 있던 F/S 버튼을 떼고, 조종기의 [Bnd] 버튼을 누름 

⑩ X8R의 전원을 뺏다가 다시 공급했을 때, 수신기에 녹색불이 계속 켜져 있는 상태가 되면 바인딩 성공 (녹색발간색이 점멸하는 상태에서 10~30초 정도 대기하면 바인딩이 되면서 녹색불만 들어옴)

* 오래 기다려도 녹색불이 유지되지 않으면, 바인딩을 다시 해본다.

⑪ X8R에 쇼트시켰던 2개의 점퍼를 빼고, X8R Ch1 레일에 서보모터를 연결하여 테스트

* 조종기 MIXER 설정에서 Ch9에 스위치를 설정한뒤, 스위치를 토글하였을 때, 서보모터가 움직이면 OK

<br>

##### Failsafe 설정

Internal RF> Failsafe> Receiver로 설정 (수신기 신호가 끊어지면 Failsafe 작동)

<br>

##### External RF (CROSSFIRE) (선택사항)

External RF는 CROSSFIRE(CRSF) 수신기 (40km이상 장거리 수신)이 필요한 경우에 설정할 수 있다.

※ 추후 업데이트

<br>

#### 조종기 채널 할당

① 메뉴 짧게> Page 4번 눌러서 5페이지에 INPUTS

* (Ch8에 RSSI를 설정하는 경우) 【I】08에 RSSI 설정
* 【I】08으로 내려가서 Enter
* Name: rssi
* Source: 텔레메트리에서 찾았던 RSSI 선택
* Scale: 100dB

② 메뉴 짧게> Page 5번 눌러서 6페이지에 MIXER

* CH1~4는 기본 채널로 수정하지 않음

  * CH1 100【I】Thr

  * CH2 100【I】Ail

  * CH3 100【I】Ele

  * CH4 100【I】Rud

* 단, QGround Control을 사용할 경우,
  * CH1 100【I】Ele
  * CH2 100【I】Ail
  * CH3 100【I】Thr
  * CH4 100【I】Rud

③ CH5 비행모드 설정

* CH5로 이동하여 Enter

* Mix name: F-Mode

* Source: Enter키 누르고, 모드키로 할당할 3단 스위치(SB)를 움직이면, 소스가 SB로 변경

④ CH6 아밍 설정

* CH6로 이동하여 Enter

* Mix name: Arm

* Source: Enter키 누르고, 아밍키로 할당할 스위치(SF)를 움직이면, 소스가 SF로 변경

⑤ CH7 RTL or 부저 설정

* CH7로 이동하여 Enter

* Mix name: RTL or Buz

* Source: Enter키 누르고, RTL (or Buz)키로 할당할 스위치(SA)를 움직이면, 소스가 SA로 변경

⑥ CH8은 필요에 따라 RSSI로 할당 (X8R, XSR 등 텔레메트리 지원 수신기인 경우)

* 메뉴 짧게> Page 10번 눌러서 12페이지에 TELEMETRY

{{< figure src="/image/d/drone2_25.png" width="75%" class="center" >}}

* TELEMETRY> Sensors> Discover new sensors 선택

{{< figure src="/image/d/drone2_26.png" width="75%" class="center" >}}

​       센서가 발견되면 Stop Discovery, Exit 버튼을 눌러서 빠져나감

* 메뉴 짧게> Page 6번 눌러서 6페이지에 MIXER

  * CH8로 이동하여 Enter

  * Mix name: rssi

  * Source: Enter키 누르고

  * Weight: 200

  * Offset: -100 (채널범위는 –100~100, 즉 200의 범위인데, RSSI는 0~100까지의 값만 갖기 때문)

​         ※ XM, XM+ 등은 이미 채널이 할당되어 있으므로 위와 같이 INPUT, MIXER를 설정할 필요 없음

⑨ QGC에서 RC_RSSI_PWM_CHAN: Channel 8 로 변경

<br>

#### FrSky 수신기 리스트

{{< figure src="/image/d/drone2_29.png" width="100%" class="center" >}}

<br>

#### FrSky RX8R 수신기 메뉴얼

{{< figure src="/image/d/drone2_30.png" width="75%" class="center" >}}

{{< figure src="/image/d/drone2_31.png" width="75%" class="center" >}}
