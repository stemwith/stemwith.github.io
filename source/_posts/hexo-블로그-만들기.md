---
title: hexo NexT 테마로 Github 블로그 만들기
categories:
  - diy
date: 2019-09-01 18:27:53
tags:
---

### 필수 요소

Hexo를 이용하여 블로그를 만들기에 앞서 아래 요소를 먼저 설치

- git
- github.com에 repository 2개 생성하기
  - 사용자ID-archives
  - 사용자ID.github.io
- node.js
- npm

[hexo.io](https://hexo.io) 사이트에는 이를 위한 설치 방법이 간단하게 요약이 되어 있지만, 이것만으로 자신이 원하는 형태의 블로그를 운영할 수 있는 환경을 가진 사용자는 많지 않을 것이다. 이 글은 아무것도 설치 되어있지 않은 상태의 윈도우 사용 컴퓨터 사용자를 기준으로, d드라이브에 hexo 블로그를 생성하고 운영하는 방법을 차례대로 따라할 수 있도록 정리한 것이다.

<br>

#### Git 설치

1. https://git-scm.com/download/win 에서 **64-bit Git for Windows Setup** 다운로드
2. 설치 (설치 경로는 바꾸지 않음)
3. exe 파일은 삭제

<br>

#### nodejs 설치

1. https://nodejs.org/en/download/ 에서 Windows Installer (.msi) 64-bit 다운로드
2. 설치 (설치 경로는 바꾸지 않음)
3. (선택사항) 설치 중 Tools for Native Modules 에서 Automatically install the necessary tools에 체크
   - chocolately, python, visualstudio 등 여러가지 패키지가 설치됨
   - 설치 후, 리부팅 필요

4. 환경 변수 구성: **제어판> 고급 시스템 설정 보기> 고급> 환경 변수**를 열고, **사용자 변수와 시스템 변수**에 다음을 새로만들기 혹은 추가
   - PATH 변수에 아래의 변수값 지정되어 있는지 확인 (없으면 새로 만들기)
     - 변수값: C:\Program Files\nodejs 

<br>

#### git-bash 실행 후, hexo 설치

~~~
cd d:/dev
npm install -g hexo-cli 
~~~

~~~
mkdir myblog
hexo init myblog               // stemwith 폴더가 비어 있어야 함.
cd myblog
npm install                    // stemwith 폴더 내에서 실행해야 함.
npm install hexo-server --save
git config --global user.name githubID
git config --global user.email 이메일주소
~~~

<br>

#### Hexo-Deployer-Git 설치

~~~
npm install hexo-deployer-git --save
~~~

<br>

* _config.yml 수정

~~~
deploy:
  type: git
  repo: 저장소 주소(예: https://github.com/[githubID]/[githubID].github.io.git)
  branch: master
~~~

<br>

#### Category list order 설정 (선택사항)

* d:/dev/hexo-site/node-modules/hexo-generator-category/lib/generator.js 수정

~~~
module.exports = function(locals) {
  const config = this.config;
  const perPage = config.category_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.category_generator.order_by || '+date';
~~~

* orderBy 부분
  * -date : 최근 글 순 (default)
  * +date : 오래된 글 순

<br>

### NexT 테마 설치

#### 기본 설치

* NexT 테마 설치 (Hexo 5.0 버전 이상 사용)

~~~C++
cd d:/dev/myblog
git clone https://github.com/theme-next/hexo-theme-next themes/next
~~~

* _config.yml 수정

~~~C++
theme: next
~~~

* cache cleaning

~~~C++
hexo clean
~~~

* 현재까지 설치된 NexT 테마의 블로그 상태를 로컬에서 체크

~~~C++
hexo s --debug
~~~

​		이후, 브라우저 주소창에 http://localhost:4000를 입력했을 때, NexT 테마를 이용한 Hello World 화면이 나타나면 잘 설치된 것임

* Site Configuration: _config.yml 수정

~~~C++
# Site
title: myblog
subtitle: 'my first blog'
description: 'life diary'
keywords:
author: anonymous
language: ko
timezone: Asia/Seoul

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: http://[githubID].github.io
~~~

* Localization re-testing

~~~C++
hexo clean && hexo s
~~~

<br>

#### NexT 테마 업데이트

~~~c++
cd d:/dev/myblog
git pull
~~~

<br>

#### Alternative Configuration

_config.yml 에서는 가장 기본적인 셋팅과 테마 설정만 하고. 나머지 설정은 _config.[테마명].yml 에서 수행한다. 이를 위해 우선 hexo-theme-next폴더의 기본 설정 _config.yml 파일을 myblog 폴더에 복사한다.

~~~C++
cd d:/dev/myblog
cp ./themes/next/_config.yml _config.next.yml
~~~

<br>

##### 사용 예시

동일한 설정항목에 대하여 두가지 이상의 설정파일에서 동시에 정의하는 경우, 우선순위에 의해 설정값이 결정된다. 만약 _config.yml, _config.[테마명].yml, themes/[테마명]'/ _config.yml 세가지 설정파일이 동시에 존재하는 경우, 각 파일을 아래와 같이 설정했다면,

~~~C++
# _config.yml
theme: "my-theme"
~~~

~~~C++
# _config.my-theme.yml
bio: "My awesome bio"
foo:
  bar: 'a'
~~~

~~~C++
# themes/my-theme/_config.yml
bio: "Some generic bio"
logo: "a-cool-image.png"
  foo:
    baz: 'b'
~~~

최종적으로 설정되는 값은 각각 다음과 같다.

~~~C++
{
  bio: "My awesome bio",
  logo: "a-cool-image.png",
  foo: {
    bar: "a",
    baz: "b"
  }
}
~~~

<br>

#### Upgrade

So, NexT suggest to upgrade from version 5 or 7 to version 8 in this way:

1. You need to do some copies of old NexT files:
   1.1. `_config.yml` or `next.yml` (if you used [Alternate Theme Config](https://theme-next.js.org/docs/getting-started/configuration.html)).
   1.2. Custom CSS files placed in `next/source/css/_custom/*` and `next/source/css/_variables/*` directories.
   1.3. Custom layout files placed in `next/layout/_custom/*`.
   1.4. Any another possible custom additions which can be finded by compare tools between repositories.
2. Then rename the old NexT folder, for example, rename `next` to `next-old`.
3. Install the new version according to the method provided in this article: [installation instructions](https://theme-next.js.org/docs/getting-started/installation.html). Run `hexo clean` and `hexo s` to check whether the site works correctly.
4. Update Hexo and Hexo plugin
   If after completing the above steps, an error occurs when executing `hexo s` or `hexo g`, it means that there may be a conflict between the old version of Hexo / Hexo plugin and the new version of the theme NexT. We recommend upgrading Hexo to versions 5.0 or later and upgrading Hexo plugins to the latest version. You can run `npm outdated` to see all the upgradeable plugins.
5. If you see any bugs or you simply does not like this version, you can switch back to the old version at any time.

<br>

<br>

### NexT 테마 구성

#### NexT 테마 서브메뉴 구성

_config.[테마].yml 수정

~~~C++
menu:
  home: / || fa fa-home
  ...(etc)
~~~

<br>

#### NexT 테마에서 별도의 시작화면 사용하기

NexT 테마에서는 (별도의 설정을 하지 않는다면) 자동으로 recent post를 보여주는 기본시작화면을 구성하여 /public 폴더내에 index.html을 생성한다. 만약 이를 원하지 않고, 별도의 시작화면을 원한다면 다음과 같이 설정한다.

<br>

* _config.yml 수정: index_generator 부분의 path를 /default-index/ 로 변경

~~~C++
# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: /default-index/
  per_page: 10
  order_by: -date
~~~

<br>

* source 폴더에 index.md 생성

  index.md 파일에 시작화면 구성

<br>

* _config.[테마].yml 의 home 경로 설정

~~~C++
menu:
  home: / || fa fa-home
~~~

<br>

#### KaTeX 설정

* _config.[테마].yml 설정

~~~C++
math:
    enable: false
  ...
  katex:
    enable: true
    # See: https://github.com/KaTeX/KaTeX/tree/master/contrib/copy-tex
    copy_tex: true
~~~

​		math: enable: false 상태에서는 필요한 렌더링이 필요한 페이지의 헤더에 **mathjax: true**를 넣어주어야 한다.

~~~C++
---
title: Will Render Math
mathjax: true
---
~~~

<br>

* renderer 변경

~~~C++
$ npm un hexo-renderer-marked
$ npm i hexo-renderer-markdown-it-plus
~~~

<br>

#### Google Analytics 설정

~~~C++
# Google Analytics
# See: https://analytics.google.com
google_analytics:
  tracking_id: UA-*********-1          // google analytics 계정 s○○○○○○○@○○○○○○○.com
~~~

<br>

<br>

### NexT 테마 셋팅

_config.next.yml 파일 수정

#### Cache support

~~~C++
# Allow to cache content generation.
cache:
  enable: true
~~~

<br>

#### Minify support

~~~C++
# Remove unnecessary files after hexo generate.
minify: false
~~~

<br>

#### Choosing scheme & dark mode

 ~~~C++
 #scheme: Muse
 #scheme: Mist
 #scheme: Pisces
 scheme: Gemini
 
 # Dark Mode
 darkmode: true
 ~~~

<br>

#### Configuring Favicon

favicon in hexo-site/source/images/

~~~C++
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  android_manifest: /images/manifest.json
~~~

<br>

#### Custom Logo support

~~~C++
custom_logo: /uploads/custom-logo.jpg
~~~

<br>

#### Creative Commons

~~~C++
creative_commons:
  license: by-nc-sa
  size: small
  sidebar: true
  post: true
  language: deed.zh
~~~

<br>

#### Configuring Menu Items

기본 형식: Key: /link/ || icon

~~~C++
menu:
  home: / || fa fa-home
  #about: /about/ || fa fa-user
  #tags: /tags/ || fa fa-tags
  #categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
~~~

home, archives 를 제외한 모든 페이지는 사용자가 만들어야 한다. (Custom Page Support 참고)

<br>

#### Dynamic sub-menu

~~~C++
menu:
  home: / || fa fa-home
  archives: /archives/ || fa fa-archive
  Docs:
    default: /docs/ || fa fa-book
    Getting Started:
      default: /getting-started/ || fa fa-flag
      Installation: /installation.html || fa fa-download
      Configuration: /configuration.html || fa fa-wrench
    Third Party Services:
      default: /third-party-services/ || fa fa-puzzle-piece
      Math Equations: /math-equations.html || fa fa-square-root-alt
      Comment Systems: /comments.html || fa fa-comment-alt
~~~

※ 각 서브메뉴에는 default 페이지를 지정해야 함.

<br>

#### Icons & Badges

~~~
menu_settings:
  icons: true
~~~

<br>

~~~
menu_settings:
  badges: true
~~~

※ badges값이 true인 경우, 메뉴에 Posts, Categories, Tags의 수를 표시한다.

<br>

#### Custom Page Support

<br>

#### Code Highlight

_config.yml

~~~
highlight:
  enable: true
  ...
prismjs:
  enable: false
  ...
~~~

_config.[테마].yml

~~~
codeblock:
# Code Highlight theme
# All available themes: https://theme-next.js.org/highlight/
  ...
  theme:
    light: atom-one-dark-reasonable
    dark: atom-one-dark-reasonable
  ...
~~~

<br>

그밖의 여러가지 설정을 _config.[테마].yml 의 내용을 보면서 수정

<br>

<br>

### Troubleshooting

#### 경로의 대소문자 구분 설정

* _config.yml의 filename_case 수정

  ~~~
  # Writing
  filename_case: 1
  ~~~

  * 0: 대소문자 구분
  * 1: 경로를 이루는 문자를 모두 소문자로 변경하여 관리
  * 2: 경로를 이루는 문자를 모두 대문자로 변경하여 관리

* github repository의 categories 폴더 삭제

* hexo의 .deploy_git 폴더 삭제

* hexo clean 후 재배포

<br>

이렇게 해도 경로가 인식이 안되는 경우는, Git에서 대소문자를 구분하게 설정하고, 폴더명 및 파일이름의 대소문자를 하나하나 맞춰주어서 해결할 수도 있다.

~~~
git config --global core.ignorecase=false
~~~

<br>

<br>

### 블로그 포스트 생성

1. 마크다운 파일을 만든 뒤, d:/dev/stemwith/source/_post/ 폴더에 복사

   (post front-matter 예시)

   ~~~
   ---
   title: <string>
   comments: <boolean> (default: true)
   zoom_image: <boolean> (default: true)
   ---
   ~~~

2. 로컬에서 페이지 확인

   ~~~
   hexo serve
   http://localhost:4000
   ~~~

3. 로컬 작업 내용을 github 도메인으로 배포 (push)

   ~~~
   hexo generate
   hexo deploy
   ~~~

   or

   ~~~
   hexo g -d
   ~~~

4. deploy 후에도 오랜시간 업데이트가 안된다면, 페이지 clean 후 재배포

   ~~~
   hexo clean
   hexo deploy --generate
   ~~~

<br>

<br>

### 사진 첨부 방법

1. 첨부할 사진 파일 위치 : 사진 파일을 d:/dev/stemwith/source/image/ 폴더에 복사

2. 마크다운 파일에서 파일 위치를 다음과 같이 지정함 지정함

   ~~~
   ![사진첨부파일설명](/image/~~~.jpg)
   ~~~

3. 사진 출력시 사이즈 조정이 필요할 경우, 아래와 같이 하면 화면에 출력되는 크기를 조정할 수 있음 (단, Next 테마를 비롯한 일부 테마에서는 적용 안됨)

   ~~~
   ![사진첨부파일설명](/image/~~~.png =432x768)
   ~~~


4. Next 테마 사용시에는 사진 사이즈 조정이 필요한 경우, img 태그를 사용하여 zoom 수치로 조정하여야 함

   ~~~c++
   <img src="/image/test.png" style="zoom:80%;" />
   ~~~

5. 주의 사항

   - 필요한 경우, hexo-image-link-with-display-size 설치

     ~~~
     npm i hexo-image-link-with-display-size
     ~~~

   - 사진이 위치한 폴더를 지정할 때, /image/ 폴더 앞에 점(.) 같은 것을 추가하면 안됨

   - 파일이름에 언더바(_)가 포함되면 안됨. 대시(-)는 가능

<br>

<br>

### 주의! 기존 블로그를 복구하는 경우

* 기존에 사용하던 블로그 디렉토리가 d:\dev\myblog 인 경우, d:\dev 폴더 전체를 다른 폴더에 복사하여 백업해두고 아래의 과정을 진행한다.
* 백업 완료 후, 기존에 사용하던 d:\dev\ 폴더 자체를 삭제한 후, 아래의 과정을 수행하여 모든 설치를 마친 뒤, 백업해둔 myblog 폴더에서 필요한 부분을 복구함.

<br>

<br>

### Github 블로그 구글 검색 노출

※ 출처: [내 github blog 글이 구글 검색에 나오는 법(친성의 블로그)](https://chinsun9.github.io/2020/09/23/%EB%82%B4-github-blog-%EA%B8%80%EC%9D%B4-%EA%B5%AC%EA%B8%80-%EA%B2%80%EC%83%89%EC%97%90-%EB%82%98%EC%98%A4%EB%8A%94-%EB%B2%95/)

<br>

#### blog 설정

##### SEO (search engine optimization) 설정

블로그 설치 폴더가 d:\dev\myblog 인 경우, d:\dev\myblog 폴더에서

~~~C++
npm i hexo-autonofollow
npm i hexo-generator-feed
npm i hexo-generator-seo-friendly-sitemap
npm i hexo-generator-robotstxt
~~~

필요한 경우 hexo-auto-canonical과 hexo-component-inferno을 추가로 설치한다.

~~~C++
npm i hexo-auto-canonical
npm i hexo-component-inferno
~~~

설치 후

~~~
npm audit fix
~~~

<br>

※ 표준링크 확인 방법

1. 본인 블로그로 접속

2. F12로 개발자도구를 열고

3. 개발자도구 상단의 **요소**를 클릭한 뒤,

4. Ctrl-F를 눌러 **canonical**를 검색했을 때, 아래 형태의 링크 태그가 검색이 되면, 이미 표준링크가 생성되고 있는 것임. 이런 경우에는 hexo-auto-canonical은 설치하지 않아도 됨!

   ~~~
   <link rel="canonical" href="http://블로그 글 주소/"
   ~~~

5. NEXT 테마의 경우, (이미 표준링크를 생성하고 있으므로) hexo-auto-canonical은 설치하지 않아도 됨 

<br>

##### _config.yml 설정

_config.yml 최하단 deploy 설정 아래에 다음을 추가

~~~
nofollow:
  enable: true
  exclude:
    - exclude1.com
    - exclude2.com
feed:
  type: rss2
  path: rss2.xml
  limit: 20
sitemap:
  path: sitemap.xml
  tag: false
  category: false
robotstxt:
  useragent: '*'
  allow:
    - /
  sitemap: https://깃허브유저네임.github.io/sitemap.xml
~~~

<br>

##### 배포

~~~C++
hexo g -d
~~~

<br>

##### 생성된 파일 확인하기

d:\dev\myblog\public\ 디렉터리 하단에 rss2.xml, sitemap.xml, robots.txt 이 3개의 파일이 보이는지 확인한다.

<br>

#### 구글 검색 엔진 등록

1. [Google Search Console](https://search.google.com/search-console/about) 에 접속후 시작하기 클릭
2. **URL 접두어**를 선택하고, **자신의 깃헙 주소** (예, https://testblog.github.io)를 입력한 뒤 **계속** 클릭

3. 소유권 확인
   1. html 파일 다운로드
   2. (_config.yml 이 위치한) d:\dev\myblog\public\ 디렉토리에 다운 받은 파일을 넣고
   3. hexo d 로 배포
   4. 잠시 대기 후, 소유권 확인 과정 창의 **확인** 클릭 (확인이 안된다고 나오는 경우에는 잠시 후에 다시 시도 해야 함)
   5. 소유권이 확인되면, **속성으로 이동** 클릭
4. Google Search Console에서
   1. 왼쪽 메뉴의 **sitemaps** 클릭
   2. 새 사이트맵 추가에서 **sitemap.xml** 입력 후 **제출** 클릭
   3. 새 사이트맵 추가에서 **rss2.xml** 입력 후 **제출** 클릭
   4. 두 파일의 제출 상태가 **성공**으로 표시되어야 함 (**가져올 수 없음** 이라고 나오면 잠시 후에 페이지 새로고침을 해보고, 성공으로 표시되는지 확인이 필요함)
5. 실제 검색은 하루 정도 지나면 가능

<br>

#### Naver 검색 노출

1. 구글과 유사하며, 네이버 웹마스터 도구 (Naver Search Advisor)를 사용하여 등록함
2. RSS 제출 메뉴와 사이트맵 제출 메뉴가 분리되어 있으므로, sitemap.xml 및 rss2.xml 등록시 유의

<br>

#### Daum 검색 노출

1. [Daum 검색등록](https://register.search.daum.net/index.daum)으로 들어가서
2. 신규 등록에 블로그 URL을 등록한 뒤 **확인**을 클릭하여 제출하면, 심사 후 이메일로 등록 결과를 알려줌

