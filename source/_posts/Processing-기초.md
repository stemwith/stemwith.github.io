---
title: Processing 기초
categories:
  - arduino
date: 2018-11-30 18:27:53
tags:
---

# Processing

* processing.org 에서 다운로드 ([다운로드 페이지](https://processing.org/download/))
* arduino sketch는 C++기반이고, processing sketch는 java기반입니다.

<br>

## processing sketch 예제

<br>

1) 예제1 : 프로세싱 윈도우 크기, 배경색, 점, 선, 사각형, 원, 텍스트, 폰트, 사진 입력

~~~ java
void setup() {
  size(400,400);
  background(100);        // background(0,255,0);
  strokeWeight(10);       // dot/line width
  stroke(0,255,0,100);    // dot/line color and transparency, noStroke();
  point(200,200);         // draw dot
  line(0,0,200,150);      // draw line
  ellipse(300,300,50,80); // draw circle(x,y,xr,yr)
  fill(0);                // rect/text color, nofill();
  rect(100,250,150,300);  // draw rectangle(x1,y1,x2,y2)
  
  textSize(20);
  PFont font = createFont("NanumGothic", 32);
  textFont(font);
  text("Hello World!",200,100); // text(string,x1,y2)

  PImage img = loadImage("sks.jpg");  // file in '/sketch_XXXXXXa/data/' folder
  image(img,20,50);       // image(img,x,y,width,height);
  
}

void draw() {

}
~~~

<br>

2) 예제2 : 마우스와 키보드 이벤트

~~~ java
void setup() {
  size(400,400);
}

void draw() {
  
}

void mousePressed() {
  if(mouseButton == LEFT) {
    println("left button Pressed!");
  } else if(mouseButton == RIGHT) {
    println("right button Pressed!");
  } else if(mouseButton == CENTER) {
    println("center button Pressed!");
  }
}

void keyPressed() {
  println("key Pressed!");   // Key event
  println(key);              // Key String
  println(keyCode);          // ASCII Code
}

void mouseReleased() {
  println("button Released!");
}

void keyReleased() {
  println("key Released!");
}

void mouseClicked() {
  println("button Clicked!");
}

void mouseMoved() {
  println("mouse Moved!");
}

void mouseDragged() {
  println("mouse Dragged!");
}

void mouseWheel() {
  println("mouse Wheel!");
}
~~~

<br>

3) 예제3 : 마우스 움직이는 대로 원 그리기

~~~ java
void setup() {
  size(400,400);
}

void draw() {  
}

void mouseMoved() {
  ellipse(mouseX,mouseY,50,50);  
}
~~~

<br>

4) 예제4 : 자유선 그리기

~~~ java
void setup() {
  size(400,400);
}

void draw() {  
}

void mouseMoved() {
  line(pmouseX,pmouseY,mouseX,mouseY);  
}
~~~

<br>

<br>

# Arduino와 Processing을 통해 arduino 보드의 기본 led blink 하기

<br>

## schematic

아두이노의 기본 LED를 사용할 것이므로 별도의 회로 연결없이 아두이노만 연결한다.

<br>

## library 등록

1) 아두이노 사이트에서 프로세싱 라이브러리를 다운받은 후

2) 압축을 풀었을 때 나오는 arduino폴더를 c:\Users\userID\processing\libraries\ 폴더에 복사한다.

3) 프로세싱 프로그램에서 `스케치` → `내부라이브러리` → `Arduino (firmata)`를 선택하면,

~~~ C
import cc.arduino.*;
import org.firmata.*;
import processing.serial.*;
~~~

가 등록된다.

<br>

## processing sketch

~~~ java
import cc.arduino.*;
import org.firmata.*;
import processing.serial.*;

Arduino arduino;
int ledPin = 13;

void setup() {
  size(400,400);
  println(Arduino.list());
  arduino = new Arduino(this, Arduino.list()[0], 57600); // Arduino.list()[0] or "COM3"
  arduino.pinMode(ledPin, Arduino.OUTPUT);
}

void draw() {
  arduino.digitalWrite(ledPin, Arduino.HIGH);
  delay(1000);
  arduino.digitalWrite(ledPin, Arduino.LOW);
  delay(1000);
}
~~~

<br>

## arduino sketch

1) arduino IDE에서 `파일` → `예제` → `firmata` → `standard firmata`를 불러들인 후

2) 컴파일하고 업로드한다.

<br>

## processing에서 실행하기

1) processing에서 실행버튼을 눌러 실행해보기

2) `파일` → `어플리케이션으로 내보내기`를 선택하여 윈도우, Mac, Linux용 실행파일을 만들어보기

※ 어플리케이션으로 내보내기를 하기전에 processing sketch를 저장하여야 한다.

<br>

<br>

# Processing으로 led 제어하기

<br>

## processing sketch : 사각형 스위치

~~~ java
import cc.arduino.*;
import org.firmata.*;
import processing.serial.*;

Arduino arduino;
int ledPin = 13;

void setup() {
  size(400,400);
  background(0);
  fill(255);
  noStroke();
  rect(width/2, 0, width/2, height);
  text("LED OFF", 30, 30);
  fill(0, 0, 0);
  text("LED ON", 230, 30);
  
  println(Arduino.list());
  arduino = new Arduino(this, Arduino.list()[0], 57600);
  arduino.pinMode(ledPin, Arduino.OUTPUT);
}

void draw() {
}

void mouseMoved() {
  if(mouseX < width/2) {
    arduino.digitalWrite(ledPin, Arduino.LOW);
  } else {
    arduino.digitalWrite(ledPin, Arduino.HIGH);
  }
}
~~~



## processing sketch : 그라데이션 가변저항

~~~ java
import cc.arduino.*;
import org.firmata.*;
import processing.serial.*;

Arduino arduino;
int ledPin = 13;

void setup() {
  size(400,400);

  for(int i=0; i<width; i++) {
    stroke(map(i, 0, width-1, 0, 255)); // 색깔을 점차 변화시키면서
    line(i, 0, i, height);              // 선을 그려, 그라데이션 효과를 만들어 냄
  }

  println(Arduino.list());
  arduino = new Arduino(this, Arduino.list()[0], 57600);
}

void draw() {
}

void mouseMoved() {
  arduino.analogWrite(ledPin, int(map(mouseX, 0, width-1, 0, 255)));
}
~~~

