---
title: "esp32 OpenWeatherMap에서 실시간 날씨 정보 받기"
categories: ["esp32"]
date: 2019-11-19T18:27:53+09:00
toc: true
tags: ["iot"]
---
### OpenWeatherMap.org

[OpenWeatherMap]( https://openweathermap.org/ )은 세계 각 지역의 현재 날씨, 예보, 과거 날씨 데이터를 제공하는 사이트입니다. (몇가지 제약이 있긴 하지만) 회원가입을 통해서 API Key를 생성하고 이를 통해 무료로 실시간 날씨 정보를 얻을 수 있습니다.

<br>

#### Free Current weather and forecasts collection

- 60 Calls per minute (no more than)
- [Current weather API](https://openweathermap.org/current)
- [5 days/3 hour forecast API](https://openweathermap.org/forecast5)
- [Weather maps 1.0](https://openweathermap.org/api/weathermaps) 
- [UV index](https://openweathermap.org/api/uvi) 
- [Weather alerts](https://openweathermap.org/triggers) 
- Availability 95% 
- Weather API data update  < 2 hours
- Weather maps data update  < 3 hours
- API lifetime support :  Current version
- Historical weather collection은 모두 Starter 이상(유료)

<br>

#### Current weather collections API Key 생성

1. Sign Up을 클릭하여 회원가입을 하고,

   {{< figure src="/image/owm-api-01.png" width="75%" class="center" >}}

   <br>

   {{< figure src="/image/owm-api-02.png" width="75%" class="center" >}}

   <br>

2. Sign In을 클릭하여 로그인한 뒤, API Keys를 누릅니다.

   {{< figure src="/image/owm-api-03.png" width="75%" class="center" >}}

   <br>

   {{< figure src="/image/owm-api-04.png" width="75%" class="center" >}}

   <br>

3.  Default로 지정되어 있는 Key를 복사하거나, 새로운 Key를 생성합니다.

   {{< figure src="/image/owm-api-05.png" width="75%" class="center" >}}

<br>

4. API Key를 이용하는 방법은 메인홈페이지 메뉴의 API 탭을 누른뒤, 얻고자 하는 날씨정보(예를 들어 Current weather data)의 [**API doc**](https://openweathermap.org/api)을 참고하세요.

   {{< figure src="/image/owm-api-06.png" width="75%" class="center" >}}

5. 먼저 인터넷 브라우저를 통해 날씨정보가 어떻게 출력되는지 알아보기위하여 아래 홈페이지 주소에 접속해봅니다. 이때 주소의 끝부분에 있는 YOUR_API_KEY 대신 본인의 API Key를 입력합니다.

<br>

- 서울: https://api.openweathermap.org/data/2.5/weather?q=Seoul,KR&units=metric&APPID=YOUR_API_KEY

```http
https://api.openweathermap.org/data/2.5/weather?q=Seoul,KR&units=metric&APPID=1bf3d5e1bd2e5934aadd86..........
```

<br>

- 런던: https://api.openweathermap.org/data/2.5/weather?q=London,GB&units=metric&appid=YOUR_API_KEY

```http
https://api.openweathermap.org/data/2.5/weather?q=London,GB&units=metric&APPID=1bf3d5e1bd2e5934aadd86..........
```

<br>

- 상하이: https://api.openweathermap.org/data/2.5/weather?q=Shanghai,CN&units=metric&APPID=YOUR_API_KEY


```http
https://api.openweathermap.org/data/2.5/weather?q=Shanghai,CN&units=metric&APPID=1bf3d5e1bd2e5934aadd86..........
```

<br>

#### 브라우저에 출력되는 내용

```json
{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":277.16,"pressure":1007,"humidity":86,"temp_min":274.82,"temp_max":279.26},"visibility":8000,"wind":{"speed":5.1,"deg":90},"clouds":{"all":90},"dt":1574300635,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1574321288,"sunset":1574352288},"timezone":0,"id":2643743,"name":"London","cod":200}
```

<br>

그밖의 도시 및 국가명은 Maps> Weather maps를 클릭하여 표시되는 지도를 통해 확인할 수 있습니다.

<br>

<br>

### ESP32에서 사용하는 경우

#### wifi 접속 설정

```C++
const char* ssid     = "your ssid";                  // 연결할 SSID
const char* password = "your password";              // 연결할 SSID의 비밀번호
```

- wifi에 접속하기 위한 ssid와 password를 설정

<br>

#### OpenWeatherMap.org 접속 설정

```C++
const String endpoint = "https://api.openweathermap.org";
const String ver = "/data/2.5/weather?q=";
const String city = "Shanghai,CN";                 // City,Country (띄어쓰기 금지)
const String appid = "&units=metric&APPID=";       // Units: metric
const String key = "1bf3d5e1bd2e5934aadd86..........";    // API Key
```

- 날씨 데이터를 받아올 도시, 국가를 지정 (Shanghai,CN)  (※주의: **Shanghai,CN** 사이에 **띄어쓰기를 하면 안됨**)
- key 변수에 본의 API Key를 입력

<br>

#### sketch

```C++
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "your ssid";                  // 연결할 SSID
const char* password = "your password";              // 연결할 SSID의 비밀번호

// OpenWeatherMap.org: Shanghai,CN
const String endpoint = "https://api.openweathermap.org";
const String ver = "/data/2.5/weather?q=";
const String city = "Shanghai,CN";                 // City,Country (띄어쓰기 금지)
const String appid = "&units=metric&APPID=";       // Units: metric
const String key = "1bf3d5e1bd2e5934aadd86..........";    // API Key

void setup() {
    Serial.begin(115200);
    delay(10);
    
    WiFi.begin(ssid, password);

    // 와이파이 연결
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Connecting to WiFi..");
    }

    Serial.println("Connected to the WiFi network");
}

// 연결 여부 로그 출력
void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {    // Check the current connection status
 
    HTTPClient http;
 
    http.begin(endpoint + ver + city + appid + key); // Specify the URL
    int httpCode = http.GET();                       // Make the request
 
    if (httpCode > 0) {                              // Check for the returning code
 
        String json = http.getString();         // get JSON format data
        Serial.println(httpCode);
        Serial.println(json);
    }
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end();                                     // Free the resources
  }
 
  delay(30000); 
}
```

<br>

#### 출력 DATA

출력 데이터는 **JSON**(JavaScript Object Notation)을 기반으로 합니다. JSON은 프로그래밍 언어에 관계없이 데이터를 생성하고 읽을 수 있도록 만들어졌으며, 이를 통해 상호간에 보다 쉽게 데이터를 교환이 가능한 텍스트 기반의 데이터 교환 방식입니다. OpenWeatherMap에서도 이 방식을 사용하여 날씨 데이터를 생성하여 출력하고 있으며, 출력 데이터의 형태는 아래와 같습니다.

> 스케치 맨 아래라인의 delay 명령으로 인해 10초마다 1번씩 data를 출력합니다. 단, OpenWeatherMap free service의 update time이 2시간 이하로 되어 있으므로, 자료 갱신이 매 출력시마다 진행되지는 않습니다.

{{< figure src="/image/owm-01.png" width="75%" class="center" >}}

<br>

Firefox 등의 몇몇 인터넷 브라우저에서는 JSON 데이터를 보다 직관적으로 이해할 수 있도록 계층별로 나누어 출력해주기도 합니다.

{{< figure src="/image/owm-02.png" width="50%" class="center" >}}

<br>

<br>

### JSON Parsing

위와 같이 복잡한 형태로 출력되는 날씨 데이터 중에서 필요한 날씨 정보를 추출하기 위하여 JSON (JavaScript Object Notation) 파싱 과정을 거쳐야 하는데요. 이를 위해 아두이노 IDE에서 Json 파싱을 위한 라이브러리를 설치하여야 합니다.

<br>

#### 라이브러리 설치

ArduinoJson (by Benoit Blanchon) 라이브러리 (version 6)를 설치합니다.

**스케치**> **라이브러리 포함하기**> **라이브러리 관리**

{{< figure src="/image/json-01.png" width="75%" class="center" >}}

<br>

{{< figure src="/image/json-02.png" width="75%" class="center" >}}

<br>

#### Memory pool 크기 계산

1. JSON 파싱에 사용할 배열의 크기를 계산하여 메모리를 확보합니다. 이를 위해 샘플로 사용할 JSON데이터가 필요하므로, 먼저 웹브라우저에서 OpenWeatherMap에 접속한 뒤,

```http
https://api.openweathermap.org/data/2.5/weather?q=Shanghai,CN&units=metric&APPID=1bf3d5e1bd2e5934aadd86..........
```

<br>

2. 출력되는 JSON 데이터를 드래그하여 복사합니다.

```json
{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":277.16,"pressure":1007,"humidity":86,"temp_min":274.82,"temp_max":279.26},"visibility":8000,"wind":{"speed":5.1,"deg":90},"clouds":{"all":90},"dt":1574300635,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1574321288,"sunset":1574352288},"timezone":0,"id":2643743,"name":"London","cod":200}
```

<br>

3. https://arduinojson.org/assistant 에 접속한 뒤, **Input**란에 있는 내용을 모두 지우고 복사한 JSON데이터를 붙여넣기하면, Memory pool size가 자동으로 계산됩니다.

{{< figure src="/image/owm-04.png" width="75%" class="center" >}}

<br>

4. Memory pool size의 Expression부분을 드래그하여 복사하고, Additional bytes for strings dubplucation 부분의 숫자를 이용하여 스케치에서 다음의 형식으로 변수를 생성합니다.

```C++
const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + 2*JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(13) + 240;
```

> 실제로는 아래 Parsing Program에 이미 변수가 설정되어 있으므로, 이 과정은 수행하지 않아도 됩니다.

<br>

#### Parsing program

1. Memory pool size가 출력된 화면의 아래쪽에 Parsing program도 함께 출력됩니다.

{{< figure src="/image/owm-05.png" width="75%" class="center" >}}

<br>

2. 우선 Parsing Program 전체를 복사한 뒤, 스케치의 void loop() 부분에 붙여넣기 합니다.

<br>

3. 밑줄친 부분의 json 변수가 나타나 있는 라인을 모두 지우고 

```C++
const char* json = "{\"coord\":{\"lon\":121.49,\"lat\":31.23},\"weather\":[{\"id\":804,\"main\":\"Clouds\",\"description\":\"overcast clouds\",\"icon\":\"04d\"}],\"base\":\"stations\",\"main\":{\"temp\":293.02,\"pressure\":1027,\"humidity\":55,\"temp_min\":289.82,\"temp_max\":298.71},\"visibility\":10000,\"wind\":{\"speed\":3,\"deg\":60},\"clouds\":{\"all\":94},\"dt\":1574303919,\"sys\":{\"type\":1,\"id\":9659,\"country\":\"CN\",\"sunrise\":1574288762,\"sunset\":1574326426},\"timezone\":28800,\"id\":1796236,\"name\":\"Shanghai\",\"cod\":200}";
```

<br>

4.  OpenWeatherMap에서 실시간으로 받는 String 형식의 데이터 변수로 바꿔줍니다.

```C++
String json = http.getString();
```

<br>

5. Timezone 반영을 위하여, 붙여넣기 한 Parsing program의 아래 부분에 아래 내용을 추가합니다.

```C++
dt = dt + timezone;                     // for GMT+8 -> +28800, for GMT+9 -> +32400
sys_sunrise = sys_sunrise + timezone;
sys_sunset = sys_sunset + timezone;
```

<br>

6. UNIX Timestamp로 표기되는 시간을 일반적인 날짜, 시간으로 표기되도록 변환해줍니다. 이를 위해서 timelib.h 파일을 이용해야하는데, 이 파일은 Time 라이브러리(by Michael Margolis)에 포함되어 있지요. 그러므로 라이브러리 매니저를 통해 Time라이브러리를 찾아 설치해줍니다.

   {{< figure src="/image/owm-10.png" width="75%" class="center" >}}

```C++
year(dt), month(dt), day(dt), hour(dt), minute(dt), second(dt), weekday(dt));
```

​		위의 스케치를 통해서 UTC를 YYYY.MM.DD HH:MM:SS(요일) 형태의 날짜를 변환하며, printf문을 통해 출력할 수 있습니다.

<br>

#### Data 출력에 사용한 variables

JSON 형식의 데이터를 파싱할때 사용한 변수들입니다.

| 내용                | 형식        | 변수                       | unit |
| ------------------- | ----------- | -------------------------- | ---- |
| UNIX Time(UTC)      | long        | dt                         |      |
| Weather ID          | int         | weather_0_id               |      |
| Weather Main        | const char* | weather_0_main             |      |
| Weather Description | const char* | weather_0_description      |      |
| Weather Icon ID     | const char* | weather_0_icon             |      |
| Temperature         | float       | main_temp                  | ℃    |
| Temperature Max.    | float       | main_temp_max              | ℃    |
| Temperature Min.    | float       | main_temp_min              | ℃    |
| Pressure            | int         | main_pressure              | hPa  |
| Humidity            | int         | main_humidity              | %    |
| Visibility          | int         | visibility                 | m    |
| Wind Speed          | int         | wind_speed                 | m/s  |
| Wind Degree         | int         | wind_deg                   | º    |
| Clouds              | int         | clouds_all                 |      |
| Sunrise             | long        | sys_sunrise                |      |
| Sunset              | long        | sys_sunset                 |      |
| City ID             | long        | id                         |      |
| City name           | const char* | name                       |      |
| Country             | const char* | sys_country                |      |
| Longitude           | float       | coord_lon                  | º    |
| Latitude            | float       | coord_lat                  | º    |
| GMT                 | int         | timezone  (※timezone/3600) | hour |
|                     | int         | sys_type                   |      |
|                     | int         | sys_id                     |      |
| Base                | const char* | base                       |      |
| COD                 | int         | cod                        |      |

<br>

<br>

#### sketch: 전체

위의 과정을 통해 만들진 부분 스케치를 병합하여 JSON 파싱을 위한 전체 스케치를 구성해봅니다.

> ArduinoJson 라이브러리의 경우 version 5와 6의 사용 문법이 조금 다릅니다. 현재 Arduino IDE에서 라이브러리 추가과정을 통해 다운로드 받을 수 있는 최신 라이브러리 버전이 ArduinoJson 6이므로, 이에 맞게 작성하여야합니다. (기존의 ArduinoJson 5에 맞게 작성된 스케치는 컴파일이 되지 않으므로, [Migrating from version 5 to 6](https://arduinojson.org/v6/doc/upgrade/) 문서를 참고하여 스케치를 변경해야 합니다.)

```C++
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <TimeLib.h>
 
const char* ssid     = "your ssid";                  // 연결할 SSID
const char* password = "your password";              // 연결할 SSID의 비밀번호
 
const String endpoint = "https://api.openweathermap.org";
const String ver = "/data/2.5/weather?q=";
const String city = "Shanghai,CN";                 // City,Country (띄어쓰기 금지)
const String appid = "&units=metric&APPID=";       // Units: metric
const String key = "1bf3d5e1bd2e5934aadd86..........";    // API Key

unsigned long offset_days = 3;     // 3 days for convert unix timestamp to datetime

void setup() {
 
  Serial.begin(115200);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
}
 
void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {      // Check the current connection status
 
    HTTPClient http;
 
    http.begin(endpoint + ver + city + appid + key); // Specify the URL
    int httpCode = http.GET();                       // Make the request
 
    if (httpCode > 0) {                              // Check for the returning code
      // 데이터 파싱
      const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + 2*JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(13) + 270;
      DynamicJsonDocument doc(capacity);

      String json = http.getString();                // get JSON format data

      deserializeJson(doc, json);

      float coord_lon = doc["coord"]["lon"]; // 121.49
      float coord_lat = doc["coord"]["lat"]; // 31.23

      JsonObject weather_0 = doc["weather"][0];
      int weather_0_id = weather_0["id"]; // 804
      const char* weather_0_main = weather_0["main"]; // "Clouds"
      const char* weather_0_description = weather_0["description"]; // "overcast clouds"
      const char* weather_0_icon = weather_0["icon"]; // "04d"

      /*
      JsonObject weather_1 = weather[1];
      int weather_1_id = weather_1["id"]; // 701
      const char* weather_1_main = weather_1["main"]; // "Mist"
      const char* weather_1_description = weather_1["description"]; // "mist"
      const char* weather_1_icon = weather_1["icon"]; // "50n"

      JsonObject weather_2 = weather[2];
      int weather_2_id = weather_2["id"]; // 741
      const char* weather_2_main = weather_2["main"]; // "Fog"
      const char* weather_2_description = weather_2["description"]; // "fog"
      const char* weather_2_icon = weather_2["icon"]; // "50n"
      */

      const char* base = doc["base"]; // "stations"

      JsonObject main = doc["main"];
      float main_temp = main["temp"]; // 293.02
      int main_pressure = main["pressure"]; // 1027
      int main_humidity = main["humidity"]; // 55
      float main_temp_min = main["temp_min"]; // 289.82
      float main_temp_max = main["temp_max"]; // 298.71

      int visibility = doc["visibility"]; // 10000

      int wind_speed = doc["wind"]["speed"]; // 3
      int wind_deg = doc["wind"]["deg"]; // 60

      int clouds_all = doc["clouds"]["all"]; // 94
      
      long dt = doc["dt"]; // 1574303919

      JsonObject sys = doc["sys"];
      int sys_type = sys["type"]; // 1
      int sys_id = sys["id"]; // 9659
      //float sys_message = sys["message"]; // Internal parameter (0.0226)
      const char* sys_country = sys["country"]; // "CN"
      long sys_sunrise = sys["sunrise"]; // 1574288762
      long sys_sunset = sys["sunset"]; // 1574326426

      int timezone = doc["timezone"]; // 28800
      long id = doc["id"]; // 1796236
      const char* name = doc["name"]; // "Shanghai"
      int cod = doc["cod"]; // 200

      dt = dt + timezone;                // for GMT+8 -> +28800, for GMT+9 -> +32400
      sys_sunrise = sys_sunrise + timezone;
      sys_sunset = sys_sunset + timezone;

      //int main_sea_level = main["sea_level"]; // Atmospheric pressure hPa on the sea level
      //int main_grnd_level = main["grnd_level"]; // Atmospheric pressure hPa on the ground level     
      //int rain_1h = doc["rain"]["1h"]; // Rain volume for the last 1 hour, mm
      //int rain_3h = doc["rain"]["3h"]; // Rain volume for the last 3 hour, mm
      //int snow_1h = doc["snow"]["1h"]; // Snow volume for the last 1 hour, mm
      //int snow_3h = doc["snow"]["3h"]; // Snow volume for the last 3 hour, mm

      //데이터 출력
      Serial.print("UNIX Time of Weather: "); Serial.println(dt);
      Serial.printf("Time of Weather: %4d-%02d-%02d %02d:%02d:%02d(%1d)\n", year(dt), month(dt), day(dt), hour(dt), minute(dt), second(dt), weekday(dt));
      Serial.print("Weather ID: "); Serial.println(weather_0_id);
      Serial.print("Weather Main: "); Serial.println(weather_0_main);
      Serial.print("Weather Description: "); Serial.println(weather_0_description);
      Serial.print("Weather Icon: "); Serial.println(weather_0_icon);
      Serial.print("Temperature(℃): "); Serial.println(main_temp);
      Serial.print("Temperature Max(℃): "); Serial.println(main_temp_max);
      Serial.print("Temperature Min(℃): "); Serial.println(main_temp_min);
      Serial.print("Pressure(hPa): "); Serial.println(main_pressure);
      Serial.print("Humidity(%): "); Serial.println(main_humidity);
      Serial.print("Visibility(m): "); Serial.println(visibility);
      Serial.print("Wind Speed(m/s): "); Serial.println(wind_speed);
      Serial.print("Wind Degree(º): "); Serial.println(wind_deg);
      Serial.print("Clouds: "); Serial.println(clouds_all);
      Serial.printf("Sunrise: %02d:%02d:%02d\n", hour(sys_sunrise), minute(sys_sunrise), second(sys_sunrise));
      Serial.printf("Sunset:  %02d:%02d:%02d\n", hour(sys_sunset), minute(sys_sunset), second(sys_sunset));
      Serial.print("City/Country: "); Serial.print(name); Serial.print("/"); Serial.println(sys_country);
      Serial.print("longitude/latidude: "); Serial.print(coord_lon); Serial.print("/"); Serial.println(coord_lat);
      Serial.print("Timezone: GMT+"); Serial.println(timezone/3600);

      /*
      Serial.print("Sea Level(hPa): "); Serial.println(main_sea_level);
      Serial.print("Ground Level(hPa): "); Serial.println(main_grnd_level);
      Serial.print("Rain 1h(mm): "); Serial.println(rain_1h);
      Serial.print("Rain 3h(mm): "); Serial.println(rain_3h);
      Serial.print("Snow 1h(mm): "); Serial.println(snow_1h);
      Serial.print("Snow 3h(mm): "); Serial.println(snow_3h);
      */
    }
 
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end();
  }
 
  delay(30000);
}
```

<br>

#### 출력 Data

{{< figure src="/image/owm-03.png" width="75%" class="center" >}}

<br>

<br>

### Weather Condition Code

#### Group 2xx: Thunderstorm

| ID   | Main         | Description                     | Icon                                                    |
| ---- | ------------ | ------------------------------- | ------------------------------------------------------- |
| 200  | Thunderstorm | thunderstorm with light rain    | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 201  | Thunderstorm | thunderstorm with rain          | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 202  | Thunderstorm | thunderstorm with heavy rain    | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 210  | Thunderstorm | light thunderstorm              | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 211  | Thunderstorm | thunderstorm                    | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 212  | Thunderstorm | heavy thunderstorm              | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 221  | Thunderstorm | ragged thunderstorm             | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 230  | Thunderstorm | thunderstorm with light drizzle | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 231  | Thunderstorm | thunderstorm with drizzle       | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |
| 232  | Thunderstorm | thunderstorm with heavy drizzle | {{< figure src="http://openweathermap.org/img/wn/11d@2x.png" alt="img" width="50%" class="center" >}} 11d |

<br>

#### Group 3xx: Drizzle

| ID   | Main    | Description                   | Icon                                                    |
| ---- | ------- | ----------------------------- | ------------------------------------------------------- |
| 300  | Drizzle | light intensity drizzle       | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 301  | Drizzle | drizzle                       | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 302  | Drizzle | heavy intensity drizzle       | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 310  | Drizzle | light intensity drizzle rain  | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 311  | Drizzle | drizzle rain                  | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 312  | Drizzle | heavy intensity drizzle rain  | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 313  | Drizzle | shower rain and drizzle       | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 314  | Drizzle | heavy shower rain and drizzle | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 321  | Drizzle | shower drizzle                | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |

<br>

#### Group 5xx: Rain

| ID   | Main | Description                 | Icon                                                    |
| ---- | ---- | --------------------------- | ------------------------------------------------------- |
| 500  | Rain | light rain                  | {{< figure src="http://openweathermap.org/img/wn/10d@2x.png" alt="img" width="50%" class="center" >}} 10d |
| 501  | Rain | moderate rain               | {{< figure src="http://openweathermap.org/img/wn/10d@2x.png" alt="img" width="50%" class="center" >}} 10d |
| 502  | Rain | heavy intensity rain        | {{< figure src="http://openweathermap.org/img/wn/10d@2x.png" alt="img" width="50%" class="center" >}} 10d |
| 503  | Rain | very heavy rain             | {{< figure src="http://openweathermap.org/img/wn/10d@2x.png" alt="img" width="50%" class="center" >}} 10d |
| 504  | Rain | extreme rain                | {{< figure src="http://openweathermap.org/img/wn/10d@2x.png" alt="img" width="50%" class="center" >}} 10d |
| 511  | Rain | freezing rain               | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 520  | Rain | light intensity shower rain | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 521  | Rain | shower rain                 | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 522  | Rain | heavy intensity shower rain | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |
| 531  | Rain | ragged shower rain          | {{< figure src="http://openweathermap.org/img/wn/09d@2x.png" alt="img" width="50%" class="center" >}} 09d |

<br>

#### Group 6xx: Snow

| ID   | Main | Description         | Icon                                                    |
| ---- | ---- | ------------------- | ------------------------------------------------------- |
| 600  | Snow | light snow          | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 601  | Snow | Snow                | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 602  | Snow | Heavy snow          | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 611  | Snow | Sleet               | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 612  | Snow | Light shower sleet  | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 613  | Snow | Shower sleet        | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 615  | Snow | Light rain and snow | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 616  | Snow | Rain and snow       | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 620  | Snow | Light shower snow   | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 621  | Snow | Shower snow         | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |
| 622  | Snow | Heavy shower snow   | {{< figure src="http://openweathermap.org/img/wn/13d@2x.png" alt="img" width="50%" class="center" >}} 13d |

<br>

#### Group 7xx: Atmosphere

| ID   | Main    | Description       | Icon                                                    |
| ---- | ------- | ----------------- | ------------------------------------------------------- |
| 701  | Mist    | mist              | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 711  | Smoke   | Smoke             | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 721  | Haze    | Haze              | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 731  | Dust    | sand/ dust whirls | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 741  | Fog     | fog               | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 751  | Sand    | sand              | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 761  | Dust    | dust              | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 762  | Ash     | volcanic ash      | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 771  | Squall  | squalls           | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |
| 781  | Tornado | tornado           | {{< figure src="http://openweathermap.org/img/wn/50d@2x.png" alt="img" width="50%" class="center" >}} 50d |

<br>

#### Group 800: Clear

| ID   | Main  | Description | Icon                                                         |
| ---- | ----- | ----------- | ------------------------------------------------------------ |
| 800  | Clear | clear sky   | {{< figure src="http://openweathermap.org/img/wn/01d@2x.png" alt="img" width="50%" class="center" >}} 01n |

<br>

#### Group 80x: Clouds

| ID   | Main   | Description              | Icon                                                         |
| ---- | ------ | ------------------------ | ------------------------------------------------------------ |
| 801  | Clouds | few clouds: 11-25%       | {{< figure src="http://openweathermap.org/img/wn/02d@2x.png" alt="img" width="50%" class="center" >}} 02n |
| 802  | Clouds | scattered clouds: 25-50% | {{< figure src="http://openweathermap.org/img/wn/03d@2x.png" alt="img" width="50%" class="center" >}} 03n |
| 803  | Clouds | broken clouds: 51-84%    | {{< figure src="http://openweathermap.org/img/wn/04d@2x.png" alt="img" width="50%" class="center" >}} 04n |
| 804  | Clouds | overcast clouds: 85-100% | {{< figure src="http://openweathermap.org/img/wn/04d@2x.png" alt="img" width="50%" class="center" >}} 04n |

<br>

#### ICON 출력방법

Weather ID 801에 해당하는 아이콘 code가 02d이므로 URL을 다음과 같이 지정하면

```html
http://openweathermap.org/img/wn/10d.png
```

{{< figure src="http://openweathermap.org/img/wn/10d.png" width="10%" class="center" >}}

ICON크기를 크게 출력하고 싶은 경우에는 아이콘 code에 **@2x**를 덧붙입니다.

```html
http://openweathermap.org/img/wn/10d@2x.png
```

{{< figure src="http://openweathermap.org/img/wn/10d@2x.png" width="10%" class="center" >}}

<br>

<br>

### 1602 LCD에 날씨 정보 출력하기

여러가지 날씨 정보 중에서 현재 온도를 1602 LCD(I2C)에 출력해보겠습니다.

<br>

#### 라이브러리 설치하기

**스케치**> **라이브러리 포함하기**> **라이브러리 관리**

- LiquidCrystal I2C (by Frank de Brabander) 검색하여 설치

<br>

#### schematic

{{< figure src="/image/owm-06.png" width="75%" class="center" >}}

<br>

#### sketch

```C++
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <TimeLib.h>

const char* ssid     = "your ssid";                  // 연결할 SSID
const char* password = "your password";              // 연결할 SSID의 비밀번호
 
const String endpoint = "https://api.openweathermap.org";
const String ver = "/data/2.5/weather?q=";
const String city = "Shanghai,CN";                 // City,Country (띄어쓰기 금지)
const String appid = "&units=metric&APPID=";       // Units: metric
const String key = "1bf3d5e1bd2e5934aadd86..........";    // API Key

unsigned long offset_days = 3;                            // 3 days for convert unix timestamp to datetime
float main_temp;

// set the LCD
#include <LiquidCrystal_I2C.h>

int lcdColumns = 16;
int lcdRows = 2;

// set LCD address, number of columns and rows
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

void setup() {
 
  Serial.begin(115200);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");

  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
}
 
void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {            // Check the current connection status
 
    HTTPClient http;
 
    http.begin(endpoint + ver + city + appid + key); // Specify the URL
    int httpCode = http.GET();                       // Make the request
 
    if (httpCode > 0) {                              // Check for the returning code
      // 데이터 파싱
      const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + 2*JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(13) + 270;
      DynamicJsonDocument doc(capacity);

      String json = http.getString();                // get JSON format data

      deserializeJson(doc, json);

      float coord_lon = doc["coord"]["lon"]; // 121.49
      float coord_lat = doc["coord"]["lat"]; // 31.23

      JsonObject weather_0 = doc["weather"][0];
      int weather_0_id = weather_0["id"]; // 804
      const char* weather_0_main = weather_0["main"]; // "Clouds"
      const char* weather_0_description = weather_0["description"]; // "overcast clouds"
      const char* weather_0_icon = weather_0["icon"]; // "04d"

      /*
      JsonObject weather_1 = weather[1];
      int weather_1_id = weather_1["id"]; // 701
      const char* weather_1_main = weather_1["main"]; // "Mist"
      const char* weather_1_description = weather_1["description"]; // "mist"
      const char* weather_1_icon = weather_1["icon"]; // "50n"

      JsonObject weather_2 = weather[2];
      int weather_2_id = weather_2["id"]; // 741
      const char* weather_2_main = weather_2["main"]; // "Fog"
      const char* weather_2_description = weather_2["description"]; // "fog"
      const char* weather_2_icon = weather_2["icon"]; // "50n"
      */

      const char* base = doc["base"]; // "stations"

      JsonObject main = doc["main"];
      float main_temp = main["temp"]; // 293.02
      int main_pressure = main["pressure"]; // 1027
      int main_humidity = main["humidity"]; // 55
      float main_temp_min = main["temp_min"]; // 289.82
      float main_temp_max = main["temp_max"]; // 298.71

      int visibility = doc["visibility"]; // 10000

      int wind_speed = doc["wind"]["speed"]; // 3
      int wind_deg = doc["wind"]["deg"]; // 60

      int clouds_all = doc["clouds"]["all"]; // 94
      
      long dt = doc["dt"]; // 1574303919

      JsonObject sys = doc["sys"];
      int sys_type = sys["type"]; // 1
      int sys_id = sys["id"]; // 9659
      //float sys_message = sys["message"]; // Internal parameter (0.0226)
      const char* sys_country = sys["country"]; // "CN"
      long sys_sunrise = sys["sunrise"]; // 1574288762
      long sys_sunset = sys["sunset"]; // 1574326426

      int timezone = doc["timezone"]; // 28800
      long id = doc["id"]; // 1796236
      const char* name = doc["name"]; // "Shanghai"
      int cod = doc["cod"]; // 200

      dt = dt + timezone;                     // for GMT+8 -> +28800, for GMT+9 -> +32400
      sys_sunrise = sys_sunrise + timezone;
      sys_sunset = sys_sunset + timezone;

      //int main_sea_level = main["sea_level"]; // Atmospheric pressure hPa on the sea level
      //int main_grnd_level = main["grnd_level"]; // Atmospheric pressure hPa on the ground level     
      //int rain_1h = doc["rain"]["1h"]; // Rain volume for the last 1 hour, mm
      //int rain_3h = doc["rain"]["3h"]; // Rain volume for the last 3 hour, mm
      //int snow_1h = doc["snow"]["1h"]; // Snow volume for the last 1 hour, mm
      //int snow_3h = doc["snow"]["3h"]; // Snow volume for the last 3 hour, mm

      //데이터 출력
      Serial.print("UNIX Time of Weather: "); Serial.println(dt);
      Serial.printf("Time of Weather: %4d-%02d-%02d %02d:%02d:%02d(%1d)\n", year(dt), month(dt), day(dt), hour(dt), minute(dt), second(dt), weekday(dt));
      Serial.print("Weather ID: "); Serial.println(weather_0_id);
      Serial.print("Weather Main: "); Serial.println(weather_0_main);
      Serial.print("Weather Description: "); Serial.println(weather_0_description);
      Serial.print("Weather Icon: "); Serial.println(weather_0_icon);
      Serial.print("Temperature(℃): "); Serial.println(main_temp);
      Serial.print("Temperature Max(℃): "); Serial.println(main_temp_max);
      Serial.print("Temperature Min(℃): "); Serial.println(main_temp_min);
      Serial.print("Pressure(hPa): "); Serial.println(main_pressure);
      Serial.print("Humidity(%): "); Serial.println(main_humidity);
      Serial.print("Visibility(m): "); Serial.println(visibility);
      Serial.print("Wind Speed(m/s): "); Serial.println(wind_speed);
      Serial.print("Wind Degree(º): "); Serial.println(wind_deg);
      Serial.print("Clouds: "); Serial.println(clouds_all);
      Serial.printf("Sunrise: %02d:%02d:%02d\n", hour(sys_sunrise), minute(sys_sunrise), second(sys_sunrise));
      Serial.printf("Sunset:  %02d:%02d:%02d\n", hour(sys_sunset), minute(sys_sunset), second(sys_sunset));
      Serial.print("City/Country: "); Serial.print(name); Serial.print("/"); Serial.println(sys_country);
      Serial.print("longitude/latidude: "); Serial.print(coord_lon); Serial.print("/"); Serial.println(coord_lat);
      Serial.print("Timezone: GMT+"); Serial.println(timezone/3600);

      /*
      Serial.print("Sea Level(hPa): "); Serial.println(main_sea_level);
      Serial.print("Ground Level(hPa): "); Serial.println(main_grnd_level);
      Serial.print("Rain 1h(mm): "); Serial.println(rain_1h);
      Serial.print("Rain 3h(mm): "); Serial.println(rain_3h);
      Serial.print("Snow 1h(mm): "); Serial.println(snow_1h);
      Serial.print("Snow 3h(mm): "); Serial.println(snow_3h);
      */
      lcd.setCursor(0, 0);
      lcd.print("Temperature : ");
      lcd.setCursor(0, 1);
      lcd.print(main_temp);
    }
 
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end();
  }

  delay(30000);
  
  lcd.setCursor(0, 1);
  lcd.print("                ");
}
```

> Arduino IDE에서 컴파일시 *""경고: 라이브러리 LiquidCrystal_I2C가 avr 아키텍처에서 실행되며 esp32아키텍처에서 실행되는 현재보드에서는 호환되지 않을 수 있습니다.""*라는 메세지가 나타나지만, LCD 출력에는 문제가 없습니다.

<br>

<br>

### 공공데이터 활용하기

위의 방법을 응용하면 국가별, 관련 업체별로 제공되는 여러가지 공공데이터를 활용할 수 있습니다.

- 대기질 관련 데이터 : https://aqicn.org/api/
- (한국)공공데이터포털 : https://www.data.go.kr/
- (미국)공공데이터포털 : https://www.data.gov/

그밖에 활용가능한 공공데이터가 어떤 것이 있는지, 살펴보세요~